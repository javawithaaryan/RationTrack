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
  HelpCircle,
  X,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { StatusBadge } from './StatusBadge';
import { mockBeneficiaries, mockDealers, findBeneficiaryByAadhaar, findBeneficiaryByName } from '@/lib/mockData';
import { t as translate, type Language } from '@/lib/translations';

type ModalType = 'shop' | 'schemes' | 'helpline' | null;

export function CitizenPortal() {
  const { state, dispatch, showToast } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [complaintForm, setComplaintForm] = useState({ date: '', description: '' });
  const [submittedComplaintId, setSubmittedComplaintId] = useState<string | null>(null);

  // Quick Action Modal states
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [pincodeQuery, setPincodeQuery] = useState('');
  const [shopResults, setShopResults] = useState<{name: string, location: string, dist: string, open: boolean, owner: string}[] | null>(null);

  const lang = state.language;
  const tt = (key: string) => translate(lang as Language, key as any);

  // Search beneficiary
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
    const complaintId = `CMP-2026-${String(state.complaints.length + 100 + 1).padStart(3, '0')}`;
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
    showToast('Complaint Filed', 'error');
  };

  const toggleLanguage = () => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang === 'en' ? 'hi' : 'en' });
  };

  const mockShopData = [
    { pincode: '452001', name: 'Sharma Ration Shop', location: 'Indore', dist: '0.8km', open: true, owner: 'Dealer: Rajesh Sharma' },
    { pincode: '452002', name: 'Verma General Store', location: 'Indore', dist: '1.4km', open: true, owner: 'Dealer: Priya Verma' },
    { pincode: '462001', name: 'Central Supplies', location: 'Bhopal', dist: '1.2km', open: true, owner: 'Dealer: Amit Patel' },
    { pincode: '462022', name: 'Bhopal Ration Center', location: 'Bhopal', dist: '0.6km', open: false, owner: 'Dealer: Sunita Joshi' },
    { pincode: '456001', name: 'Grain Hub Ujjain', location: 'Ujjain', dist: '0.5km', open: false, owner: 'Dealer: Mohan Gupta' },
    { pincode: '456010', name: 'Ujjain Ration Point', location: 'Ujjain', dist: '1.8km', open: true, owner: 'Dealer: Geeta Sharma' },
    { pincode: '474001', name: 'Pure Foods Gwalior', location: 'Gwalior', dist: '0.9km', open: true, owner: 'Dealer: Ramesh Tiwari' },
    { pincode: '482001', name: 'Jabalpur Hub', location: 'Jabalpur', dist: '1.1km', open: true, owner: 'Dealer: Sunita Yadav' },
  ];

  const handleFindShop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincodeQuery || pincodeQuery.length < 3) {
      setShopResults([]);
      return;
    }
    const results = mockShopData.filter(shop => shop.pincode.startsWith(pincodeQuery.substring(0, 3)));
    setShopResults(results);
  };

  const handleCheckEntitlement = () => {
    document.getElementById('entitlement-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {tt('citizenPortal')} {lang === 'hi' ? '' : '/ नागरिक पोर्टल'}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">{tt('citizenSubtitle')}</p>
        </div>
        <button
          onClick={toggleLanguage}
          className="px-5 py-2.5 rounded-xl font-bold text-white transition-all shadow-md"
          style={{ backgroundColor: '#E8620A' }}
        >
          {lang === 'en' ? 'हिन्दी' : 'English'}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{tt('searchLabel')}</h2>
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tt('searchPlaceholder')}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 text-lg"
            style={{ '--tw-ring-color': '#E8620A' } as any}
          />
        </div>
        {!searchQuery && (
          <p className="text-gray-400 text-sm mt-3">{tt('searchPrompt')}</p>
        )}
        {searchQuery && !matchedBeneficiary && searchQuery.length >= 3 && (
          <p className="text-amber-600 text-sm mt-3">{tt('noTransactions')}</p>
        )}
      </div>

      {/* Beneficiary Card */}
      {matchedBeneficiary && (
        <div className="bg-white rounded-2xl p-6 shadow-md border-l-4 animate-fade-in-up" style={{ borderLeftColor: '#E8620A' }}>
          <h2 className="text-xl font-bold text-gray-900">{matchedBeneficiary.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
            <div>
              <p className="text-gray-500">{tt('rationCard')}</p>
              <p className="font-semibold text-gray-900">{matchedBeneficiary.rationCard}</p>
            </div>
            <div>
              <p className="text-gray-500">{tt('district')}</p>
              <p className="font-semibold text-gray-900">{matchedBeneficiary.district} · {matchedDealer?.name}</p>
            </div>
            <div>
              <p className="text-gray-500">{tt('category')}</p>
              <p className="font-semibold text-gray-900">{matchedBeneficiary.category}</p>
            </div>
            <div>
              <p className="text-gray-500">Aadhaar</p>
              <p className="font-semibold text-gray-900">XXXX-XXXX-{matchedBeneficiary.aadhaarLast4}</p>
            </div>
          </div>
        </div>
      )}

      {matchedBeneficiary && (
        <>
          {/* Entitlement Card */}
          <div id="entitlement-section" className="rounded-2xl p-6 shadow-md animate-fade-in-up" style={{ backgroundColor: '#FDF0E8' }}>
            <h3 className="font-bold text-gray-900 mb-4">
              {tt('march2026')} · {tt('entitlement')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { key: 'wheat', icon: '🌾', amount: matchedBeneficiary.entitlement.wheat, unit: tt('kg'), collected: currentMonthCollections.wheat },
                { key: 'rice', icon: '🍚', amount: matchedBeneficiary.entitlement.rice, unit: tt('kg'), collected: currentMonthCollections.rice },
                { key: 'sugar', icon: '🍬', amount: matchedBeneficiary.entitlement.sugar, unit: tt('kg'), collected: currentMonthCollections.sugar },
                { key: 'kerosene', icon: '🛢️', amount: matchedBeneficiary.entitlement.kerosene, unit: tt('litres'), collected: currentMonthCollections.kerosene },
                { key: 'dal', icon: '🍛', amount: matchedBeneficiary.entitlement.dal, unit: tt('kg'), collected: currentMonthCollections.dal },
              ].map((item) => (
                <div key={item.key} className="bg-white rounded-xl p-4 text-center">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="font-semibold text-gray-900">{tt(item.key as any)}</p>
                  <p className="text-sm text-gray-600">{item.amount} {item.unit}</p>
                  <div className="mt-2">
                    {item.collected ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#E8F5E4', color: '#128807' }}>
                        🟢 {tt('collected')}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                        🟡 {tt('pending')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SMS Bubble */}
          {lastSMS && (
            <div className="bg-white rounded-2xl p-6 shadow-md animate-fade-in-up">
              <h3 className="font-semibold text-gray-900 mb-3">{tt('lastSMS')}</h3>
              <div className="bg-gray-100 rounded-2xl p-4 max-w-md relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: '#E8620A' }}>RT</div>
                  <span className="text-xs text-gray-500">
                    RationTrack · {lastSMS.timestamp.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {lastSMS.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">
                  "{lastSMS.message}"
                </p>
              </div>
            </div>
          )}

          {/* Distribution History */}
          {beneficiaryTransactions.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md animate-fade-in-up">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {tt('distributionHistory')} ({beneficiaryTransactions.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Grain</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Shop</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-600">{lang === 'hi' ? 'स्थिति' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beneficiaryTransactions.map((txn) => {
                      const currentStatus = state.verificationStatuses[txn.id] || txn.status;
                      const isReported = currentStatus === 'reported';
                      return (
                        <tr key={txn.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isReported ? 'bg-[#FEF2F2]' : ''}`}>
                          <td className="px-4 py-3 text-gray-700">{new Date(txn.timestamp).toLocaleDateString()}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{txn.grainType}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{txn.dealerName}</td>
                          <td className="px-4 py-3 text-center">
                            <StatusBadge status={currentStatus} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Complaint Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} style={{ color: '#EF4444' }} />
                {tt('iDidNotReceive')}
              </h3>

              {submittedComplaintId ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center animate-fade-in-up">
                  <CheckCircle size={40} className="mx-auto mb-3 text-green-600" />
                  <p className="font-bold text-green-900 mb-1">{tt('complaintFiled')}</p>
                  <p className="text-sm text-green-700">{tt('referenceId')}: <span className="font-mono font-bold">{submittedComplaintId}</span></p>
                  <button
                    onClick={() => setSubmittedComplaintId(null)}
                    className="mt-4 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200"
                  >
                    File Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleComplaintSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{tt('complaintDate')}</label>
                    <input
                      type="date"
                      value={complaintForm.date}
                      onChange={(e) => setComplaintForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{tt('complaintDesc')}</label>
                    <textarea
                      value={complaintForm.description}
                      onChange={(e) => setComplaintForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={lang === 'hi' ? 'अपनी शिकायत विस्तार से लिखें...' : 'Describe what happened...'}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-xl font-semibold transition-colors"
                  >
                    {tt('submit')}
                  </button>
                </form>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {tt('complaintStatus')} ({myComplaints.length})
              </h3>
              {myComplaints.length === 0 ? (
                <div className="text-center py-8">
                  <FileText size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-400 text-sm">{lang === 'hi' ? 'कोई शिकायत नहीं मिली' : 'No complaints filed'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myComplaints.map((complaint) => (
                    <div key={complaint.id} className="border border-gray-200 rounded-xl p-4 animate-fade-in-up">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-gray-900 text-sm">{complaint.id}</p>
                        <StatusBadge status={complaint.status === 'open' ? 'reported' : complaint.status === 'investigating' ? 'pending' : 'verified'} />
                      </div>
                      <p className="text-sm text-gray-600 italic mb-3">"{complaint.description}"</p>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`flex items-center gap-1 ${complaint.status === 'open' || complaint.status === 'investigating' || complaint.status === 'resolved' ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
                          🔴 {tt('open')}
                        </div>
                        <div className={`flex-1 h-0.5 ${complaint.status === 'investigating' || complaint.status === 'resolved' ? 'bg-amber-600' : 'bg-gray-200'}`} />
                        <div className={`flex items-center gap-1 ${complaint.status === 'investigating' || complaint.status === 'resolved' ? 'text-amber-600 font-bold' : 'text-gray-400'}`}>
                          🟠 {tt('investigating')}
                        </div>
                        <div className={`flex-1 h-0.5 ${complaint.status === 'resolved' ? 'bg-emerald-600' : 'bg-gray-200'}`} />
                        <div className={`flex items-center gap-1 ${complaint.status === 'resolved' ? 'text-emerald-600 font-bold' : 'text-gray-400'}`}>
                          🟢 {tt('resolved')}
                        </div>
                      </div>

                      {complaint.remarks && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Admin Response</p>
                          <p className="text-xs text-blue-900 font-medium">{complaint.remarks}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <MapPin size={20} />, label: tt('findShop'), color: '#E8620A', onClick: () => setActiveModal('shop') },
          { icon: <ShoppingBag size={20} />, label: tt('checkEntitlement'), color: '#128807', onClick: handleCheckEntitlement },
          { icon: <FileText size={20} />, label: tt('activeSchemes'), color: '#1E3A5F', onClick: () => setActiveModal('schemes') },
          { icon: <Phone size={20} />, label: `${tt('callHelpline')}: ${tt('helplineNumber')}`, color: '#3b82f6', onClick: () => setActiveModal('helpline') },
        ].map((link, idx) => (
          <button
            key={idx}
            onClick={link.onClick}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all text-left flex items-start gap-3"
          >
            <div className="p-2 rounded-lg text-white" style={{ backgroundColor: link.color }}>
              {link.icon}
            </div>
            <span className="text-sm font-medium text-gray-700 leading-tight">{link.label}</span>
          </button>
        ))}
      </div>

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-xl my-8">
            <button
              onClick={() => { setActiveModal(null); setShopResults(null); setPincodeQuery(''); }}
              className="absolute right-4 top-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>

            {activeModal === 'shop' && (
              <div className="space-y-4 pt-2">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="text-orange-600" /> Find My Shop
                </h2>
                <form onSubmit={handleFindShop} className="flex gap-2">
                  <input
                    type="text"
                    value={pincodeQuery}
                    onChange={(e) => setPincodeQuery(e.target.value)}
                    placeholder="Enter 6-digit Pincode"
                    className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                    maxLength={6}
                  />
                  <button type="submit" className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-colors">
                    Search
                  </button>
                </form>

                {shopResults !== null && (
                  <div className="mt-4 space-y-3">
                    {shopResults.length === 0 ? (
                      <p className="text-gray-500 text-sm">No shops found for this pincode.</p>
                    ) : (
                      shopResults.map((shop, i) => (
                        <div key={i} className="border rounded-xl p-4 bg-gray-50 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-gray-900">{shop.name}, {shop.location}</p>
                            <p className="text-sm text-gray-600">{shop.dist} away · {shop.owner}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${shop.open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {shop.open ? 'Open today' : 'Closed today'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {activeModal === 'schemes' && (
              <div className="space-y-5 pt-2">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="text-blue-900" /> Active Schemes
                </h2>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div className="border border-blue-100 bg-blue-50 rounded-xl p-4">
                    <h3 className="font-bold text-blue-900 mb-2">PMGKAY (Pradhan Mantri Garib Kalyan Anna Yojana)</h3>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p><strong>Free:</strong> 5kg grain per person per month</p>
                      <p><strong>Who qualifies:</strong> All NFSA cardholders</p>
                      <p><strong>How to apply:</strong> Automatic — no application needed</p>
                    </div>
                  </div>

                  <div className="border border-purple-100 bg-purple-50 rounded-xl p-4">
                    <h3 className="font-bold text-purple-900 mb-2">Antyodaya Anna Yojana (AAY)</h3>
                    <div className="space-y-1 text-sm text-purple-800">
                      <p><strong>Entitlement:</strong> 35kg grain per family/month at ₹2/kg wheat, ₹3/kg rice</p>
                      <p><strong>Who qualifies:</strong> Poorest of poor families, no regular income</p>
                      <p><strong>How to apply:</strong> Apply at district collector office with income certificate</p>
                    </div>
                  </div>

                  <div className="border border-green-100 bg-green-50 rounded-xl p-4">
                    <h3 className="font-bold text-green-900 mb-2">BPL (Below Poverty Line) Scheme</h3>
                    <div className="space-y-1 text-sm text-green-800">
                      <p><strong>Entitlement:</strong> 25kg grain per family/month at subsidized rates</p>
                      <p><strong>Who qualifies:</strong> Annual family income below ₹1.2 lakh</p>
                      <p><strong>How to apply:</strong> Apply at gram panchayat or ward office</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'helpline' && (
              <div className="space-y-5 pt-2 text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Phone size={28} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">PDS Helpline Numbers</h2>
                
                <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3">
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm">
                    <span className="font-medium text-gray-700">National PDS Helpline</span>
                    <a href="tel:1800111222" className="font-bold text-blue-600">1800-XXX-XXXX</a>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm">
                    <span className="font-medium text-gray-700">MP State Helpline</span>
                    <a href="tel:18002334567" className="font-bold text-blue-600">1800-233-4567</a>
                  </div>
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm">
                    <span className="font-medium text-gray-700">WhatsApp Support</span>
                    <span className="font-bold text-green-600">+91-98XXX-XXXXX</span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Working hours: Monday–Saturday 9AM–6PM
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
