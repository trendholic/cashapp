import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../state/store'
import { formatKeypad, formatMoney, parseKeypad } from '../utils/format'
import Avatar from '../components/Avatar'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del']

export default function Home() {
  const { me } = useStore()
  const navigate = useNavigate()
  const [raw, setRaw] = useState('')

  function press(key) {
    setRaw((prev) => {
      if (key === 'del') return prev.slice(0, -1)
      if (key === '.') {
        if (prev.includes('.')) return prev
        return prev === '' ? '0.' : prev + '.'
      }
      if (prev.includes('.') && prev.split('.')[1]?.length >= 2) return prev
      if (prev === '0') return key
      const next = prev + key
      if (parseFloat(next) > 100000) return prev
      return next
    })
  }

  const amount = parseKeypad(raw)
  const canProceed = amount > 0

  const go = (mode) => navigate('/send', { state: { amount, mode } })

  return (
    <div className="screen flush">
      <div className="topbar">
        <button className="icon-btn" onClick={() => navigate('/profile')} aria-label="Profile">
          <Avatar user={me} size="sm" />
        </button>
        <button className="balance-pill" onClick={() => navigate('/profile')}>
          💵 {formatMoney(me.balance)}
        </button>
        <button className="icon-btn" onClick={() => navigate('/activity')} aria-label="Activity">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3 12h4l2.5 7 5-14L17 12h4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="amount-display">
        <span className={`amount${raw ? '' : ' dim'}`}>{formatKeypad(raw)}</span>
      </div>

      <div className="keypad">
        {KEYS.map((k) => (
          <button key={k} className="key" onClick={() => press(k)}>
            {k === 'del' ? '⌫' : k}
          </button>
        ))}
      </div>

      <div className="action-row">
        <button className="btn btn-secondary" disabled={!canProceed} onClick={() => go('request')}>
          Request
        </button>
        <button className="btn btn-primary" disabled={!canProceed} onClick={() => go('pay')}>
          Pay
        </button>
      </div>
    </div>
  )
}
