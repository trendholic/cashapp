import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../state/store'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import Highlight from '../components/Highlight'
import { formatMoney } from '../utils/format'

export default function Send() {
  const { state, me, dispatch } = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  const location = useLocation()
  const { amount, mode } = location.state || {}

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')

  if (!amount || !mode) return <Navigate to="/" replace />

  const isPay = mode === 'pay'
  const insufficient = isPay && amount > me.balance

  const people = useMemo(() => {
    const q = query.trim().toLowerCase()
    return state.users
      .filter((u) => u.id !== me.id)
      .filter((u) => !q || u.name.toLowerCase().includes(q) || u.cashtag.toLowerCase().includes(q))
  }, [query, state.users, me.id])

  function confirm() {
    if (isPay) {
      dispatch({ type: 'PAY', fromId: me.id, toId: selected.id, amount, note: note.trim() })
      toast(`Paid ${formatMoney(amount)} to ${selected.name.split(' ')[0]}`)
    } else {
      dispatch({ type: 'REQUEST', fromId: me.id, toId: selected.id, amount, note: note.trim() })
      toast(`Requested ${formatMoney(amount)}`)
    }
    navigate('/activity')
  }

  return (
    <div className="screen">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className="link-btn" onClick={() => navigate(-1)}>‹ Back</button>
        <div style={{ marginLeft: 'auto', fontWeight: 800, fontSize: 17 }}>
          {isPay ? 'Pay' : 'Request'} {formatMoney(amount)}
        </div>
      </div>

      <h1 className="screen-title" style={{ marginTop: 14 }}>
        {isPay ? 'Pay whom?' : 'Request from?'}
      </h1>

      <div className="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" strokeLinecap="round" />
        </svg>
        <input placeholder="Name, $cashtag, or email" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="section-label">Suggested</div>
      {people.length === 0 && <div className="empty">No people match “{query}”.</div>}
      {people.map((u) => (
        <button key={u.id} className="row" onClick={() => { setSelected(u); setNote('') }}>
          <Avatar user={u} />
          <div className="row-main">
            <div className="row-title"><Highlight text={u.name} query={query} /></div>
            <div className="row-sub"><Highlight text={u.cashtag} query={query} /></div>
          </div>
        </button>
      ))}

      {selected && (
        <div className="sheet-backdrop" onClick={() => setSelected(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grab" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
              <Avatar user={selected} />
              <div className="row-main">
                <h2>{selected.name}</h2>
                <div className="row-sub">{selected.cashtag}</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: 44, fontWeight: 800, letterSpacing: '-2px', margin: '14px 0 2px' }}>
              {formatMoney(amount)}
            </div>
            <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
              {isPay ? 'to' : 'from'} {selected.name}
            </div>

            <input className="field" placeholder="What's it for?" value={note} onChange={(e) => setNote(e.target.value)} maxLength={80} />

            {insufficient && (
              <div style={{ color: 'var(--danger)', textAlign: 'center', marginBottom: 10, fontSize: 14 }}>
                Not enough balance. Add cash from Profile or Admin.
              </div>
            )}

            <button className="btn btn-primary btn-block" disabled={insufficient} onClick={confirm}>
              {isPay ? 'Pay' : 'Request'} {formatMoney(amount)}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
