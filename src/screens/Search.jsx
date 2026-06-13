import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../state/store'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import { formatMoney } from '../utils/format'

export default function Search() {
  const { state, me, dispatch } = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [raw, setRaw] = useState('')
  const [note, setNote] = useState('')

  const people = useMemo(() => {
    const q = query.trim().toLowerCase()
    return state.users
      .filter((u) => u.id !== me.id)
      .filter((u) => !q || u.name.toLowerCase().includes(q) || u.cashtag.toLowerCase().includes(q))
  }, [query, state.users, me.id])

  const amount = Math.round(parseFloat(raw) * 100) / 100 || 0
  const insufficientPay = amount > me.balance

  function open(u) {
    setSelected(u)
    setRaw('')
    setNote('')
  }

  function act(mode) {
    if (!amount || amount <= 0) return
    if (mode === 'pay') {
      if (insufficientPay) return
      dispatch({ type: 'PAY', fromId: me.id, toId: selected.id, amount, note: note.trim() })
      toast(`Paid ${formatMoney(amount)} to ${selected.name.split(' ')[0]}`)
    } else {
      dispatch({ type: 'REQUEST', fromId: me.id, toId: selected.id, amount, note: note.trim() })
      toast(`Requested ${formatMoney(amount)}`)
    }
    setSelected(null)
    navigate('/activity')
  }

  return (
    <div className="screen">
      <h1 className="screen-title">Search</h1>

      <div className="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" strokeLinecap="round" />
        </svg>
        <input placeholder="Search people, $cashtags" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
      </div>

      <div className="section-label">{query ? 'Results' : 'People on Cash'}</div>
      {people.length === 0 && <div className="empty">No people match “{query}”.</div>}
      {people.map((u) => (
        <button key={u.id} className="row" onClick={() => open(u)}>
          <Avatar user={u} />
          <div className="row-main">
            <div className="row-title">{u.name}</div>
            <div className="row-sub">{u.cashtag}</div>
          </div>
          <span className="badge">Pay</span>
        </button>
      ))}

      {selected && (
        <div className="sheet-backdrop" onClick={() => setSelected(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grab" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Avatar user={selected} />
              <div className="row-main">
                <h2>{selected.name}</h2>
                <div className="row-sub">{selected.cashtag}</div>
              </div>
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
            <input className="field" placeholder="What's it for?" value={note} onChange={(e) => setNote(e.target.value)} maxLength={80} />

            {amount > 0 && insufficientPay && (
              <div style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: 8, fontSize: 13.5 }}>
                You can still request, but your balance is too low to pay this.
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" disabled={!amount} onClick={() => act('request')}>Request</button>
              <button className="btn btn-primary" disabled={!amount || insufficientPay} onClick={() => act('pay')}>Pay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
