import { Transaction, FraudAlert, Dealer } from './mockData';

export interface FraudScore {
  total: number;          // 0-100
  reasons: string[];      // why it was flagged
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface RiskScore {
  dealerId: string;
  score: number;
  riskLevel: 'safe' | 'suspicious' | 'high';
  reasons: string[];
}

// Helper: check if two timestamps are in the same month
function isSameMonth(ts1: number, ts2: number): boolean {
  const d1 = new Date(ts1);
  const d2 = new Date(ts2);
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

// Helper: check if timestamp is today
function isToday(ts: number): boolean {
  const d = new Date(ts);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

// Helper: format time from timestamp
function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Calculate fraud score for a new transaction
 */
export const calculateFraudScore = (
  newTransaction: Transaction,
  allTransactions: Transaction[],
  dealer: Dealer
): FraudScore => {
  let score = 0;
  const reasons: string[] = [];

  // Rule 1 — Double collection (same beneficiary, same month)
  const sameMonthSameBene = allTransactions.filter(t =>
    t.beneficiaryId === newTransaction.beneficiaryId &&
    isSameMonth(t.timestamp, newTransaction.timestamp) &&
    t.id !== newTransaction.id
  );
  if (sameMonthSameBene.length >= 1) {
    score += 40;
    reasons.push(`${newTransaction.beneficiaryName} already received ration this month`);
  }

  // Rule 2 — Speed fraud (too many entries in 30 min)
  const last30Min = allTransactions.filter(t =>
    t.dealerId === newTransaction.dealerId &&
    Math.abs(newTransaction.timestamp - t.timestamp) < 30 * 60 * 1000 &&
    t.id !== newTransaction.id
  );
  if (last30Min.length >= 5) {
    score += 30;
    reasons.push(`${last30Min.length} distributions logged in under 30 minutes`);
  }

  // Rule 3 — Off hours (before 7am or after 9pm or Sunday)
  const hour = new Date(newTransaction.timestamp).getHours();
  const day = new Date(newTransaction.timestamp).getDay();
  if (hour < 7 || hour > 21 || day === 0) {
    score += 20;
    reasons.push(`Logged at ${formatTime(newTransaction.timestamp)} — outside shop hours`);
  }

  // Rule 4 — 100% quota in one day
  const todayCount = allTransactions.filter(t =>
    t.dealerId === newTransaction.dealerId &&
    isToday(t.timestamp) &&
    t.id !== newTransaction.id
  ).length;
  if (todayCount >= dealer.monthlyQuota) {
    score += 30;
    reasons.push(`Entire monthly quota of ${dealer.monthlyQuota} claimed in one day`);
  }

  const capped = Math.min(score, 100);
  return {
    total: capped,
    reasons,
    riskLevel: capped >= 70 ? 'critical' : capped >= 50 ? 'high' : capped >= 25 ? 'medium' : 'low',
  };
};

/**
 * Calculate risk score for a dealer based on transaction patterns
 */
export const calculateDealerRiskScore = (
  transactions: Transaction[],
  dealerId: string
): RiskScore => {
  const dealerTransactions = transactions.filter(t => t.dealerId === dealerId);
  const reasons: string[] = [];
  let riskPoints = 0;

  // Rule 1: Bulk transactions (>30 in 10 minutes)
  const now = Date.now();
  const last10MinTransactions = dealerTransactions.filter(t =>
    now - t.timestamp < 10 * 60 * 1000
  );

  if (last10MinTransactions.length > 30) {
    riskPoints += 40;
    reasons.push(`${last10MinTransactions.length} transactions in 10 minutes`);
  }

  // Rule 2: Off-hours transactions
  const offHoursCount = dealerTransactions.filter(t => {
    const h = new Date(t.timestamp).getHours();
    return h < 7 || h > 21;
  }).length;

  if (offHoursCount > dealerTransactions.length * 0.2) {
    riskPoints += 25;
    reasons.push(`${offHoursCount} off-hours transactions`);
  }

  // Rule 3: Reported transactions
  const reportedCount = dealerTransactions.filter(t => t.status === 'reported').length;
  if (reportedCount > dealerTransactions.length * 0.1) {
    riskPoints += 30;
    reasons.push(`${reportedCount} fraud-reported transactions`);
  }

  // Rule 4: High volume = slightly positive
  if (dealerTransactions.length > 1000) {
    riskPoints -= 10;
  }

  const score = Math.min(100, Math.max(0, riskPoints));
  const riskLevel = score >= 60 ? 'high' : score >= 35 ? 'suspicious' : 'safe';

  return {
    dealerId,
    score,
    riskLevel,
    reasons: reasons.length > 0 ? reasons : ['No anomalies detected'],
  };
};

/**
 * Get recommended actions for a fraud alert
 */
export const getRecommendedActions = (alert: FraudAlert): string[] => {
  switch (alert.type) {
    case 'duplicate':
      return [
        'Verify beneficiary identity immediately',
        'Suspend dealer account pending investigation',
        'Contact beneficiary for confirmation',
      ];
    case 'bulk_transaction':
    case 'speed_fraud':
      return [
        'Review transaction logs for irregularities',
        'Verify dealer capacity and inventory',
        'Monitor for next 48 hours',
      ];
    case 'off_hours':
      return [
        'Investigate reason for off-hours transaction',
        'Request dealer explanation',
        'Monitor account activity',
      ];
    case 'quota_exceeded':
      return [
        'Review monthly distribution plan',
        'Verify stock availability',
        'Issue quota reset notice',
      ];
    case 'anomaly':
      return [
        'Analyze transaction patterns',
        'Cross-verify with beneficiary records',
        'Schedule audit',
      ];
    default:
      return ['Monitor account', 'Review logs', 'Plan follow-up'];
  }
};

/**
 * Calculate district risk level
 */
export const calculateDistrictRiskLevel = (
  fraudCases: number,
  totalTransactions: number
): 'safe' | 'suspicious' | 'high' => {
  const fraudRate = (fraudCases / totalTransactions) * 100;
  if (fraudRate > 5) return 'high';
  if (fraudRate > 2.5) return 'suspicious';
  return 'safe';
};
