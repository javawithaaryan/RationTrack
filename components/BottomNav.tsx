'use client';

import { LayoutGrid, Store, Users, AlertCircle, Map } from 'lucide-react';

type TabType = 'dashboard' | 'dealer' | 'citizen' | 'alerts' | 'map';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs: Array<{ id: TabType; icon: React.ReactNode; label: string }> = [
    { id: 'dealer', icon: <Store size={22} />, label: 'Dealer' },
    { id: 'citizen', icon: <Users size={22} />, label: 'Citizen' },
    { id: 'alerts', icon: <AlertCircle size={22} />, label: 'Alerts' },
    { id: 'map', icon: <Map size={22} />, label: 'Map' },
    { id: 'dashboard', icon: <LayoutGrid size={22} />, label: 'Admin' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 safe-area-bottom">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-2.5 px-1 flex-1 transition-colors ${
              activeTab === tab.id
                ? 'border-t-2'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            style={
              activeTab === tab.id
                ? { color: '#E8620A', borderTopColor: '#E8620A' }
                : undefined
            }
            aria-label={tab.label}
          >
            {tab.icon}
            <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
