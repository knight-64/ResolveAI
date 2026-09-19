import { dbStore } from '../../db/store';
import { IssueCategory, SupportTicket, Transaction, RefundRecord } from '../../../src/types';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, { type: string; description: string; required?: boolean }>;
}

export interface ToolResult<T = unknown> {
  toolName: string;
  success: boolean;
  data?: T;
  error?: string;
  executedAt: string;
}

export class ToolRegistry {
  /**
   * Tool: getTransactionStatus(transactionId)
   */
  static getTransactionStatus(transactionId: string): ToolResult<Transaction | { message: string }> {
    const txn = dbStore.getTransactionById(transactionId);
    if (!txn) {
      return {
        toolName: 'getTransactionStatus',
        success: false,
        error: `Transaction ID '${transactionId}' not found in Paytm core ledger.`,
        executedAt: new Date().toISOString(),
      };
    }
    return {
      toolName: 'getTransactionStatus',
      success: true,
      data: txn,
      executedAt: new Date().toISOString(),
    };
  }

  /**
   * Tool: getRefundStatus(transactionId)
   */
  static getRefundStatus(transactionId: string): ToolResult<RefundRecord | { message: string }> {
    const refund = dbStore.getRefundByTransactionId(transactionId);
    if (!refund) {
      // Check if transaction exists to provide context
      const txn = dbStore.getTransactionById(transactionId);
      if (txn && txn.status === 'PENDING') {
        return {
          toolName: 'getRefundStatus',
          success: true,
          data: {
            message: 'No refund initiated because transaction is still in PENDING state. Once settled or failed, auto-reversal will trigger if debited.',
            transactionId: txn.id,
            status: 'NOT_APPLICABLE' as const,
          } as unknown as RefundRecord,
          executedAt: new Date().toISOString(),
        };
      }
      return {
        toolName: 'getRefundStatus',
        success: false,
        error: `No refund record currently registered for reference '${transactionId}'.`,
        executedAt: new Date().toISOString(),
      };
    }
    return {
      toolName: 'getRefundStatus',
      success: true,
      data: refund,
      executedAt: new Date().toISOString(),
    };
  }

  /**
   * Tool: getUserTransactions(userId)
   */
  static getUserTransactions(userId: string = 'USR_DEMO_99'): ToolResult<Transaction[]> {
    const txns = dbStore.getUserTransactions(userId);
    return {
      toolName: 'getUserTransactions',
      success: true,
      data: txns,
      executedAt: new Date().toISOString(),
    };
  }

  /**
   * Tool: checkFraudRisk(transactionId)
   */
  static checkFraudRisk(params: { transactionId?: string; amount?: number; issue?: string }): ToolResult<{
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    score: number; // 0 to 100
    factors: string[];
    recommendedAction: string;
    isSimulated: boolean;
  }> {
    const txn = params.transactionId ? dbStore.getTransactionById(params.transactionId) : undefined;
    const issueText = (params.issue || '').toLowerCase();
    
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
    let score = 55;
    const factors: string[] = ['Real-time Risk Engine heuristics evaluation'];

    if (
      issueText.includes('unauthorized') ||
      issueText.includes('hacked') ||
      issueText.includes('stolen') ||
      issueText.includes('scam') ||
      issueText.includes('did not make') ||
      issueText.includes('fraud')
    ) {
      riskLevel = 'CRITICAL';
      score = 92;
      factors.push('User reported unauthorized dispute keyword');
      factors.push('Immediate account safety protocols triggered');
    } else if (txn && txn.amount > 2000) {
      riskLevel = 'HIGH';
      score = 78;
      factors.push('High value debit threshold exceeded');
    } else {
      riskLevel = 'LOW';
      score = 22;
      factors.push('Standard merchant counterparty verification passed');
    }

    return {
      toolName: 'checkFraudRisk',
      success: true,
      data: {
        riskLevel,
        score,
        factors,
        recommendedAction:
          riskLevel === 'CRITICAL'
            ? 'Place temporary security restriction on UPI delegate & initiate immediate fraud dispute ticket.'
            : 'Advise customer on safe UPI pin habits and monitor transaction status.',
        isSimulated: true,
      },
      executedAt: new Date().toISOString(),
    };
  }

  /**
   * Tool: createSupportTicket(issue)
   */
  static createSupportTicket(params: {
    issue: string;
    category?: IssueCategory;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    transactionId?: string;
  }): ToolResult<SupportTicket> {
    const ticket = dbStore.createTicket({
      issue: params.issue,
      category: params.category,
      priority: params.priority,
      transactionId: params.transactionId,
    });
    return {
      toolName: 'createSupportTicket',
      success: true,
      data: ticket,
      executedAt: new Date().toISOString(),
    };
  }

  /**
   * Tool: escalateToHuman(issue)
   */
  static escalateToHuman(params: {
    issue: string;
    category?: IssueCategory;
    reason: string;
    transactionId?: string;
  }): ToolResult<{
    escalated: boolean;
    ticket: SupportTicket;
    queueEstimatedWaitSec: number;
    team: string;
  }> {
    const ticket = dbStore.createTicket({
      issue: `[ESCALATION] ${params.issue}. Reason: ${params.reason}`,
      category: params.category || 'GENERAL_SUPPORT',
      priority: 'HIGH',
      transactionId: params.transactionId,
    });

    return {
      toolName: 'escalateToHuman',
      success: true,
      data: {
        escalated: true,
        ticket,
        queueEstimatedWaitSec: 120,
        team: ticket.assignedTeam,
      },
      executedAt: new Date().toISOString(),
    };
  }
}
