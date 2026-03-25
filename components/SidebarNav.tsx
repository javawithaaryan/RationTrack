'use client';

import { LayoutGrid, Store, Users, AlertCircle, Map, Shield, Globe } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t, type Language } from '@/lib/translations';

type TabType = 'dashboard' | 'dealer' | 'citizen' | 'alerts' | 'map';

interface SidebarNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  const { state, dispatch } = useAppStore();
  const lang = state.language as Language;

  const tabs: Array<{ id: TabType; icon: React.ReactNode; label: string }> = [
    { id: 'dealer', icon: <Store size={20} />, label: t(lang, 'dealerPanel' as any) },
    { id: 'citizen', icon: <Users size={20} />, label: t(lang, 'citizenPortal' as any) },
    { id: 'alerts', icon: <AlertCircle size={20} />, label: t(lang, 'fraudAlerts' as any) },
    { id: 'map', icon: <Map size={20} />, label: t(lang, 'districtMap' as any) },
    { id: 'dashboard', icon: <LayoutGrid size={20} />, label: t(lang, 'dashboard' as any) },
  ];

  const handleToggleLang = () => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang === 'en' ? 'hi' : 'en' });
  };

  return (
    <aside
      className="hidden md:flex w-64 flex-col fixed left-0 top-0 bottom-0 pt-6"
      style={{ background: 'linear-gradient(180deg, #0D1F3C 0%, #1E3A5F 100%)' }}
    >
      <div className="px-6 mb-8 mt-2 relative">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#E8620A' }}
          >
            <Shield size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-white text-xl font-bold tracking-tight">RationTrack</h1>
            <p className="text-slate-400 text-[10px] font-medium tracking-wider uppercase">
              PDS Intelligence · MP
            </p>
          </div>
        </div>
        <button
          onClick={handleToggleLang}
          className="absolute right-6 top-0 flex items-center gap-1.5 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs font-bold text-white transition-colors"
          title="Toggle Language"
        >
          <Globe size={12} />
          {lang === 'en' ? 'हिं' : 'ENG'}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'text-white shadow-lg'
                : 'text-slate-300 hover:bg-white/10'
            }`}
            style={
              activeTab === tab.id
                ? { backgroundColor: '#E8620A' }
                : undefined
            }
            aria-label={tab.label}
          >
            {tab.icon}
            <span className="font-medium text-sm">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 py-6 border-t border-white/10">
        <p className="text-slate-400 text-xs text-center">
          RationTrack v2.0 · Madhya Pradesh
        </p>
      </div>
    </aside>
  );
}
