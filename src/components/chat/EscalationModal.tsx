import React, { useState } from 'react';
import { SupportTicket, IssueCategory, TicketPriority } from '../../types';
import { X, Ticket, ShieldAlert, CheckCircle, UserCheck } from 'lucide-react';

interface EscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIssue?: string;
  defaultCategory?: IssueCategory;
  defaultTransactionId?: string;
  onTicketCreated: (ticket: SupportTicket) => void;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  isOpen,
  onClose,
  defaultIssue = '',
  defaultCategory = 'PAYMENT_PENDING',
  defaultTransactionId = '',
  onTicketCreated,
}) => {
  const [issue, setIssue] = useState(defaultIssue || 'Transaction requires manual clearing verification.');
  const [category, setCategory] = useState<IssueCategory>(defaultCategory);
  const [priority, setPriority] = useState<TicketPriority>('HIGH');
  const [transactionId, setTransactionId] = useState(defaultTransactionId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<SupportTicket | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/support-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue,
          category,
          priority,
          transactionId: transactionId.trim() || undefined,
        }),
      });

      if (res.ok) {
        const ticket: SupportTicket = await res.json();
        setCreatedTicket(ticket);
        onTicketCreated(ticket);
      }
    } catch (err) {
      console.error('Failed to create ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!createdTicket ? (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Escalate to Human Specialist
                </h3>
                <p className="text-xs text-slate-500">
                  Raise an official priority support ticket for Paytm human operations.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Issue Summary & Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Describe the payment or account problem..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00BAF2] text-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IssueCategory)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-slate-800 bg-white"
                  >
                    <option value="PAYMENT_PENDING">Payment Pending</option>
                    <option value="PAYMENT_FAILED">Payment Failed</option>
                    <option value="REFUND">Refund Inquiry</option>
                    <option value="FRAUD_ALERT">Fraud / Security Alert</option>
                    <option value="KYC">KYC & Compliance</option>
                    <option value="GENERAL_SUPPORT">General Support</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    className="w-full p-2 rounded-xl border border-slate-200 text-slate-800 bg-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High (Urgent)</option>
                    <option value="URGENT">Critical (Fraud)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Transaction Reference (Optional)
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. TXN1002"
                  className="w-full p-2 rounded-xl border border-slate-200 text-slate-800 uppercase font-mono"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-[#0F4A8A] text-white hover:bg-[#002E6E] font-semibold transition-colors shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Ticket...' : 'Create Priority Ticket'}
              </button>
            </div>
          </form>
        ) : (
          /* Success confirmation */
          <div className="text-center py-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Ticket #{createdTicket.id} Created
            </h4>
            <p className="text-xs text-slate-600 mb-4">
              Your support ticket has been dispatched directly to{' '}
              <span className="font-semibold text-slate-800">{createdTicket.assignedTeam}</span>.
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-xs mb-4 space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Ticket ID:</span>
                <span className="font-bold text-slate-800">{createdTicket.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Priority:</span>
                <span className="text-rose-600 font-bold">{createdTicket.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Status:</span>
                <span className="text-emerald-700 font-bold">{createdTicket.status}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#0F4A8A] text-white font-semibold text-xs hover:bg-[#002E6E] transition-colors"
            >
              Done & Return to Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
