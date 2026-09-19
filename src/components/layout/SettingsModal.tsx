import React from 'react';
import { X, Cpu, Database, Shield, Sliders, RefreshCw, CheckCircle2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetDemo: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0F4A8A] flex items-center justify-center border border-blue-100">
              <Sliders className="w-4 h-4 text-[#00BAF2]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-tight">
                System & Agent Settings
              </h3>
              <p className="text-xs text-slate-500">ResolveAI Engine Parameters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Environment Status */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                Ledger Environment
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10.5px] font-bold">
                SIMULATED SANDBOX
              </span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Safe testing sandbox seeded with realistic banking failure states, UPI switch timeouts, and merchant refund cases.
            </p>
          </div>

          {/* AI Orchestrator Details */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#00BAF2]" />
                Multi-Agent Orchestrator
              </span>
              <span className="font-mono text-slate-600 text-[11px]">Groq / Gemini AI</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                <span className="text-slate-400 block text-[10px]">Confidence Floor</span>
                <span className="font-mono font-bold text-slate-800">65% Minimum</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-slate-200/70">
                <span className="text-slate-400 block text-[10px]">NPCI Reconciliation SLA</span>
                <span className="font-mono font-bold text-slate-800">2 Hours Window</span>
              </div>
            </div>
          </div>

          {/* Data Reset Action */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-amber-900 block text-xs">
                Reset Demo Ledger & Tickets
              </span>
              <span className="text-[11px] text-amber-700 leading-tight block mt-0.5">
                Restores original 8 test transactions and sample tickets.
              </span>
            </div>
            <button
              onClick={() => {
                onResetDemo();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset State
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
