'use client';

interface StatusBadgeProps {
  status: 'pending' | 'verified' | 'reported';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    pending: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: '⏳',
      label: 'Pending',
    },
    verified: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: '✅',
      label: 'Verified',
    },
    reported: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: '🚨',
      label: 'Reported',
    },
  };

  const c = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
    >
      <span>{c.icon}</span>
      {c.label}
    </span>
  );
}
