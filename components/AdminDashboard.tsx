'use client';

import { useMemo } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Shield,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { CartesianGrid, Tooltip, ResponsiveContainer, XAxis, YAxis, AreaChart, Area } from 'recharts';
import { KPICard } from './KPICard';
import { StatusBadge } from './StatusBadge';
import { DealerTrustScore } from './DealerTrustScore';
import { useAppStore } from '@/lib/store';

export function AdminDashboard() {
  const { state } = useAppStore();

  // KPIs
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTransactions = state.transactions.filter(t => t.timestamp >= todayStart.getTime());
  const totalToday = todayTransactions.length;
  const verifiedCount = state.transactions.filter(t => state.verificationStatuses[t.id] === 'verified').length;
  const reportedCount = state.transactions.filter(t => state.verificationStatuses[t.id] === 'reported').length;

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
          color="amber"
        />
      </div>

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
                          <StatusBadge status={currentStatus} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
