'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Clock, 
  Wifi, 
  Battery, 
  Signal, 
  LogOut, 
  Minus, 
  Plus, 
  Wand2, 
  AlertCircle, 
  CheckCircle, 
  Activity, 
  Package, 
  ShieldCheck, 
  Smartphone,
  ChevronRight,
  User,
  Hash
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { StatusBadge } from './StatusBadge';
import {
  findBeneficiaryByAadhaar,
  findBeneficiaryByName,
  grainOptions,
  type Transaction,
} from '@/lib/mockData';
import { calculateFraudScore } from '@/lib/fraudDetection';

export function DealerPanel() {
  const { state, dispatch, showToast } = useAppStore();

  // ----- Login State -----
  const [loggedInDealerId, setLoggedInDealerId] = useState<string | null>(null);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // ----- Panel State -----
  const [aadhaarLast4, setAadhaarLast4] = useState('');
  const [matchedName, setMatchedName] = useState('');
  
  // Maps grain type to custom quantity. Missing key means 0 / unselected.
  const [grainQuantities, setGrainQuantities] = useState<Record<string, number>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [fullMessage, setFullMessage] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [phoneBrighten, setPhoneBrighten] = useState(false);
  const [lastTransactionId, setLastTransactionId] = useState<string | null>(null);
  const [lastBeneficiaryId, setLastBeneficiaryId] = useState('');
  const [lastBeneficiaryName, setLastBeneficiaryName] = useState('');
  const typingInterval = useRef<NodeJS.Timeout | null>(null);

  const currentDealer = loggedInDealerId ? state.dealers[loggedInDealerId] : null;

  // Count today's transactions for this dealer
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTransactions = state.transactions.filter(
    t => t.dealerId === loggedInDealerId && t.timestamp >= todayStart.getTime()
  );
  const monthlyCount = state.transactions.filter(
    t => t.dealerId === loggedInDealerId &&
    new Date(t.timestamp).getMonth() === new Date().getMonth() &&
    new Date(t.timestamp).getFullYear() === new Date().getFullYear()
  ).length;

  // Auto-fill beneficiary name on aadhaar match
  useEffect(() => {
    if (aadhaarLast4.length === 4) {
      const found = findBeneficiaryByAadhaar(aadhaarLast4);
      if (found) {
        setMatchedName(found.name);
      } else {
        setMatchedName('');
      }
    } else {
      setMatchedName('');
    }
  }, [aadhaarLast4]);

  // Typing animation
  useEffect(() => {
    if (fullMessage && typingIndex < fullMessage.length) {
      typingInterval.current = setTimeout(() => {
        setPhoneMessage(fullMessage.slice(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      }, 40);
      return () => {
        if (typingInterval.current) clearTimeout(typingInterval.current);
      };
    } else if (fullMessage && typingIndex >= fullMessage.length) {
      setTimeout(() => setShowButtons(true), 300);
    }
  }, [typingIndex, fullMessage]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const credentials: Record<string, string> = {
      'DLR-001': 'D001',
      'DLR-002': 'D002',
      'DLR-003': 'D003'
    };
    const inputId = loginId.trim().toUpperCase();
    const dealerId = credentials[inputId] || (state.dealers[inputId] ? inputId : null);

    if (dealerId && loginPassword === 'pass123') {
      setLoggedInDealerId(dealerId);
      showToast('Welcome back, Agent', 'success');
      setLoginId('');
      setLoginPassword('');
    } else {
      showToast('Invalid credentials', 'error');
    }
  };

  const handleLogout = () => {
    setLoggedInDealerId(null);
    setAadhaarLast4('');
    setMatchedName('');
    setGrainQuantities({});
    setPhoneMessage('');
    setFullMessage('');
    setShowButtons(false);
  };

  // ----- Quantity Input Handlers -----
  const updateQuantity = (type: string, value: string | number) => {
    let numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue) || numValue < 0) numValue = 0;
    
    setGrainQuantities(prev => {
      const next = { ...prev as Record<string, number>, [type]: numValue };
      if (numValue === 0) {
        delete next[type];
      }
      return next;
    });
  };

  const adjustQuantity = (type: string, delta: number) => {
    const current = (grainQuantities as Record<string, number>)[type] || 0;
    const next = Math.max(0, current + delta);
    updateQuantity(type, next);
  };

  const fillDefaultEntitlement = () => {
    const defaultQtys: Record<string, number> = {};
    grainOptions.forEach(g => {
      defaultQtys[g.type] = g.amount;
    });
    setGrainQuantities(defaultQtys);
  };

  const countSelectedItems = Object.keys(grainQuantities).length;
  const totalQuantity = Object.values(grainQuantities).reduce((acc, val) => (acc as number) + (val as number), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedName || totalQuantity <= 0 || !currentDealer) return;
    
    if (currentDealer.isSuspended) {
      showToast('Your account is suspended. Contact district office.', 'error');
      return;
    }

    setIsSubmitting(true);

    const bene = findBeneficiaryByAadhaar(aadhaarLast4) || findBeneficiaryByName(matchedName);
    if (!bene) {
      setIsSubmitting(false);
      return;
    }

    const selectedItems = grainOptions
      .filter(g => (grainQuantities as Record<string, number>)[g.type] > 0)
      .map(g => ({
        type: g.type,
        amount: (grainQuantities as Record<string, number>)[g.type] || 0,
        unit: g.unit
      }));

    const grainDesc = selectedItems.map(g => `${g.amount}${g.unit} ${g.type.toLowerCase()}`).join(' + ');

    // Create transaction
    const txnId = `TXN${Date.now()}`;
    const newTransaction: Transaction = {
      id: txnId,
      beneficiaryId: bene.id,
      beneficiaryName: bene.name,
      grainType: selectedItems.map(g => g.type).join(', '),
      quantity: totalQuantity,
      unit: 'kg', // simplifying unit sum for transaction record
      timestamp: Date.now(),
      dealerId: currentDealer.id,
      dealerName: currentDealer.name,
      district: currentDealer.district,
      status: 'pending',
    };

    // Run fraud check
    const fraudResult = calculateFraudScore(newTransaction, state.transactions, currentDealer);

    if (fraudResult.total > 0) {
      dispatch({
        type: 'ADD_FRAUD_ALERT',
        payload: {
          id: `FA-${Date.now()}`,
          type: fraudResult.total >= 40 ? 'duplicate' : 'anomaly',
          severity: fraudResult.riskLevel as 'low' | 'medium' | 'high' | 'critical',
          description: fraudResult.total >= 40 ? 'Double Collection Detected' : 'Anomaly Detected',
          dealerId: currentDealer.id,
          dealerName: currentDealer.name,
          beneficiaryId: bene.id,
          beneficiaryName: bene.name,
          timestamp: new Date(),
          district: currentDealer.district,
          fraudScore: fraudResult.total,
          reasons: fraudResult.reasons,
        },
      });

      if (fraudResult.total >= 40) {
        dispatch({ type: 'UPDATE_DEALER_TRUST_SCORE', payload: { dealerId: currentDealer.id, delta: -8 } });
        showToast('Fraud Detected', 'error');
      }

      dispatch({ type: 'PULSE_DISTRICT', payload: currentDealer.district });
      setTimeout(() => dispatch({ type: 'PULSE_DISTRICT', payload: null }), 3000);
    }

    newTransaction.fraudScore = fraudResult.total;
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });

    // Prepare SMS Message
    const msg = `RationTrack: ${grainDesc} collected at ${currentDealer.name}. NOT YOU? Reply REPORT`;

    setLastTransactionId(txnId);
    setLastBeneficiaryId(bene.id);
    setLastBeneficiaryName(bene.name);

    setPhoneBrighten(true);
    setTimeout(() => setPhoneBrighten(false), 600);
    setPhoneMessage('');
    setTypingIndex(0);
    setShowButtons(false);
    setFullMessage(msg);

    dispatch({
      type: 'ADD_SMS',
      payload: {
        id: `SMS-${Date.now()}`,
        from: 'RationTrack',
        message: msg,
        timestamp: new Date(),
        type: 'incoming',
        beneficiaryId: bene.id,
        transactionId: txnId,
      },
    });

    showToast('Success: SMS Notification Dispatched', 'info');

    // Reset form
    setAadhaarLast4('');
    setMatchedName('');
    setGrainQuantities({});
    setIsSubmitting(false);
  };

  const handleReportFraud = () => {
    if (!lastTransactionId || !currentDealer) return;
    dispatch({
      type: 'REPORT_FRAUD',
      payload: {
        transactionId: lastTransactionId,
        beneficiaryId: lastBeneficiaryId,
        beneficiaryName: lastBeneficiaryName,
        dealerId: currentDealer.id,
        dealerName: currentDealer.name,
        description: `${lastBeneficiaryName} did not collect ration on ${new Date().toLocaleDateString()}`,
      },
    });
    dispatch({ type: 'UPDATE_DEALER_TRUST_SCORE', payload: { dealerId: currentDealer.id, delta: -3 } });
    showToast('Complaint Filed', 'success');
    setShowButtons(false);
  };

  const handleVerify = () => {
    if (!lastTransactionId || !currentDealer) return;
    dispatch({ type: 'VERIFY_TRANSACTION', payload: { transactionId: lastTransactionId } });
    dispatch({ type: 'UPDATE_DEALER_TRUST_SCORE', payload: { dealerId: currentDealer.id, delta: 0.5 } });
    showToast('Receipt Confirmed', 'success');
    setShowButtons(false);
  };

  // Login Screen Render
  if (!loggedInDealerId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 animate-fade-in">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -ml-64 -mt-64" />
           <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-india-green/5 rounded-full blur-3xl -mr-48 -mb-48" />
        </div>

        <div className="glass-panel max-w-md w-full p-10 rounded-[3rem] shadow-2xl relative">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/5">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dealer Access</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">MP PDS Secure Environment</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Dealer ID</label>
              <div className="relative group">
                 <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                 <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="e.g. DLR-001"
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white focus:ring-4 focus:ring-primary/10 transition-all"
                    required
                 />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secure Pin</label>
              <div className="relative group">
                 <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                 <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••"
                    className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white focus:ring-4 focus:ring-primary/10 transition-all"
                    required
                 />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Initialize Session
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed">
             Test Acc: DLR-001 <span className="mx-2">|</span> Pin: pass123
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 p-6 md:p-10 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-xl flex items-center justify-center">
              <Activity className="w-8 h-8 text-primary" />
           </div>
           <div>
              <div className="flex items-center gap-3">
                 <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dealer Workspace</h1>
                 <span className="px-2 py-1 bg-india-green/10 text-india-green text-[9px] font-black uppercase tracking-widest rounded-md border border-india-green/20">Online</span>
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] mt-1">
                Agent: {currentDealer?.owner} · <span className="text-slate-400">{currentDealer?.name}</span>
              </p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:block text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Trust Rating</p>
              <div className="flex items-center gap-2 justify-end">
                 <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${currentDealer?.trustScore}%` }} />
                 </div>
                 <span className="text-sm font-black text-slate-900 dark:text-white">{currentDealer?.trustScore}%</span>
              </div>
           </div>
           <button
             onClick={handleLogout}
             className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm hover:shadow-md hover:bg-red-50 hover:text-red-600 transition-all flex items-center gap-2"
           >
             <LogOut className="w-4 h-4" /> End Session
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* LEFT — Distribution Panel */}
        <div className="xl:col-span-8 space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Today Entries', value: todayTransactions.length, icon: <Activity className="text-primary" /> },
                { label: 'Monthly Families', value: `${monthlyCount}/${currentDealer?.monthlyQuota}`, icon: <User className="text-blue-600" /> },
                { label: 'Verification Rate', value: '94.2%', icon: <CheckCircle className="text-india-green" /> },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6 rounded-[2rem] flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                      {stat.icon}
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                   </div>
                </div>
              ))}
           </div>

           <div className="glass-card p-10 rounded-[3rem] space-y-10">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">New <span className="text-gradient">Distribution</span></h3>
                 <button onClick={fillDefaultEntitlement} className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-colors">
                    <Wand2 className="w-3.5 h-3.5" /> Auto-fill Defaults
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Citizen Aadhaar (Last 4)</label>
                       <div className="relative group">
                          <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                          <input
                             type="text"
                             maxLength={4}
                             value={aadhaarLast4}
                             onChange={(e) => setAadhaarLast4(e.target.value.replace(/\D/g, ''))}
                             placeholder="e.g. 0001"
                             className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white text-xl tracking-[0.2em] focus:ring-4 focus:ring-primary/10 transition-all"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Verified Name</label>
                       <div className="relative group">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                          <input
                             type="text"
                             value={matchedName}
                             readOnly
                             placeholder="Awaiting Aadhaar Input..."
                             className={`w-full pl-14 pr-6 py-5 rounded-2xl border-none font-bold transition-all ${
                                matchedName ? 'bg-india-green/5 text-india-green text-xl' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 text-sm'
                             }`}
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="flex items-center gap-2">
                       <Package className="w-5 h-5 text-slate-400" />
                       <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Grain Quantities</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                       {grainOptions.map((grain) => {
                          const isActive = (grainQuantities[grain.type] || 0) > 0;
                          return (
                            <div key={grain.type} className={`p-6 rounded-[2rem] border transition-all ${
                               isActive ? 'bg-white dark:bg-slate-800 border-primary shadow-xl shadow-primary/5' : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'
                            }`}>
                               <div className="flex items-center justify-between mb-6">
                                  <span className="text-3xl">{grain.icon}</span>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{grain.type}</span>
                               </div>
                               <div className="flex items-center justify-between gap-4">
                                  <button type="button" onClick={() => adjustQuantity(grain.type, -0.5)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center">
                                     <Minus className="w-5 h-5" />
                                  </button>
                                  <div className="flex-1 text-center">
                                     <span className="text-2xl font-black text-slate-900 dark:text-white">{grainQuantities[grain.type] || 0}</span>
                                     <span className="text-[10px] font-black text-slate-400 uppercase ml-1">{grain.unit}</span>
                                  </div>
                                  <button type="button" onClick={() => adjustQuantity(grain.type, 0.5)} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-india-green/10 hover:text-india-green transition-colors flex items-center justify-center">
                                     <Plus className="w-5 h-5" />
                                  </button>
                               </div>
                            </div>
                          );
                       })}
                    </div>
                 </div>

                 <button
                    type="submit"
                    disabled={!matchedName || totalQuantity <= 0 || isSubmitting}
                    className="w-full py-6 bg-india-green text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-india-green/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed"
                 >
                    <Send className="w-6 h-6" /> Complete Distribution {totalQuantity > 0 && `(${totalQuantity}kg Total)`}
                 </button>
              </form>
           </div>
           
           {/* Recent Log Table */}
           <div className="glass-card rounded-[3rem] overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                 <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" /> Distribution Log
                 </h3>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead>
                       <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-left">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Beneficiary</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantum</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                       {todayTransactions.slice(0, 5).map((txn) => (
                          <tr key={txn.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                             <td className="px-8 py-6">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                             </td>
                             <td className="px-8 py-6">
                                <p className="text-sm font-black text-slate-900 dark:text-white">{txn.beneficiaryName}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ID: {txn.beneficiaryId}</p>
                             </td>
                             <td className="px-8 py-6">
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{txn.grainType}</p>
                                <p className="text-xs font-black text-primary">{txn.quantity}{txn.unit}</p>
                             </td>
                             <td className="px-8 py-6 text-center">
                                <StatusBadge status={state.verificationStatuses[txn.id] || txn.status} />
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* RIGHT — Live Monitor */}
        <div className="xl:col-span-4 space-y-10">
           {/* Phone Simulator */}
           <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-india-green/20 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className={`relative glass-panel rounded-[3.5rem] p-4 bg-slate-950 shadow-2xl transition-all ${phoneBrighten ? 'ring-4 ring-white' : 'ring-1 ring-white/10'}`}>
                 <div className="bg-white rounded-[2.8rem] overflow-hidden flex flex-col" style={{ minHeight: '620px' }}>
                    {/* Phone Status Bar */}
                    <div className="px-8 pt-6 pb-2 flex items-center justify-between text-[10px] text-slate-400 font-bold bg-slate-50">
                       <div className="flex items-center gap-2">
                          <Signal className="w-3 h-3" />
                          <span>PDS-NET</span>
                       </div>
                       <span className="text-slate-900">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       <div className="flex items-center gap-2">
                          <Wifi className="w-3 h-3" />
                          <Battery className="w-4 h-4" />
                       </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                       <div className="px-8 py-4 bg-slate-50 border-b border-slate-100">
                          <h4 className="text-sm font-black text-slate-900 tracking-tight">Citizen Verification</h4>
                       </div>

                       <div className="p-6 flex-1 space-y-6">
                          {phoneMessage ? (
                             <div className="animate-fade-in-up space-y-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-white">RT</div>
                                   <div>
                                      <p className="text-[10px] font-black text-slate-900 uppercase">Government of India</p>
                                      <p className="text-[8px] font-bold text-slate-400">Just now</p>
                                   </div>
                                </div>
                                <div className="ml-11 p-4 rounded-2xl rounded-tl-none bg-slate-100 text-slate-800 text-xs font-bold leading-relaxed border border-slate-200">
                                   {phoneMessage}
                                   {typingIndex < fullMessage.length && <span className="inline-block w-0.5 h-3 bg-primary ml-1 animate-pulse" />}
                                </div>

                                {showButtons && (
                                   <div className="ml-11 flex flex-col gap-2 pt-4">
                                      <button onClick={handleVerify} className="w-full py-4 bg-india-green text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-india-green/20">
                                         Confirm Receipt
                                      </button>
                                      <button onClick={handleReportFraud} className="w-full py-4 bg-white text-red-600 border-2 border-red-100 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-50">
                                         Report Anomaly
                                      </button>
                                   </div>
                                )}
                             </div>
                          ) : (
                             <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-30 py-20">
                                <Smartphone className="w-16 h-16 mb-4 text-slate-300" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                                   Awaiting Distribution Entry to Initiate SMS Handshake
                                </p>
                             </div>
                          )}
                       </div>
                    </div>
                    
                    {/* Home Bar */}
                    <div className="h-1.5 w-32 bg-slate-200 rounded-full mx-auto mb-3" />
                 </div>
              </div>
           </div>

           {/* Stock Monitor */}
           <div className="glass-card p-8 rounded-[3rem] space-y-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                 <Package className="w-5 h-5 text-orange-500" /> Inventory Health
              </h3>
              <div className="space-y-5">
                 {[
                   { label: 'Wheat', value: '450kg', progress: 75, color: 'bg-amber-500' },
                   { label: 'Rice', value: '210kg', progress: 42, color: 'bg-slate-400' },
                   { label: 'Sugar', value: '80kg', progress: 85, color: 'bg-pink-500' },
                   { label: 'Kerosene', value: '120L', progress: 30, color: 'bg-blue-500' },
                 ].map((stock, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">{stock.label}</span>
                          <span className="text-slate-900 dark:text-slate-200">{stock.value}</span>
                       </div>
                       <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${stock.color} rounded-full`} style={{ width: `${stock.progress}%` }} />
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors flex items-center justify-center gap-2">
                 Request Stock Replenishment <ChevronRight className="w-3 h-3" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
