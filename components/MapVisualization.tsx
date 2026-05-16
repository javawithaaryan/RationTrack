'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';
import { StatusBadge } from './StatusBadge';
import { Download, X, TrendingUp, MapPin, Search, ChevronRight, Activity, ShieldAlert, FileText } from 'lucide-react';

const MapInner = dynamic(() => import('./MapInner'), { 
  ssr: false, 
  loading: () => <div className="h-[600px] glass-panel animate-pulse rounded-[3rem] flex items-center justify-center text-slate-400 font-black uppercase tracking-widest text-[10px]">Initializing Surveillance Grid...</div> 
});

export function MapVisualization() {
  const { state } = useAppStore();
  const [selectedDistrict, setSelectedDistrict] = useState<any | null>(null);
  const [showFullLog, setShowFullLog] = useState(false);

  // Exact coordinates and mock details requested
  const mockDistricts = [
    { id: '1', name: 'Indore', lat: 22.7196, lng: 75.8577, alerts: 8, riskLevel: 'high', bg: 'red',
      shops: 'Sharma Ration Shop (73%) Monitor, Verma Store (88%) Verified', lastAlert: 'Double Collection 16m ago' },
    { id: '2', name: 'Bhopal', lat: 23.2599, lng: 77.4126, alerts: 15, riskLevel: 'suspicious', bg: 'orange',
      shops: 'Central Supplies (62%) Monitor', lastAlert: 'Off-hours logging 5h ago' },
    { id: '3', name: 'Ujjain', lat: 23.1765, lng: 75.7885, alerts: 22, riskLevel: 'high', bg: 'red',
      shops: 'Grain Hub Ujjain (45%) At Risk', lastAlert: 'Speed Fraud 2h ago' },
    { id: '4', name: 'Gwalior', lat: 26.2183, lng: 78.1828, alerts: 5, riskLevel: 'safe', bg: 'green',
      shops: 'Pure Foods Gwalior (88%) Verified', lastAlert: 'Quota exceeded 3h ago' },
    { id: '5', name: 'Jabalpur', lat: 23.1815, lng: 79.9864, alerts: 18, riskLevel: 'suspicious', bg: 'orange',
      shops: 'Jabalpur Hub (55%) Monitor', lastAlert: 'Off-hours 6h ago' },
    { id: '6', name: 'Rewa', lat: 24.5362, lng: 81.2961, alerts: 9, riskLevel: 'safe', bg: 'green',
      shops: 'Rewa Ration Center (91%) Verified', lastAlert: 'None in 24h' },
    { id: '7', name: 'Sagar', lat: 23.8388, lng: 78.7378, alerts: 12, riskLevel: 'suspicious', bg: 'orange',
      shops: 'Sagar Supplies (71%) Monitor', lastAlert: 'Speed Fraud 4h ago' },
    { id: '8', name: 'Mandsaur', lat: 24.0765, lng: 75.0711, alerts: 19, riskLevel: 'high', bg: 'red',
      shops: 'Mandsaur Stores (38%) At Risk', lastAlert: 'Double Collection 1h ago' },
    { id: '9', name: 'Satna', lat: 24.6005, lng: 80.8322, alerts: 7, riskLevel: 'safe', bg: 'green',
      shops: 'Satna Foods (85%) Verified', lastAlert: 'None in 24h' },
    { id: '10', name: 'Dewas', lat: 22.9676, lng: 76.0534, alerts: 11, riskLevel: 'suspicious', bg: 'orange',
      shops: 'Dewas General (65%) Monitor', lastAlert: 'Anomaly 2h ago' },
  ];

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return '#10b981';     // emerald
      case 'suspicious': return '#f59e0b'; // amber
      case 'high': return '#ef4444';      // red
      default: return '#94a3b8';
    }
  };

  const handleExportCSV = () => {
    if (!selectedDistrict) return;
    const content = 'Date,Beneficiary,Grain,Quantity,Shop,Status\n' + state.transactions.slice(0, 10).map(t => 
      `${new Date(t.timestamp).toLocaleDateString()},${t.beneficiaryName},${t.grainType},${t.quantity}${t.unit},${t.dealerName},${state.verificationStatuses[t.id] || t.status}`
    ).join('\n');

    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDistrict.name.toLowerCase()}-log.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 p-6 md:p-10 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Geospatial Intelligence</h1>
              <span className="px-2 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-md border border-primary/20">Live Sync</span>
           </div>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
             Madhya Pradesh District Risk Assessment & Distribution Monitoring
           </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Safe</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> Warning</div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> Critical</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Map Container */}
        <div className="xl:col-span-8 group relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-transparent rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative glass-panel p-4 rounded-[3.5rem] shadow-2xl overflow-hidden min-h-[600px]">
            <MapInner
              districts={mockDistricts}
              selectedDistrict={selectedDistrict}
              onSelectDistrict={setSelectedDistrict}
              getRiskColor={getRiskColor}
            />
            {/* Map Overlay Controls */}
            <div className="absolute top-8 left-8 z-10 flex flex-col gap-3">
               <div className="glass-card p-2 rounded-2xl flex flex-col gap-2 shadow-2xl border-white/20">
                  <button className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"><Search size={18} /></button>
                  <button className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"><Activity size={18} /></button>
               </div>
            </div>
          </div>
        </div>

        {/* Intelligence Side Panel */}
        <div className="xl:col-span-4 space-y-10">
           <div className="glass-card p-10 rounded-[3rem] min-h-[400px] flex flex-col shadow-2xl relative overflow-hidden">
              {selectedDistrict ? (
                <div className="space-y-8 animate-fade-in-up">
                   <div className="flex items-start justify-between">
                      <div>
                         <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{selectedDistrict.name}</h2>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">District Analysis Profile</p>
                      </div>
                      <button onClick={() => setSelectedDistrict(null)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors">
                         <X size={20} />
                      </button>
                   </div>

                   <div className={`p-6 rounded-3xl border-l-8 flex items-center justify-between ${
                      selectedDistrict.riskLevel === 'high' ? 'bg-red-50/50 border-red-600' : 
                      selectedDistrict.riskLevel === 'suspicious' ? 'bg-amber-50/50 border-amber-600' : 
                      'bg-emerald-50/50 border-emerald-600'
                   }`}>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assessed Threat</p>
                         <p className={`text-xl font-black uppercase tracking-tight ${
                            selectedDistrict.riskLevel === 'high' ? 'text-red-600' : 
                            selectedDistrict.riskLevel === 'suspicious' ? 'text-amber-600' : 
                            'text-emerald-600'
                         }`}>{selectedDistrict.riskLevel} Risk</p>
                      </div>
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm">
                         <ShieldAlert className={selectedDistrict.riskLevel === 'high' ? 'text-red-600' : 'text-slate-400'} />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="glass-card p-6 rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/50">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Alerts</p>
                         <p className="text-2xl font-black text-slate-900 dark:text-white">{selectedDistrict.alerts}</p>
                      </div>
                      <div className="glass-card p-6 rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/50">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Safety Rating</p>
                         <p className="text-2xl font-black text-slate-900 dark:text-white">{100 - selectedDistrict.alerts}%</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-3 h-3" /> Flagged Distribution Points
                         </p>
                         <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">{selectedDistrict.shops}</p>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-3 h-3" /> Recent Incident
                         </p>
                         <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedDistrict.lastAlert}</p>
                         </div>
                      </div>
                   </div>

                   <button
                     onClick={() => setShowFullLog(true)}
                     className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-auto shadow-xl shadow-black/10"
                   >
                     <FileText size={16} /> Analysis Full Log
                   </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-6 opacity-30">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <MapPin size={32} className="text-slate-400" />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-loose">
                    Select a District Marker to Access Intelligence Dashboard
                  </p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Full Log Modal */}
      {showFullLog && selectedDistrict && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div className="glass-panel w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[4rem] border-white/10">
            <div className="flex items-center justify-between p-10 border-b border-white/5 bg-white/5">
              <div>
                 <h2 className="text-3xl font-black text-white tracking-tight">{selectedDistrict.name} Transaction Intelligence</h2>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Comprehensive Audit Log for Security Analysis</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <Download size={16} /> Export Intelligence Data
                </button>
                <button onClick={() => setShowFullLog(false)} className="w-14 h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center hover:rotate-90 transition-transform">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-10 bg-slate-950/50">
               <div className="rounded-[2.5rem] border border-white/5 overflow-hidden bg-white/5">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5 text-left border-b border-white/5">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Chronology</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Citizen Entity</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Distribution</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {state.transactions.slice(0, 15).map((txn, idx) => {
                      const currentStatus = state.verificationStatuses[txn.id] || txn.status;
                      return (
                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-6">
                             <p className="text-white font-bold text-sm">{new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                             <p className="text-slate-500 text-[10px] font-bold uppercase mt-1">{new Date(txn.timestamp).toLocaleDateString()}</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="font-black text-white text-base tracking-tight">{txn.beneficiaryName}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                               <div className="w-3 h-3 bg-blue-500/20 rounded flex items-center justify-center"><Activity className="w-2 h-2 text-blue-400" /></div>
                               ID: {txn.beneficiaryId}
                            </p>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <span className="text-lg">🌾</span>
                                <div>
                                   <p className="text-sm font-black text-white">{txn.quantity}{txn.unit} {txn.grainType}</p>
                                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Terminal: {txn.dealerName}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <StatusBadge status={currentStatus} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
