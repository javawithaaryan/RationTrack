'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  Copy,
  TrendingDown,
  Zap,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { FraudAlert } from '@/lib/mockData';

interface AlertCardProps {
  alert: FraudAlert;
  compact?: boolean;
}

export function AlertCard({ alert, compact = false }: AlertCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const severityConfig = {
    low: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', badge: 'bg-blue-100 text-blue-800' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', badge: 'bg-amber-100 text-amber-800' },
    high: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600', badge: 'bg-orange-100 text-orange-800' },
    critical: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', badge: 'bg-red-100 text-red-800' },
  };

  const config = severityConfig[alert.severity] || severityConfig.medium;

  const typeIcon = {
    duplicate: <Copy className={config.icon} size={20} />,
    quota_exceeded: <TrendingDown className={config.icon} size={20} />,
    off_hours: <Clock className={config.icon} size={20} />,
    bulk_transaction: <Zap className={config.icon} size={20} />,
    anomaly: <AlertTriangle className={config.icon} size={20} />,
    speed_fraud: <Zap className={config.icon} size={20} />,
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
      <div className={`${config.bg} border ${config.border} rounded-lg p-3 ${alert.severity === 'critical' || alert.severity === 'high' ? 'animate-pulse-glow' : ''}`}>
        <div className="flex items-start gap-3">
          {typeIcon[alert.type]}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm line-clamp-2">{alert.description}</p>
            {alert.fraudScore !== undefined && (
              <p className="text-xs font-bold text-red-600 mt-0.5">{alert.fraudScore}% risk</p>
            )}
            <p className="text-xs text-gray-500 mt-1">{timeAgo(alert.timestamp)}</p>
          </div>
          <span className={`${config.badge} px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2`}>
            {alert.severity.toUpperCase()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${config.bg} border ${config.border} rounded-2xl p-6 ${alert.severity === 'critical' || alert.severity === 'high' ? 'animate-pulse-glow' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-lg">{typeIcon[alert.type]}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{alert.description}</h3>
            {alert.fraudScore !== undefined && (
              <p className="text-sm font-bold text-red-600 mt-1">{alert.fraudScore}% fraud risk</p>
            )}
            <p className="text-sm text-gray-600 mt-1">
              Type: <span className="font-medium">{alert.type.replace(/_/g, ' ')}</span>
            </p>
          </div>
        </div>
        <span className={`${config.badge} px-3 py-1 rounded-full text-sm font-medium`}>
          {alert.severity.toUpperCase()}
        </span>
      </div>

      <div className="bg-white bg-opacity-50 rounded-lg p-4 space-y-2 text-sm">
        {alert.dealerName && (
          <div className="flex justify-between">
            <span className="text-gray-600">Dealer:</span>
            <span className="font-medium text-gray-900">{alert.dealerName}</span>
          </div>
        )}
        {alert.beneficiaryName && (
          <div className="flex justify-between">
            <span className="text-gray-600">Beneficiary:</span>
            <span className="font-medium text-gray-900">{alert.beneficiaryName}</span>
          </div>
        )}
        {alert.district && (
          <div className="flex justify-between">
            <span className="text-gray-600">District:</span>
            <span className="font-medium text-gray-900">{alert.district}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-600">Timestamp:</span>
          <span className="font-medium text-gray-900">{timeAgo(alert.timestamp)}</span>
        </div>
      </div>

      {alert.reasons && alert.reasons.length > 0 && (
        <div className="mt-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase hover:text-gray-700 transition-colors"
          >
            <span>Why flagged:</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40 mt-3 border-t border-gray-200/50 pt-3' : 'max-h-0'}`}>
            <ul className="space-y-1">
              {alert.reasons.map((reason, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
        <button className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors text-white" style={{ backgroundColor: '#E8620A' }}>
          Investigate
        </button>
        <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
          Dismiss
        </button>
      </div>
    </div>
  );
}
