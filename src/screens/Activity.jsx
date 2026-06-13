import { useMemo, useState } from 'react'
import { useStore } from '../state/store'
import Avatar from '../components/Avatar'
import { formatMoney, relativeDate } from '../utils/format'

function view(tx, me, userById) {
  switch (tx.type) {
    case 'sent': {
      const u = userById(tx.toId)
      return { user: u, title: u?.name || 'Payment', sub: tx.note || 'Payment', sign: -1 }
    }
    case 'received': {
      const u = userById(tx.fromId)
      return { user: u, title: u?.name || 'Payment', sub: tx.note || 'Payment', sign: +1 }
    }
    case 'requested': {
      const u = userById(tx.toId)
      return { user: u, title: u?.name || 'Request', sub: tx.note ? `Requested · ${tx.note}` : 'Requested', sign: 0, pending: true }
    }
    case 'cash_added':
      return { icon: '🏦', title: 'Added Cash', sub: tx.note, sign: +1 }
    case 'cash_out':
      return { icon: '🏦', title: 'Cash Out', sub: tx.note, sign: -1 }
    case 'admin_credit':
      return { icon: '🛡️', title: 'Admin Deposit', sub: tx.note, sign: +1 }
    default:
      return { title: 'Transaction', sub: '', sign: 0 }
  }
}

export default function Activity() {
  const { state, me, userById } = useStore()
  const [filter, setFilter] = useState('all')

  // Only transactions that involve the current user
  const mine = useMemo(
    () => state.transactions.filter((t) => t.fromId === me.id || t.toId === me.id),
    [state.transactions, me.id],
  )

  const txs = useMemo(() => {
    if (filter === 'all') return mine
    if (filter === 'pending') return mine.filter((t) => t.pending)
    if (filter === 'sent') return mine.filter((t) => (t.fromId === me.id && !t.pending) && t.type !== 'cash_added')
    if (filter === 'received') return mine.filter((t) => t.toId === me.id && !t.pending)
    return mine
  }, [filter, mine, me.id])

  return (
    <div className="screen">
      <h1 className="screen-title">Activity</h1>

      <div className="chip-row">
        {[['all', 'All'], ['sent', 'Sent'], ['received', 'Received'], ['pending', 'Pending']].map(([k, label]) => (
          <button key={k} className={`chip${filter === k ? ' active' : ''}`} onClick={() => setFilter(k)}>
            {label}
          </button>
        ))}
      </div>

      {txs.length === 0 ? (
        <div className="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h4l2.5 7 5-14L17 12h4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>No activity yet.</div>
        </div>
      ) : (
        txs.map((tx) => {
          const v = view(tx, me, userById)
          const signed = v.sign * tx.amount
          return (
            <div key={tx.id}>
              <div className="row">
                {v.user ? (
                  <Avatar user={v.user} />
                ) : (
                  <div className="avatar avatar-md" style={{ background: 'var(--surface-2)', fontSize: 20 }}>{v.icon}</div>
                )}
                <div className="row-main">
                  <div className="row-title">{v.title}</div>
                  <div className="row-sub">{v.sub} · {relativeDate(tx.date)}</div>
                </div>
                <div className={`row-amount${signed > 0 ? ' positive' : ''}${v.pending ? ' pending' : ''}`}>
                  {v.pending || v.sign === 0 ? formatMoney(tx.amount) : formatMoney(signed, true)}
                </div>
              </div>
              <div className="divider" />
            </div>
          )
        })
      )}
    </div>
  )
}
