import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../state/store'
import { formatKeypad, formatMoney, parseKeypad } from '../utils/format'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del']

export default function Home() {
  const { state } = useStore()
  const navigate = useNavigate()
  const [raw, setRaw] = useState('')

  function press(key) {
    setRaw((prev) => {
      if (key === 'del') return prev.slice(0, -1)
      if (key === '.') {
        if (prev.includes('.')) return prev
        return prev === '' ? '0.' : prev + '.'
      }
      // limit to 2 decimal places
      if (prev.includes('.') && prev.split('.')[1]?.length >= 2) return prev
      // avoid leading zeros like "00"
      if (prev === '0') return key
      // cap at a sane max
      const next = prev + key
      if (parseFloat(next) > 100000) return prev
      return next
    })
  }

  const amount = parseKeypad(raw)
  const canProceed = amount > 0

  function go(mode) {
    navigate('/send', { state: { amount, mode } })
  }

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="balance-pill">
        <span>💵</span>
        <span>{formatMoney(state.balance)}</span>
      </div>

      <div className="amount-display">
        <span className="amount">{formatKeypad(raw)}</span>
      </div>

      <div className="keypad">
        {KEYS.map((k) => (
          <button key={k} className="key" onClick={() => press(k)}>
            {k === 'del' ? '⌫' : k}
          </button>
        ))}
      </div>

      <div className="action-row">
        <button
          className="btn btn-secondary"
          disabled={!canProceed}
          onClick={() => go('request')}
        >
          Request
        </button>
        <button
          className="btn btn-primary"
          disabled={!canProceed}
          onClick={() => go('pay')}
        >
          Pay
        </button>
      </div>
    </div>
  )
}
