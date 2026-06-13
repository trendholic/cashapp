export function formatMoney(n, withSign = false) {
  const sign = withSign ? (n < 0 ? '-' : '+') : ''
  const abs = Math.abs(n)
  const str = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${sign}$${str}`
}

// Compact amount for the keypad display: no trailing .00 until the user types it
export function formatKeypad(raw) {
  if (!raw || raw === '0') return '$0'
  return '$' + raw
}

export function parseKeypad(raw) {
  const n = parseFloat(raw)
  return isNaN(n) ? 0 : n
}

export function relativeDate(ts) {
  const diff = Date.now() - ts
  const day = 86_400_000
  const date = new Date(ts)
  if (diff < day && new Date().getDate() === date.getDate()) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
  if (diff < day * 2) return 'Yesterday'
  if (diff < day * 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
