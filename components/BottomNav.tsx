'use client';

<<<<<<< HEAD
import { LayoutGrid, Store, Users, AlertCircle, Map, FileText } from 'lucide-react';
import { type Language, t } from '@/lib/translations';
import { useAppStore } from '@/lib/store';

type TabType = 'dashboard' | 'dealer' | 'citizen' | 'alerts' | 'map' | 'complaints';
=======
import { LayoutGrid, Store, Users, AlertCircle, Map } from 'lucide-react';

type TabType = 'dashboard' | 'dealer' | 'citizen' | 'alerts' | 'map';
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
<<<<<<< HEAD
  const { state } = useAppStore();
  const lang = (state?.language as Language) || 'en';

  const tabs: Array<{ id: TabType; icon: React.ReactNode; label: string }> = [
    { id: 'dealer', icon: <Store className="w-5 h-5" />, label: t(lang, 'dealerPanel' as any) },
    { id: 'citizen', icon: <Users className="w-5 h-5" />, label: t(lang, 'citizenPortal' as any) },
    { id: 'alerts', icon: <AlertCircle className="w-5 h-5" />, label: t(lang, 'fraudAlerts' as any) },
    { id: 'complaints', icon: <FileText className="w-5 h-5" />, label: t(lang, 'complaints' as any) },
    { id: 'map', icon: <Map className="w-5 h-5" />, label: t(lang, 'districtMap' as any) },
    { id: 'dashboard', icon: <LayoutGrid className="w-5 h-5" />, label: t(lang, 'dashboard' as any) },
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50">
      <div className="glass-panel rounded-2xl flex items-center justify-around p-2 shadow-2xl border border-white/10 dark:border-white/5 overflow-hidden">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-saffron scale-110' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`transition-transform duration-300 ${isActive ? 'translate-y-[-2px]' : ''}`}>
                {tab.icon}
              </div>
              <span className={`text-[10px] font-bold mt-1 tracking-tight transition-all duration-300 ${
                isActive ? 'opacity-100 scale-100 max-h-4' : 'opacity-0 scale-75 max-h-0'
              }`}>
                {tab.label.split(' ')[0]}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-saffron shadow-[0_0_8px_#E8620A]" />
              )}
            </button>
          );
        })}
=======
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
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620
      </div>
    </nav>
  );
}
