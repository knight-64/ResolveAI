import React from 'react';
import { Transaction } from '../../types';
import { X, CheckCircle, AlertCircle, Clock, RotateCcw, ShieldCheck, Copy, Check } from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onTestInChat?: (txn: Transaction) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onTestInChat,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!transaction) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(transaction, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0F4A8A] flex items-center justify-center font-bold">
            ₹
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900 font-mono">
                {transaction.id}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Simulated Data
              </span>
            </div>
            <p className="text-xs text-slate-500">{transaction.merchant}</p>
          </div>
        </div>

        <div className="space-y-3 text-xs mb-5">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400">Total Amount</span>
              <p className="text-xl font-extrabold text-slate-900">
                ₹{transaction.amount.toLocaleString('en-IN')}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                transaction.status === 'SUCCESS'
                  ? 'bg-emerald-100 text-emerald-800'
                  : transaction.status === 'PENDING'
                  ? 'bg-amber-100 text-amber-800'
                  : transaction.status === 'FAILED'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {transaction.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Payment Mode</span>
              <span className="font-semibold text-slate-800">{transaction.paymentMode}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Bank Partner</span>
              <span className="font-semibold text-slate-800">{transaction.bankName}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">UPI ID / Handle</span>
              <span className="font-semibold text-slate-800 font-mono text-[11px]">{transaction.upiId || 'N/A'}</span>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Timestamp</span>
              <span className="font-semibold text-slate-800 font-mono text-[11px]">{transaction.date}</span>
            </div>
          </div>

          {transaction.failureReason && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
              <span className="font-semibold block mb-0.5 text-[11px]">System Status Note:</span>
              <p className="text-[11.5px] leading-relaxed">{transaction.failureReason}</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Prisma / API Record Payload</span>
              <button
                onClick={handleCopyJson}
                className="text-[11px] text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-2.5 bg-slate-900 text-slate-200 rounded-xl text-[10.5px] font-mono overflow-x-auto max-h-36">
              {JSON.stringify(transaction, null, 2)}
            </pre>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
          >
            Close
          </button>
          {onTestInChat && (
            <button
              onClick={() => {
                onTestInChat(transaction);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-[#0F4A8A] hover:bg-[#002E6E] text-white font-semibold text-xs shadow-xs"
            >
              Test with ResolveAI Chat →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
