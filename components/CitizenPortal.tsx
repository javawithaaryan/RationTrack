'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  AlertCircle,
  CheckCircle,
  Phone,
  MapPin,
  FileText,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  History,
  MessageSquare,
  ArrowRight,
  X,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { StatusBadge } from './StatusBadge';
import { mockDealers, findBeneficiaryByAadhaar, findBeneficiaryByName } from '@/lib/mockData';
import { t as translate, type Language } from '@/lib/translations';

type ModalType = 'shop' | 'schemes' | 'helpline' | null;

export function CitizenPortal() {
  const { state, dispatch, showToast } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [complaintForm, setComplaintForm] = useState({ date: '', description: '' });
  const [submittedComplaintId, setSubmittedComplaintId] = useState<string | null>(null);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [pincodeQuery, setPincodeQuery] = useState('');
  const [shopResults, setShopResults] = useState<{name: string, location: string, dist: string, open: boolean, owner: string}[] | null>(null);

  const lang = state.language;
  const tt = (key: string) => translate(lang as Language, key as any);

  const matchedBeneficiary = useMemo(() => {
    if (!searchQuery || searchQuery.length < 3) return null;
    const byAadhaar = findBeneficiaryByAadhaar(searchQuery);
    if (byAadhaar) return byAadhaar;
    return findBeneficiaryByName(searchQuery) || null;
  }, [searchQuery]);

  const matchedDealer = matchedBeneficiary ? mockDealers[matchedBeneficiary.dealerId] : null;

  const beneficiaryTransactions = useMemo(() => {
    if (!matchedBeneficiary) return [];
    return state.transactions.filter(t => t.beneficiaryId === matchedBeneficiary.id);
  }, [matchedBeneficiary, state.transactions]);

  const currentMonthCollections = useMemo(() => {
    if (!matchedBeneficiary) return { wheat: false, rice: false, sugar: false, kerosene: false, dal: false };
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const monthTxns = state.transactions.filter(t => {
      const d = new Date(t.timestamp);
      return t.beneficiaryId === matchedBeneficiary.id && d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    });
    return {
      wheat: monthTxns.some(t => t.grainType.includes('Wheat')),
      rice: monthTxns.some(t => t.grainType.includes('Rice')),
      sugar: monthTxns.some(t => t.grainType.includes('Sugar')),
      kerosene: monthTxns.some(t => t.grainType.includes('Kerosene')),
      dal: monthTxns.some(t => t.grainType.includes('Dal')),
    };
  }, [matchedBeneficiary, state.transactions]);

  const myComplaints = useMemo(() => {
    if (!matchedBeneficiary) return [];
    return state.complaints.filter(c => c.beneficiaryId === matchedBeneficiary.id);
  }, [matchedBeneficiary, state.complaints]);

  const lastSMS = useMemo(() => {
    if (!matchedBeneficiary) return null;
    return state.smsMessages.find(s => s.beneficiaryId === matchedBeneficiary.id) || null;
  }, [matchedBeneficiary, state.smsMessages]);

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedBeneficiary || !complaintForm.description) return;
    const complaintId = `CMP-${new Date().getFullYear()}-${String(state.complaints.length + 101).padStart(3, '0')}`;
    dispatch({
      type: 'ADD_COMPLAINT',
      payload: {
        id: complaintId,
        beneficiaryId: matchedBeneficiary.id,
        beneficiaryName: matchedBeneficiary.name,
        dealerId: matchedBeneficiary.dealerId,
        dealerName: matchedDealer?.name || '',
        description: complaintForm.description,
        date: new Date(),
        status: 'open',
      },
    });
    setSubmittedComplaintId(complaintId);
    setComplaintForm({ date: '', description: '' });
    showToast('Complaint Filed Successfully', 'success');
  };

  const mockShopData = [
    { pincode: '452001', name: 'Sharma Ration Shop', location: 'Indore', dist: '0.8km', open: true, owner: 'Rajesh Sharma' },
    { pincode: '452002', name: 'Verma General Store', location: 'Indore', dist: '1.4km', open: true, owner: 'Priya Verma' },
    { pincode: '462001', name: 'Central Supplies', location: 'Bhopal', dist: '1.2km', open: true, owner: 'Amit Patel' },
    { pincode: '462022', name: 'Bhopal Ration Center', location: 'Bhopal', dist: '0.6km', open: false, owner: 'Sunita Joshi' },
  ];

  const handleFindShop = (e: React.FormEvent) => {
    e.preventDefault();
    const results = mockShopData.filter(shop => shop.pincode.startsWith(pincodeQuery.substring(0, 3)));
    setShopResults(results);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
         {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-saffron/10 to-transparent rounded-full blur-3xl -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-india-green/10 to-transparent rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron/10 text-saffron text-[10px] font-black uppercase tracking-widest mb-6 border border-saffron/20">
            <ShieldCheck className="w-3 h-3" />
            Empowering Citizens
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Welcome to <span className="text-gradient">Citizen Portal</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            {tt('citizenSubtitle')} Track your monthly quota, find nearby shops, and report discrepancies in real-time.
          </p>

          {/* Large Search Bar */}
          <div className="mt-12 max-w-2xl mx-auto group">
            <div className="relative glass-panel rounded-3xl shadow-2xl transition-all group-focus-within:ring-4 group-focus-within:ring-primary/10 group-focus-within:scale-[1.02]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tt('searchPlaceholder')}
                className="w-full pl-16 pr-8 py-6 bg-transparent border-none text-xl font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-0 outline-none"
              />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Try searching:</span>
               <button onClick={() => setSearchQuery('0001')} className="text-xs font-black text-primary/70 hover:text-primary transition-colors hover:underline">0001 (Ramesh)</button>
               <button onClick={() => setSearchQuery('0003')} className="text-xs font-black text-primary/70 hover:text-primary transition-colors hover:underline">0003 (Amit)</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Empty State */}
        {!matchedBeneficiary && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { icon: <MapPin />, title: tt('findShop'), desc: 'Locate authorized PDS shops near you.', onClick: () => setActiveModal('shop'), color: 'bg-saffron' },
               { icon: <FileText />, title: tt('activeSchemes'), desc: 'Learn about your entitlement benefits.', onClick: () => setActiveModal('schemes'), color: 'bg-blue-600' },
               { icon: <Phone />, title: 'Call Helpline', desc: tt('helplineNumber'), onClick: () => setActiveModal('helpline'), color: 'bg-india-green' },
             ].map((item, i) => (
               <button key={i} onClick={item.onClick} className="glass-card p-8 rounded-[2rem] text-left hover-lift group">
                 <div className={`w-14 h-14 rounded-2xl ${item.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-black/5 group-hover:rotate-6 transition-transform`}>
                   {item.icon}
                 </div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{item.title}</h3>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                 <ArrowRight className="w-5 h-5 mt-6 text-slate-300 group-hover:text-primary transition-colors" />
               </button>
             ))}
           </div>
        )}

        {matchedBeneficiary && (
          <div className="space-y-12 animate-fade-in-up">
            {/* Beneficiary Identity Card */}
            <div className="glass-card p-10 rounded-[3rem] border-l-8 border-l-saffron overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <ShieldCheck className="w-40 h-40 text-saffron" />
              </div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-4 space-y-2">
                  <span className="px-3 py-1 bg-saffron/10 text-saffron text-[10px] font-black uppercase tracking-widest rounded-lg">Verified Citizen</span>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{matchedBeneficiary.name}</h2>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">{matchedBeneficiary.district} District · Block A</p>
                </div>
                <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-3 gap-6 border-l border-slate-100 dark:border-slate-800 md:pl-10">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ration Card ID</p>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200">{matchedBeneficiary.rationCard}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Family Category</p>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg text-xs font-black">
                       <FileText className="w-3 h-3" /> {matchedBeneficiary.category}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Aadhaar (Linked)</p>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200">XXXX-XXXX-{matchedBeneficiary.aadhaarLast4}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quota Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Monthly <span className="text-gradient">Entitlement</span></h3>
                 <span className="text-sm font-bold text-slate-400">March 2026 Cycle</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { key: 'wheat', icon: '🌾', amount: matchedBeneficiary.entitlement.wheat, unit: tt('kg'), collected: currentMonthCollections.wheat, color: 'from-amber-400 to-amber-600' },
                  { key: 'rice', icon: '🍚', amount: matchedBeneficiary.entitlement.rice, unit: tt('kg'), collected: currentMonthCollections.rice, color: 'from-slate-300 to-slate-500' },
                  { key: 'sugar', icon: '🍬', amount: matchedBeneficiary.entitlement.sugar, unit: tt('kg'), collected: currentMonthCollections.sugar, color: 'from-pink-400 to-pink-600' },
                  { key: 'kerosene', icon: '🛢️', amount: matchedBeneficiary.entitlement.kerosene, unit: tt('litres'), collected: currentMonthCollections.kerosene, color: 'from-blue-400 to-blue-600' },
                  { key: 'dal', icon: '🍛', amount: matchedBeneficiary.entitlement.dal, unit: tt('kg'), collected: currentMonthCollections.dal, color: 'from-emerald-400 to-emerald-600' },
                ].map((item) => (
                  <div key={item.key} className="glass-card p-6 rounded-[2rem] text-center hover-lift relative overflow-hidden group">
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r ${item.color} opacity-30`} />
                    <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-500">{item.icon}</div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{tt(item.key as any)}</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">{item.amount} <span className="text-xs">{item.unit}</span></p>
                    
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      item.collected ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {item.collected ? <CheckCircle className="w-3 h-3" /> : <History className="w-3 h-3" />}
                      {item.collected ? tt('collected') : tt('pending')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* History & Status */}
              <div className="lg:col-span-8 space-y-8">
                <div className="glass-card rounded-[2.5rem] overflow-hidden">
                   <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      <History className="w-5 h-5 text-primary" /> Recent Collections
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-left">
                          <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Distribution Center</th>
                          <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Grain Details</th>
                          <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {beneficiaryTransactions.slice(0, 5).map((txn) => {
                          const currentStatus = state.verificationStatuses[txn.id] || txn.status;
                          return (
                            <tr key={txn.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-8 py-5">
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{txn.dealerName}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(txn.timestamp).toLocaleDateString()}</p>
                              </td>
                              <td className="px-8 py-5">
                                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{txn.grainType} · {txn.quantity}{txn.unit}</p>
                              </td>
                              <td className="px-8 py-5 text-center">
                                <StatusBadge status={currentStatus} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Complaint Form */}
                <div className="glass-card p-10 rounded-[2.5rem]">
                   <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" /> Discrepancy Reporting
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mb-8">If you haven't received your quota or faced dealer issues, file a report here.</p>

                  {submittedComplaintId ? (
                    <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 text-center animate-pulse-glow">
                      <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                         <CheckCircle className="w-8 h-8" strokeWidth={3} />
                      </div>
                      <h4 className="text-xl font-black text-emerald-900 mb-1">{tt('complaintFiled')}</h4>
                      <p className="text-sm font-bold text-emerald-700">Ref ID: <span className="font-mono text-lg">{submittedComplaintId}</span></p>
                      <button onClick={() => setSubmittedComplaintId(null)} className="mt-6 text-xs font-black uppercase text-emerald-600 hover:underline">File New Case</button>
                    </div>
                  ) : (
                    <form onSubmit={handleComplaintSubmit} className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date of Incident</label>
                          <input
                            type="date"
                            required
                            value={complaintForm.date}
                            onChange={(e) => setComplaintForm(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-red-500/20 transition-all"
                          />
                        </div>
                         <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Complaint Type</label>
                          <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-red-500/20 transition-all">
                             <option>Ration not received</option>
                             <option>Poor grain quality</option>
                             <option>Overcharging by dealer</option>
                             <option>Shop closed during hours</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Additional Details</label>
                        <textarea
                          required
                          rows={4}
                          value={complaintForm.description}
                          onChange={(e) => setComplaintForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Please provide specific details about your issue..."
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                        />
                      </div>
                      <button type="submit" className="w-full py-5 bg-red-600 hover:bg-red-700 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-red-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all">
                        {tt('submit')}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Sidebar: SMS & Status */}
              <div className="lg:col-span-4 space-y-8">
                {/* SMS Communication Card */}
                {lastSMS && (
                  <div className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-saffron" /> Communication Hub
                    </h3>
                    <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl shadow-black/5">
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-saffron flex items-center justify-center text-[10px] font-black text-white">RT</div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RationTrack Govt</span>
                         </div>
                         <span className="text-[10px] font-bold text-slate-300">{new Date(lastSMS.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed italic">
                        "{lastSMS.message}"
                      </p>
                      <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white dark:bg-slate-800 border-r border-b border-slate-100 dark:border-slate-700 rotate-45" />
                    </div>
                    <p className="mt-4 text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">Received on registered mobile</p>
                  </div>
                )}

                {/* Status Tracking */}
                <div className="glass-card p-8 rounded-[2.5rem]">
                   <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" /> Your Grievances
                  </h3>
                  {myComplaints.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                       <MessageSquare className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No active cases</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {myComplaints.slice(0, 3).map((complaint) => (
                        <div key={complaint.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover-lift">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{complaint.id.split('-')[2]}</span>
                            <StatusBadge status={complaint.status === 'open' ? 'reported' : complaint.status === 'investigating' ? 'pending' : 'verified'} />
                          </div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed mb-4">"{complaint.description}"</p>
                          <div className="flex items-center gap-1.5">
                             {[1, 2, 3].map(i => {
                               const isActive = (i === 1) || (i === 2 && complaint.status !== 'open') || (i === 3 && complaint.status === 'resolved');
                               return (
                                 <div key={i} className={`flex-1 h-1.5 rounded-full ${isActive ? 'bg-primary shadow-[0_0_8px_var(--color-primary)]' : 'bg-slate-200 dark:bg-slate-700'}`} />
                               );
                             })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS (Simplified for Aesthetics) */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="glass-panel w-full max-w-xl rounded-[3rem] p-10 relative shadow-2xl animate-fade-in-up">
             <button onClick={() => setActiveModal(null)} className="absolute right-8 top-8 p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:rotate-90 transition-transform">
               <X className="w-5 h-5" />
             </button>

             {activeModal === 'shop' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-saffron/10 text-saffron rounded-2xl flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Find Nearby Shops</h2>
                  </div>
                  <form onSubmit={handleFindShop} className="relative group">
                     <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                     <input
                        type="text"
                        value={pincodeQuery}
                        onChange={(e) => setPincodeQuery(e.target.value)}
                        placeholder="Enter your 6-digit Pincode..."
                        className="w-full pl-14 pr-32 py-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-saffron"
                     />
                     <button type="submit" className="absolute right-2 top-2 bottom-2 px-6 bg-saffron text-white rounded-xl font-black uppercase tracking-widest text-[10px]">Search</button>
                  </form>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                     {shopResults?.map((shop, i) => (
                        <div key={i} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                           <div>
                              <p className="font-black text-slate-800 dark:text-white">{shop.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{shop.location} · {shop.dist} away</p>
                           </div>
                           <ChevronRight className="w-5 h-5 text-slate-300" />
                        </div>
                     ))}
                  </div>
                </div>
             )}

             {activeModal === 'schemes' && (
                <div className="space-y-8">
                   <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Govt Schemes</h2>
                  </div>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                     {[
                       { name: 'PMGKAY', desc: 'Free 5kg grain per person', color: 'border-l-amber-500' },
                       { name: 'Antyodaya (AAY)', desc: '35kg grain for poorest families', color: 'border-l-purple-500' },
                       { name: 'BPL Ration', desc: 'Subsidized grain for families', color: 'border-l-emerald-500' },
                     ].map((s, i) => (
                        <div key={i} className={`p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 border-l-4 ${s.color}`}>
                           <h4 className="font-black text-slate-900 dark:text-white mb-1">{s.name}</h4>
                           <p className="text-sm font-medium text-slate-500">{s.desc}</p>
                        </div>
                     ))}
                  </div>
                </div>
             )}

             {activeModal === 'helpline' && (
                <div className="space-y-8 text-center">
                   <div className="w-20 h-20 bg-india-green/10 text-india-green rounded-[2rem] flex items-center justify-center mx-auto">
                      <Phone className="w-10 h-10" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">PDS Helpdesk</h2>
                     <p className="text-sm text-slate-500 font-medium">Available Monday–Saturday, 9AM to 6PM</p>
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                      <a href="tel:181" className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between hover:scale-[1.02] transition-transform">
                         <span className="font-black text-slate-800 dark:text-white">State Helpline</span>
                         <span className="text-xl font-black text-primary">181</span>
                      </a>
                      <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                         <span className="font-black text-slate-800 dark:text-white">WhatsApp</span>
                         <span className="text-xl font-black text-emerald-600">+91 98XX-XX-XX</span>
                      </div>
                   </div>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
