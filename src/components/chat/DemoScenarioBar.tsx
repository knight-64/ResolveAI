import React, { useState } from 'react';
import {
  Play,
  Sparkles,
  AlertCircle,
  Clock,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle,
  Zap,
} from 'lucide-react';

interface DemoScenario {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  prompt: string;
  expectedIntent: string;
  expectedAgent: string;
  expectedTool: string;
  accent: string;
  agentColor: string;
}

interface DemoScenarioBarProps {
  onSelectScenario: (prompt: string) => void;
  isLoading: boolean;
}

export const DemoScenarioBar: React.FC<DemoScenarioBarProps> = ({
  onSelectScenario,
  isLoading,
}) => {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const scenarios: DemoScenario[] = [
    {
      id: 'demo-1',
      tag: 'UPI Delay',
      title: 'Pending ₹499 Payment',
      subtitle: 'Simulates NPCI switch delay & 2-hr reconciliation rule',
      prompt: 'My payment of ₹499 is still pending.',
      expectedIntent: 'PAYMENT_PENDING',
      expectedAgent: 'Transaction Agent',
      expectedTool: 'getTransactionStatus(TXN1002)',
      accent: 'border-amber-400/40 hover:border-amber-400 bg-gradient-to-br from-amber-500/10 to-amber-600/5',
      agentColor: 'text-amber-300 bg-amber-950/60 border-amber-800',
    },
    {
      id: 'demo-2',
      tag: 'Security & Risk',
      title: 'Unauthorized ₹5,000 Alert',
      subtitle: 'Simulates 92% fraud risk scoring & urgent human escalation',
      prompt: 'I think someone made an unauthorized transaction of ₹5000.',
      expectedIntent: 'FRAUD_ALERT',
      expectedAgent: 'Security/Fraud Agent',
      expectedTool: 'checkFraudRisk() + Escalate',
      accent: 'border-rose-400/40 hover:border-rose-400 bg-gradient-to-br from-rose-500/10 to-rose-600/5',
      agentColor: 'text-rose-300 bg-rose-950/60 border-rose-800',
    },
    {
      id: 'demo-3',
      tag: 'Merchant SLA',
      title: 'Missing Flipkart Refund',
      subtitle: 'Simulates banking RRN statement verification & timeline',
      prompt: 'My refund for Flipkart TXN1004 has not arrived yet.',
      expectedIntent: 'REFUND',
      expectedAgent: 'Refund Agent',
      expectedTool: 'getRefundStatus(TXN1004)',
      accent: 'border-purple-400/40 hover:border-purple-400 bg-gradient-to-br from-purple-500/10 to-purple-600/5',
      agentColor: 'text-purple-300 bg-purple-950/60 border-purple-800',
    },
    {
      id: 'demo-4',
      tag: 'Auto Reversal',
      title: 'Failed Uber Payment',
      subtitle: 'Simulates bank switch timeout & automated reversal tracking',
      prompt: 'Money was deducted for Uber ride TXN1003 but driver says unpaid.',
      expectedIntent: 'PAYMENT_FAILED',
      expectedAgent: 'Transaction Agent',
      expectedTool: 'getTransactionStatus(TXN1003)',
      accent: 'border-blue-400/40 hover:border-blue-400 bg-gradient-to-br from-blue-500/10 to-blue-600/5',
      agentColor: 'text-blue-300 bg-blue-950/60 border-blue-800',
    },
  ];

  return (
    <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-lg mb-4 border border-slate-800 transition-all">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0F4A8A] to-[#00BAF2] flex items-center justify-center text-white shadow-xs shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Paytm AI Hackathon 3-Minute Demo Scenarios
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                1-Click Interactive Test
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Click any real-world banking scenario below to watch the autonomous multi-agent pipeline resolve it live.
            </p>
          </div>
        </div>

        {/* How It Works Toggle */}
        <button
          onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
          className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-200 border border-white/10 transition-colors cursor-pointer shrink-0"
        >
          <Info className="w-3.5 h-3.5 text-[#00BAF2]" />
          <span>How ResolveAI Works</span>
          {isHowItWorksOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expandable "How ResolveAI Works" Explanation */}
      {isHowItWorksOpen && (
        <div className="mb-4 p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-xs text-slate-200 animate-in fade-in slide-in-from-top-2">
          <h4 className="font-bold text-white mb-2 flex items-center gap-1.5 text-xs">
            <Zap className="w-4 h-4 text-amber-400" />
            The 3-Tier Multi-Agent Architecture:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700">
              <div className="font-bold text-[#00BAF2] text-[11px] mb-1">1. Semantic Intent Extraction</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Intent Agent uses NLP to extract entities (TXN ID, Amount) and computes confidence scores.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700">
              <div className="font-bold text-amber-300 text-[11px] mb-1">2. Domain Agent & Ledger Tools</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Routes to specialized agent (Transaction, Refund, Fraud) which queries simulated Paytm core banking APIs.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700">
              <div className="font-bold text-emerald-300 text-[11px] mb-1">3. Verified Resolution or Handoff</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Emits structured cards with NPCI reconciliation SLAs, or dispatches priority tickets to human agents.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4 Interactive Scenario Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            id={`btn-${scenario.id}`}
            disabled={isLoading}
            onClick={() => onSelectScenario(scenario.prompt)}
            className={`text-left p-3 rounded-2xl border transition-all duration-200 group relative flex flex-col justify-between cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${scenario.accent}`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {scenario.tag}
                </span>
                <span className={`text-[9.5px] px-1.5 py-0.5 rounded-md border font-mono ${scenario.agentColor}`}>
                  {scenario.expectedAgent.replace(' Agent', '')}
                </span>
              </div>

              <h4 className="text-xs font-bold text-white group-hover:text-[#00BAF2] transition-colors leading-tight mb-1">
                {scenario.title}
              </h4>
              <p className="text-[10.5px] text-slate-300 line-clamp-2 leading-relaxed mb-2.5">
                {scenario.subtitle}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10.5px]">
              <span className="text-[#00BAF2] font-semibold flex items-center gap-1 group-hover:underline">
                <Play className="w-2.5 h-2.5 fill-current" />
                Run Live Demo
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* Quick Test Pill Bar for Different Transactions */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-slate-400 font-semibold text-[10.5px] mr-1">More payment tests:</span>
        <button
          onClick={() => onSelectScenario('What is the status of my Blinkit order ₹1999?')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-400/50 transition-colors"
        >
          🟡 Blinkit Pending (₹1,999)
        </button>
        <button
          onClick={() => onSelectScenario('Why did my Chai Point payment of ₹150 fail?')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 hover:border-rose-400/50 transition-colors"
        >
          🔴 Chai Point Failed (₹150)
        </button>
        <button
          onClick={() => onSelectScenario('What happened to my Delhi Metro ₹350 transaction?')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 hover:border-indigo-400/50 transition-colors"
        >
          🟣 Metro Reversed (₹350)
        </button>
        <button
          onClick={() => onSelectScenario('Show me the status of all my recent payments.')}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#00BAF2] border border-slate-700 hover:border-[#00BAF2]/50 transition-colors"
        >
          📊 All Payments Ledger
        </button>
      </div>
    </div>
  );
};
