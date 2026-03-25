'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppStore } from '@/lib/store';
import { StatusBadge } from './StatusBadge';
import { mockDealers } from '@/lib/mockData';
import { Download, X, TrendingUp, MapPin } from 'lucide-react';

const MapInner = dynamic(() => import('./MapInner'), { ssr: false, loading: () => <div className="h-[500px] bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">Loading map...</div> });

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
      case 'safe': return '#22c55e';     // green
      case 'suspicious': return '#f59e0b'; // orange
      case 'high': return '#ef4444';      // red
      default: return '#9ca3af';
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
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">MP District Map</h1>
          <p className="text-gray-500 mt-1 text-sm">Risk assessment by district — click any marker for details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-md relative z-0">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={20} style={{ color: '#E8620A' }} />
            Madhya Pradesh Districts
          </h2>
          <MapInner
            districts={mockDistricts}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            getRiskColor={getRiskColor}
          />
        </div>

        {/* Details Panel */}
        <div className="bg-white rounded-2xl p-6 shadow-md h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">District Details</h2>
            {selectedDistrict && (
              <button onClick={() => setSelectedDistrict(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            )}
          </div>

          {selectedDistrict ? (
            <div className="space-y-4 animate-fade-in-up">
              <div>
                <p className="text-2xl font-bold text-gray-900">{selectedDistrict.name} District</p>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: getRiskColor(selectedDistrict.riskLevel) }}
                >
                  {selectedDistrict.riskLevel === 'high' ? '🔴' : selectedDistrict.riskLevel === 'suspicious' ? '🟠' : '🟢'}
                  {selectedDistrict.riskLevel.toUpperCase()} RISK
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                <p className="text-xs text-red-500 uppercase font-bold mb-1">Total Alerts</p>
                <p className="font-bold text-red-700 text-lg">{selectedDistrict.alerts} alerts</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Flagged Shops & Status</p>
                <p className="font-medium text-gray-900 text-sm whitespace-pre-wrap">{selectedDistrict.shops}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Most Recent Alert</p>
                <p className="font-medium text-gray-900 text-sm">{selectedDistrict.lastAlert}</p>
              </div>

              <button
                onClick={() => setShowFullLog(true)}
                className="w-full py-2.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 mt-2"
                style={{ backgroundColor: '#E8620A' }}
              >
                View Full Log
              </button>
            </div>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <TrendingUp size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500">Click a district marker to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Full Log Modal */}
      {showFullLog && selectedDistrict && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{selectedDistrict.name} — Full Transaction Log</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Download size={16} /> Export CSV
                </button>
                <button onClick={() => setShowFullLog(false)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-5 py-4 text-left font-semibold text-gray-600">Date</th>
                      <th className="px-5 py-4 text-left font-semibold text-gray-600">Beneficiary</th>
                      <th className="px-5 py-4 text-left font-semibold text-gray-600">Grain</th>
                      <th className="px-5 py-4 text-left font-semibold text-gray-600">Quantity</th>
                      <th className="px-5 py-4 text-left font-semibold text-gray-600">Shop</th>
                      <th className="px-5 py-4 text-center font-semibold text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.transactions.slice(0, 10).map((txn, idx) => {
                      const currentStatus = state.verificationStatuses[txn.id] || txn.status;
                      const isReported = currentStatus === 'reported';
                      return (
                        <tr key={idx} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isReported ? 'bg-[#FEF2F2]' : ''}`}>
                          <td className="px-5 py-4 text-gray-700">{new Date(txn.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                          <td className="px-5 py-4 font-medium text-gray-900">{txn.beneficiaryName}</td>
                          <td className="px-5 py-4 text-gray-700">{txn.grainType}</td>
                          <td className="px-5 py-4 text-gray-900 font-bold">{txn.quantity}{txn.unit}</td>
                          <td className="px-5 py-4 text-gray-600">
                            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold">{txn.dealerName}</span>
                          </td>
                          <td className="px-5 py-4 text-center">
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
