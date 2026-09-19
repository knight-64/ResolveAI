export type IssueCategory =
  | 'PAYMENT_FAILED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_REVERSED'
  | 'REFUND'
  | 'TRANSACTION_STATUS'
  | 'ACCOUNT_ISSUE'
  | 'FRAUD_ALERT'
  | 'KYC'
  | 'GENERAL_SUPPORT';

export type AgentName =
  | 'Intent Agent'
  | 'Transaction Agent'
  | 'Refund Agent'
  | 'Security/Fraud Agent'
  | 'General Support Agent';

export type TransactionStatus =
  | 'SUCCESS'
  | 'PENDING'
  | 'FAILED'
  | 'REFUNDED'
  | 'REVERSED';

export type RefundStatus =
  | 'COMPLETED'
  | 'IN_PROGRESS'
  | 'INITIATED'
  | 'FAILED'
  | 'NOT_APPLICABLE';

export type ResolutionStatus =
  | 'RESOLVED'
  | 'PENDING_USER_ACTION'
  | 'ESCALATED'
  | 'UNDER_INVESTIGATION';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Transaction {
  id: string; // e.g. TXN1001
  userId: string;
  amount: number; // in INR
  status: TransactionStatus;
  merchant: string;
  upiId?: string;
  bankName: string;
  paymentMode: 'UPI' | 'WALLET' | 'CREDIT_CARD' | 'NET_BANKING';
  date: string; // ISO or formatted YYYY-MM-DD HH:mm
  description: string;
  failureReason?: string;
  isSimulated: boolean;
}

export interface RefundRecord {
  id: string; // e.g. REF-2001
  transactionId: string;
  amount: number;
  status: RefundStatus;
  initiatedAt: string;
  estimatedCompletionAt: string;
  completedAt?: string;
  destinationAccount: string;
  rrnNumber?: string; // Retrieval Reference Number
  reason?: string;
}

export interface SupportTicket {
  id: string; // e.g. RA-10293
  userId?: string;
  priority: TicketPriority;
  issue: string;
  category: IssueCategory;
  assignedTeam: string;
  status: TicketStatus;
  createdAt: string;
  transactionId?: string;
  resolutionNotes?: string;
}

export interface ExecutionStep {
  id: string;
  stepNumber: number;
  agentName: string;
  action: string;
  details?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp: string;
  durationMs?: number;
}

export interface ToolInvocation {
  toolName: string;
  params: Record<string, unknown>;
  result: Record<string, unknown>;
  status: 'SUCCESS' | 'ERROR';
}

export interface ResolutionCardData {
  title: string;
  category: IssueCategory;
  status: ResolutionStatus;
  amount?: number;
  transactionId?: string;
  merchant?: string;
  resolutionSummary: string;
  keyDetails: { label: string; value: string }[];
  suggestedActions: {
    label: string;
    actionType: 'view_transaction' | 'create_ticket' | 'escalate_human' | 'retry_payment' | 'track_refund';
    payload?: Record<string, unknown>;
  }[];
  ticket?: SupportTicket;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  agentName?: AgentName;
  intent?: IssueCategory;
  confidence?: number;
  executionSteps?: ExecutionStep[];
  toolsUsed?: ToolInvocation[];
  resolutionCard?: ResolutionCardData;
  isEscalated?: boolean;
}

export interface DashboardStats {
  totalQueries: number;
  resolvedQueries: number;
  escalatedQueries: number;
  resolutionRate: number; // e.g. 92.4%
  avgResponseTimeMs: number; // e.g. 1150
  activeAgentsCount: number;
  agentUsage: { name: string; count: number; percentage: number }[];
  categoryDistribution: { category: string; count: number }[];
  recentTickets: SupportTicket[];
  recentLogs: {
    id: string;
    timestamp: string;
    query: string;
    intent: IssueCategory;
    agent: AgentName;
    toolsCalled: string[];
    confidence: number;
    status: ResolutionStatus;
  }[];
}
