import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../state/store'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import Highlight from '../components/Highlight'
import { formatMoney } from '../utils/format'

// Rank: exact cashtag/name first, then prefix matches, then substring.
function rank(u, q) {
  const name = u.name.toLowerCase()
  const tag = u.cashtag.toLowerCase()
  if (tag === q || tag === '$' + q || name === q) return 0
  if (tag.startsWith(q) || tag.startsWith('$' + q) || name.startsWith(q)) return 1
  if (tag.includes(q) || name.includes(q)) return 2
  return 99
}

export default function Search() {
  const { state, me, dispatch } = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [raw, setRaw] = useState('')
  const [note, setNote] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = state.users.filter((u) => u.id !== me.id)
    if (!q) return pool
    return pool
      .map((u) => ({ u, r: rank(u, q) }))
      .filter((x) => x.r < 99)
      .sort((a, b) => a.r - b.r)
      .map((x) => x.u)
  }, [query, state.users, me.id])

  // Resolve ANY typed name/$cashtag into a payable profile (like paying any
  // cashtag in the real app). Data is simulated — not from real accounts.
  const synthetic = useMemo(() => {
    const q = query.trim()
    if (!q) return null
    const exists = state.users.some(
      (u) =>
        u.name.toLowerCase() === q.toLowerCase() ||
        u.cashtag.toLowerCase() === q.toLowerCase() ||
        u.cashtag.toLowerCase() === '$' + q.toLowerCase(),
    )
    if (exists) return null
    const isTag = q.startsWith('$')
    const base = (isTag ? q.slice(1) : q).replace(/[^a-zA-Z0-9 ]/g, '')
    if (!base.trim()) return null
    const cashtag = '$' + base.toLowerCase().replace(/\s+/g, '')
    const name = base.replace(/\b\w/g, (c) => c.toUpperCase())
    return { id: 'syn-' + cashtag, name, cashtag, balance: 0, synthetic: true }
  }, [query, state.users])

  const amount = Math.round(parseFloat(raw) * 100) / 100 || 0
  const insufficientPay = amount > me.balance

  function open(u) {
    setSelected(u)
    setRaw('')
    setNote('')
  }

  function act(mode) {
    if (!amount || amount <= 0) return
    // Persist a newly-searched cashtag so it becomes a real payable user.
    if (selected.synthetic) {
      dispatch({ type: 'ADD_USER', id: selected.id, name: selected.name, cashtag: selected.cashtag, balance: 0 })
    }
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
        <input
          placeholder="Name, $cashtag, phone, email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          autoFocus
        />
        {query && (
          <button className="search-clear" onClick={() => setQuery('')} aria-label="Clear">×</button>
        )}
      </div>

      <div className="section-label">
        {query ? `${results.length} match${results.length === 1 ? '' : 'es'}` : 'People on Cash'}
      </div>

      {results.map((u) => (
        <button key={u.id} className="row" onClick={() => open(u)}>
          <Avatar user={u} />
          <div className="row-main">
            <div className="row-title"><Highlight text={u.name} query={query} /></div>
            <div className="row-sub"><Highlight text={u.cashtag} query={query} /></div>
          </div>
          <span className="badge green">Pay</span>
        </button>
      ))}

      {synthetic && (
        <>
          <div className="section-label">Send to a new $cashtag</div>
          <button className="row" onClick={() => open(synthetic)}>
            <Avatar user={synthetic} />
            <div className="row-main">
              <div className="row-title">{synthetic.cashtag}</div>
              <div className="row-sub">Pay anyone by their $cashtag</div>
            </div>
            <span className="badge green">Pay</span>
          </button>
        </>
      )}

      {results.length === 0 && !synthetic && query && (
        <div className="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" strokeLinecap="round" />
          </svg>
          <div>Type a name or $cashtag to find someone.</div>
        </div>
      )}

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
