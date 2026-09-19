import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { MessageBubble } from './MessageBubble';
import { EscalationModal } from './EscalationModal';
import {
  Send,
  ArrowRight,
  Sparkles,
  Bot,
  CheckCircle2,
} from 'lucide-react';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => Promise<void>;
  isLoading: boolean;
  onViewTransaction: (id: string) => void;
  onResetDemo: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onViewTransaction,
  onResetDemo,
}) => {
  const [inputText, setInputText] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [modalInitialTxn, setModalInitialTxn] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // High-level loading sequence requested in Section 19
  const loadingStages = [
    'Understanding your issue...',
    'Identifying the right agent...',
    'Checking relevant data...',
    'Preparing resolution...',
  ];

  // Rotate loading steps smoothly
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingStages.length - 1 ? prev + 1 : prev));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const query = inputText.trim();
    setInputText('');
    await onSendMessage(query);
  };

  const handleActionClick = (actionType: string, payload?: Record<string, unknown>) => {
    if (actionType === 'view_transaction' && payload?.id) {
      onViewTransaction(String(payload.id));
    } else if (actionType === 'create_ticket' || actionType === 'escalate_human') {
      setModalInitialTxn(payload?.transactionId ? String(payload.transactionId) : undefined);
      setIsEscalateModalOpen(true);
    } else if (actionType === 'track_refund' && payload?.transactionId) {
      onViewTransaction(String(payload.transactionId));
    } else if (actionType === 'retry_payment') {
      onSendMessage('I want to retry the payment for this order.');
    }
  };

  const demoScenarios = [
    {
      label: '₹499 Payment Pending',
      query: 'My payment of ₹499 is still pending.',
      category: 'Pending Payment',
      badgeColor: 'border-amber-200 bg-amber-50/80 text-amber-900 hover:bg-amber-100',
    },
    {
      label: '₹5,000 Unauthorized Payment',
      query: 'I think someone made an unauthorized transaction of ₹5000.',
      category: 'Security Risk',
      badgeColor: 'border-rose-200 bg-rose-50/80 text-rose-900 hover:bg-rose-100',
    },
    {
      label: 'Flipkart Refund Missing',
      query: 'My refund for Flipkart TXN1004 has not arrived yet.',
      category: 'Refund Lookup',
      badgeColor: 'border-purple-200 bg-purple-50/80 text-purple-900 hover:bg-purple-100',
    },
    {
      label: 'Failed Uber Payment',
      query: 'My payment of ₹250 for Uber failed but money was deducted.',
      category: 'Failed Auto-Reversal',
      badgeColor: 'border-blue-200 bg-blue-50/80 text-blue-900 hover:bg-blue-100',
    },
  ];

  const hasConversation = messages.length > 1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col min-h-[calc(100vh-8.5rem)]">
        {/* If empty / initial state, show Hero & Prominent Input Card */}
          {!hasConversation && (
            <div className="space-y-5 mb-4 animate-in fade-in">
              {/* 3. HERO AREA */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/40 border border-slate-200/90 shadow-xs text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>AI System Online • 5 Specialized Agents Active</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Resolve<span className="text-[#00BAF2]">AI</span>
                </h1>
                <p className="text-base sm:text-lg font-bold text-[#0F4A8A] mt-0.5">
                  AI-powered payment issue resolution
                </p>

                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                  Describe your payment, refund, or security issue. Our multi-agent system identifies the problem, verifies the relevant data, and guides you to a resolution.
                </p>
              </div>

              {/* 4. PRIMARY ACTION MUST BE OBVIOUS */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-blue-200 shadow-sm">
                <div className="mb-3">
                  <h2 className="text-base font-bold text-slate-900">
                    How can ResolveAI help?
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Describe your payment or account issue below.
                  </p>
                </div>

                {/* Primary Input */}
                <form onSubmit={handleSend} className="relative mt-2">
                  <div className="relative flex items-center">
                    <input
                      id="hero-chat-input"
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={isLoading}
                      placeholder="Type your issue here (e.g. My ₹499 payment is pending)..."
                      className="w-full py-4 pl-4 pr-14 rounded-2xl bg-slate-50/80 border border-slate-300 focus:bg-white focus:border-[#00BAF2] focus:ring-4 focus:ring-[#00BAF2]/10 text-sm text-slate-900 shadow-inner focus:outline-none transition-all placeholder:text-slate-400"
                    />
                    <button
                      id="btn-hero-send"
                      type="submit"
                      disabled={isLoading || !inputText.trim()}
                      className="absolute right-2.5 p-3 rounded-xl bg-[#0F4A8A] hover:bg-[#002E6E] text-white disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer active:scale-95"
                      title="Send problem to ResolveAI"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Quick Try Pills */}
                <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 font-semibold text-[11px]">Try:</span>
                  <button
                    onClick={() => onSendMessage('My payment of ₹499 is pending.')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Payment pending
                  </button>
                  <button
                    onClick={() => onSendMessage('My refund is missing for Flipkart order.')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Refund missing
                  </button>
                  <button
                    onClick={() => onSendMessage('I suspect an unauthorized payment on my account.')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Unauthorized payment
                  </button>
                </div>
              </div>

              {/* 5. DEMO SCENARIOS (COMPACT) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Quick Demo Scenarios
                  </span>
                  <span className="text-[11px] text-blue-600 font-medium">
                    Try a live scenario
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {demoScenarios.map((sc, i) => (
                    <button
                      key={i}
                      disabled={isLoading}
                      onClick={() => onSendMessage(sc.query)}
                      className={`p-3 rounded-xl border text-left font-semibold text-xs transition-all shadow-2xs cursor-pointer flex items-center justify-between ${sc.badgeColor}`}
                    >
                      <span>{sc.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onActionClick={handleActionClick}
              />
            ))}

            {/* 19. LOADING STATE */}
            {isLoading && (
              <div className="flex items-start space-x-3 my-4 animate-in fade-in">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0F4A8A] to-[#00BAF2] flex items-center justify-center text-white shadow-xs shrink-0">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>

                <div className="bg-white border border-blue-100 rounded-2xl rounded-tl-xs p-4 text-xs shadow-xs max-w-md w-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#0F4A8A] text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00BAF2] animate-ping" />
                      Multi-Agent Investigation
                    </span>
                    <span className="text-[10.5px] font-mono text-slate-400">
                      Step {loadingStep + 1} of 4
                    </span>
                  </div>

                  {/* Clean Animated Step Indicator */}
                  <div className="space-y-1.5 pt-1">
                    {loadingStages.map((stage, idx) => {
                      const isPast = idx < loadingStep;
                      const isCurrent = idx === loadingStep;

                      return (
                        <div
                          key={idx}
                          className={`flex items-center space-x-2 text-xs transition-colors ${
                            isCurrent
                              ? 'text-[#0F4A8A] font-semibold'
                              : isPast
                              ? 'text-emerald-700 font-medium'
                              : 'text-slate-300'
                          }`}
                        >
                          {isPast ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : isCurrent ? (
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00BAF2] border-t-transparent animate-spin shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-200 shrink-0" />
                          )}
                          <span>{stage}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Input Field (always visible when conversation is active) */}
          {hasConversation && (
            <div className="pt-3 sticky bottom-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
              {/* Quick Try Chips */}
              <div className="pb-2 flex items-center space-x-2 overflow-x-auto text-[11px] no-scrollbar">
                <span className="text-slate-400 font-bold uppercase tracking-wider shrink-0 text-[10px]">
                  Scenarios:
                </span>
                {demoScenarios.map((sc, i) => (
                  <button
                    key={i}
                    disabled={isLoading}
                    onClick={() => onSendMessage(sc.query)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-medium shrink-0 transition-all cursor-pointer shadow-2xs"
                  >
                    {sc.label}
                  </button>
                ))}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSend} className="relative">
                <div className="relative flex items-center">
                  <input
                    id="chat-input"
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isLoading}
                    placeholder="Type your payment or account issue..."
                    className="w-full py-3.5 pl-4 pr-12 rounded-2xl bg-white border border-slate-300 focus:border-[#00BAF2] focus:ring-3 focus:ring-[#00BAF2]/10 text-sm text-slate-800 shadow-sm focus:outline-none transition-all placeholder:text-slate-400"
                  />

                  <button
                    id="btn-send-message"
                    type="submit"
                    disabled={isLoading || !inputText.trim()}
                    className="absolute right-2 p-2.5 rounded-xl bg-[#0F4A8A] text-white hover:bg-[#002E6E] disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-xs cursor-pointer"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-slate-400">
                  <span>Simulated Sandbox Environment</span>
                  <span>NPCI Reconciliation Guardrails Active</span>
                </div>
              </form>
            </div>
          )}
      </div>

      {/* Escalation Modal */}
      <EscalationModal
        isOpen={isEscalateModalOpen}
        onClose={() => setIsEscalateModalOpen(false)}
        defaultTransactionId={modalInitialTxn}
        onTicketCreated={(ticket) => {
          console.log('Ticket created:', ticket.id);
        }}
      />
    </div>
  );
};
