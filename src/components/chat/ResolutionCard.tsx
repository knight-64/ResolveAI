import React from 'react';
import { ResolutionCardData } from '../../types';
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  Ticket,
  UserCheck,
  RotateCcw,
  XCircle,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ResolutionCardProps {
  cardData: ResolutionCardData;
  onActionClick: (actionType: string, payload?: Record<string, unknown>) => void;
}

export const ResolutionCard: React.FC<ResolutionCardProps> = ({ cardData, onActionClick }) => {
  const isEscalated = cardData.status === 'ESCALATED';

  // Consistent Status Badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>SUCCESS</span>
          </span>
        );
      case 'PENDING':
      case 'PENDING_USER_ACTION':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>PENDING</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>FAILED</span>
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
            <span>REFUNDED</span>
          </span>
        );
      case 'REVERSED':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
            <span>REVERSED</span>
          </span>
        );
      case 'ESCALATED':
      case 'UNDER_INVESTIGATION':
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>ESCALATED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  // Find merchant from keyDetails if available
  const merchantDetail = cardData.keyDetails?.find((d) => d.label.toLowerCase().includes('merchant'));
  const merchantName = merchantDetail ? merchantDetail.value : 'Swiggy / Partner Merchant';

  // Determine what this means and expected actions
  const getExplanation = () => {
    if (cardData.status === 'ESCALATED') {
      return {
        means: 'A high-priority risk flag was detected. The transaction has been routed to a human fraud specialist for security review.',
        action: 'A support ticket has been created. A fraud specialist will review your account history within 30 minutes.',
      };
    }
    if (cardData.title.toLowerCase().includes('pending') || cardData.status === 'PENDING_USER_ACTION') {
      return {
        means: 'Your payment is currently being processed by the banking network. The funds have been placed on hold during switch clearing.',
        action: 'Please wait for the standard 2-hour reconciliation window. If the payment remains pending after this period, you can create a support ticket for automatic reversal.',
      };
    }
    if (cardData.title.toLowerCase().includes('refund')) {
      return {
        means: 'The merchant has processed the refund. The funds are in transit to your original payment method.',
        action: 'The bank reference number (RRN) has been recorded. Check your bank statement within 2-4 business days.',
      };
    }
    if (cardData.title.toLowerCase().includes('failed')) {
      return {
        means: 'The payment was not completed due to a temporary network timeout between the bank switch and NPCI.',
        action: 'Any deducted amount will be automatically reversed to your bank account within the standard T+1 banking window.',
      };
    }
    return {
      means: cardData.resolutionSummary || 'The transaction status has been verified against core banking records.',
      action: 'No further action is needed at this time. All records have been reconciled.',
    };
  };

  const explanation = getExplanation();

  return (
    <div className="mt-3.5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all text-slate-900">
      {/* Header: Title, Category & Simulated Data Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Resolution
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono text-[9.5px] font-bold">
              SIMULATED DEMO DATA
            </span>
          </div>
          <h4 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
            {isEscalated ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            )}
            <span>{cardData.title}</span>
          </h4>
        </div>

        <div>{getStatusBadge(cardData.status)}</div>
      </div>

      {/* Transaction Details Grid */}
      <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium block">Transaction ID</span>
          <span className="font-mono text-xs font-bold text-[#0F4A8A] block mt-0.5">
            {cardData.transactionId || 'TXN1002'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium block">Amount</span>
          <span className="font-bold text-sm text-slate-900 block mt-0.5">
            ₹{cardData.amount !== undefined ? cardData.amount.toLocaleString('en-IN') : '499'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium block">Status</span>
          <span className="font-bold text-xs text-slate-800 block mt-0.5">
            {cardData.status}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium block">Merchant</span>
          <span className="font-bold text-xs text-slate-800 block mt-0.5 truncate">
            {merchantName}
          </span>
        </div>
      </div>

      {/* What this means */}
      <div className="space-y-3 pt-1 text-xs">
        <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100/80">
          <h5 className="font-bold text-slate-800 text-xs mb-1">What this means</h5>
          <p className="text-slate-600 leading-relaxed text-[11.5px]">
            {explanation.means}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <h5 className="font-bold text-slate-800 text-xs mb-1">Expected action</h5>
          <p className="text-slate-600 leading-relaxed text-[11.5px]">
            {explanation.action}
          </p>
        </div>
      </div>

      {/* Escalation Ticket if present */}
      {cardData.ticket && (
        <div className="mt-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-rose-600" />
              Ticket #{cardData.ticket.id}
            </span>
            <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-mono font-bold">
              {cardData.ticket.status}
            </span>
          </div>
          <p className="text-[11px] text-rose-800 mt-1">
            Assigned to <span className="font-semibold">{cardData.ticket.assignedTeam}</span>. Priority: {cardData.ticket.priority}.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
        <button
          onClick={() =>
            onActionClick('create_ticket', {
              transactionId: cardData.transactionId || 'TXN1002',
            })
          }
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0F4A8A] text-white hover:bg-[#002E6E] transition-colors cursor-pointer shadow-xs"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Create Support Ticket</span>
        </button>

        <button
          onClick={() =>
            onActionClick('view_transaction', {
              id: cardData.transactionId || 'TXN1002',
            })
          }
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#00BAF2]" />
          <span>Check in Demo Ledger</span>
        </button>
      </div>
    </div>
  );
};
