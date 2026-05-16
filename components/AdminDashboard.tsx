'use client';

<<<<<<< HEAD
import { useMemo } from 'react';
import {
=======
import { useMemo, useState } from 'react';
import {
  TrendingUp,
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Shield,
<<<<<<< HEAD
  Bell,
  ArrowRight,
} from 'lucide-react';
import { CartesianGrid, Tooltip, ResponsiveContainer, XAxis, YAxis, AreaChart, Area } from 'recharts';
=======
  Search,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620
import { KPICard } from './KPICard';
import { StatusBadge } from './StatusBadge';
import { DealerTrustScore } from './DealerTrustScore';
import { useAppStore } from '@/lib/store';
<<<<<<< HEAD

export function AdminDashboard() {
  const { state } = useAppStore();
=======
import { mockBeneficiaries } from '@/lib/mockData';

export function AdminDashboard() {
  const { state, dispatch, showToast } = useAppStore();
  const [activeSection, setActiveSection] = useState<'overview' | 'complaints'>('overview');
  const [adminRemarks, setAdminRemarks] = useState<Record<string, string>>({});
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620

  // KPIs
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTransactions = state.transactions.filter(t => t.timestamp >= todayStart.getTime());
  const totalToday = todayTransactions.length;
  const verifiedCount = state.transactions.filter(t => state.verificationStatuses[t.id] === 'verified').length;
  const reportedCount = state.transactions.filter(t => state.verificationStatuses[t.id] === 'reported').length;
<<<<<<< HEAD
=======
  const activeAlerts = state.fraudAlerts.length;

  // Dealer distribution chart data
  const dealerChartData = useMemo(() => {
    const dealerCounts: Record<string, number> = {};
    state.transactions.forEach(t => {
      const name = t.dealerName || t.dealerId;
      dealerCounts[name] = (dealerCounts[name] || 0) + 1;
    });
    return Object.entries(dealerCounts).map(([name, count]) => ({
      name: name.length > 15 ? name.slice(0, 14) + '…' : name,
      transactions: count,
    }));
  }, [state.transactions]);
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620

  // Daily trend
  const dailyTrendData = useMemo(() => {
    const trendMap: Record<string, { date: string; transactions: number }> = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      trendMap[dateStr] = { date: dateStr, transactions: 0 };
    }
    state.transactions.forEach(t => {
      const dateStr = new Date(t.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (trendMap[dateStr]) trendMap[dateStr].transactions++;
    });
    return Object.values(trendMap);
  }, [state.transactions]);

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 p-4 md:p-10 space-y-10 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em]">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live Intelligence
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Central <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-lg">Monitoring Public Distribution System integrity across Madhya Pradesh districts.</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Daily Transactions"
          value={totalToday}
          icon={<BarChart3 />}
          subtitle="Real-time volume"
          trend={{ value: 12.4, isPositive: true }}
          color="blue"
        />
        <KPICard
          title="Verified Deliveries"
          value={verifiedCount}
          icon={<CheckCircle />}
          subtitle="Citizen confirmed"
          trend={{ value: 3.2, isPositive: true }}
          color="emerald"
        />
        <KPICard
          title="Fraud Incidents"
          value={reportedCount}
          icon={<AlertTriangle />}
          subtitle="Pending investigation"
          trend={{ value: reportedCount > 0 ? 8.1 : 0, isPositive: false }}
          color="red"
        />
        <KPICard
          title="System Security"
          value={`${98}%`}
          icon={<Shield />}
          subtitle="Infrastructure health"
          trend={{ value: 0.5, isPositive: true }}
=======
  // Grain distribution
  const grainDistribution = useMemo(() => {
    const grainCounts: Record<string, number> = {};
    state.transactions.forEach(t => {
      const grains = t.grainType.split(', ');
      grains.forEach(g => {
        grainCounts[g] = (grainCounts[g] || 0) + 1;
      });
    });
    return Object.entries(grainCounts).map(([grain, count]) => ({ name: grain, value: count }));
  }, [state.transactions]);

  const GRAIN_COLORS = ['#E8620A', '#128807', '#F59E0B', '#3b82f6'];

  const handleComplaintStatusChange = (id: string, status: 'open' | 'investigating' | 'resolved') => {
    dispatch({ type: 'UPDATE_COMPLAINT_STATUS', payload: { complaintId: id, status, remarks: adminRemarks[id] } });
    showToast(`Complaint marked as ${status}`, 'success');
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Real-time PDS fraud detection and monitoring</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSection === 'overview'
                ? 'text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={activeSection === 'overview' ? { backgroundColor: '#E8620A' } : undefined}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSection('complaints')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
              activeSection === 'complaints'
                ? 'text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={activeSection === 'complaints' ? { backgroundColor: '#E8620A' } : undefined}
          >
            Complaints
            {state.complaints.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {state.complaints.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Transactions Today"
          value={totalToday}
          icon={<BarChart3 size={22} />}
          subtitle="Live counter"
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <KPICard
          title="Verified"
          value={verifiedCount}
          icon={<CheckCircle size={22} />}
          subtitle="Confirmed receipts"
          trend={{ value: 3, isPositive: true }}
          color="emerald"
        />
        <KPICard
          title="Fraud Reported"
          value={reportedCount}
          icon={<AlertTriangle size={22} />}
          subtitle="Denial reports"
          trend={{ value: reportedCount > 0 ? 8 : 0, isPositive: false }}
          color="red"
        />
        <KPICard
          title="Active Alerts"
          value={activeAlerts}
          icon={<Shield size={22} />}
          subtitle="Anomaly alerts"
          trend={{ value: 5, isPositive: false }}
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620
          color="amber"
        />
      </div>

<<<<<<< HEAD
      {/* Insight Banner */}
      <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border-l-4 border-l-primary group">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
            Anomalous activity detected in <span className="text-primary font-bold">Ujjain North</span>
          </p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Shop ID: MP-IND-4422 · Spike in biometry failures reported by 12 citizens.</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 text-xs font-bold text-primary hover:underline">
          View Detail <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-card p-8 rounded-[2rem]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Distribution Trends</h3>
                <p className="text-sm text-slate-500 font-medium">Weekly volume across districts</p>
              </div>
              <div className="flex gap-2">
                 <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-600">
                   <div className="w-2 h-2 rounded-full bg-primary" /> Target
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-600">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" /> Actual
                 </div>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTrendData}>
                  <defs>
                    <linearGradient id="colorTrans" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="transactions" stroke="var(--color-primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorTrans)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live Feed Table */}
          <div className="glass-card rounded-[2rem] overflow-hidden">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Real-time Verification</h3>
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full">Updates Every 5s</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-left">
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Citizen</th>
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Distribution Center</th>
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {state.transactions.slice(0, 8).map((txn) => {
                    const currentStatus = state.verificationStatuses[txn.id] || txn.status;
                    return (
                      <tr key={txn.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-primary group-hover:scale-110 transition-transform">
                              {txn.beneficiaryName ? txn.beneficiaryName[0] : '?'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{txn.beneficiaryName}</p>
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{txn.grainType}</p>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{txn.dealerName}</p>
                        </td>
                        <td className="px-8 py-5 text-center">
=======
      {/* Insight Line */}
      <div className="bg-white rounded-xl px-5 py-3 shadow-sm border border-gray-100">
        <p className="text-gray-500 text-sm italic">
          💡 Most alerts today: <span className="font-medium text-gray-700">Ujjain district</span> · Grain Hub Shop · between 2–4 PM
        </p>
      </div>

      {activeSection === 'overview' ? (
        <>
          {/* Transaction Feed */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Live Transaction Feed
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Beneficiary</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Grain</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Shop</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Time</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {state.transactions.slice(0, 15).map((txn) => {
                    const currentStatus = state.verificationStatuses[txn.id] || txn.status;
                    const isReported = currentStatus === 'reported';
                    return (
                      <tr key={txn.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isReported ? 'bg-[#FEF2F2]' : ''}`}>
                        <td className="px-4 py-3 font-medium text-gray-900">{txn.beneficiaryName}</td>
                        <td className="px-4 py-3 text-gray-700">{txn.grainType}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{txn.dealerName}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-3 text-center">
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620
                          <StatusBadge status={currentStatus} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
<<<<<<< HEAD
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-4 space-y-8">
          {/* Dealer Trust Score Card */}
          <div className="glass-card p-8 rounded-[2rem]">
             <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Dealer Rankings</h3>
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <DealerTrustScore dealers={state.dealers} />
          </div>

          {/* Fraud Alerts Sidebar */}
          <div className="glass-card p-8 rounded-[2rem]">
             <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Critical Alerts</h3>
              <Bell className="w-5 h-5 text-red-500" />
            </div>
            <div className="space-y-4">
              {state.fraudAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className={`p-5 rounded-2xl border-l-4 border-b border-r border-t transition-all hover:scale-[1.02] ${
                  alert.severity === 'critical' ? 'bg-red-50/50 border-red-100 border-l-red-500' : 'bg-amber-50/50 border-amber-100 border-l-amber-500'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                     <span className={`text-[10px] font-black uppercase tracking-widest ${
                       alert.severity === 'critical' ? 'text-red-600' : 'text-amber-600'
                     }`}>{alert.severity}</span>
                     <p className="text-[10px] font-bold text-slate-400">{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">{alert.description}</p>
                  <button className="mt-3 text-xs font-black text-primary uppercase tracking-wider hover:underline">Investigate Case</button>
=======

          {/* Fraud Alerts */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Fraud Alerts ({state.fraudAlerts.length})
            </h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {state.fraudAlerts.slice(0, 8).map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-xl p-5 border ${
                    alert.severity === 'critical'
                      ? 'bg-red-50 border-red-200 animate-pulse-glow'
                      : alert.severity === 'high'
                      ? 'bg-red-50 border-red-200'
                      : alert.severity === 'medium'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white ${
                          alert.severity === 'critical' ? 'bg-red-600' :
                          alert.severity === 'high' ? 'bg-red-500' :
                          alert.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        {alert.fraudScore !== undefined && (
                          <span className="text-sm font-bold text-red-600">{alert.fraudScore}% fraud risk</span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900">{alert.description}</h3>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-0.5 mb-3">
                    {alert.dealerName && <p>Dealer: <span className="font-medium text-gray-800">{alert.dealerName}</span></p>}
                    {alert.beneficiaryName && <p>Beneficiary: <span className="font-medium text-gray-800">{alert.beneficiaryName}</span></p>}
                    <p>Time: {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {alert.district} District</p>
                  </div>

                  {alert.reasons && alert.reasons.length > 0 && (
                    <div className="bg-white/50 rounded-lg p-3 mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Why flagged:</p>
                      <ul className="space-y-1">
                        {alert.reasons.map((reason, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors hover:opacity-90" style={{ backgroundColor: '#E8620A' }}>
                      Investigate
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
                      Dismiss
                    </button>
                  </div>
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620
                </div>
              ))}
            </div>
          </div>
<<<<<<< HEAD
        </div>
      </div>
=======

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribution by Dealer</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dealerChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-30} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Bar dataKey="transactions" fill="#E8620A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="transactions" stroke="#128807" strokeWidth={2.5} dot={{ fill: '#128807', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Grain Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={grainDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {grainDistribution.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={GRAIN_COLORS[index % GRAIN_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dealer Trust Scores</h2>
              <DealerTrustScore dealers={state.dealers} />
            </div>
          </div>
        </>
      ) : (
        /* Complaints Tab */
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Complaint Inbox ({state.complaints.length})
          </h2>
          {state.complaints.length === 0 ? (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No complaints received yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.complaints.map((complaint) => (
                <div key={complaint.id} className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors animate-fade-in-up">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-gray-900">Complaint {complaint.id}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Filed by: <span className="font-medium">{complaint.beneficiaryName}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Against: <span className="font-medium">{complaint.dealerName}</span>
                      </p>
                    </div>
                    <StatusBadge status={complaint.status === 'open' ? 'reported' : complaint.status === 'investigating' ? 'pending' : 'verified'} />
                  </div>

                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg italic mb-3">
                    "{complaint.description}"
                  </p>

                  <p className="text-xs text-gray-400 mb-3">
                    Filed: {complaint.date.toLocaleString()}
                  </p>

                  <div className="flex flex-col gap-3 mt-3">
                    <input
                      type="text"
                      placeholder="Add admin remarks..."
                      value={adminRemarks[complaint.id] || ''}
                      onChange={(e) => setAdminRemarks(prev => ({ ...prev, [complaint.id]: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleComplaintStatusChange(complaint.id, 'investigating')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          complaint.status === 'investigating' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Mark Investigating
                      </button>
                      <button
                        onClick={() => handleComplaintStatusChange(complaint.id, 'resolved')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          complaint.status === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620
    </div>
  );
}
