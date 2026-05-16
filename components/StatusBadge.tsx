'use client';

interface StatusBadgeProps {
  status: 'pending' | 'verified' | 'reported';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    pending: {
      bg: 'bg-amber-100/50 dark:bg-amber-900/20',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200/50 dark:border-amber-800/50',
      label: 'Awaiting Verification',
      dot: 'bg-amber-500'
    },
    verified: {
      bg: 'bg-emerald-100/50 dark:bg-emerald-900/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200/50 dark:border-emerald-800/50',
      label: 'Legitimacy Confirmed',
      dot: 'bg-emerald-500'
    },
    reported: {
      bg: 'bg-red-100/50 dark:bg-red-900/20',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200/50 dark:border-red-800/50',
      label: 'Protocol Breach',
      dot: 'bg-red-500'
    },
  };

  const c = config[status] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border backdrop-blur-sm shadow-sm transition-all ${c.bg} ${c.text} ${c.border}`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === 'pending' ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  );
}
