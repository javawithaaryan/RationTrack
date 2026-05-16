import { CheckCircle, AlertCircle, XCircle, Ban, Power } from 'lucide-react';
import { Dealer } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';

interface DealerTrustScoreProps {
  dealers: Record<string, Dealer>;
}

export function DealerTrustScore({ dealers }: DealerTrustScoreProps) {
  const { dispatch, showToast } = useAppStore();
  
  const sortedDealers = Object.values(dealers).sort(
    (a, b) => b.trustScore - a.trustScore
  );

  const getTrustBadge = (dealer: Dealer) => {
    if (dealer.isSuspended) {
      return {
        icon: <Ban size={16} className="text-gray-600" />,
        label: 'Suspended',
        color: 'bg-gray-100 text-gray-700 border-gray-300',
      };
    }
    const score = dealer.trustScore;
    if (score >= 85) {
      return {
        icon: <CheckCircle size={16} className="text-emerald-600" />,
        label: 'Verified',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    } else if (score >= 60) {
      return {
        icon: <AlertCircle size={16} className="text-amber-600" />,
        label: 'Monitor',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    } else {
      return {
        icon: <XCircle size={16} className="text-red-600" />,
        label: 'At Risk',
        color: 'bg-red-50 text-red-700 border-red-200',
      };
    }
  };

  const handleToggleSuspension = (dealer: Dealer) => {
    if (!dealer.isSuspended) {
      const confirmed = window.confirm(`Disable ${dealer.name}? They will not be able to log distributions.`);
      if (!confirmed) return;
    }
    
    dispatch({ type: 'TOGGLE_DEALER_SUSPENSION', payload: { dealerId: dealer.id } });
    showToast(dealer.isSuspended ? `${dealer.name} re-enabled` : `${dealer.name} suspended`, dealer.isSuspended ? 'success' : 'error');
  };

  return (
    <div className="space-y-3">
      {sortedDealers.map((dealer) => {
        const badge = getTrustBadge(dealer);
        const isSuspended = dealer.isSuspended;
        
        return (
          <div 
            key={dealer.id} 
            className={`flex items-center justify-between p-3 rounded-xl transition-all border ${
              isSuspended ? 'bg-gray-100 border-gray-200 opacity-75' : 'bg-gray-50 border-transparent hover:bg-gray-100'
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${isSuspended ? 'text-gray-500' : 'text-gray-900'}`}>{dealer.name}</p>
              <p className="text-xs text-gray-500 truncate">{dealer.owner} · {dealer.district}</p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 ml-2">
              <div className="text-right hidden xs:block">
                <p className={`text-sm font-bold ${
                  isSuspended ? 'text-gray-400' :
                  dealer.trustScore >= 85 ? 'text-emerald-600' :
                  dealer.trustScore >= 60 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {dealer.trustScore}%
                </p>
                <div className="w-16 h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isSuspended ? 'bg-gray-400' :
                      dealer.trustScore >= 85 ? 'bg-emerald-500' :
                      dealer.trustScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${dealer.trustScore}%` }}
                  />
                </div>
              </div>

              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] sm:text-xs font-medium ${badge.color}`}>
                {badge.icon}
                <span className="hidden sm:inline">{badge.label}</span>
              </div>

              <button
                onClick={() => handleToggleSuspension(dealer)}
                className={`p-1.5 rounded-lg transition-colors border ${
                  isSuspended 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' 
                    : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                }`}
                title={isSuspended ? 'Re-enable Dealer' : 'Disable Dealer'}
              >
                {isSuspended ? <Power size={14} /> : <Ban size={14} />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
