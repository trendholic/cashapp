import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../state/store'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import { formatMoney } from '../utils/format'

export default function Send() {
  const { state, dispatch } = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  const location = useLocation()
  const { amount, mode } = location.state || {}

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')

  // Guard: if user navigated here directly without an amount, send them home
  if (!amount || !mode) return <Navigate to="/" replace />

  const isPay = mode === 'pay'
  const insufficient = isPay && amount > state.balance

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return state.contacts
    return state.contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.cashtag.toLowerCase().includes(q),
    )
  }, [query, state.contacts])

  function confirm() {
    if (isPay) {
      dispatch({ type: 'PAY', contact: selected, amount, note: note.trim() })
      toast(`Paid ${formatMoney(amount)} to ${selected.name.split(' ')[0]}`)
    } else {
      dispatch({ type: 'REQUEST', contact: selected, amount, note: note.trim() })
      toast(`Requested ${formatMoney(amount)} from ${selected.name.split(' ')[0]}`)
    }
    navigate('/activity')
  }

  return (
    <div className="screen">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="link-btn" onClick={() => navigate(-1)}>
          ‹ Back
        </button>
        <div style={{ marginLeft: 'auto', fontWeight: 800, fontSize: 18 }}>
          {isPay ? 'Pay' : 'Request'} {formatMoney(amount)}
        </div>
      </div>

      <h1 className="screen-title" style={{ marginTop: 16 }}>
        {isPay ? 'Pay whom?' : 'Request from?'}
      </h1>

      <input
        className="search-input"
        placeholder="Name, $cashtag, or email"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="section-label">Contacts</div>
      {filtered.length === 0 && (
        <div className="empty">No contacts match “{query}”.</div>
      )}
      {filtered.map((c) => (
        <button
          key={c.id}
          className="row"
          style={{ width: '100%', textAlign: 'left' }}
          onClick={() => {
            setSelected(c)
            setNote('')
          }}
        >
          <Avatar name={c.name} />
          <div className="row-main">
            <div className="row-title">{c.name}</div>
            <div className="row-sub">{c.cashtag}</div>
          </div>
        </button>
      ))}

      {selected && (
        <div className="sheet-backdrop" onClick={() => setSelected(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Avatar name={selected.name} />
              <div className="row-main">
                <h2>{selected.name}</h2>
                <div className="row-sub">{selected.cashtag}</div>
              </div>
            </div>

            <div
              style={{
                textAlign: 'center',
                fontSize: 40,
                fontWeight: 800,
                margin: '18px 0 4px',
              }}
            >
              {formatMoney(amount)}
            </div>
            <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
              {isPay ? 'to' : 'from'} {selected.name}
            </div>

            <input
              className="note-input"
              placeholder="What's it for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={80}
            />

            {insufficient && (
              <div
                style={{
                  color: 'var(--danger)',
                  textAlign: 'center',
                  marginBottom: 12,
                  fontSize: 14,
                }}
              >
                Not enough balance. Add cash from your Profile.
              </div>
            )}

            <button
              className="btn btn-primary btn-block"
              disabled={insufficient}
              onClick={confirm}
            >
              {isPay ? 'Pay' : 'Request'} {formatMoney(amount)}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
