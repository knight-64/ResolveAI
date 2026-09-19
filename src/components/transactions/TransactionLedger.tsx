import React, { useState, useEffect } from 'react';
import { Transaction } from '../../types';
import { TransactionDetailModal } from './TransactionDetailModal';
import {
  Search,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  RefreshCw,
  Database,
  ArrowRight,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

interface TransactionLedgerProps {
  onTestInChat: (query: string) => void;
  initialSelectedId?: string | null;
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({ onTestInChat, initialSelectedId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/transactions');
      if (res.ok) {
        const data = (await res.json()) as Transaction[];
        setTransactions(data);
        if (initialSelectedId) {
          const match = data.find((t) => t.id === initialSelectedId);
          if (match) setSelectedTxn(match);
        }
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filtered = transactions.filter((t) => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bankName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Standardized Status Badges matching Section 10
  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>SUCCESS</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>PENDING</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>FAILED</span>
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <RotateCcw className="w-3 h-3 text-purple-600" />
            <span>REFUNDED</span>
          </span>
        );
      case 'REVERSED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <RotateCcw className="w-3 h-3 text-blue-600" />
            <span>REVERSED</span>
          </span>
        );
    }
  };

  const getHandlingAgent = (txn: Transaction) => {
    if (txn.status === 'REFUNDED') return 'Refund Agent';
    if (txn.status === 'FAILED' && txn.amount > 4000) return 'Security Agent';
    return 'Transaction Agent';
  };

  const getResolutionSummary = (txn: Transaction) => {
    if (txn.status === 'SUCCESS') return 'Settled instantly via UPI Switch';
    if (txn.status === 'PENDING') return 'NPCI 2-Hr clearing window';
    if (txn.status === 'FAILED') return 'Auto-reversal queued (T+1)';
    if (txn.status === 'REFUNDED') return 'Credited with Bank RRN';
    if (txn.status === 'REVERSED') return 'Returned to source account';
    return 'Reconciled';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-[#0F4A8A]" />
              ResolveAI Demo Ledger
            </h2>
            <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 font-mono text-[10px] font-bold uppercase">
              SIMULATED DATA
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulated core banking ledger proving that ResolveAI ground-truth agents inspect real transactional states.
          </p>
        </div>

        <button
          onClick={fetchTransactions}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload Records</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Transaction ID (e.g. TXN1002), merchant, or bank..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00BAF2]"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto text-xs font-semibold bg-slate-100 p-1 rounded-xl">
          {['ALL', 'PENDING', 'FAILED', 'REFUNDED', 'SUCCESS', 'REVERSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg transition-colors shrink-0 cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-[#0F4A8A] shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table with Exact Columns from Prompt */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Merchant</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Agent</th>
                <th className="py-3 px-4">Resolution</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((txn) => {
                const agent = getHandlingAgent(txn);
                const resolution = getResolutionSummary(txn);

                return (
                  <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F4A8A]">
                      {txn.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{txn.merchant}</p>
                      <span className="text-[10.5px] text-slate-400 font-mono">{txn.paymentMode}</span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900 font-mono text-sm">
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(txn.status)}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                        {agent}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-700 font-medium text-[11.5px] line-clamp-1">
                        {resolution}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Bank: {txn.bankName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {txn.date}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedTxn(txn)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold transition-colors cursor-pointer"
                        title="Inspect record details"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => {
                          let prompt = `What is the status of my transaction ${txn.id}?`;
                          if (txn.status === 'PENDING') prompt = `My payment of ₹${txn.amount} (${txn.id}) is still pending.`;
                          if (txn.status === 'REFUNDED') prompt = `Where is my refund for ${txn.merchant} transaction ${txn.id}?`;
                          if (txn.status === 'FAILED') prompt = `My payment of ₹${txn.amount} for ${txn.merchant} failed.`;
                          onTestInChat(prompt);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#0F4A8A] hover:bg-[#002E6E] text-white font-semibold transition-colors cursor-pointer shadow-2xs inline-flex items-center gap-1"
                        title="Ask ResolveAI to investigate this record"
                      >
                        <Sparkles className="w-3 h-3 text-[#00BAF2]" />
                        <span>Test in AI Support</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTxn && (
        <TransactionDetailModal
          transaction={selectedTxn}
          onClose={() => setSelectedTxn(null)}
          onTestInChat={(txn) => {
            setSelectedTxn(null);
            let prompt = `What is the status of my transaction ${txn.id}?`;
            if (txn.status === 'PENDING') prompt = `My payment of ₹${txn.amount} (${txn.id}) is still pending.`;
            if (txn.status === 'REFUNDED') prompt = `Where is my refund for ${txn.merchant} transaction ${txn.id}?`;
            if (txn.status === 'FAILED') prompt = `My payment of ₹${txn.amount} for ${txn.merchant} failed.`;
            onTestInChat(prompt);
          }}
        />
      )}
    </div>
  );
};
