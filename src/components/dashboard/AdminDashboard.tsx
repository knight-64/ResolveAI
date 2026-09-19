import React, { useState, useEffect } from 'react';
import { DashboardStats, SupportTicket } from '../../types';
import {
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Clock,
  Cpu,
  Users,
  Activity,
  Ticket,
  Search,
  Filter,
  RefreshCw,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ticketFilter, setTicketFilter] = useState<string>('ALL');

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data: DashboardStats = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleTicketStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await fetch('/api/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, status: newStatus }),
      });
      fetchDashboardStats();
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2 text-slate-500 text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-[#00BAF2]" />
          <span>Loading ResolveAI Multi-Agent Analytics...</span>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const COLORS = ['#0F4A8A', '#00BAF2', '#8B5CF6', '#F59E0B', '#10B981'];

  const filteredTickets = stats.recentTickets.filter((t) => {
    if (ticketFilter === 'ALL') return true;
    return t.status === ticketFilter;
  });

  // Performance breakdown per agent
  const agentPerformance = [
    {
      name: 'Transaction Agent',
      workload: stats.agentUsage.find((a) => a.name.includes('Transaction'))?.count || 48,
      resolutionRate: '94.2%',
      avgLatency: '820ms',
      status: 'OPTIMAL',
      accent: 'text-[#0F4A8A]',
      bg: 'bg-blue-50',
    },
    {
      name: 'Refund Agent',
      workload: stats.agentUsage.find((a) => a.name.includes('Refund'))?.count || 29,
      resolutionRate: '91.8%',
      avgLatency: '940ms',
      status: 'OPTIMAL',
      accent: 'text-purple-700',
      bg: 'bg-purple-50',
    },
    {
      name: 'Security/Fraud Agent',
      workload: stats.agentUsage.find((a) => a.name.includes('Security'))?.count || 14,
      resolutionRate: '78.5%',
      avgLatency: '1,120ms',
      status: 'HUMAN_TRIAGE',
      accent: 'text-rose-700',
      bg: 'bg-rose-50',
    },
    {
      name: 'General Support Agent',
      workload: stats.agentUsage.find((a) => a.name.includes('General'))?.count || 22,
      resolutionRate: '96.0%',
      avgLatency: '650ms',
      status: 'OPTIMAL',
      accent: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
  ];

  // Hourly resolution trend mock
  const hourlyTrends = [
    { hour: '09:00', resolved: 14, escalated: 1 },
    { hour: '11:00', resolved: 28, escalated: 2 },
    { hour: '13:00', resolved: 42, escalated: 4 },
    { hour: '15:00', resolved: 36, escalated: 3 },
    { hour: '17:00', resolved: 51, escalated: 5 },
    { hour: '19:00', resolved: 33, escalated: 2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            ResolveAI Multi-Agent Operations Command
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-[#0F4A8A] font-mono border border-blue-200">
              Live Telemetry
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time intent routing metrics, resolution SLA benchmarks, and human escalation triage.
          </p>
        </div>

        <button
          onClick={fetchDashboardStats}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 12. TOP CARDS (Total Requests, Resolved, Escalated, Average Resolution Time) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Requests</span>
            <div className="p-2 rounded-xl bg-blue-50 text-[#0F4A8A]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-black text-slate-900">{stats.totalQueries}</p>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +18% today
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total customer queries processed</p>
        </div>

        {/* Resolved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-black text-slate-900">{stats.resolvedQueries}</p>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {stats.resolutionRate}% Rate
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Resolved without human escalation</p>
        </div>

        {/* Escalated */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Escalated</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-black text-slate-900">{stats.escalatedQueries}</p>
            <span className="text-[11px] font-semibold text-rose-600">
              {Math.round((stats.escalatedQueries / stats.totalQueries) * 100)}% of total
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Escalated to human fraud & Tier 2 ops</p>
        </div>

        {/* Average Resolution Time */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Resolution Time</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <p className="text-2xl font-black text-slate-900">{stats.avgResponseTimeMs}ms</p>
            <span className="text-[11px] font-semibold text-emerald-600">
              ⚡ ~0.9s per query
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Orchestrator + Tool calling cycle</p>
        </div>
      </div>

      {/* 12. AGENT PERFORMANCE SECTION */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Agent Performance Breakdown</h3>
            <p className="text-xs text-slate-500">Individual specialized agent resolution metrics and latency</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0F4A8A] font-semibold text-xs border border-blue-100">
            4 Autonomous Sub-Agents
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {agentPerformance.map((ag) => (
            <div key={ag.name} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`font-bold text-xs ${ag.accent}`}>{ag.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                  {ag.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400 block text-[10px]">Requests</span>
                  <span className="font-bold text-slate-800">{ag.workload} handled</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Auto-Resolve</span>
                  <span className="font-bold text-emerald-700">{ag.resolutionRate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Avg Latency</span>
                  <span className="font-mono text-slate-700">{ag.avgLatency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Confidence</span>
                  <span className="font-bold text-blue-700">&gt; 92%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 12. CHARTS (Category distribution & Hourly resolution trends) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Issue Category Distribution</h3>
              <p className="text-xs text-slate-500">Query classification volume by Intent Agent</p>
            </div>
            <span className="p-1.5 bg-blue-50 text-[#0F4A8A] rounded-lg">
              <Activity className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 9, fill: '#64748b' }}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value: any) => [`${value} incidents`, 'Queries']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" fill="#00BAF2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Resolution Trends */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Hourly Resolution Trends</h3>
              <p className="text-xs text-slate-500">Resolved queries vs. human escalations</p>
            </div>
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Area type="monotone" dataKey="resolved" stackId="1" stroke="#0F4A8A" fill="#0F4A8A" fillOpacity={0.2} name="Auto-Resolved" />
                <Area type="monotone" dataKey="escalated" stackId="2" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.2} name="Escalated" />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 12. TICKET TRIAGE LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#0F4A8A]" />
              Support Ticket Triage Queue
            </h3>
            <p className="text-xs text-slate-500">
              Escalated tickets requiring human-in-the-loop validation or manual bank reconciliation.
            </p>
          </div>

          {/* Filter by status */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((f) => (
              <button
                key={f}
                onClick={() => setTicketFilter(f)}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  ticketFilter === f ? 'bg-white text-[#0F4A8A] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Issue Description</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Desk</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#0F4A8A]">
                    {ticket.id}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="font-semibold text-slate-900 line-clamp-1">{ticket.issue}</p>
                    {ticket.transactionId && (
                      <span className="text-[10.5px] text-slate-400 font-mono">Txn: {ticket.transactionId}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ticket.priority === 'URGENT' || ticket.priority === 'HIGH'
                          ? 'bg-rose-100 text-rose-800'
                          : ticket.priority === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {ticket.assignedTeam}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ticket.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ticket.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    {ticket.status !== 'IN_PROGRESS' && ticket.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleTicketStatusChange(ticket.id, 'IN_PROGRESS')}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0F4A8A] font-semibold text-[11px] cursor-pointer"
                      >
                        In Progress
                      </button>
                    )}
                    {ticket.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleTicketStatusChange(ticket.id, 'RESOLVED')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    )}
                    {ticket.status === 'RESOLVED' && (
                      <button
                        onClick={() => handleTicketStatusChange(ticket.id, 'OPEN')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] cursor-pointer"
                      >
                        Reopen
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
