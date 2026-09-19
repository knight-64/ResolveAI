import { ToolRegistry } from '../tools/registry';
import { ResolutionCardData, ToolInvocation, SupportTicket } from '../../../src/types';

export interface SecurityResolutionResult {
  agentName: 'Security/Fraud Agent';
  message: string;
  toolsUsed: ToolInvocation[];
  resolutionCard?: ResolutionCardData;
  isEscalated: boolean;
}

export class SecurityAgent {
  static async resolve(params: {
    query: string;
    transactionId?: string;
    amount?: number;
  }): Promise<SecurityResolutionResult> {
    const toolsUsed: ToolInvocation[] = [];
    const targetTxnId = params.transactionId || 'TXN1008';

    // 1. Run Risk Engine Assessment
    const riskCheckResult = ToolRegistry.checkFraudRisk({
      transactionId: targetTxnId,
      amount: params.amount,
      issue: params.query,
    });

    toolsUsed.push({
      toolName: 'checkFraudRisk',
      params: { transactionId: targetTxnId, query: params.query },
      result: riskCheckResult.data as Record<string, unknown>,
      status: 'SUCCESS',
    });

    // 2. High risk / Unauthorized queries trigger automated human escalation & ticket creation
    const ticketResult = ToolRegistry.createSupportTicket({
      issue: `[FRAUD ALERT / UNAUTHORIZED] ${params.query}`,
      category: 'FRAUD_ALERT',
      priority: 'HIGH',
      transactionId: targetTxnId,
    });

    toolsUsed.push({
      toolName: 'createSupportTicket',
      params: { issue: params.query, priority: 'HIGH', category: 'FRAUD_ALERT' },
      result: ticketResult.data ? (ticketResult.data as unknown as Record<string, unknown>) : {},
      status: 'SUCCESS',
    });

    const ticket = ticketResult.data as SupportTicket;

    // Escalate to human
    const escalateResult = ToolRegistry.escalateToHuman({
      issue: params.query,
      category: 'FRAUD_ALERT',
      reason: 'User reported suspected unauthorized transaction. Mandatory human specialist protocol.',
      transactionId: targetTxnId,
    });

    toolsUsed.push({
      toolName: 'escalateToHuman',
      params: { category: 'FRAUD_ALERT', reason: 'Suspected unauthorized activity' },
      result: escalateResult.data ? (escalateResult.data as unknown as Record<string, unknown>) : {},
      status: 'SUCCESS',
    });

    const message = `⚠️ Security Action Taken: I have registered an immediate security alert for your account regarding "${params.query}". Because this involves suspected unauthorized activity, our automated system has initiated account protection protocols and escalated this directly to our dedicated Fraud & Risk Mitigation Specialist team.\n\nTicket #${ticket.id} has been opened with HIGH priority. A fraud specialist is assigned to review this case and will contact you directly within 15 minutes. In the meantime, we recommend not sharing any OTP or UPI PIN with anyone.`;

    const resolutionCard: ResolutionCardData = {
      title: 'Security Alert: Escalated to Fraud Operations',
      category: 'FRAUD_ALERT',
      status: 'ESCALATED',
      amount: params.amount || 5000,
      transactionId: targetTxnId,
      merchant: 'Suspected Unauthorized Merchant / Device',
      resolutionSummary: `Your security concern has been classified as HIGH risk and escalated to human specialists. Account protection measures have been simulated.`,
      keyDetails: [
        { label: 'Escalation Ticket', value: ticket.id },
        { label: 'Priority', value: 'HIGH (Immediate Attention)' },
        { label: 'Assigned Team', value: ticket.assignedTeam },
        { label: 'Risk Score', value: '92 / 100 (Critical)' },
        { label: 'Status', value: 'OPEN - Escalated to Human' },
      ],
      suggestedActions: [
        { label: 'View Support Ticket', actionType: 'create_ticket', payload: { ticketId: ticket.id } },
        { label: 'Simulate Block UPI / Card', actionType: 'view_transaction', payload: { action: 'block' } },
        { label: 'Emergency Hotline (Simulated)', actionType: 'escalate_human' },
      ],
      ticket,
    };

    return {
      agentName: 'Security/Fraud Agent',
      message,
      toolsUsed,
      resolutionCard,
      isEscalated: true,
    };
  }
}
