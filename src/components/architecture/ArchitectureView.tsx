import React, { useState } from 'react';
import {
  GitMerge,
  Cpu,
  Bot,
  Wrench,
  CheckCircle2,
  ShieldAlert,
  CreditCard,
  RotateCcw,
  HelpCircle,
  Zap,
  ArrowDown,
  Layers,
  Sparkles,
  Workflow,
  ArrowRight,
  Play,
  Check,
  X,
  Database,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface SimulationScenario {
  id: string;
  name: string;
  query: string;
  detectedIntent: string;
  confidence: number;
  extractedSlots: { txnId?: string; amount?: number; merchant?: string };
  selectedAgent: string;
  toolCall: string;
  toolResponse: string;
  outcomeType: 'AUTO_RESOLVED' | 'AUTO_ESCALATED';
  resolutionTitle: string;
}

export const ArchitectureView: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('Transaction Agent');
  const [activeSimulationId, setActiveSimulationId] = useState<string>('sim-pending');

  const simulations: Record<string, SimulationScenario> = {
    'sim-pending': {
      id: 'sim-pending',
      name: 'Scenario 1: Pending ₹499 Payment',
      query: 'My payment of ₹499 is still pending.',
      detectedIntent: 'PAYMENT_PENDING',
      confidence: 0.98,
      extractedSlots: { txnId: 'TXN1002', amount: 499, merchant: 'Swiggy' },
      selectedAgent: 'Transaction Agent',
      toolCall: 'getTransactionStatus("TXN1002")',
      toolResponse: '{ status: "PENDING", reason: "Bank Switch Timeout (NPCI Code U30)", bankName: "State Bank of India" }',
      outcomeType: 'AUTO_RESOLVED',
      resolutionTitle: 'Payment Pending at Bank Clearing (NPCI SLA: 2 Hours)',
    },
    'sim-fraud': {
      id: 'sim-fraud',
      name: 'Scenario 2: Unauthorized ₹5,000 Fraud',
      query: 'I think someone made an unauthorized transaction of ₹5000.',
      detectedIntent: 'FRAUD_ALERT',
      confidence: 0.94,
      extractedSlots: { amount: 5000, merchant: 'Unknown Vendor' },
      selectedAgent: 'Security/Fraud Agent',
      toolCall: 'checkFraudRisk({ amount: 5000, userReported: true })',
      toolResponse: '{ riskScore: 94, flagged: true, actionRequired: "HUMAN_ESCALATION" }',
      outcomeType: 'AUTO_ESCALATED',
      resolutionTitle: 'High-Priority Escalation Ticket Created for Human Fraud Ops',
    },
    'sim-refund': {
      id: 'sim-refund',
      name: 'Scenario 3: Missing Flipkart Refund',
      query: 'My refund for Flipkart TXN1004 has not arrived yet.',
      detectedIntent: 'REFUND',
      confidence: 0.96,
      extractedSlots: { txnId: 'TXN1004', amount: 3499, merchant: 'Flipkart' },
      selectedAgent: 'Refund Agent',
      toolCall: 'getRefundStatus("TXN1004")',
      toolResponse: '{ refundStatus: "CREDITED_TO_ACCOUNT", rrn: "948201948210", bankName: "HDFC Bank" }',
      outcomeType: 'AUTO_RESOLVED',
      resolutionTitle: 'Refund Successfully Credited with Bank RRN Reference',
    },
    'sim-kyc': {
      id: 'sim-kyc',
      name: 'Scenario 4: Video KYC Limits',
      query: 'How do I complete Video KYC to upgrade my wallet limit?',
      detectedIntent: 'GENERAL_SUPPORT',
      confidence: 0.91,
      extractedSlots: {},
      selectedAgent: 'General Support Agent',
      toolCall: 'getKYCGuidelines({ tier: "Full-KYC" })',
      toolResponse: '{ status: "ELIGIBLE", requiredDocs: ["Aadhaar", "PAN"], estimatedTimeMinutes: 5 }',
      outcomeType: 'AUTO_RESOLVED',
      resolutionTitle: 'Step-by-Step Paperless Video KYC Onboarding',
    },
  };

  const activeSim = simulations[activeSimulationId] || simulations['sim-pending'];

  // Agent interactive specification profiles (Purpose, Inputs, Tools, Output)
  const agentSpecs: Record<
    string,
    {
      name: string;
      icon: React.ReactNode;
      purpose: string;
      inputs: string[];
      tools: string[];
      output: string;
      accent: string;
    }
  > = {
    'Intent Agent': {
      name: 'Intent Agent',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      purpose:
        'Analyzes natural language queries, classifies issues, extracts payment entities (amounts, TXN IDs), and routes context to the appropriate specialized agent.',
      inputs: ['Raw user text query', 'Active user profile ID', 'Recent session state'],
      tools: ['Semantic Intent Classifier', 'Entity & Currency Slot Extractor', 'Confidence Assessor'],
      output: 'Structured intent label, extracted entity dictionary, confidence score (0.0 - 1.0), recommended specialist agent.',
      accent: 'border-amber-200 bg-amber-50/50',
    },
    'Transaction Agent': {
      name: 'Transaction Agent',
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
      purpose:
        'Investigates pending, failed, and stuck payments by querying simulated core banking switches and explaining NPCI reconciliation SLAs in plain language.',
      inputs: ['Transaction ID', 'Payment Amount', 'Merchant Name', 'User Query Context'],
      tools: ['getTransactionStatus(id)', 'getUserTransactions(userId)', 'verifyBankReconciliation(id)'],
      output: 'Live ledger verification card with bank switch status, reconciliation timer, and automated dispute actions.',
      accent: 'border-blue-200 bg-blue-50/50',
    },
    'Refund Agent': {
      name: 'Refund Agent',
      icon: <RotateCcw className="w-5 h-5 text-purple-600" />,
      purpose:
        'Tracks the complete refund lifecycle from merchant cancellation through payment gateway settlement and provides bank RRN reference numbers.',
      inputs: ['Order reference or Transaction ID', 'Refund Amount', 'Merchant entity'],
      tools: ['getRefundStatus(id)', 'getTransactionStatus(id)', 'getBankRRN(id)'],
      output: 'Verified refund tracking card with ARN/RRN codes, target bank account, and expected credit settlement dates.',
      accent: 'border-purple-200 bg-purple-50/50',
    },
    'Security/Fraud Agent': {
      name: 'Security/Fraud Agent',
      icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
      purpose:
        'Evaluates fraud alerts and suspicious transactions, executes real-time risk scoring, and immediately triages critical alerts to human fraud specialists.',
      inputs: ['Suspicious Transaction ID or Amount', 'User dispute narrative', 'Device velocity markers'],
      tools: ['checkFraudRisk(params)', 'createSupportTicket(ticketData)', 'escalateToHumanFraudOps(ticketId)'],
      output: 'High-priority human escalation ticket, session freeze recommendations, and proactive account security actions.',
      accent: 'border-rose-200 bg-rose-50/50',
    },
    'General Support Agent': {
      name: 'General Support Agent',
      icon: <HelpCircle className="w-5 h-5 text-emerald-600" />,
      purpose:
        'Provides instant guidance on Video KYC verification, wallet-to-bank transfer limits, UPI Lite rules, and customer account configurations.',
      inputs: ['Account inquiry query', 'KYC status query', 'Limit tier requirements'],
      tools: ['getKYCGuidelines(tier)', 'getWalletLimitPolicy()', 'createSupportTicket()'],
      output: 'Step-by-step resolution cards with KYC requirements, documentation checklists, and limit escalation workflows.',
      accent: 'border-emerald-200 bg-emerald-50/50',
    },
  };

  const currentAgent = agentSpecs[selectedAgent] || agentSpecs['Transaction Agent'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Title & Introduction */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2 text-[#0F4A8A] font-semibold text-xs uppercase tracking-wider mb-1">
          <Workflow className="w-4 h-4 text-[#00BAF2]" />
          <span>System Architecture & Autonomous Mesh</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          How ResolveAI Multi-Agent System Works
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          ResolveAI replaces monolithic chatbots with a modular multi-agent pipeline. Each agent has strict domain boundaries, verified tool execution, and zero-hallucination safeguards.
        </p>
      </div>

      {/* 14. VISUAL PIPELINE FLOW DIAGRAM (USER -> INTENT -> ORCHESTRATOR -> SPECIALIZED -> TOOLS -> RESOLUTION -> USER) */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0F4A8A]" />
              End-to-End Orchestration Architecture
            </h3>
            <p className="text-xs text-slate-500">
              Interactive trace showing deterministic routing from customer query to verified resolution
            </p>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0F4A8A] border border-blue-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#00BAF2] animate-ping" />
            <span>Deterministic Graph</span>
          </div>
        </div>

        {/* The Full Visual Flow */}
        <div className="flex flex-col items-center space-y-3.5 max-w-3xl mx-auto">
          {/* 1. USER */}
          <div className="w-full max-w-md p-3.5 rounded-2xl bg-slate-900 text-white text-center shadow-md flex items-center justify-center space-x-2 border-2 border-slate-700">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-400">1. Customer:</span>
            <span className="text-xs text-emerald-300 font-mono">"{activeSim.query}"</span>
          </div>

          <ArrowDown className="w-4 h-4 text-blue-500" />

          {/* 2. INTENT AGENT */}
          <div className="w-full max-w-lg p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-slate-900 text-center shadow-xs">
            <div className="flex items-center justify-center space-x-2 text-amber-900 font-bold text-xs mb-1">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>2. INTENT AGENT (Classification & Entity Extraction)</span>
            </div>
            <p className="text-[11.5px] text-amber-800 font-mono">
              Intent: {activeSim.detectedIntent} • Confidence: {Math.round(activeSim.confidence * 100)}%
            </p>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-400" />

          {/* 3. AI ORCHESTRATOR */}
          <div className="w-full max-w-xl p-4 rounded-2xl bg-gradient-to-r from-[#0F4A8A] to-[#00BAF2] text-white text-center shadow-md">
            <div className="flex items-center justify-center space-x-2 mb-0.5">
              <Cpu className="w-4 h-4" />
              <h4 className="font-bold text-sm">3. AI ORCHESTRATOR (Context Router & Guardrails)</h4>
            </div>
            <p className="text-[11px] text-blue-100">
              Validates confidence floor (&gt;65%), routes context slots, and enforces fallback policies
            </p>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-400" />

          {/* 4. SPECIALIZED AGENTS GRID */}
          <div className="w-full">
            <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-2">
              4. SPECIALIZED AGENTS
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {/* Transaction Agent */}
              <div
                onClick={() => setSelectedAgent('Transaction Agent')}
                className={`p-3 rounded-2xl text-center cursor-pointer transition-all ${
                  activeSim.selectedAgent === 'Transaction Agent'
                    ? 'bg-blue-50 border-2 border-[#0F4A8A] ring-3 ring-blue-400/20 shadow-xs'
                    : 'bg-slate-50 border border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#0F4A8A] mx-auto mb-1" />
                <h5 className="text-xs font-bold text-slate-900">Transaction Agent</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">UPI switch & status</p>
                {activeSim.selectedAgent === 'Transaction Agent' && (
                  <span className="inline-block mt-1 px-1.5 py-0.2 rounded-full bg-blue-100 text-[#0F4A8A] font-bold text-[9px]">
                    ● ACTIVE
                  </span>
                )}
              </div>

              {/* Refund Agent */}
              <div
                onClick={() => setSelectedAgent('Refund Agent')}
                className={`p-3 rounded-2xl text-center cursor-pointer transition-all ${
                  activeSim.selectedAgent === 'Refund Agent'
                    ? 'bg-purple-50 border-2 border-purple-600 ring-3 ring-purple-400/20 shadow-xs'
                    : 'bg-slate-50 border border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <RotateCcw className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <h5 className="text-xs font-bold text-slate-900">Refund Agent</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">RRN & settlements</p>
                {activeSim.selectedAgent === 'Refund Agent' && (
                  <span className="inline-block mt-1 px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-bold text-[9px]">
                    ● ACTIVE
                  </span>
                )}
              </div>

              {/* Security Agent */}
              <div
                onClick={() => setSelectedAgent('Security/Fraud Agent')}
                className={`p-3 rounded-2xl text-center cursor-pointer transition-all ${
                  activeSim.selectedAgent === 'Security/Fraud Agent'
                    ? 'bg-rose-50 border-2 border-rose-600 ring-3 ring-rose-400/20 shadow-xs'
                    : 'bg-slate-50 border border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-600 mx-auto mb-1" />
                <h5 className="text-xs font-bold text-slate-900">Security Agent</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">Risk & escalation</p>
                {activeSim.selectedAgent === 'Security/Fraud Agent' && (
                  <span className="inline-block mt-1 px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 font-bold text-[9px]">
                    ● ACTIVE
                  </span>
                )}
              </div>

              {/* General Support */}
              <div
                onClick={() => setSelectedAgent('General Support Agent')}
                className={`p-3 rounded-2xl text-center cursor-pointer transition-all ${
                  activeSim.selectedAgent === 'General Support Agent'
                    ? 'bg-emerald-50 border-2 border-emerald-600 ring-3 ring-emerald-400/20 shadow-xs'
                    : 'bg-slate-50 border border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <h5 className="text-xs font-bold text-slate-900">General Support</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">KYC & policies</p>
                {activeSim.selectedAgent === 'General Support Agent' && (
                  <span className="inline-block mt-1 px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                    ● ACTIVE
                  </span>
                )}
              </div>
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-400" />

          {/* 5. TOOLS / DATA */}
          <div className="w-full max-w-xl p-3.5 rounded-2xl bg-slate-900 text-white shadow-xs border border-slate-800 text-left text-xs font-mono">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 border-b border-slate-800 pb-1">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Wrench className="w-3.5 h-3.5" />
                5. TOOLS / DATA (Simulated Core Banking Ledger)
              </span>
              <span className="text-emerald-400">Status 200 OK</span>
            </div>
            <p className="text-[#00BAF2] font-bold mb-1">➔ {activeSim.toolCall}</p>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-slate-300 text-[10.5px] truncate">
              {activeSim.toolResponse}
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-emerald-500" />

          {/* 6. RESOLUTION */}
          <div className="w-full max-w-md p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-center shadow-xs">
            <div className="flex items-center justify-center space-x-1.5 font-extrabold text-xs mb-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>6. RESOLUTION CARD</span>
            </div>
            <p className="text-xs font-semibold text-emerald-900">
              "{activeSim.resolutionTitle}"
            </p>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-400" />

          {/* 7. USER */}
          <div className="w-full max-w-md p-2.5 rounded-xl bg-slate-100 text-slate-800 text-center border border-slate-200 text-xs font-semibold">
            7. Delivered to Customer with One-Click Actions
          </div>
        </div>
      </div>

      {/* 14. INTERACTIVE AGENT INSPECTION (Purpose, Inputs, Tools, Output) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="text-base font-bold text-slate-900">
            Interactive Agent Inspector
          </h3>
          <p className="text-xs text-slate-500">
            Click any agent to inspect its Purpose, Inputs, Tools, and Output specifications:
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Agent Selection List */}
          <div className="lg:col-span-4 space-y-2">
            {Object.values(agentSpecs).map((ag) => (
              <button
                key={ag.name}
                onClick={() => setSelectedAgent(ag.name)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  selectedAgent === ag.name
                    ? 'border-[#0F4A8A] bg-blue-50/70 shadow-xs'
                    : 'border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    {ag.icon}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{ag.name}</h5>
                    <span className="text-[11px] text-slate-500 line-clamp-1">{ag.purpose}</span>
                  </div>
                </div>
                <ArrowRight
                  className={`w-4 h-4 text-slate-400 ${selectedAgent === ag.name ? 'text-[#0F4A8A]' : ''}`}
                />
              </button>
            ))}
          </div>

          {/* Interactive Inspection Card: Purpose, Inputs, Tools, Output */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  {currentAgent.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{currentAgent.name}</h4>
                  <span className="text-[11px] text-slate-500 font-mono">Autonomous Specialized Agent</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold">
                GROUND-TRUTH ENFORCED
              </span>
            </div>

            {/* Purpose */}
            <div>
              <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[10.5px] block mb-1">
                Purpose
              </span>
              <p className="text-slate-700 leading-relaxed text-xs bg-white p-3 rounded-xl border border-slate-200">
                {currentAgent.purpose}
              </p>
            </div>

            {/* Inputs */}
            <div>
              <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[10.5px] block mb-1">
                Inputs
              </span>
              <div className="flex flex-wrap gap-2">
                {currentAgent.inputs.map((inp, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-mono text-[11px]"
                  >
                    • {inp}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[10.5px] block mb-1">
                Tools & Capabilities
              </span>
              <div className="flex flex-wrap gap-2">
                {currentAgent.tools.map((tl, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#0F4A8A] font-mono text-[11px] font-semibold flex items-center gap-1"
                  >
                    <Wrench className="w-3 h-3 text-[#00BAF2]" />
                    {tl}
                  </span>
                ))}
              </div>
            </div>

            {/* Output */}
            <div>
              <span className="font-extrabold text-slate-700 uppercase tracking-wider text-[10.5px] block mb-1">
                Output
              </span>
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 font-medium">
                {currentAgent.output}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
