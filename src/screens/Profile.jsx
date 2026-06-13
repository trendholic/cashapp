import { useMemo, useState } from 'react'
import { useStore } from '../state/store'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import { formatMoney } from '../utils/format'

const SETTINGS = [
  { label: 'Linked Banks', icon: '🏦', bg: '#1f6feb' },
  { label: 'Bitcoin', icon: '₿', bg: '#f7931a' },
  { label: 'Cash Card', icon: '💳', bg: '#111' },
  { label: 'Personal', icon: '👤', bg: '#34c759' },
  { label: 'Notifications', icon: '🔔', bg: '#ff3b30' },
  { label: 'Security & Privacy', icon: '🔒', bg: '#8e8e93' },
  { label: 'Support', icon: '💬', bg: '#5e5ce6' },
]

export default function Profile() {
  const { state, me, dispatch } = useStore()
  const toast = useToast()
  const [sheet, setSheet] = useState(null) // 'add' | 'out'
  const [raw, setRaw] = useState('')

  const myTxCount = useMemo(
    () => state.transactions.filter((t) => t.fromId === me.id || t.toId === me.id).length,
    [state.transactions, me.id],
  )

  function submit() {
    const amount = Math.round(parseFloat(raw) * 100) / 100
    if (!amount || amount <= 0) return
    if (sheet === 'add') {
      dispatch({ type: 'ADD_CASH', userId: me.id, amount })
      toast(`Added ${formatMoney(amount)}`)
    } else {
      if (amount > me.balance) return
      dispatch({ type: 'CASH_OUT', userId: me.id, amount })
      toast(`Cashed out ${formatMoney(amount)}`)
    }
    setRaw('')
    setSheet(null)
  }

  const outTooMuch = sheet === 'out' && parseFloat(raw) > me.balance

  return (
    <div className="screen">
      <div className="profile-head">
        <Avatar user={me} size="lg" />
        <div style={{ fontSize: 22, fontWeight: 800 }}>{me.name}</div>
        <div className="cashtag">{me.cashtag}</div>
      </div>

      <div className="card" style={{ textAlign: 'center' }}>
        <div className="row-sub">Cash balance</div>
        <div className="balance-amount" style={{ margin: '4px 0 16px' }}>{formatMoney(me.balance)}</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => setSheet('add')}>Add Cash</button>
          <button className="btn btn-secondary" disabled={me.balance <= 0} onClick={() => setSheet('out')}>Cash Out</button>
        </div>
      </div>

      <div className="card">
        <div className="stat-row"><span>Your transactions</span><span style={{ color: 'var(--text-dim)' }}>{myTxCount}</span></div>
        <div className="divider" style={{ margin: '0' }} />
        <div className="stat-row"><span>People on Cash</span><span style={{ color: 'var(--text-dim)' }}>{state.users.length}</span></div>
      </div>

      <div className="section-label">Settings</div>
      <div className="card" style={{ padding: '4px 16px', marginTop: 4 }}>
        {SETTINGS.map((s, i) => (
          <div key={s.label}>
            <button className="setting-row" onClick={() => toast(`${s.label} isn't part of this demo`)}>
              <span className="setting-ic" style={{ background: s.bg }}>{s.icon}</span>
              <span className="setting-label">{s.label}</span>
              <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {i < SETTINGS.length - 1 && <div className="divider" style={{ margin: '0 0 0 50px' }} />}
          </div>
        ))}
      </div>

      <button
        className="link-btn"
        style={{ marginTop: 22, display: 'block', color: 'var(--danger)', textAlign: 'center', width: '100%' }}
        onClick={() => {
          if (confirm('Reset all data back to demo defaults?')) {
            dispatch({ type: 'RESET' })
            toast('Reset to defaults')
          }
        }}
      >
        Reset demo data
      </button>
      <div style={{ textAlign: 'center', color: 'var(--text-dim-2)', fontSize: 12, marginTop: 18 }}>
        Cash · Demo build · v2.0
      </div>

      {sheet && (
        <div className="sheet-backdrop" onClick={() => setSheet(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grab" />
            <h2>{sheet === 'add' ? 'Add Cash' : 'Cash Out'}</h2>
            <div className="row-sub">
              {sheet === 'add' ? 'Move money from your bank into Cash.' : `Available: ${formatMoney(me.balance)}`}
            </div>
            <input
              className="big-amount-input"
              type="number"
              inputMode="decimal"
              placeholder="$0"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              autoFocus
            />
            {outTooMuch && <div style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: 8, fontSize: 14 }}>Exceeds your balance.</div>}
            <button className="btn btn-primary btn-block" disabled={!parseFloat(raw) || parseFloat(raw) <= 0 || outTooMuch} onClick={submit}>
              {sheet === 'add' ? 'Add Cash' : 'Cash Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
