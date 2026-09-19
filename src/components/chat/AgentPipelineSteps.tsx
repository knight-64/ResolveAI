import React, { useState } from 'react';
import { ExecutionStep, ToolInvocation } from '../../types';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Wrench,
  Sparkles,
  Database,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface AgentPipelineStepsProps {
  steps: ExecutionStep[];
  toolsUsed?: ToolInvocation[];
  agentName?: string;
  intent?: string;
  confidence?: number;
}

export const AgentPipelineSteps: React.FC<AgentPipelineStepsProps> = ({
  steps,
  toolsUsed = [],
  agentName,
  confidence,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!steps || steps.length === 0) return null;

  // Helper to map internal technical logs into clean human-understandable milestones
  const getCleanLabel = (action: string, idx: number): string => {
    const lower = action.toLowerCase();
    if (lower.includes('analyzing') || lower.includes('extracting')) {
      return 'Intent detected & query parsed';
    }
    if (lower.includes('classified as') || lower.includes('routing context')) {
      return 'Payment issue categorized & agent routed';
    }
    if (lower.includes('invoked tool') || lower.includes('tool:')) {
      if (lower.includes('refund')) return 'Checking refund status with payment gateway';
      if (lower.includes('fraud') || lower.includes('risk')) return 'Assessing security risk & account safety';
      if (lower.includes('transaction')) return 'Verifying transaction status in core ledger';
      return 'Checking payment network & banking records';
    }
    if (lower.includes('synthesized') || lower.includes('resolution')) {
      return 'Resolution synthesized & verified';
    }
    return action;
  };

  const toolCount = toolsUsed.length;
  const stageCount = steps.length;
  const confidencePercent = confidence ? Math.round(confidence * 100) : 98;

  return (
    <div className="my-3 rounded-2xl border border-slate-200/90 bg-slate-50/60 overflow-hidden text-xs transition-all shadow-2xs">
      {/* Collapsed Header Bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-100/70 transition-colors text-slate-800 cursor-pointer text-left"
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Title */}
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00BAF2] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0F4A8A]"></span>
            </span>
            <span className="font-bold text-slate-900 text-xs">
              Autonomous Agent Trace
            </span>
          </div>

          {/* Agent Name Badge */}
          {agentName && (
            <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[#0F4A8A] font-semibold text-[11px]">
              {agentName}
            </span>
          )}

          {/* Confidence Badge */}
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[10.5px] font-semibold">
            {confidencePercent}% Confidence
          </span>

          {/* Tool Calls Badge */}
          {toolCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#0F4A8A] font-mono text-[10.5px] font-semibold flex items-center gap-1">
              <Wrench className="w-3 h-3 text-[#00BAF2]" />
              {toolCount} {toolCount === 1 ? 'Tool Call' : 'Tool Calls'}
            </span>
          )}

          {/* Stage Count Badge */}
          <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10.5px]">
            {stageCount} Stages
          </span>
        </div>

        <div className="flex items-center space-x-1 text-slate-400 hover:text-slate-700 shrink-0 ml-2">
          <span className="text-[11px] font-medium hidden sm:inline">
            {isExpanded ? 'Hide Trace' : 'View Trace'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Clean Timeline */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-200/80 bg-white space-y-3">
          <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {steps.map((step, idx) => {
              const cleanLabel = getCleanLabel(step.action, idx);
              const isCompleted = step.status === 'completed';

              return (
                <div key={step.id || idx} className="relative group">
                  {/* Timeline Node */}
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-blue-500 animate-pulse" />
                    )}
                  </div>

                  {/* Step Item */}
                  <div className="p-2 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:bg-blue-50/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800 text-[11.5px] leading-snug">
                        {cleanLabel}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                        Step {step.stepNumber}
                      </span>
                    </div>

                    {step.details && (
                      <p className="text-[11px] text-slate-600 mt-1 font-mono bg-white/90 p-2 rounded-lg border border-slate-200/80 leading-relaxed break-all">
                        {step.details}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tools executed summary */}
          {toolsUsed.length > 0 && (
            <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                Executed Tools:
              </span>
              {toolsUsed.map((tool, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-blue-50 text-[#0F4A8A] border border-blue-200 rounded-md font-mono text-[10.5px] flex items-center gap-1"
                >
                  <Database className="w-3 h-3 text-[#00BAF2]" />
                  {tool.toolName}()
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
