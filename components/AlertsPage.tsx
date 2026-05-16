'use client';

import { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  Filter, 
  ShieldAlert, 
  TrendingUp, 
  ShieldCheck, 
  Activity,
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles
} from 'lucide-react';
import { AlertCard } from './AlertCard';
import { useAppStore } from '@/lib/store';
import { getRecommendedActions } from '@/lib/fraudDetection';

type SeverityFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';
type TypeFilter = 'all' | 'duplicate' | 'quota_exceeded' | 'off_hours' | 'bulk_transaction' | 'anomaly' | 'speed_fraud';

export function AlertsPage() {
  const { state } = useAppStore();
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  const fraudAlerts = state.fraudAlerts;

  const filteredAlerts = useMemo(() => {
    return fraudAlerts.filter((alert) => {
      const severityMatch = severityFilter === 'all' || alert.severity === severityFilter;
      const typeMatch = typeFilter === 'all' || alert.type === typeFilter;
      return severityMatch && typeMatch;
    });
  }, [fraudAlerts, severityFilter, typeFilter]);

  const severityCounts = useMemo(() => ({
    critical: fraudAlerts.filter(a => a.severity === 'critical').length,
    high: fraudAlerts.filter(a => a.severity === 'high').length,
    medium: fraudAlerts.filter(a => a.severity === 'medium').length,
    low: fraudAlerts.filter(a => a.severity === 'low').length,
  }), [fraudAlerts]);

  const typeOptions = [
    { id: 'duplicate', label: 'Duplicate Distribution' },
    { id: 'quota_exceeded', label: 'Quota Exceeded' },
    { id: 'off_hours', label: 'Off-Hours' },
    { id: 'bulk_transaction', label: 'Bulk Transaction' },
    { id: 'speed_fraud', label: 'Speed Fraud' },
    { id: 'anomaly', label: 'Anomaly' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 p-6 md:p-10 space-y-10 animate-fade-in">
      {/* Hero Header */}
      <div className="relative glass-panel rounded-[3rem] p-10 overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">AI Surveillance Active</span>
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Security <span className="text-gradient">Intelligence</span></h1>
               <p className="text-slate-500 font-bold text-sm max-w-xl leading-relaxed uppercase tracking-widest opacity-80">
                  Real-time anomaly detection, risk assessment, and fraud prevention for the Madhya Pradesh PDS ecosystem.
               </p>
            </div>
            <div className="flex flex-wrap gap-4">
               {[
                 { label: 'Critical', value: severityCounts.critical, color: 'bg-red-500', icon: <ShieldAlert className="w-4 h-4" /> },
                 { label: 'High Risk', value: severityCounts.high, color: 'bg-orange-500', icon: <TrendingUp className="w-4 h-4" /> },
                 { label: 'Total Scanned', value: fraudAlerts.length, color: 'bg-blue-500', icon: <Activity className="w-4 h-4" /> },
               ].map((stat, i) => (
                 <div key={i} className="glass-card px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/10">
                    <div className={`w-10 h-10 ${stat.color} text-white rounded-xl flex items-center justify-center shadow-lg shadow-black/5`}>
                       {stat.icon}
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                       <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Filters & Control Center */}
      <div className="glass-card p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-8">
         <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500">
               <Filter className="w-4 h-4" />
               <span className="text-xs font-black uppercase tracking-widest">Filter By</span>
            </div>
            <div className="flex flex-wrap gap-2">
               {(['all', 'critical', 'high', 'medium', 'low'] as SeverityFilter[]).map((sev) => (
                 <button
                   key={sev}
                   onClick={() => setSeverityFilter(sev)}
                   className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     severityFilter === sev
                       ? 'bg-primary text-white shadow-xl shadow-primary/20'
                       : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-primary/30'
                   }`}
                 >
                   {sev}
                 </button>
               ))}
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <select
                 value={typeFilter}
                 onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
                 className="pl-12 pr-10 py-3 bg-white dark:bg-slate-800 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:ring-4 focus:ring-primary/10 appearance-none cursor-pointer"
               >
                 <option value="all">All Incident Types</option>
                 {typeOptions.map(opt => (
                   <option key={opt.id} value={opt.id}>{opt.label}</option>
                 ))}
               </select>
               <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
               <button className="p-2 bg-white dark:bg-slate-700 text-primary rounded-lg shadow-sm">
                  <LayoutGrid className="w-4 h-4" />
               </button>
               <button className="p-2 text-slate-400">
                  <List className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>

      {/* Main Alerts Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         <div className="xl:col-span-8 space-y-8">
            {filteredAlerts.length === 0 ? (
               <div className="glass-card p-20 rounded-[3rem] text-center space-y-6">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                     <ShieldCheck className="w-10 h-10 text-slate-300" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">System Secured</h3>
                     <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No active threats detected matching your filters.</p>
                  </div>
               </div>
            ) : (
               <div className="grid grid-cols-1 gap-6">
                 {filteredAlerts.map((alert) => (
                   <div key={alert.id} className="cursor-pointer space-y-4" onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}>
                     <AlertCard alert={alert} />
                     {expandedAlert === alert.id && (
                       <div className="glass-panel p-8 rounded-[2rem] border border-primary/20 bg-primary/5 animate-fade-in-up">
                          <div className="flex items-center gap-3 mb-6">
                             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                             </div>
                             <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Recommended AI Countermeasures</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {getRecommendedActions(alert).map((action, idx) => (
                               <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                                 <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 text-primary text-[10px] font-black flex-shrink-0">
                                   {idx + 1}
                                 </span>
                                 <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">{action}</p>
                               </div>
                             ))}
                          </div>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
            )}
         </div>

         {/* Sidebar - Risk Analytics */}
         <div className="xl:col-span-4 space-y-10">
            <div className="glass-card p-8 rounded-[3rem] space-y-8">
               <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-widest">Risk Leaderboard</h3>
                  <div className="w-8 h-8 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                     <TrendingUp className="w-4 h-4 text-red-600" />
                  </div>
               </div>
               <div className="space-y-4">
                 {Object.values(state.dealers)
                   .sort((a, b) => b.alerts - a.alerts)
                   .slice(0, 5)
                   .map((dealer, i) => (
                     <div key={dealer.id} className="p-5 rounded-3xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:scale-[1.02] transition-transform">
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400">
                                 #{i+1}
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{dealer.name}</p>
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{dealer.district}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-lg font-black text-red-600 tracking-tighter">{dealer.alerts}</p>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Alerts</p>
                           </div>
                        </div>
                        <div className="space-y-1.5">
                           <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                              <span className="text-slate-400">Trust Integrity</span>
                              <span className={dealer.trustScore >= 85 ? 'text-emerald-600' : dealer.trustScore >= 60 ? 'text-amber-600' : 'text-red-600'}>
                                 {dealer.trustScore}%
                              </span>
                           </div>
                           <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${
                                 dealer.trustScore >= 85 ? 'bg-emerald-500' : dealer.trustScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                              }`} style={{ width: `${dealer.trustScore}%` }} />
                           </div>
                        </div>
                     </div>
                   ))}
               </div>
               <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                  Export Risk Report
               </button>
            </div>

            <div className="glass-card p-8 rounded-[3rem] bg-primary/5 border-primary/20 space-y-6">
               <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Investigator Notes
               </h3>
               <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-widest opacity-80">
                  Critical alerts (Risk &gt; 85%) trigger automatic distribution suspension. Manual review required for re-activation.
               </p>
               <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                     <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">System Pulse: Healthy</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
