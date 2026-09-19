import React from 'react';
import {
  Bot,
  MessageSquare,
  LayoutDashboard,
  Database,
  GitMerge,
  Sparkles,
  RotateCcw,
  Sliders,
  HelpCircle,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'dashboard' | 'transactions' | 'architecture';
  setActiveTab: (tab: 'chat' | 'dashboard' | 'transactions' | 'architecture') => void;
  onResetDemo: () => void;
  onNewChat: () => void;
  onOpenTour: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onResetDemo,
  onNewChat,
  onOpenTour,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-900 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          {/* Left: Branding & Hackathon Badge */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0F4A8A] to-[#00BAF2] flex items-center justify-center text-white shadow-sm shadow-[#00BAF2]/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-tight text-slate-900">
                  Resolve<span className="text-[#00BAF2]">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                Modular Multi-Agent Issue Resolution
              </p>
            </div>
          </div>

          {/* Center: Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <button
              id="tab-chat"
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white text-[#0F4A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>AI Support</span>
            </button>

            <button
              id="tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#0F4A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#0F4A8A]" />
              <span>Dashboard</span>
            </button>

            <button
              id="tab-transactions"
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-white text-[#0F4A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Demo Ledger</span>
            </button>

            <button
              id="tab-architecture"
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-white text-[#0F4A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5 text-indigo-600" />
              <span>Architecture</span>
            </button>
          </nav>

          {/* Right: Agents Active status & Actions */}
          <div className="flex items-center space-x-2">
            {/* 5 Agents Active Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>5 Agents Active</span>
            </div>

            {/* Guide Button */}
            <button
              id="btn-open-tour"
              onClick={onOpenTour}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 text-[#0F4A8A] hover:bg-blue-100/80 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
              title="View ResolveAI System Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>Guide</span>
            </button>

            {/* New Session Button */}
            <button
              id="btn-new-chat"
              onClick={onNewChat}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Start a fresh support session"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">New Session</span>
            </button>

            {/* Settings Button */}
            <button
              id="btn-settings"
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="System Settings & Engine Details"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200/80 px-2 py-1.5 bg-slate-50">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            activeTab === 'chat' ? 'bg-white text-[#0F4A8A] shadow-2xs' : 'text-slate-600'
          }`}
        >
          <MessageSquare className="w-3 h-3 text-[#00BAF2]" />
          <span>Support</span>
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            activeTab === 'dashboard' ? 'bg-white text-[#0F4A8A] shadow-2xs' : 'text-slate-600'
          }`}
        >
          <LayoutDashboard className="w-3 h-3 text-[#0F4A8A]" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            activeTab === 'transactions' ? 'bg-white text-[#0F4A8A] shadow-2xs' : 'text-slate-600'
          }`}
        >
          <Database className="w-3 h-3 text-emerald-600" />
          <span>Ledger</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
            activeTab === 'architecture' ? 'bg-white text-[#0F4A8A] shadow-2xs' : 'text-slate-600'
          }`}
        >
          <GitMerge className="w-3 h-3 text-indigo-600" />
          <span>Arch</span>
        </button>
      </div>
    </header>
  );
};
