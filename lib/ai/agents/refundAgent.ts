import { ToolRegistry } from '../tools/registry';
import { AIService } from '../groq';
import { RefundRecord, ResolutionCardData, ToolInvocation, Transaction } from '../../../src/types';

export interface RefundResolutionResult {
  agentName: 'Refund Agent';
  message: string;
  toolsUsed: ToolInvocation[];
  resolutionCard?: ResolutionCardData;
  isEscalated: boolean;
}

export class RefundAgent {
  static async resolve(params: {
    query: string;
    transactionId?: string;
    amount?: number;
    merchant?: string;
  }): Promise<RefundResolutionResult> {
    const toolsUsed: ToolInvocation[] = [];
    let targetTxnId = params.transactionId;
    const qLower = params.query.toLowerCase();

    if (!targetTxnId) {
      if (params.merchant?.toLowerCase().includes('uber') || qLower.includes('uber') || params.amount === 850) {
        targetTxnId = 'TXN1003';
      } else if (params.merchant?.toLowerCase().includes('metro') || qLower.includes('metro') || params.amount === 350) {
        targetTxnId = 'TXN1005';
      } else if (params.merchant?.toLowerCase().includes('flipkart') || qLower.includes('flipkart') || params.amount === 2499) {
        targetTxnId = 'TXN1004';
      } else {
        // Find most recent in-progress or active refund
        targetTxnId = 'TXN1003'; // Uber in-progress refund is usually what users are actively checking!
      }
    }

    const resolvedTxnId = targetTxnId || 'TXN1004';

    // Call getRefundStatus
    const refundToolRes = ToolRegistry.getRefundStatus(resolvedTxnId);
    toolsUsed.push({
      toolName: 'getRefundStatus',
      params: { transactionId: resolvedTxnId },
      result: refundToolRes.data ? (refundToolRes.data as Record<string, unknown>) : { error: refundToolRes.error },
      status: refundToolRes.success ? 'SUCCESS' : 'ERROR',
    });

    // Also get the transaction details for context
    const txnToolRes = ToolRegistry.getTransactionStatus(resolvedTxnId);
    toolsUsed.push({
      toolName: 'getTransactionStatus',
      params: { transactionId: resolvedTxnId },
      result: txnToolRes.data ? (txnToolRes.data as Record<string, unknown>) : { error: txnToolRes.error },
      status: txnToolRes.success ? 'SUCCESS' : 'ERROR',
    });

    const refund = refundToolRes.success ? (refundToolRes.data as RefundRecord) : undefined;
    const txn = txnToolRes.success ? (txnToolRes.data as Transaction) : undefined;

    if (refund && refund.status === 'COMPLETED') {
      const answer = `Great news! Your refund of ₹${refund.amount} for transaction ${refund.transactionId} has already been COMPLETED. It was credited directly to your ${refund.destinationAccount} on ${refund.completedAt}. You can verify this credit in your bank statement with Bank Reference (RRN): ${refund.rrnNumber || 'Available in statement'}.`;

      const resolutionCard: ResolutionCardData = {
        title: 'Refund Status: Credit Completed',
        category: 'REFUND',
        status: 'RESOLVED',
        amount: refund.amount,
        transactionId: refund.transactionId,
        merchant: txn?.merchant || 'Merchant Order',
        resolutionSummary: `Refund of ₹${refund.amount} processed and successfully credited to your ${refund.destinationAccount}.`,
        keyDetails: [
          { label: 'Refund Reference', value: refund.id },
          { label: 'Original Transaction', value: refund.transactionId },
          { label: 'Refund Amount', value: `₹${refund.amount}` },
          { label: 'Credited Account', value: refund.destinationAccount },
          { label: 'Bank RRN / URN', value: refund.rrnNumber || 'N/A' },
          { label: 'Completed At', value: refund.completedAt || 'Recently' },
        ],
        suggestedActions: [
          { label: 'View Bank Reference (RRN)', actionType: 'view_transaction', payload: { id: refund.transactionId } },
          { label: 'Still Not Visible in Bank?', actionType: 'create_ticket', payload: { transactionId: refund.transactionId } },
          { label: 'Talk to Support', actionType: 'escalate_human' },
        ],
      };

      return {
        agentName: 'Refund Agent',
        message: answer,
        toolsUsed,
        resolutionCard,
        isEscalated: false,
      };
    }

    if (refund && refund.status === 'IN_PROGRESS') {
      const answer = `Your refund of ₹${refund.amount} for transaction ${refund.transactionId} is currently IN PROGRESS. It was initiated on ${refund.initiatedAt} and is expected to be credited by ${refund.estimatedCompletionAt} to your ${refund.destinationAccount}. Banks typically take 24–48 banking hours to settle UPI reversal batches.`;

      const resolutionCard: ResolutionCardData = {
        title: 'Refund Status: In Progress',
        category: 'REFUND',
        status: 'RESOLVED',
        amount: refund.amount,
        transactionId: refund.transactionId,
        merchant: txn?.merchant || 'Merchant Partner',
        resolutionSummary: `Your refund of ₹${refund.amount} is currently being processed by the destination banking gateway. Expected by ${refund.estimatedCompletionAt}.`,
        keyDetails: [
          { label: 'Refund ID', value: refund.id },
          { label: 'Amount', value: `₹${refund.amount}` },
          { label: 'Status', value: 'IN_PROGRESS' },
          { label: 'Destination', value: refund.destinationAccount },
          { label: 'Estimated By', value: refund.estimatedCompletionAt },
        ],
        suggestedActions: [
          { label: 'Track Real-time Status', actionType: 'track_refund', payload: { id: refund.transactionId } },
          { label: 'Notify Me on Credit', actionType: 'view_transaction' },
          { label: 'Raise Priority Escalation', actionType: 'create_ticket', payload: { transactionId: refund.transactionId } },
        ],
      };

      return {
        agentName: 'Refund Agent',
        message: answer,
        toolsUsed,
        resolutionCard,
        isEscalated: false,
      };
    }

    // Fallback if no specific refund found
    return {
      agentName: 'Refund Agent',
      message: `I investigated refund status for reference ${targetTxnId}. If a transaction failed or was cancelled by the merchant, refunds are usually processed within 2 to 4 business days directly to the original payment source. Would you like me to raise an investigation ticket with the merchant clearing team?`,
      toolsUsed,
      isEscalated: false,
    };
  }
}
