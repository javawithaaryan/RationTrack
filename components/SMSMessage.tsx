'use client';

import { SMSMessageType } from '@/lib/mockData';

interface SMSMessageProps {
  message: SMSMessageType;
}

export function SMSMessage({ message }: SMSMessageProps) {
  const isIncoming = message.type === 'incoming';

  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`flex gap-2 animate-slide-in ${
        isIncoming ? 'justify-start' : 'justify-end'
      }`}
    >
      <div
        className={`max-w-xs rounded-lg px-4 py-2 ${
          isIncoming
            ? 'bg-gray-100 text-gray-900'
            : 'text-white'
        }`}
        style={!isIncoming ? { backgroundColor: '#E8620A' } : undefined}
      >
        <p className="text-xs font-semibold mb-0.5">{message.from}</p>
        <p className="text-sm">{message.message}</p>
        <p
          className={`text-xs mt-1 ${
            isIncoming ? 'text-gray-500' : 'text-orange-100'
          }`}
        >
          {timeAgo(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
