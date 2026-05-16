'use client';

import { useState } from 'react';
import { Search, Users, Store, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { StatusBadge } from './StatusBadge';

export function ComplaintsPage() {
  const { state, dispatch, showToast } = useAppStore();
  const [adminRemarks, setAdminRemarks] = useState<Record<string, string>>({});

  const handleComplaintStatusChange = (id: string, status: 'open' | 'investigating' | 'resolved') => {
    dispatch({ type: 'UPDATE_COMPLAINT_STATUS', payload: { complaintId: id, status, remarks: adminRemarks[id] } });
    showToast(`Complaint marked as ${status}`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 p-6 md:p-10 space-y-10 animate-fade-in">
      <div className="glass-card rounded-[2rem] p-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Public <span className="text-gradient">Grievances</span></h2>
            <p className="text-sm text-slate-500 font-medium">Resolving citizen reported issues and denial of service.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs" />
              ))}
            </div>
            <p className="text-xs font-bold text-slate-400">8 Officers Online</p>
          </div>
        </div>

        {state.complaints.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-xl font-black text-slate-400 uppercase tracking-widest">All cases resolved. Inbox empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {state.complaints.map((complaint) => (
              <div key={complaint.id} className="p-8 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:shadow-xl transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">ID: {complaint.id ? complaint.id.slice(0, 8) : 'N/A'}</span>
                      <StatusBadge status={complaint.status === 'open' ? 'reported' : complaint.status === 'investigating' ? 'pending' : 'verified'} />
                    </div>
                    <p className="text-lg font-black text-slate-800 dark:text-white leading-snug group-hover:text-primary transition-colors">
                      "{complaint.description}"
                    </p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Citizen: {complaint.beneficiaryName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Against: {complaint.dealerName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-72 space-y-4">
                    <div className="relative group">
                      <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        placeholder="Admin action notes..."
                        value={adminRemarks[complaint.id] || ''}
                        onChange={(e) => setAdminRemarks(prev => ({ ...prev, [complaint.id]: e.target.value }))}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none text-sm font-semibold focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleComplaintStatusChange(complaint.id, 'investigating')}
                        className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          complaint.status === 'investigating' ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Investigate
                      </button>
                      <button
                        onClick={() => handleComplaintStatusChange(complaint.id, 'resolved')}
                        className="flex-1 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
