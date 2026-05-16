'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  Transaction,
  FraudAlert,
  Complaint,
  Dealer,
  SMSMessageType,
  mockDealers as initialDealers,
  createMockTransactions,
  createMockFraudAlerts,
  mockBeneficiaries,
} from './mockData';
import { calculateFraudScore } from './fraudDetection';

// ==================== STATE ====================
export interface AppState {
  transactions: Transaction[];
  fraudAlerts: FraudAlert[];
  complaints: Complaint[];
  dealers: Record<string, Dealer>;
  smsMessages: SMSMessageType[];
  verificationStatuses: Record<string, 'pending' | 'verified' | 'reported'>;
  pulsingDistrict: string | null;
  language: 'en' | 'hi';
  toasts: ToastItem[];
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

// ==================== ACTIONS ====================
export type AppAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'VERIFY_TRANSACTION'; payload: { transactionId: string } }
  | { type: 'REPORT_FRAUD'; payload: { transactionId: string; beneficiaryId: string; beneficiaryName: string; dealerId: string; dealerName: string; description: string } }
  | { type: 'UPDATE_COMPLAINT_STATUS'; payload: { complaintId: string; status: 'open' | 'investigating' | 'resolved'; remarks?: string } }
  | { type: 'UPDATE_DEALER_TRUST_SCORE'; payload: { dealerId: string; delta: number } }
  | { type: 'ADD_FRAUD_ALERT'; payload: FraudAlert }
  | { type: 'ADD_SMS'; payload: SMSMessageType }
  | { type: 'ADD_COMPLAINT'; payload: Complaint }
  | { type: 'PULSE_DISTRICT'; payload: string | null }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'hi' }
  | { type: 'ADD_TOAST'; payload: ToastItem }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'TOGGLE_DEALER_SUSPENSION'; payload: { dealerId: string } };

// ==================== INITIAL STATE ====================
const seedTransactions = createMockTransactions();
const seedAlerts = createMockFraudAlerts();

export const initialState: AppState = {
  transactions: seedTransactions,
  fraudAlerts: seedAlerts,
  complaints: [],
  dealers: JSON.parse(JSON.stringify(initialDealers)),
  smsMessages: [],
  verificationStatuses: seedTransactions.reduce((acc, t) => {
    acc[t.id] = t.status;
    return acc;
  }, {} as Record<string, 'pending' | 'verified' | 'reported'>),
  pulsingDistrict: null,
  language: 'en',
  toasts: [],
};

// ==================== REDUCER ====================
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const txn = action.payload;
      return {
        ...state,
        transactions: [txn, ...state.transactions],
        verificationStatuses: {
          ...state.verificationStatuses,
          [txn.id]: txn.status || 'pending',
        },
      };
    }

    case 'VERIFY_TRANSACTION': {
      const { transactionId } = action.payload;
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === transactionId ? { ...t, status: 'verified' as const } : t
        ),
        verificationStatuses: {
          ...state.verificationStatuses,
          [transactionId]: 'verified',
        },
      };
    }

    case 'REPORT_FRAUD': {
      const { transactionId, beneficiaryId, beneficiaryName, dealerId, dealerName, description } = action.payload;
      const complaintId = `CMP-2026-${String(state.complaints.length + 1).padStart(3, '0')}`;
      const newComplaint: Complaint = {
        id: complaintId,
        beneficiaryId,
        beneficiaryName,
        dealerId,
        dealerName,
        description,
        date: new Date(),
        status: 'open',
        transactionId,
      };
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === transactionId ? { ...t, status: 'reported' as const } : t
        ),
        verificationStatuses: {
          ...state.verificationStatuses,
          [transactionId]: 'reported',
        },
        complaints: [newComplaint, ...state.complaints],
      };
    }

    case 'UPDATE_COMPLAINT_STATUS': {
      const { complaintId, status, remarks } = action.payload;
      return {
        ...state,
        complaints: state.complaints.map(c =>
          c.id === complaintId
            ? { ...c, status, ...(remarks !== undefined ? { remarks } : {}) }
            : c
        ),
      };
    }

    case 'UPDATE_DEALER_TRUST_SCORE': {
      const { dealerId, delta } = action.payload;
      const currentDealer = state.dealers[dealerId];
      if (!currentDealer) return state;
      const newScore = Math.max(0, Math.min(100, currentDealer.trustScore + delta));
      return {
        ...state,
        dealers: {
          ...state.dealers,
          [dealerId]: { ...currentDealer, trustScore: Math.round(newScore * 10) / 10 },
        },
      };
    }

    case 'ADD_FRAUD_ALERT': {
      return {
        ...state,
        fraudAlerts: [action.payload, ...state.fraudAlerts],
      };
    }

    case 'ADD_SMS': {
      return {
        ...state,
        smsMessages: [action.payload, ...state.smsMessages],
      };
    }

    case 'ADD_COMPLAINT': {
      return {
        ...state,
        complaints: [action.payload, ...state.complaints],
      };
    }

    case 'PULSE_DISTRICT': {
      return {
        ...state,
        pulsingDistrict: action.payload,
      };
    }

    case 'SET_LANGUAGE': {
      return {
        ...state,
        language: action.payload,
      };
    }

    case 'ADD_TOAST': {
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    }

    case 'REMOVE_TOAST': {
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload),
      };
    }

    case 'SET_TRANSACTIONS': {
      return {
        ...state,
        transactions: action.payload,
      };
    }

    case 'TOGGLE_DEALER_SUSPENSION': {
      const { dealerId } = action.payload;
      const dealer = state.dealers[dealerId];
      if (!dealer) return state;
      return {
        ...state,
        dealers: {
          ...state.dealers,
          [dealerId]: { ...dealer, isSuspended: !dealer.isSuspended },
        },
      };
    }

    default:
      return state;
  }
}

// ==================== CONTEXT ====================
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  showToast: (message: string, type: ToastItem['type']) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}

// ==================== PROVIDER COMPONENT ====================
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const showToast = useCallback((message: string, type: ToastItem['type']) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, 2000);
  }, [dispatch]);

  return React.createElement(
    AppContext.Provider,
    { value: { state, dispatch, showToast } },
    children
  );
}
