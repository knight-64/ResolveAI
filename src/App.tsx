import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { ChatView } from './components/chat/ChatView';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { TransactionLedger } from './components/transactions/TransactionLedger';
import { ArchitectureView } from './components/architecture/ArchitectureView';
import { QuickTourModal } from './components/layout/QuickTourModal';
import { SettingsModal } from './components/layout/SettingsModal';
import { ChatMessage } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'transactions' | 'architecture'>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null);

  // Initial welcome message explaining the multi-agent system
  const initialMessages: ChatMessage[] = [
    {
      id: 'welcome-1',
      sender: 'agent',
      agentName: 'Intent Agent',
      content:
        'Hello! Welcome to ResolveAI, the automated issue-resolution platform for payments.\n\nOur system uses a modular multi-agent architecture (Intent Agent, Transaction Agent, Refund Agent, Security/Fraud Agent, and General Support) to diagnose payments, query ledger records, and resolve issues in real-time.\n\nHow can I help you today? You can describe your payment query or select one of the suggested prompts below.',
      timestamp: 'Just now',
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Send message to backend multi-agent orchestrator
  const handleSendMessage = async (query: string) => {
    if (!query.trim() || isLoading) return;

    // 1. Append user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        content: data.message || 'Resolution generated successfully.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agentName: data.agentName,
        intent: data.intent,
        confidence: data.confidence,
        executionSteps: data.executionSteps,
        toolsUsed: data.toolsUsed,
        resolutionCard: data.resolutionCard,
        isEscalated: data.isEscalated,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback message
      const errorMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        agentName: 'General Support Agent',
        content:
          "I encountered a temporary connection issue communicating with our ledger service. I've logged this request; please retry or escalate to a human agent.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset demo data
  const handleResetDemo = async () => {
    try {
      await fetch('/api/reset-demo', { method: 'POST' });
      setResetNotice('Demo ledger & tickets reset to initial state!');
      setTimeout(() => setResetNotice(null), 3500);
    } catch (err) {
      console.error('Reset failed:', err);
    }
  };

  // Start new session
  const handleNewChat = () => {
    setMessages(initialMessages);
    setActiveTab('chat');
  };

  // Jump from Ledger or Tour to Chat
  const handleTestInChat = (prompt: string) => {
    setActiveTab('chat');
    handleSendMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#00BAF2]/20">
      {/* Toast notification */}
      {resetNotice && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl animate-in fade-in slide-in-from-top-2">
          {resetNotice}
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDemo={handleResetDemo}
        onNewChat={handleNewChat}
        onOpenTour={() => setIsTourOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetDemo={handleResetDemo}
      />

      {/* Hackathon Guide / Quick Tour Modal */}
      <QuickTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSelectScenario={handleTestInChat}
      />

      {/* Main Body Content according to active tab */}
      <main className="flex-1">
        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onViewTransaction={(id) => {
              setSelectedTxnId(id);
              setActiveTab('transactions');
            }}
            onResetDemo={handleResetDemo}
          />
        )}

        {activeTab === 'dashboard' && <AdminDashboard />}

        {activeTab === 'transactions' && (
          <TransactionLedger
            onTestInChat={handleTestInChat}
            initialSelectedId={selectedTxnId}
          />
        )}

        {activeTab === 'architecture' && <ArchitectureView />}
      </main>
    </div>
  );
}
