import { useState } from 'react'
import { useStore } from '../state/store'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import { formatMoney } from '../utils/format'

export default function Profile() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const [sheet, setSheet] = useState(null) // 'add' | 'out' | null
  const [raw, setRaw] = useState('')

  function submit() {
    const amount = Math.round(parseFloat(raw) * 100) / 100
    if (!amount || amount <= 0) return
    if (sheet === 'add') {
      dispatch({ type: 'ADD_CASH', amount })
      toast(`Added ${formatMoney(amount)}`)
    } else {
      if (amount > state.balance) return
      dispatch({ type: 'CASH_OUT', amount })
      toast(`Cashed out ${formatMoney(amount)}`)
    }
    setRaw('')
    setSheet(null)
  }

  function reset() {
    if (confirm('Reset all data back to the demo defaults?')) {
      dispatch({ type: 'RESET' })
      toast('Reset to defaults')
    }
  }

  const outTooMuch =
    sheet === 'out' && parseFloat(raw) > state.balance

  return (
    <div className="screen">
      <div className="profile-head">
        <Avatar name={state.me.name} size="lg" />
        <div style={{ fontSize: 22, fontWeight: 800 }}>{state.me.name}</div>
        <div className="cashtag">{state.me.cashtag}</div>
        <div className="row-sub">{state.me.email}</div>
      </div>

      <div className="stat-card" style={{ textAlign: 'center' }}>
        <div className="row-sub">Cash balance</div>
        <div style={{ fontSize: 40, fontWeight: 800, margin: '4px 0 16px' }}>
          {formatMoney(state.balance)}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => setSheet('add')}>
            Add Cash
          </button>
          <button
            className="btn btn-secondary"
            disabled={state.balance <= 0}
            onClick={() => setSheet('out')}
          >
            Cash Out
          </button>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-row">
          <span>Transactions</span>
          <span style={{ color: 'var(--text-dim)' }}>
            {state.transactions.length}
          </span>
        </div>
        <div className="divider" />
        <div className="stat-row">
          <span>Contacts</span>
          <span style={{ color: 'var(--text-dim)' }}>
            {state.contacts.length}
          </span>
        </div>
      </div>

      <button
        className="link-btn"
        style={{ marginTop: 24, display: 'block', color: 'var(--danger)' }}
        onClick={reset}
      >
        Reset demo data
      </button>

      {sheet && (
        <div className="sheet-backdrop" onClick={() => setSheet(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <h2>{sheet === 'add' ? 'Add Cash' : 'Cash Out'}</h2>
            <div className="row-sub">
              {sheet === 'add'
                ? 'Move money from your bank into Cash App.'
                : `Available: ${formatMoney(state.balance)}`}
            </div>
            <input
              className="note-input"
              type="number"
              inputMode="decimal"
              placeholder="$0.00"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              autoFocus
            />
            {outTooMuch && (
              <div
                style={{
                  color: 'var(--danger)',
                  marginBottom: 12,
                  fontSize: 14,
                }}
              >
                Amount exceeds your balance.
              </div>
            )}
            <button
              className="btn btn-primary btn-block"
              disabled={!parseFloat(raw) || parseFloat(raw) <= 0 || outTooMuch}
              onClick={submit}
            >
              {sheet === 'add' ? 'Add' : 'Cash Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
