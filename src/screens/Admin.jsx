import { useMemo, useState } from 'react'
import { useStore } from '../state/store'
import { useToast } from '../components/Toast'
import Avatar from '../components/Avatar'
import { formatMoney } from '../utils/format'

export default function Admin() {
  const { state, dispatch } = useStore()
  const toast = useToast()
  const [authed, setAuthed] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  const [query, setQuery] = useState('')
  const [target, setTarget] = useState(null) // user being funded
  const [amount, setAmount] = useState('')
  const [adding, setAdding] = useState(false) // add-user sheet
  const [newName, setNewName] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newBal, setNewBal] = useState('')

  const totalFloat = useMemo(() => state.users.reduce((s, u) => s + u.balance, 0), [state.users])
  const people = useMemo(() => {
    const q = query.trim().toLowerCase()
    return state.users.filter((u) => !q || u.name.toLowerCase().includes(q) || u.cashtag.toLowerCase().includes(q))
  }, [query, state.users])

  function submitPin() {
    if (pin === state.adminPin) {
      setAuthed(true)
      setError(false)
    } else {
      setError(true)
      setPin('')
    }
  }

  function fund(mode) {
    const amt = Math.round(parseFloat(amount) * 100) / 100
    if (!amt || amt <= 0) return
    if (mode === 'add') {
      dispatch({ type: 'ADMIN_ADD', userId: target.id, amount: amt })
      toast(`Added ${formatMoney(amt)} to ${target.name.split(' ')[0]}`)
    } else {
      dispatch({ type: 'ADMIN_SET_BALANCE', userId: target.id, amount: amt })
      toast(`Set ${target.name.split(' ')[0]} to ${formatMoney(amt)}`)
    }
    setTarget(null)
    setAmount('')
  }

  function createUser() {
    const name = newName.trim()
    if (!name) return
    let tag = newTag.trim()
    if (!tag) tag = '$' + name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12)
    if (!tag.startsWith('$')) tag = '$' + tag
    dispatch({ type: 'ADD_USER', name, cashtag: tag, balance: parseFloat(newBal) || 0 })
    toast(`Added user ${name}`)
    setAdding(false)
    setNewName(''); setNewTag(''); setNewBal('')
  }

  // ---- PIN gate ----
  if (!authed) {
    return (
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="avatar avatar-lg" style={{ background: 'var(--surface-2)', fontSize: 34, marginBottom: 18 }}>🛡️</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>Admin Access</h1>
        <p className="row-sub" style={{ textAlign: 'center', marginTop: 6 }}>Enter the admin PIN to manage balances.</p>
        <input
          className="big-amount-input"
          style={{ fontSize: 40, letterSpacing: 8 }}
          type="password"
          inputMode="numeric"
          placeholder="••••"
          maxLength={8}
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(false) }}
          onKeyDown={(e) => e.key === 'Enter' && submitPin()}
          autoFocus
        />
        {error && <div style={{ color: 'var(--danger)', marginBottom: 10 }}>Incorrect PIN.</div>}
        <button className="btn btn-primary btn-block" style={{ maxWidth: 280 }} onClick={submitPin}>Unlock</button>
        <div className="row-sub" style={{ marginTop: 14 }}>Demo PIN: <b>{state.adminPin}</b></div>
      </div>
    )
  }

  // ---- Admin dashboard ----
  return (
    <div className="screen">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 className="screen-title" style={{ margin: '8px 0 14px' }}>Admin</h1>
        <button className="link-btn" style={{ marginLeft: 'auto' }} onClick={() => setAuthed(false)}>Lock</button>
      </div>

      <div className="card" style={{ marginTop: 0, display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div className="row-sub">Total on platform</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{formatMoney(totalFloat)}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="row-sub">Users</div>
          <div style={{ fontSize: 26, fontWeight: 800 }}>{state.users.length}</div>
        </div>
      </div>

      <div className="search-bar" style={{ marginTop: 14 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" strokeLinecap="round" />
        </svg>
        <input placeholder="Search users" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
        <div className="section-label">All users</div>
        <button className="link-btn" style={{ marginLeft: 'auto' }} onClick={() => setAdding(true)}>+ Add user</button>
      </div>

      {people.map((u) => (
        <div key={u.id}>
          <div className="row">
            <Avatar user={u} />
            <div className="row-main">
              <div className="row-title">
                {u.name} {u.id === state.meId && <span className="badge green">You</span>}
              </div>
              <div className="row-sub">{u.cashtag} · {formatMoney(u.balance)}</div>
            </div>
            <button className="btn btn-secondary" style={{ flex: 'none', padding: '9px 16px', fontSize: 14 }} onClick={() => { setTarget(u); setAmount('') }}>
              Add $
            </button>
          </div>
          <div className="divider" />
        </div>
      ))}

      {/* Fund a user */}
      {target && (
        <div className="sheet-backdrop" onClick={() => setTarget(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grab" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Avatar user={target} />
              <div className="row-main">
                <h2>{target.name}</h2>
                <div className="row-sub">{target.cashtag} · current {formatMoney(target.balance)}</div>
              </div>
            </div>
            <input
              className="big-amount-input"
              type="number"
              inputMode="decimal"
              placeholder="$0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
            <div className="chip-row" style={{ justifyContent: 'center' }}>
              {[50, 100, 500, 1000].map((q) => (
                <button key={q} className="chip" onClick={() => setAmount(String(q))}>+{q}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button className="btn btn-ghost" disabled={!parseFloat(amount)} onClick={() => fund('set')}>Set balance</button>
              <button className="btn btn-primary" disabled={!parseFloat(amount)} onClick={() => fund('add')}>Add money</button>
            </div>
            {state.meId !== target.id && (
              <button
                className="link-btn"
                style={{ display: 'block', textAlign: 'center', width: '100%', marginTop: 16 }}
                onClick={() => { dispatch({ type: 'SWITCH_ME', userId: target.id }); toast(`Signed in as ${target.name.split(' ')[0]}`); setTarget(null) }}
              >
                Sign in as this user
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add user */}
      {adding && (
        <div className="sheet-backdrop" onClick={() => setAdding(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-grab" />
            <h2>Add a user</h2>
            <input className="field" placeholder="Full name" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
            <input className="field" placeholder="$cashtag (optional)" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
            <input className="field" type="number" inputMode="decimal" placeholder="Starting balance (optional)" value={newBal} onChange={(e) => setNewBal(e.target.value)} />
            <button className="btn btn-primary btn-block" disabled={!newName.trim()} onClick={createUser}>Create user</button>
          </div>
        </div>
      )}
    </div>
  )
}
