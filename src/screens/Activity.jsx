import { useMemo, useState } from 'react'
import { useStore } from '../state/store'
import Avatar from '../components/Avatar'
import { formatMoney, relativeDate } from '../utils/format'

const META = {
  sent: { sign: -1, verb: 'Paid', icon: '↑' },
  received: { sign: 1, verb: 'Received from', icon: '↓' },
  requested: { sign: 0, verb: 'Requested from', icon: '⏳' },
  cash_added: { sign: 1, verb: '', icon: '🏦' },
  cash_out: { sign: -1, verb: '', icon: '🏦' },
}

function describe(tx) {
  switch (tx.type) {
    case 'sent':
      return { title: tx.name, sub: tx.note || 'Payment' }
    case 'received':
      return { title: tx.name, sub: tx.note || 'Payment' }
    case 'requested':
      return { title: tx.name, sub: tx.note ? `Requested · ${tx.note}` : 'Requested' }
    case 'cash_added':
      return { title: 'Added Cash', sub: tx.note }
    case 'cash_out':
      return { title: 'Cash Out', sub: tx.note }
    default:
      return { title: tx.name, sub: '' }
  }
}

export default function Activity() {
  const { state } = useStore()
  const [filter, setFilter] = useState('all')

  const txs = useMemo(() => {
    if (filter === 'all') return state.transactions
    if (filter === 'pending') return state.transactions.filter((t) => t.pending)
    return state.transactions.filter((t) => t.type === filter)
  }, [filter, state.transactions])

  return (
    <div className="screen">
      <h1 className="screen-title">Activity</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        {[
          ['all', 'All'],
          ['sent', 'Sent'],
          ['received', 'Received'],
          ['pending', 'Pending'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: '7px 14px',
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 14,
              background: filter === key ? 'var(--green)' : 'var(--surface)',
              color: filter === key ? '#000' : 'var(--text)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {txs.length === 0 ? (
        <div className="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>No activity yet.</div>
        </div>
      ) : (
        txs.map((tx) => {
          const meta = META[tx.type] || META.sent
          const { title, sub } = describe(tx)
          const signed = meta.sign * tx.amount
          return (
            <div key={tx.id}>
              <div className="row">
                {tx.contactId ? (
                  <Avatar name={tx.name} />
                ) : (
                  <div
                    className="avatar"
                    style={{ background: 'var(--surface-2)', fontSize: 20 }}
                  >
                    {meta.icon}
                  </div>
                )}
                <div className="row-main">
                  <div className="row-title">{title}</div>
                  <div className="row-sub">
                    {sub} · {relativeDate(tx.date)}
                  </div>
                </div>
                <div
                  className={`row-amount${signed > 0 ? ' positive' : ''}`}
                  style={tx.pending ? { color: 'var(--text-dim)' } : undefined}
                >
                  {tx.pending
                    ? formatMoney(tx.amount)
                    : meta.sign === 0
                      ? formatMoney(tx.amount)
                      : formatMoney(signed, true)}
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
