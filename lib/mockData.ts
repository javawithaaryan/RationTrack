export interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  district: string;
  aadhaarLast4: string;
  rationCard: string;
  category: 'BPL' | 'AAY' | 'APL';
  dealerId: string;
  entitlement: {
    wheat: number;
    rice: number;
    sugar: number;
    kerosene: number;
    dal: number;
  };
  collectionHistory: CollectionRecord[];
}

export interface CollectionRecord {
  month: string;
  items: {
    wheat: boolean;
    rice: boolean;
    sugar: boolean;
    kerosene: boolean;
    dal: boolean;
  };
  date?: string;
}

export interface Transaction {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  grainType: string;
  quantity: number;
  unit: string;
  timestamp: number;
  dealerId: string;
  dealerName: string;
  district: string;
  status: 'pending' | 'verified' | 'reported';
  fraudScore?: number;
}

export interface Dealer {
  id: string;
  name: string;
  owner: string;
  location: string;
  district: string;
  trustScore: number;
  totalTransactions: number;
  alerts: number;
  lastActivity: Date;
  isVerified: boolean;
  monthlyQuota: number;
  isSuspended?: boolean;
}

export interface District {
  id: string;
  name: string;
  fraudCases: number;
  totalTransactions: number;
  riskLevel: 'safe' | 'suspicious' | 'high';
  topRiskyDealer: string;
  topRiskyDealerName: string;
  lat: number;
  lng: number;
  shops: number;
}

export interface FraudAlert {
  id: string;
  type: 'duplicate' | 'quota_exceeded' | 'off_hours' | 'bulk_transaction' | 'anomaly' | 'speed_fraud';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  dealerId?: string;
  dealerName?: string;
  beneficiaryId?: string;
  beneficiaryName?: string;
  timestamp: Date;
  district?: string;
  fraudScore?: number;
  reasons?: string[];
}

export interface Complaint {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  dealerId: string;
  dealerName: string;
  description: string;
  date: Date;
  status: 'open' | 'investigating' | 'resolved';
  remarks?: string;
  transactionId?: string;
}

export interface SMSMessageType {
  id: string;
  from: string;
  message: string;
  timestamp: Date;
  type: 'incoming' | 'outgoing';
  beneficiaryId?: string;
  transactionId?: string;
}

// ==================== BENEFICIARIES ====================
export const mockBeneficiaries: Record<string, Beneficiary> = {
  B001: {
    id: 'B001',
    name: 'Ramesh Kumar Patel',
    phone: '98XXXXX001',
    pincode: '452001',
    district: 'Indore',
    aadhaarLast4: '0001',
    rationCard: 'MP-IN-0448832',
    category: 'BPL',
    dealerId: 'D001',
    entitlement: { wheat: 10, rice: 5, sugar: 2, kerosene: 5, dal: 3 },
    collectionHistory: [
      { month: 'January 2026', items: { wheat: true, rice: true, sugar: true, kerosene: true , dal: true }, date: '2026-01-15' },
      { month: 'February 2026', items: { wheat: true, rice: true, sugar: false, kerosene: true , dal: true }, date: '2026-02-12' },
    ],
  },
  B002: {
    id: 'B002',
    name: 'Sunita Devi Sharma',
    phone: '98XXXXX002',
    pincode: '462001',
    district: 'Bhopal',
    aadhaarLast4: '0002',
    rationCard: 'MP-BH-0562841',
    category: 'AAY',
    dealerId: 'D002',
    entitlement: { wheat: 10, rice: 5, sugar: 2, kerosene: 5, dal: 3 },
    collectionHistory: [
      { month: 'January 2026', items: { wheat: true, rice: true, sugar: true, kerosene: true , dal: true }, date: '2026-01-18' },
      { month: 'February 2026', items: { wheat: true, rice: true, sugar: true, kerosene: false , dal: true }, date: '2026-02-20' },
    ],
  },
  B003: {
    id: 'B003',
    name: 'Amit Singh Yadav',
    phone: '98XXXXX003',
    pincode: '456001',
    district: 'Ujjain',
    aadhaarLast4: '0003',
    rationCard: 'MP-UJ-0331247',
    category: 'BPL',
    dealerId: 'D003',
    entitlement: { wheat: 10, rice: 5, sugar: 2, kerosene: 5, dal: 3 },
    collectionHistory: [
      { month: 'January 2026', items: { wheat: true, rice: false, sugar: true, kerosene: true , dal: true }, date: '2026-01-10' },
      { month: 'February 2026', items: { wheat: true, rice: true, sugar: true, kerosene: true , dal: true }, date: '2026-02-08' },
    ],
  },
  B004: {
    id: 'B004',
    name: 'Kamla Bai Verma',
    phone: '98XXXXX004',
    pincode: '474001',
    district: 'Gwalior',
    aadhaarLast4: '0004',
    rationCard: 'MP-GW-0789123',
    category: 'BPL',
    dealerId: 'D004',
    entitlement: { wheat: 10, rice: 5, sugar: 2, kerosene: 5, dal: 3 },
    collectionHistory: [
      { month: 'January 2026', items: { wheat: true, rice: true, sugar: true, kerosene: true , dal: true }, date: '2026-01-22' },
      { month: 'February 2026', items: { wheat: true, rice: true, sugar: true, kerosene: true , dal: true }, date: '2026-02-15' },
    ],
  },
  B005: {
    id: 'B005',
    name: 'Mohan Lal Kushwaha',
    phone: '98XXXXX005',
    pincode: '482001',
    district: 'Jabalpur',
    aadhaarLast4: '0005',
    rationCard: 'MP-JB-0456789',
    category: 'AAY',
    dealerId: 'D005',
    entitlement: { wheat: 10, rice: 5, sugar: 2, kerosene: 5, dal: 3 },
    collectionHistory: [
      { month: 'January 2026', items: { wheat: true, rice: true, sugar: false, kerosene: false , dal: true }, date: '2026-01-25' },
      { month: 'February 2026', items: { wheat: true, rice: false, sugar: true, kerosene: true , dal: true }, date: '2026-02-18' },
    ],
  },
  B006: {
    id: 'B006',
    name: 'Geeta Bai Rajput',
    phone: '98XXXXX006',
    pincode: '486001',
    district: 'Rewa',
    aadhaarLast4: '0006',
    rationCard: 'MP-RW-0912345',
    category: 'BPL',
    dealerId: 'D001',
    entitlement: { wheat: 10, rice: 5, sugar: 2, kerosene: 5, dal: 3 },
    collectionHistory: [
      { month: 'January 2026', items: { wheat: true, rice: true, sugar: true, kerosene: true , dal: true }, date: '2026-01-14' },
      { month: 'February 2026', items: { wheat: true, rice: true, sugar: true, kerosene: true , dal: true }, date: '2026-02-13' },
    ],
  },
  B007: {
    id: 'B007',
    name: 'Suresh Prasad Tiwari',
    phone: '98XXXXX007',
    pincode: '458001',
    district: 'Mandsaur',
    aadhaarLast4: '0007',
    rationCard: 'MP-MS-0678901',
    category: 'APL',
    dealerId: 'D003',
    entitlement: { wheat: 10, rice: 5, sugar: 2, kerosene: 5, dal: 3 },
    collectionHistory: [
      { month: 'January 2026', items: { wheat: true, rice: true, sugar: true, kerosene: false , dal: true }, date: '2026-01-20' },
      { month: 'February 2026', items: { wheat: false, rice: true, sugar: true, kerosene: true , dal: true }, date: '2026-02-22' },
    ],
  },
  B008: {
    id: 'B008',
    name: 'Radha Bai Malviya',
    phone: '98XXXXX008',
    pincode: '470001',
    district: 'Sagar',
    aadhaarLast4: '0008',
    rationCard: 'MP-SG-0234567',
    category: 'BPL',
    dealerId: 'D004',
    entitlement: { wheat: 10, rice: 5, sugar: 2, kerosene: 5, dal: 3 },
    collectionHistory: [
      { month: 'January 2026', items: { wheat: true, rice: true, sugar: true, kerosene: true , dal: true }, date: '2026-01-17' },
      { month: 'February 2026', items: { wheat: true, rice: true, sugar: false, kerosene: true , dal: true }, date: '2026-02-16' },
    ],
  },
};

// ==================== DEALERS ====================
export const mockDealers: Record<string, Dealer> = {
  D001: {
    id: 'D001',
    name: 'Sharma Ration Shop',
    owner: 'Rajesh Sharma',
    location: 'Indore',
    district: 'Indore',
    trustScore: 73.5,
    totalTransactions: 1250,
    alerts: 2,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isVerified: true,
    monthlyQuota: 50,
  },
  D002: {
    id: 'D002',
    name: 'Verma General Store',
    owner: 'Priya Verma',
    location: 'Bhopal',
    district: 'Bhopal',
    trustScore: 88.0,
    totalTransactions: 980,
    alerts: 5,
    lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isVerified: true,
    monthlyQuota: 50,
  },
  D003: {
    id: 'D003',
    name: 'Grain Hub Ujjain',
    owner: 'Mohan Gupta',
    location: 'Ujjain',
    district: 'Ujjain',
    trustScore: 45.0,
    totalTransactions: 650,
    alerts: 18,
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    isVerified: false,
    monthlyQuota: 50,
  },
  D004: {
    id: 'D004',
    name: 'Pure Foods Gwalior',
    owner: 'Dinesh Tiwari',
    location: 'Gwalior',
    district: 'Gwalior',
    trustScore: 88,
    totalTransactions: 1120,
    alerts: 3,
    lastActivity: new Date(Date.now() - 45 * 60 * 1000),
    isVerified: true,
    monthlyQuota: 50,
  },
  D005: {
    id: 'D005',
    name: 'Central Supplies Jabalpur',
    owner: 'Ramesh Mishra',
    location: 'Jabalpur',
    district: 'Jabalpur',
    trustScore: 62,
    totalTransactions: 520,
    alerts: 12,
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isVerified: false,
    monthlyQuota: 50,
  },
};

// ==================== DISTRICTS ====================
export const mockDistricts: Record<string, District> = {
  'MP-IND': {
    id: 'MP-IND',
    name: 'Indore',
    fraudCases: 8,
    totalTransactions: 3450,
    riskLevel: 'safe',
    topRiskyDealer: 'D003',
    topRiskyDealerName: 'Grain Hub Ujjain',
    lat: 22.7196,
    lng: 75.8577,
    shops: 145,
  },
  'MP-BHO': {
    id: 'MP-BHO',
    name: 'Bhopal',
    fraudCases: 15,
    totalTransactions: 2890,
    riskLevel: 'suspicious',
    topRiskyDealer: 'D005',
    topRiskyDealerName: 'Central Supplies Jabalpur',
    lat: 23.2599,
    lng: 77.4126,
    shops: 132,
  },
  'MP-UJJ': {
    id: 'MP-UJJ',
    name: 'Ujjain',
    fraudCases: 22,
    totalTransactions: 2100,
    riskLevel: 'high',
    topRiskyDealer: 'D003',
    topRiskyDealerName: 'Grain Hub Ujjain',
    lat: 23.1765,
    lng: 75.7885,
    shops: 98,
  },
  'MP-GWA': {
    id: 'MP-GWA',
    name: 'Gwalior',
    fraudCases: 5,
    totalTransactions: 2560,
    riskLevel: 'safe',
    topRiskyDealer: 'D005',
    topRiskyDealerName: 'Central Supplies Jabalpur',
    lat: 26.2183,
    lng: 78.1828,
    shops: 118,
  },
  'MP-JAB': {
    id: 'MP-JAB',
    name: 'Jabalpur',
    fraudCases: 18,
    totalTransactions: 1950,
    riskLevel: 'suspicious',
    topRiskyDealer: 'D005',
    topRiskyDealerName: 'Central Supplies Jabalpur',
    lat: 23.1815,
    lng: 79.9864,
    shops: 156,
  },
  'MP-RWA': {
    id: 'MP-RWA',
    name: 'Rewa',
    fraudCases: 9,
    totalTransactions: 1550,
    riskLevel: 'safe',
    topRiskyDealer: 'D005',
    topRiskyDealerName: 'Central Supplies Jabalpur',
    lat: 24.5362,
    lng: 81.2999,
    shops: 87,
  },
  'MP-SGR': {
    id: 'MP-SGR',
    name: 'Sagar',
    fraudCases: 12,
    totalTransactions: 1800,
    riskLevel: 'suspicious',
    topRiskyDealer: 'D003',
    topRiskyDealerName: 'Grain Hub Ujjain',
    lat: 23.8388,
    lng: 78.7378,
    shops: 103,
  },
  'MP-MAN': {
    id: 'MP-MAN',
    name: 'Mandsaur',
    fraudCases: 19,
    totalTransactions: 1800,
    riskLevel: 'high',
    topRiskyDealer: 'D003',
    topRiskyDealerName: 'Grain Hub Ujjain',
    lat: 24.0765,
    lng: 75.0711,
    shops: 76,
  },
};

// ==================== SEED TRANSACTIONS ====================
export const createMockTransactions = (): Transaction[] => {
  const now = Date.now();
  const transactions: Transaction[] = [];
  const beneficiaryList = Object.values(mockBeneficiaries);
  const dealerList = Object.values(mockDealers);
  const grains = [
    { type: 'Wheat', qty: 5, unit: 'kg' },
    { type: 'Rice', qty: 2, unit: 'kg' },
    { type: 'Sugar', qty: 1, unit: 'kg' },
    { type: 'Kerosene', qty: 2, unit: 'L' },
  ];

  for (let i = 0; i < 45; i++) {
    const bene = beneficiaryList[i % beneficiaryList.length];
    const dealer = dealerList[i % dealerList.length];
    const grain = grains[i % grains.length];
    const statuses: Array<'pending' | 'verified' | 'reported'> = ['pending', 'verified', 'verified'];

    transactions.push({
      id: `TXN${String(i + 1).padStart(6, '0')}`,
      beneficiaryId: bene.id,
      beneficiaryName: bene.name,
      grainType: grain.type,
      quantity: grain.qty,
      unit: grain.unit,
      timestamp: now - Math.random() * 24 * 60 * 60 * 1000,
      dealerId: dealer.id,
      dealerName: dealer.name,
      district: dealer.district,
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }

  return transactions.sort((a, b) => b.timestamp - a.timestamp);
};

// ==================== FRAUD ALERTS ====================
export const createMockFraudAlerts = (): FraudAlert[] => {
  const now = new Date();
  return [
    {
      id: 'FA001',
      type: 'duplicate',
      severity: 'critical',
      description: 'Double Collection Detected',
      beneficiaryId: 'B007',
      beneficiaryName: 'Suresh Prasad Tiwari',
      dealerId: 'D003',
      dealerName: 'Grain Hub Ujjain',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000),
      district: 'Ujjain',
      fraudScore: 92,
      reasons: [
        'Suresh Tiwari already received ration this month',
        'Same dealer logged within 2 minutes',
        'Dealer already at 94% monthly quota',
      ],
    },
    {
      id: 'FA002',
      type: 'bulk_transaction',
      severity: 'high',
      description: 'Bulk Processing Alert',
      dealerId: 'D003',
      dealerName: 'Grain Hub Ujjain',
      timestamp: new Date(now.getTime() - 15 * 60 * 1000),
      district: 'Ujjain',
      fraudScore: 78,
      reasons: [
        '52 transactions in 10 minutes (quota: 30)',
        'Unusual speed of distribution entries',
        'Pattern matches bulk fraud signature',
      ],
    },
    {
      id: 'FA003',
      type: 'off_hours',
      severity: 'medium',
      description: 'Off-Hours Activity',
      dealerId: 'D005',
      dealerName: 'Central Supplies Jabalpur',
      beneficiaryName: 'Mohan Lal Kushwaha',
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      district: 'Jabalpur',
      fraudScore: 45,
      reasons: [
        'Transaction logged at 2:30 AM',
        'Outside standard shop hours (7 AM–9 PM)',
        'Dealer has 3 prior off-hours entries',
      ],
    },
    {
      id: 'FA004',
      type: 'quota_exceeded',
      severity: 'medium',
      description: 'Monthly Quota Exceeded',
      dealerId: 'D005',
      dealerName: 'Central Supplies Jabalpur',
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      district: 'Jabalpur',
      fraudScore: 55,
      reasons: [
        'Dealer exceeded monthly quota by 18%',
        'Entire monthly quota claimed in one day',
        'Unusual quantity pattern detected',
      ],
    },
    {
      id: 'FA005',
      type: 'anomaly',
      severity: 'low',
      description: 'Unusual Pattern Detected',
      dealerId: 'D002',
      dealerName: 'Verma General Store',
      timestamp: new Date(now.getTime() - 90 * 60 * 1000),
      district: 'Bhopal',
      fraudScore: 25,
      reasons: [
        'Same agent processed 8 transactions',
        'Minor deviation from normal pattern',
        'Regular monitoring recommended',
      ],
    },
  ];
};

// ==================== SMS MESSAGES ====================
export const createMockSMSMessages = (): SMSMessageType[] => {
  const now = new Date();
  return [
    {
      id: 'SMS001',
      from: 'RationTrack',
      message: 'Ramesh Kumar, 5kg wheat + 2kg rice collected at Sharma Shop, Indore. 24 Mar 2026. NOT YOU? Reply REPORT',
      timestamp: new Date(now.getTime() - 5 * 60 * 1000),
      type: 'incoming',
      beneficiaryId: 'B001',
    },
    {
      id: 'SMS002',
      from: 'RationTrack',
      message: 'Sunita Devi, 2kg rice collected at Verma Store, Bhopal. 23 Mar 2026.',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      type: 'incoming',
      beneficiaryId: 'B002',
    },
  ];
};

// Helper to find beneficiary by aadhaar last 4
export const findBeneficiaryByAadhaar = (last4: string): Beneficiary | undefined => {
  return Object.values(mockBeneficiaries).find(b => b.aadhaarLast4 === last4);
};

// Helper to find beneficiary by name
export const findBeneficiaryByName = (name: string): Beneficiary | undefined => {
  const lower = name.toLowerCase();
  return Object.values(mockBeneficiaries).find(b => b.name.toLowerCase().includes(lower));
};

// Grain options for dealer panel
export const grainOptions = [
  { type: 'Wheat', amount: 10, unit: 'kg', icon: '🌾' },
  { type: 'Rice', amount: 5, unit: 'kg', icon: '🍚' },
  { type: 'Sugar', amount: 2, unit: 'kg', icon: '🍬' },
  { type: 'Kerosene', amount: 5, unit: 'L', icon: '🛢️' },
  { type: 'Dal', amount: 3, unit: 'kg', icon: '🍛' },
];
