import {
  Transaction,
  RefundRecord,
  SupportTicket,
  IssueCategory,
  DashboardStats,
  AgentName,
  ResolutionStatus
} from '../../src/types';

export interface AgentExecutionLog {
  id: string;
  timestamp: string;
  query: string;
  intent: IssueCategory;
  agent: AgentName;
  toolsCalled: string[];
  confidence: number;
  status: ResolutionStatus;
  latencyMs: number;
}

// Initial Seed Data (strictly marked as simulated demo data)
const initialTransactions: Transaction[] = [
  {
    id: 'TXN1001',
    userId: 'USR_DEMO_99',
    amount: 1250,
    status: 'SUCCESS',
    merchant: 'Zomato Food Delivery',
    upiId: 'demo.user@paytm',
    bankName: 'HDFC Bank',
    paymentMode: 'UPI',
    date: '2026-09-16 14:32:10',
    description: 'Dinner delivery order #ZOM-92812',
    isSimulated: true,
  },
  {
    id: 'TXN1002',
    userId: 'USR_DEMO_99',
    amount: 499,
    status: 'PENDING',
    merchant: 'Example Store / Reliance Digital',
    upiId: 'demo.user@paytm',
    bankName: 'State Bank of India (SBI)',
    paymentMode: 'UPI',
    date: '2026-09-17 08:15:22',
    description: 'Electronics accessory purchase',
    failureReason: 'Awaiting final clearing settlement response from NPCI/Beneficiary Bank.',
    isSimulated: true,
  },
  {
    id: 'TXN1003',
    userId: 'USR_DEMO_99',
    amount: 850,
    status: 'FAILED',
    merchant: 'Uber Rides India',
    upiId: 'demo.user@paytm',
    bankName: 'ICICI Bank',
    paymentMode: 'UPI',
    date: '2026-09-17 07:45:00',
    description: 'Cab ride commute to airport',
    failureReason: 'Issuer Bank switch timeout (U30 - Timed out waiting for response). Debited funds auto-reversal initiated.',
    isSimulated: true,
  },
  {
    id: 'TXN1004',
    userId: 'USR_DEMO_99',
    amount: 2499,
    status: 'REFUNDED',
    merchant: 'Flipkart Online Shopping',
    upiId: 'demo.user@paytm',
    bankName: 'Axis Bank',
    paymentMode: 'UPI',
    date: '2026-09-15 11:20:44',
    description: 'Shoes returned by customer #FK-49910',
    isSimulated: true,
  },
  {
    id: 'TXN1005',
    userId: 'USR_DEMO_99',
    amount: 350,
    status: 'REVERSED',
    merchant: 'Delhi Metro Smart Card Recharge',
    upiId: 'demo.user@paytm',
    bankName: 'Paytm Payments Bank',
    paymentMode: 'WALLET',
    date: '2026-09-16 18:05:12',
    description: 'Metro card automated top-up',
    failureReason: 'Network handshake interrupted; wallet balance credited back instantly.',
    isSimulated: true,
  },
  {
    id: 'TXN1006',
    userId: 'USR_DEMO_99',
    amount: 1999,
    status: 'PENDING',
    merchant: 'Blinkit Instant Groceries',
    upiId: 'demo.user@paytm',
    bankName: 'Kotak Mahindra Bank',
    paymentMode: 'UPI',
    date: '2026-09-17 06:12:00',
    description: 'Weekly grocery supplies',
    failureReason: 'Intermittent beneficiary bank UPI gateway latency.',
    isSimulated: true,
  },
  {
    id: 'TXN1007',
    userId: 'USR_DEMO_99',
    amount: 3200,
    status: 'SUCCESS',
    merchant: 'BESCOM Electricity Bill',
    upiId: 'demo.user@paytm',
    bankName: 'HDFC Bank',
    paymentMode: 'NET_BANKING',
    date: '2026-09-14 19:40:00',
    description: 'Monthly utility electricity payment',
    isSimulated: true,
  },
  {
    id: 'TXN1008',
    userId: 'USR_DEMO_99',
    amount: 150,
    status: 'FAILED',
    merchant: 'Chai Point Café',
    upiId: 'demo.user@paytm',
    bankName: 'State Bank of India (SBI)',
    paymentMode: 'UPI',
    date: '2026-09-16 09:30:15',
    description: 'Breakfast snack and beverage',
    failureReason: 'Maximum incorrect UPI PIN attempts reached on issuing bank side.',
    isSimulated: true,
  },
];

const initialRefunds: RefundRecord[] = [
  {
    id: 'REF-2001',
    transactionId: 'TXN1004',
    amount: 2499,
    status: 'COMPLETED',
    initiatedAt: '2026-09-15 13:00:00',
    estimatedCompletionAt: '2026-09-16 13:00:00',
    completedAt: '2026-09-15 16:45:10',
    destinationAccount: 'Axis Bank A/C ending in 4109',
    rrnNumber: 'RRN-948201948210',
    reason: 'Merchant cancelled order item after inspection',
  },
  {
    id: 'REF-2002',
    transactionId: 'TXN1005',
    amount: 350,
    status: 'COMPLETED',
    initiatedAt: '2026-09-16 18:05:13',
    estimatedCompletionAt: '2026-09-16 18:05:14',
    completedAt: '2026-09-16 18:05:14',
    destinationAccount: 'Paytm Wallet Balance',
    rrnNumber: 'WAL-AUTO-REV-771',
    reason: 'Auto-reversal for disconnected metro AFC gate payment',
  },
  {
    id: 'REF-2003',
    transactionId: 'TXN1003',
    amount: 850,
    status: 'IN_PROGRESS',
    initiatedAt: '2026-09-17 07:46:00',
    estimatedCompletionAt: '2026-09-18 18:00:00',
    destinationAccount: 'ICICI Bank A/C ending in 8832',
    rrnNumber: 'RRN-PENDING-4819',
    reason: 'NPCI UPI T+2 business hours bank settlement auto-reversal',
  },
];

const initialTickets: SupportTicket[] = [
  {
    id: 'RA-10289',
    userId: 'USR_DEMO_99',
    category: 'FRAUD_ALERT',
    priority: 'HIGH',
    issue: 'Suspicious card charge alert flagged during midnight hours',
    assignedTeam: 'Paytm Fraud & Risk Mitigation Operations',
    status: 'IN_PROGRESS',
    createdAt: '2026-09-16 23:45:00',
    transactionId: 'TXN1008',
    resolutionNotes: 'Customer contacted, temporary debit block placed on card token.',
  },
  {
    id: 'RA-10290',
    userId: 'USR_DEMO_99',
    category: 'PAYMENT_FAILED',
    priority: 'MEDIUM',
    issue: 'Uber ride payment debited but showed failed in app',
    assignedTeam: 'Payments Tier 2 Clearing Support',
    status: 'RESOLVED',
    createdAt: '2026-09-17 08:00:00',
    transactionId: 'TXN1003',
    resolutionNotes: 'Auto-reversal confirmed initiated via ICICI Bank gateway RRN-PENDING-4819.',
  },
  {
    id: 'RA-10291',
    userId: 'USR_DEMO_99',
    category: 'KYC',
    priority: 'LOW',
    issue: 'Assistance required updating Aadhaar biometric OTP for Paytm Wallet limit upgrade',
    assignedTeam: 'Account Compliance & Onboarding Desk',
    status: 'OPEN',
    createdAt: '2026-09-17 07:15:00',
    resolutionNotes: 'Self-serve Video KYC link sent to registered mobile.',
  },
];

const initialLogs: AgentExecutionLog[] = [
  {
    id: 'LOG-8801',
    timestamp: '2026-09-17 08:16:04',
    query: 'My payment of ₹499 is still pending.',
    intent: 'PAYMENT_PENDING',
    agent: 'Transaction Agent',
    toolsCalled: ['getTransactionStatus', 'getUserTransactions'],
    confidence: 0.96,
    status: 'RESOLVED',
    latencyMs: 840,
  },
  {
    id: 'LOG-8802',
    timestamp: '2026-09-17 07:48:19',
    query: 'Money was deducted for Uber ride TXN1003 but driver says unpaid',
    intent: 'PAYMENT_FAILED',
    agent: 'Transaction Agent',
    toolsCalled: ['getTransactionStatus', 'getRefundStatus'],
    confidence: 0.94,
    status: 'RESOLVED',
    latencyMs: 910,
  },
  {
    id: 'LOG-8803',
    timestamp: '2026-09-17 07:20:00',
    query: 'I think someone made an unauthorized transaction of ₹5000',
    intent: 'FRAUD_ALERT',
    agent: 'Security/Fraud Agent',
    toolsCalled: ['checkFraudRisk', 'createSupportTicket', 'escalateToHuman'],
    confidence: 0.98,
    status: 'ESCALATED',
    latencyMs: 1120,
  },
  {
    id: 'LOG-8804',
    timestamp: '2026-09-16 16:50:33',
    query: 'Has my refund for the Flipkart purchase arrived yet?',
    intent: 'REFUND',
    agent: 'Refund Agent',
    toolsCalled: ['getRefundStatus'],
    confidence: 0.95,
    status: 'RESOLVED',
    latencyMs: 760,
  },
];

class DatabaseStore {
  private transactions: Transaction[] = [...initialTransactions];
  private refunds: RefundRecord[] = [...initialRefunds];
  private tickets: SupportTicket[] = [...initialTickets];
  private logs: AgentExecutionLog[] = [...initialLogs];
  private ticketCounter = 10294;

  // Transactions
  getAllTransactions(): Transaction[] {
    return [...this.transactions];
  }

  getTransactionById(id: string): Transaction | undefined {
    const cleanId = id.trim().toUpperCase();
    return this.transactions.find(
      (t) => t.id.toUpperCase() === cleanId || t.id.toUpperCase().includes(cleanId)
    );
  }

  getUserTransactions(userId: string): Transaction[] {
    return this.transactions.filter((t) => t.userId === userId || userId === 'current');
  }

  // Refunds
  getAllRefunds(): RefundRecord[] {
    return [...this.refunds];
  }

  getRefundByTransactionId(txnId: string): RefundRecord | undefined {
    const cleanId = txnId.trim().toUpperCase();
    return this.refunds.find(
      (r) => r.transactionId.toUpperCase() === cleanId || r.id.toUpperCase() === cleanId
    );
  }

  // Support Tickets
  getAllTickets(): SupportTicket[] {
    return [...this.tickets];
  }

  createTicket(params: {
    issue: string;
    category?: IssueCategory;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    transactionId?: string;
    assignedTeam?: string;
  }): SupportTicket {
    const newId = `RA-${this.ticketCounter++}`;
    const category = params.category || 'GENERAL_SUPPORT';
    
    // Auto assign team based on category if not provided
    let team = params.assignedTeam;
    if (!team) {
      switch (category) {
        case 'FRAUD_ALERT':
          team = 'Paytm Fraud & Risk Mitigation Operations';
          break;
        case 'PAYMENT_FAILED':
        case 'PAYMENT_PENDING':
        case 'PAYMENT_REVERSED':
          team = 'Payments Tier 2 Clearing Support';
          break;
        case 'REFUND':
          team = 'Merchant Settlement & Refund Operations';
          break;
        case 'KYC':
        case 'ACCOUNT_ISSUE':
          team = 'Account Compliance & Customer Verification Desk';
          break;
        default:
          team = 'Paytm Priority Customer Care';
      }
    }

    const newTicket: SupportTicket = {
      id: newId,
      userId: 'USR_DEMO_99',
      category,
      priority: params.priority || (category === 'FRAUD_ALERT' ? 'HIGH' : 'MEDIUM'),
      issue: params.issue,
      assignedTeam: team,
      status: 'OPEN',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      transactionId: params.transactionId,
      resolutionNotes: 'Created via ResolveAI Multi-Agent Automated Escalation Engine.',
    };

    this.tickets.unshift(newTicket);
    return newTicket;
  }

  updateTicketStatus(ticketId: string, status: SupportTicket['status']): SupportTicket | undefined {
    const t = this.tickets.find((ticket) => ticket.id === ticketId);
    if (t) {
      t.status = status;
    }
    return t;
  }

  // Logs & Metrics
  logExecution(log: Omit<AgentExecutionLog, 'id' | 'timestamp'>): AgentExecutionLog {
    const newLog: AgentExecutionLog = {
      ...log,
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    this.logs.unshift(newLog);
    return newLog;
  }

  getDashboardStats(): DashboardStats {
    const totalQueries = this.logs.length + 42; // base offset for rich dashboard presentation
    const resolvedCount = this.logs.filter((l) => l.status === 'RESOLVED').length + 38;
    const escalatedCount = this.logs.filter((l) => l.status === 'ESCALATED').length + 4;
    const resolutionRate = Math.round((resolvedCount / totalQueries) * 1000) / 10;
    
    // Average response time
    const sumLatency = this.logs.reduce((acc, curr) => acc + curr.latencyMs, 0);
    const avgLatency = this.logs.length > 0 ? Math.round(sumLatency / this.logs.length) : 890;

    // Agent usage counts
    const agentCounts: Record<string, number> = {
      'Transaction Agent': 24,
      'Refund Agent': 12,
      'Security/Fraud Agent': 8,
      'General Support Agent': 6,
    };
    for (const log of this.logs) {
      agentCounts[log.agent] = (agentCounts[log.agent] || 0) + 1;
    }

    const totalAgentUsages = Object.values(agentCounts).reduce((a, b) => a + b, 0);
    const agentUsage = Object.entries(agentCounts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalAgentUsages) * 100),
    }));

    // Category distribution
    const categoryCounts: Record<string, number> = {
      PAYMENT_PENDING: 18,
      PAYMENT_FAILED: 14,
      REFUND: 12,
      FRAUD_ALERT: 8,
      TRANSACTION_STATUS: 6,
      KYC: 5,
      GENERAL_SUPPORT: 4,
    };
    for (const log of this.logs) {
      categoryCounts[log.intent] = (categoryCounts[log.intent] || 0) + 1;
    }

    const categoryDistribution = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));

    return {
      totalQueries,
      resolvedQueries: resolvedCount,
      escalatedQueries: escalatedCount,
      resolutionRate,
      avgResponseTimeMs: avgLatency,
      activeAgentsCount: 5, // Intent, Transaction, Refund, Security, General
      agentUsage,
      categoryDistribution,
      recentTickets: this.tickets.slice(0, 6),
      recentLogs: this.logs.slice(0, 8),
    };
  }

  // Reset to pristine state
  resetDemoData(): void {
    this.transactions = [...initialTransactions];
    this.refunds = [...initialRefunds];
    this.tickets = [...initialTickets];
    this.logs = [...initialLogs];
    this.ticketCounter = 10294;
  }
}

export const dbStore = new DatabaseStore();
