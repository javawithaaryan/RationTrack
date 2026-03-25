'use client';

import { useState, useMemo } from 'react';
import { AlertTriangle, Filter } from 'lucide-react';
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
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Fraud Detection & Alerts</h1>
        <p className="text-gray-500 mt-1 text-sm">Real-time anomaly detection and risk assessment</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-red-600 text-xs font-bold uppercase">Critical</p>
          <p className="text-3xl font-bold text-red-700 mt-1">{severityCounts.critical}</p>
          <p className="text-[10px] text-red-500 mt-1">Immediate action</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
          <p className="text-orange-600 text-xs font-bold uppercase">High</p>
          <p className="text-3xl font-bold text-orange-700 mt-1">{severityCounts.high}</p>
          <p className="text-[10px] text-orange-500 mt-1">Requires review</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-amber-600 text-xs font-bold uppercase">Medium</p>
          <p className="text-3xl font-bold text-amber-700 mt-1">{severityCounts.medium}</p>
          <p className="text-[10px] text-amber-500 mt-1">Monitor closely</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <p className="text-blue-600 text-xs font-bold uppercase">Total Alerts</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{fraudAlerts.length}</p>
          <p className="text-[10px] text-blue-500 mt-1">Past 24 hours</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} style={{ color: '#E8620A' }} />
          <h2 className="text-base font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'critical', 'high', 'medium', 'low'] as SeverityFilter[]).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    severityFilter === sev
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={severityFilter === sev ? { backgroundColor: '#E8620A' } : undefined}
                >
                  {sev === 'all' ? 'All' : sev.charAt(0).toUpperCase() + sev.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alert Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            >
              <option value="all">All Types</option>
              {typeOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-md text-center">
          <AlertTriangle size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">No alerts match the selected filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="cursor-pointer" onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}>
              <AlertCard alert={alert} />
              {expandedAlert === alert.id && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fade-in-up">
                  <h4 className="font-semibold text-gray-900 mb-3">Recommended Actions:</h4>
                  <ul className="space-y-2">
                    {getRecommendedActions(alert).map((action, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-bold flex-shrink-0 mt-0.5" style={{ backgroundColor: '#E8620A' }}>
                          {idx + 1}
                        </span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Top Risk Dealers */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Risk Dealers</h2>
        <div className="space-y-3">
          {Object.values(state.dealers)
            .sort((a, b) => b.alerts - a.alerts)
            .slice(0, 5)
            .map(dealer => (
              <div key={dealer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900">{dealer.name}</p>
                  <p className="text-xs text-gray-500">{dealer.owner} · {dealer.district}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{dealer.alerts}</p>
                    <p className="text-[10px] text-gray-500">alerts</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      dealer.trustScore >= 85 ? 'text-emerald-600' :
                      dealer.trustScore >= 60 ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {dealer.trustScore}%
                    </p>
                    <p className="text-[10px] text-gray-500">trust</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
