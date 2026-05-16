'use client';

import React from 'react';
<<<<<<< HEAD
=======
import { LucideIcon } from 'lucide-react';
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'emerald' | 'amber' | 'red';
}

export function KPICard({
  title,
  value,
  icon,
  subtitle,
  trend,
  color = 'blue',
}: KPICardProps) {
<<<<<<< HEAD
  const colorVariants = {
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-600 dark:text-blue-400',
    emerald: 'from-emerald-500/20 to-emerald-600/20 text-emerald-600 dark:text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/20 text-amber-600 dark:text-amber-400',
    red: 'from-red-500/20 to-red-600/20 text-red-600 dark:text-red-400',
  };

  return (
    <div className="glass-card p-6 hover-lift group relative overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorVariants[color]} blur-3xl opacity-20 -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700`} />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</h3>
            {trend && (
              <div className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md ${
                trend.isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
              }`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-400 font-medium mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorVariants[color]} shadow-sm group-hover:rotate-6 transition-transform duration-500`}>
          {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
        </div>
=======
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    amber: 'text-amber-600 bg-amber-50',
    red: 'text-red-600 bg-red-50',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {trend && (
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>{icon}</div>
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620
      </div>
    </div>
  );
}
