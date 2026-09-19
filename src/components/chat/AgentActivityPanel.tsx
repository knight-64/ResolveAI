import React from 'react';
import { AgentName, IssueCategory } from '../../types';
import {
  Zap,
  CreditCard,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Circle,
  Activity,
  Cpu,
  ShieldCheck,
} from 'lucide-react';

interface AgentActivityPanelProps {
  activeAgent?: AgentName;
  activeIntent?: IssueCategory;
  isLoading: boolean;
  onSelectPrompt?: (prompt: string) => void;
}

interface AgentInfo {
  name: AgentName;
  shortName: string;
  role: string;
  activeActivity: string;
  idleActivity: string;
  icon: React.ReactNode;
  accent: string;
  badgeBg: string;
}

export const AgentActivityPanel: React.FC<AgentActivityPanelProps> = ({
  activeAgent,
  activeIntent,
  isLoading,
}) => {
  const agents: AgentInfo[] = [
    {
      name: 'Intent Agent',
      shortName: 'Intent Agent',
      role: 'Entity extraction & intent classification',
      activeActivity: 'Analyzing input & extracting payment entities',
      idleActivity: 'Query analyzed & routed',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      accent: 'border-amber-200 bg-amber-50/40 text-amber-900',
      badgeBg: 'bg-amber-100 text-amber-800',
    },
    {
      name: 'Transaction Agent',
      shortName: 'Transaction Agent',
      role: 'Ledger lookup & bank clearing state',
      activeActivity: 'Querying payment status & clearing state',
      idleActivity: 'Verified ledger records & reconciliation',
      icon: <CreditCard className="w-4 h-4 text-blue-500" />,
      accent: 'border-blue-200 bg-blue-50/40 text-blue-900',
      badgeBg: 'bg-blue-100 text-blue-800',
    },
    {
      name: 'Refund Agent',
      shortName: 'Refund Agent',
      role: 'Refund lifecycle & RRN reference tracking',
      activeActivity: 'Verifying merchant cancellation & bank RRN',
      idleActivity: 'Refund settlement verified',
      icon: <RotateCcw className="w-4 h-4 text-purple-500" />,
      accent: 'border-purple-200 bg-purple-50/40 text-purple-900',
      badgeBg: 'bg-purple-100 text-purple-800',
    },
    {
      name: 'Security/Fraud Agent',
      shortName: 'Security Agent',
      role: 'Risk scoring & human escalation triage',
      activeActivity: 'Assessing fraud risk & safety escalation',
      idleActivity: 'Security assessment completed',
      icon: <ShieldAlert className="w-4 h-4 text-rose-500" />,
      accent: 'border-rose-200 bg-rose-50/40 text-rose-900',
      badgeBg: 'bg-rose-100 text-rose-800',
    },
    {
      name: 'General Support Agent',
      shortName: 'General Support',
      role: 'KYC, wallet limits & policies',
      activeActivity: 'Fetching customer policy guidance',
      idleActivity: 'Onboarding & limit policies ready',
      icon: <HelpCircle className="w-4 h-4 text-emerald-500" />,
      accent: 'border-emerald-200 bg-emerald-50/40 text-emerald-900',
      badgeBg: 'bg-emerald-100 text-emerald-800',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0F4A8A]">
            <Cpu className="w-4 h-4 text-[#00BAF2]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Agent Activity
            </h3>
            <p className="text-[11px] text-slate-500">Autonomous multi-agent system</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10.5px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>5 Online</span>
        </div>
      </div>

      {/* Agents List */}
      <div className="space-y-2">
        {agents.map((ag) => {
          const isSelected = activeAgent === ag.name;
          const isIntentAgent = ag.name === 'Intent Agent';

          let stateIcon = <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />;
          let statusText = 'Available';
          let statusStyle = 'text-slate-400';
          let containerStyle = 'border-slate-100 bg-slate-50/50 hover:bg-slate-50';

          if (isLoading) {
            if (isIntentAgent) {
              stateIcon = <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />;
              statusText = ag.activeActivity;
              statusStyle = 'text-amber-700 font-medium';
              containerStyle = 'border-amber-200 bg-amber-50/50 shadow-2xs';
            } else if (isSelected) {
              stateIcon = <ArrowRight className="w-3.5 h-3.5 text-blue-600 animate-pulse shrink-0" />;
              statusText = ag.activeActivity;
              statusStyle = 'text-blue-700 font-medium';
              containerStyle = 'border-blue-200 bg-blue-50/50 shadow-2xs';
            }
          } else if (isSelected) {
            stateIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
            statusText = ag.idleActivity;
            statusStyle = 'text-slate-700 font-medium';
            containerStyle = 'border-blue-200/80 bg-blue-50/30 shadow-2xs';
          } else if (isIntentAgent && activeAgent) {
            stateIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
            statusText = 'Payment issue identified';
            statusStyle = 'text-slate-600 font-medium';
            containerStyle = 'border-slate-200/80 bg-white shadow-2xs';
          }

          return (
            <div
              key={ag.name}
              className={`p-2.5 rounded-xl border transition-all ${containerStyle}`}
            >
              <div className="flex items-start space-x-2.5">
                <div className="mt-0.5 shrink-0">{ag.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {ag.shortName}
                    </span>
                    <div className="flex items-center space-x-1 shrink-0">
                      {stateIcon}
                    </div>
                  </div>
                  <p className={`text-[11px] mt-0.5 leading-snug line-clamp-1 ${statusStyle}`}>
                    {statusText}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Guarantee Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10.5px] text-slate-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Zero-hallucination verified
        </span>
        <span className="font-mono text-slate-400">NPCI SLA</span>
      </div>
    </div>
  );
};
