import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { seedUsers, seedTransactions, ADMIN_PIN } from '../data/seed'

const STORAGE_KEY = 'cashapp-state-v2'
const ME_ID = 'u_me'

const initialState = {
  users: seedUsers,
  transactions: seedTransactions,
  meId: ME_ID,
  adminPin: ADMIN_PIN,
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initialState, ...JSON.parse(raw) }
  } catch {
    /* ignore corrupt storage */
  }
  return initialState
}

const round = (n) => Math.round(n * 100) / 100
const genId = () => 't' + Date.now() + Math.random().toString(36).slice(2, 6)

function adjust(users, id, delta) {
  return users.map((u) => (u.id === id ? { ...u, balance: round(u.balance + delta) } : u))
}

function reducer(state, action) {
  switch (action.type) {
    case 'PAY': {
      const { fromId, toId, amount, note } = action
      return {
        ...state,
        users: adjust(adjust(state.users, fromId, -amount), toId, amount),
        transactions: [
          { id: genId(), type: fromId === state.meId ? 'sent' : 'received', fromId, toId, amount, note, date: Date.now() },
          ...state.transactions,
        ],
      }
    }
    case 'REQUEST': {
      const { fromId, toId, amount, note } = action // from = requester (me), to = payer
      return {
        ...state,
        transactions: [
          { id: genId(), type: 'requested', fromId, toId, amount, note, pending: true, date: Date.now() },
          ...state.transactions,
        ],
      }
    }
    case 'ADD_CASH':
      return {
        ...state,
        users: adjust(state.users, action.userId, action.amount),
        transactions: [
          { id: genId(), type: 'cash_added', toId: action.userId, amount: action.amount, note: 'From linked bank', date: Date.now() },
          ...state.transactions,
        ],
      }
    case 'CASH_OUT':
      return {
        ...state,
        users: adjust(state.users, action.userId, -action.amount),
        transactions: [
          { id: genId(), type: 'cash_out', fromId: action.userId, amount: action.amount, note: 'To linked bank', date: Date.now() },
          ...state.transactions,
        ],
      }
    case 'ADMIN_ADD':
      return {
        ...state,
        users: adjust(state.users, action.userId, action.amount),
        transactions: [
          { id: genId(), type: 'admin_credit', toId: action.userId, amount: action.amount, note: action.note || 'Admin deposit', date: Date.now() },
          ...state.transactions,
        ],
      }
    case 'ADMIN_SET_BALANCE':
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.userId ? { ...u, balance: round(action.amount) } : u)),
      }
    case 'ADD_USER': {
      const id = action.id || 'u' + Date.now()
      if (state.users.some((u) => u.id === id || u.cashtag.toLowerCase() === action.cashtag.toLowerCase())) {
        return state
      }
      return {
        ...state,
        users: [...state.users, { id, name: action.name, cashtag: action.cashtag, balance: round(action.balance || 0) }],
      }
    }
    case 'SWITCH_ME':
      return { ...state, meId: action.userId }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable */
    }
  }, [state])

  const value = useMemo(() => {
    const me = state.users.find((u) => u.id === state.meId) || state.users[0]
    const userById = (id) => state.users.find((u) => u.id === id)
    return { state, dispatch, me, userById }
  }, [state])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
