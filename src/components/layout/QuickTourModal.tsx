import React, { useState } from 'react';
import {
  X,
  Bot,
  Zap,
  CreditCard,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  Wrench,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Database,
  Cpu,
  Layers,
  FileQuestion,
  ChevronDown,
} from 'lucide-react';

interface QuickTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (prompt: string) => void;
}

export const QuickTourModal: React.FC<QuickTourModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  const [activeSection, setActiveSection] = useState<number | null>(0);

  if (!isOpen) return null;

  const guideSections = [
    {
      title: '1. What is ResolveAI?',
      icon: <Sparkles className="w-4 h-4 text-[#00BAF2]" />,
      content:
        'ResolveAI is an enterprise-grade AI payment support platform engineered for fintech applications. Unlike standard chatbots that generate generic conversational text, ResolveAI coordinates specialized AI agents with direct access to core banking ledgers to resolve payment delays, verify refund statuses, and intercept fraud deterministically.',
    },
    {
      title: '2. How does it work?',
      icon: <Cpu className="w-4 h-4 text-[#0F4A8A]" />,
      content:
        'When a customer inputs a problem, the Intent Agent classifies the issue and extracts parameters (e.g. transaction ID, currency amount). The AI Orchestrator checks confidence ratings and routes the task to the domain-specific specialist agent. The agent executes real-time tool checks against the ledger and generates an interactive, verifiable Resolution Card.',
    },
    {
      title: '3. What are the agents?',
      icon: <Bot className="w-4 h-4 text-purple-600" />,
      content: (
        <div className="space-y-2 mt-1">
          <p>ResolveAI operates four autonomous sub-agents under the central orchestrator:</p>
          <ul className="space-y-1.5 pl-1 text-[11.5px]">
            <li>
              <strong className="text-blue-900">• Transaction Agent:</strong> Resolves pending, failed, and stuck payments by diagnosing NPCI UPI switch codes (e.g. U30 timeouts).
            </li>
            <li>
              <strong className="text-purple-900">• Refund Agent:</strong> Traces merchant settlements, gateway reversals, and provides bank RRN reference numbers.
            </li>
            <li>
              <strong className="text-rose-900">• Security Agent:</strong> Analyzes unauthorized debit claims, computes fraud risk scores, and protects user credentials.
            </li>
            <li>
              <strong className="text-emerald-900">• General Support Agent:</strong> Guides users through Video KYC onboarding, wallet limits, and account policies.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: '4. How does tool calling work?',
      icon: <Wrench className="w-4 h-4 text-amber-600" />,
      content:
        'Agents do not guess transaction states. Instead, they invoke deterministic backend functions like `getTransactionStatus(txnId)` or `getRefundStatus(txnId)` against the core ledger. The returned JSON status is synthesized into user-friendly explanations and visual cards with verified settlement timestamps and bank details.',
    },
    {
      title: '5. When does human escalation happen?',
      icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
      content:
        'Human escalation triggers automatically when: (1) an unauthorized transaction or fraud risk score exceeds 80%, (2) query intent confidence falls below 65%, or (3) a bank reversal exceeds the statutory RBI/NPCI SLA window. In such cases, an urgent support ticket is immediately created and routed to Tier 2 operations.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0F4A8A] to-[#002E6E] p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-[#00BAF2]/20 border border-[#00BAF2]/30 text-[#00BAF2] text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Architecture & Operations Manual</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Resolve<span className="text-[#00BAF2]">AI</span> Platform Guide
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-lg leading-relaxed">
            Essential concepts for hackathon judges: Multi-agent routing, ground-truth tool calling, and automated safeguards.
          </p>
        </div>

        {/* 15. The 5 Core Questions */}
        <div className="p-6 space-y-3 overflow-y-auto flex-1">
          {guideSections.map((sec, idx) => {
            const isOpen = activeSection === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden transition-all bg-slate-50/50"
              >
                <button
                  onClick={() => setActiveSection(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between font-bold text-sm text-slate-900 hover:bg-slate-100/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                      {sec.icon}
                    </div>
                    <span>{sec.title}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-[#0F4A8A]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                    {sec.content}
                  </div>
                )}
              </div>
            );
          })}

          {/* Quick 1-Click Launchers */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Ready to test live? Choose a demo scenario:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onSelectScenario('My payment of ₹499 is still pending.');
                  onClose();
                }}
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-[#0F4A8A]">
                    Pending ₹499 Payment
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[10.5px] text-slate-500 block mt-0.5">
                  Tests Transaction Agent UPI switch timeout diagnosis
                </span>
              </button>

              <button
                onClick={() => {
                  onSelectScenario('I think someone made an unauthorized transaction of ₹5000.');
                  onClose();
                }}
                className="p-3 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-rose-700">
                    Fraud Alert ₹5,000
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[10.5px] text-slate-500 block mt-0.5">
                  Tests Security Agent risk scoring & human escalation
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-mono">
            ResolveAI Enterprise Core v2.4
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#0F4A8A] hover:bg-[#002E6E] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
