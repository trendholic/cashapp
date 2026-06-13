import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import {
  seedContacts,
  seedTransactions,
  SEED_BALANCE,
  me,
} from '../data/seed'

const STORAGE_KEY = 'cashapp-state-v1'

const initialState = {
  balance: SEED_BALANCE,
  contacts: seedContacts,
  transactions: seedTransactions,
  me,
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initialState, ...JSON.parse(raw) }
  } catch {
    // ignore corrupt storage
  }
  return initialState
}

function genId() {
  return 't' + Date.now() + Math.random().toString(36).slice(2, 6)
}

function reducer(state, action) {
  switch (action.type) {
    case 'PAY': {
      const { contact, amount, note } = action
      return {
        ...state,
        balance: round(state.balance - amount),
        transactions: [
          {
            id: genId(),
            type: 'sent',
            contactId: contact.id,
            name: contact.name,
            amount,
            note,
            date: Date.now(),
          },
          ...state.transactions,
        ],
      }
    }
    case 'REQUEST': {
      const { contact, amount, note } = action
      return {
        ...state,
        transactions: [
          {
            id: genId(),
            type: 'requested',
            contactId: contact.id,
            name: contact.name,
            amount,
            note,
            pending: true,
            date: Date.now(),
          },
          ...state.transactions,
        ],
      }
    }
    case 'ADD_CASH':
      return {
        ...state,
        balance: round(state.balance + action.amount),
        transactions: [
          {
            id: genId(),
            type: 'cash_added',
            name: 'Added Cash',
            amount: action.amount,
            note: 'From linked bank',
            date: Date.now(),
          },
          ...state.transactions,
        ],
      }
    case 'CASH_OUT':
      return {
        ...state,
        balance: round(state.balance - action.amount),
        transactions: [
          {
            id: genId(),
            type: 'cash_out',
            name: 'Cash Out',
            amount: action.amount,
            note: 'To linked bank',
            date: Date.now(),
          },
          ...state.transactions,
        ],
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

function round(n) {
  return Math.round(n * 100) / 100
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage may be full / unavailable
    }
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
