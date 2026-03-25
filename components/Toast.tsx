'use client';

import { useAppStore } from '@/lib/store';

export function Toast() {
  const { state } = useAppStore();

  if (state.toasts.length === 0) return null;

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'info':
        return 'bg-blue-600 text-white';
      case 'warning':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
      {state.toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-5 py-3 rounded-xl shadow-2xl font-semibold text-sm animate-slide-in pointer-events-auto ${getToastStyles(toast.type)}`}
          style={{
            backdropFilter: 'blur(10px)',
            animation: 'slide-in 0.3s ease-out',
          }}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
