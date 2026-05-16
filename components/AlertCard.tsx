'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Copy,
  TrendingDown,
  Zap,
  Clock,
  ChevronDown,
  ShieldAlert,
  ArrowRight,
  Trash2,
  Search,
} from 'lucide-react';
import { FraudAlert } from '@/lib/mockData';

interface AlertCardProps {
  alert: FraudAlert;
  compact?: boolean;
}

export function AlertCard({ alert, compact = false }: AlertCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const severityConfig = {
    low: { bg: 'bg-blue-50/50', border: 'border-blue-100', icon: 'text-blue-600', badge: 'bg-blue-600 text-white', accent: 'blue' },
    medium: { bg: 'bg-amber-50/50', border: 'border-amber-100', icon: 'text-amber-600', badge: 'bg-amber-600 text-white', accent: 'amber' },
    high: { bg: 'bg-orange-50/50', border: 'border-orange-100', icon: 'text-orange-600', badge: 'bg-orange-600 text-white', accent: 'orange' },
    critical: { bg: 'bg-red-50/50', border: 'border-red-100', icon: 'text-red-600', badge: 'bg-red-600 text-white', accent: 'red' },
  };

  const config = severityConfig[alert.severity] || severityConfig.medium;

  const typeIcon = {
    duplicate: <Copy className={config.icon} size={18} />,
    quota_exceeded: <TrendingDown className={config.icon} size={18} />,
    off_hours: <Clock className={config.icon} size={18} />,
    bulk_transaction: <Zap className={config.icon} size={18} />,
    anomaly: <AlertTriangle className={config.icon} size={18} />,
    speed_fraud: <Zap className={config.icon} size={18} />,
  };

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (compact) {
    return (
      <div className={`glass-card p-4 rounded-2xl border-l-4 ${
        alert.severity === 'critical' ? 'border-l-red-500 bg-red-50/10' : 
        alert.severity === 'high' ? 'border-l-orange-500 bg-orange-50/10' : 
        'border-l-blue-500 bg-blue-50/10'
      } ${alert.severity === 'critical' || alert.severity === 'high' ? 'animate-pulse-glow' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
            {typeIcon[alert.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{alert.description}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{timeAgo(alert.timestamp)} · {alert.fraudScore}% risk</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-[2.5rem] p-8 border-l-8 ${
      alert.severity === 'critical' ? 'border-l-red-600 bg-red-50/5' : 
      alert.severity === 'high' ? 'border-l-orange-600 bg-orange-50/5' : 
      'border-l-blue-600 bg-blue-50/5'
    } transition-all hover:scale-[1.01] group ${alert.severity === 'critical' || alert.severity === 'high' ? 'animate-pulse-glow' : ''}`}>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-5">
           <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center group-hover:rotate-6 transition-transform`}>
              {typeIcon[alert.type]}
           </div>
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{alert.description}</h3>
                 <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-[0.15em] ${config.badge}`}>
                    {alert.severity}
                 </span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{alert.type.replace(/_/g, ' ')} · System ID: {alert.id}</p>
           </div>
        </div>
        <div className="text-right">
           <div className="text-2xl font-black text-red-600 tracking-tighter">{alert.fraudScore}%</div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidence Score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
         {[
           { label: 'Responsible Entity', value: alert.dealerName, icon: <ShieldAlert className="w-3.5 h-3.5" /> },
           { label: 'Citizen Link', value: alert.beneficiaryName || 'Not Specific', icon: <Search className="w-3.5 h-3.5" /> },
           { label: 'Incident Time', value: timeAgo(alert.timestamp), icon: <Clock className="w-3.5 h-3.5" /> },
         ].map((info, i) => (
           <div key={i}>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                 {info.icon} {info.label}
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{info.value}</p>
           </div>
         ))}
      </div>

      {alert.reasons && alert.reasons.length > 0 && (
        <div className="mt-8">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
          >
            <span>Intelligence Rationale</span>
            <ChevronDown size={14} className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-60 mt-4' : 'max-h-0'}`}>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 space-y-3">
              {alert.reasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-4">
        <button className="flex-1 min-w-[140px] py-4 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
          Launch Investigation <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
