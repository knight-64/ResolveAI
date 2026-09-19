import React, { useState } from 'react';
import { ChatMessage, AgentName } from '../../types';
import { AgentPipelineSteps } from './AgentPipelineSteps';
import { ResolutionCard } from './ResolutionCard';
import {
  Bot,
  User,
  CreditCard,
  RotateCcw,
  ShieldAlert,
  HelpCircle,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  onActionClick: (actionType: string, payload?: Record<string, unknown>) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onActionClick }) => {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAgentIcon = (agentName?: AgentName) => {
    switch (agentName) {
      case 'Transaction Agent':
        return <CreditCard className="w-4 h-4 text-white" />;
      case 'Refund Agent':
        return <RotateCcw className="w-4 h-4 text-white" />;
      case 'Security/Fraud Agent':
        return <ShieldAlert className="w-4 h-4 text-white" />;
      case 'Intent Agent':
        return <Zap className="w-4 h-4 text-white" />;
      default:
        return <HelpCircle className="w-4 h-4 text-white" />;
    }
  };

  const getAgentBg = (agentName?: AgentName) => {
    switch (agentName) {
      case 'Transaction Agent':
        return 'bg-gradient-to-tr from-[#0F4A8A] to-[#00BAF2]';
      case 'Refund Agent':
        return 'bg-gradient-to-tr from-purple-700 to-indigo-600';
      case 'Security/Fraud Agent':
        return 'bg-gradient-to-tr from-rose-600 to-amber-600';
      default:
        return 'bg-gradient-to-tr from-slate-700 to-slate-900';
    }
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-3xl items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
            isUser ? 'bg-slate-900 text-white' : getAgentBg(message.agentName)
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : getAgentIcon(message.agentName)}
        </div>

        {/* Bubble Content */}
        <div className="flex-1 min-w-0">
          {/* Header Info */}
          {!isUser && (
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <span>ResolveAI</span>
                <span className="text-slate-400 font-normal">•</span>
                <span className="text-[#0F4A8A] font-semibold">{message.agentName || 'Multi-Agent Engine'}</span>
              </span>

              {message.intent && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold border border-slate-200">
                  {message.intent}
                </span>
              )}

              {message.confidence && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-semibold border border-emerald-200">
                  {Math.round(message.confidence * 100)}% confidence
                </span>
              )}
            </div>
          )}

          {isUser && (
            <div className="flex items-center justify-end space-x-1.5 mb-1 text-right">
              <span className="text-[11px] font-semibold text-slate-500">You</span>
            </div>
          )}

          {/* Message Body */}
          <div
            className={`rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
              isUser
                ? 'bg-[#0F4A8A] text-white rounded-tr-xs'
                : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
            }`}
          >
            <p className="whitespace-pre-line text-sm leading-relaxed">{message.content}</p>

            {/* Autonomous Agent Trace */}
            {!isUser && message.executionSteps && message.executionSteps.length > 0 && (
              <AgentPipelineSteps
                steps={message.executionSteps}
                toolsUsed={message.toolsUsed}
                agentName={message.agentName}
                intent={message.intent}
                confidence={message.confidence}
              />
            )}

            {/* Structured Resolution Card */}
            {!isUser && message.resolutionCard && (
              <ResolutionCard cardData={message.resolutionCard} onActionClick={onActionClick} />
            )}

            {/* Timestamp & Copy action */}
            <div className={`mt-2.5 flex items-center justify-between text-[10.5px] ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
              <span>{message.timestamp}</span>

              {!isUser && (
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 hover:text-slate-700 transition-colors cursor-pointer"
                  title="Copy message text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
