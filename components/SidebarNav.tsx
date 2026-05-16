'use client';

<<<<<<< HEAD
import { LayoutGrid, Store, Users, AlertCircle, Map, Shield, Globe, ChevronRight, FileText } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t, type Language } from '@/lib/translations';

type TabType = 'dashboard' | 'dealer' | 'citizen' | 'alerts' | 'map' | 'complaints';
=======
import { LayoutGrid, Store, Users, AlertCircle, Map, Shield, Globe } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t, type Language } from '@/lib/translations';

type TabType = 'dashboard' | 'dealer' | 'citizen' | 'alerts' | 'map';
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620

interface SidebarNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  const { state, dispatch } = useAppStore();
  const lang = state.language as Language;

  const tabs: Array<{ id: TabType; icon: React.ReactNode; label: string }> = [
<<<<<<< HEAD
    { id: 'dealer', icon: <Store className="w-5 h-5" />, label: t(lang, 'dealerPanel' as any) },
    { id: 'citizen', icon: <Users className="w-5 h-5" />, label: t(lang, 'citizenPortal' as any) },
    { id: 'alerts', icon: <AlertCircle className="w-5 h-5" />, label: t(lang, 'fraudAlerts' as any) },
    { id: 'complaints', icon: <FileText className="w-5 h-5" />, label: t(lang, 'complaints' as any) },
    { id: 'map', icon: <Map className="w-5 h-5" />, label: t(lang, 'districtMap' as any) },
    { id: 'dashboard', icon: <LayoutGrid className="w-5 h-5" />, label: t(lang, 'dashboard' as any) },
=======
    { id: 'dealer', icon: <Store size={20} />, label: t(lang, 'dealerPanel' as any) },
    { id: 'citizen', icon: <Users size={20} />, label: t(lang, 'citizenPortal' as any) },
    { id: 'alerts', icon: <AlertCircle size={20} />, label: t(lang, 'fraudAlerts' as any) },
    { id: 'map', icon: <Map size={20} />, label: t(lang, 'districtMap' as any) },
    { id: 'dashboard', icon: <LayoutGrid size={20} />, label: t(lang, 'dashboard' as any) },
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620
  ];

  const handleToggleLang = () => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang === 'en' ? 'hi' : 'en' });
  };

  return (
<<<<<<< HEAD
    <aside className="hidden md:flex w-72 flex-col fixed left-0 top-0 bottom-0 z-50 bg-[#0D1F3C] border-r border-white/5">
      {/* Brand Section */}
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-[#FF8C42] flex items-center justify-center shadow-lg shadow-saffron/20 rotate-3">
              <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-white text-xl font-black tracking-tight leading-none">
                Ration<span className="text-saffron">Track</span>
              </h1>
              <p className="text-slate-400 text-[10px] font-bold tracking-[0.2em] uppercase mt-1">
                PDS Intelligence
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleToggleLang}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-all border border-white/5 group"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-saffron group-hover:rotate-12 transition-transform" />
            <span>{lang === 'en' ? 'Hindi / हिंदी' : 'English / ENG'}</span>
          </div>
          <ChevronRight className="w-3 h-3 text-slate-500" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all relative group ${
                isActive
                  ? 'bg-gradient-to-r from-saffron to-[#FF8C42] text-white shadow-xl shadow-saffron/20 translate-x-1'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-saffron'}`}>
                  {tab.icon}
                </div>
                <span className="font-semibold text-sm tracking-wide">{tab.label}</span>
              </div>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-6 mt-auto">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Live</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Madhya Pradesh Food & Supplies Department
          </p>
        </div>
=======
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
>>>>>>> 60e8cdbb3291e174c3ca45ba5c9e48340994c620
      </div>
    </aside>
  );
}
