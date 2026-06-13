import { useEffect, useState } from 'react'

function fmt() {
  const d = new Date()
  let h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  h = h % 12 || 12
  return `${h}:${m}`
}

export default function StatusBar() {
  const [time, setTime] = useState(fmt())
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="statusbar">
      <span className="sb-time">{time}</span>
      <div className="sb-island" />
      <div className="sb-icons">
        {/* cellular */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0.5" width="3" height="11.5" rx="1" />
        </svg>
        {/* wifi */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-hidden="true">
          <path d="M8.5 2.2c2.7 0 5.2 1 7 2.8l-1.4 1.5A7.8 7.8 0 0 0 8.5 4.3 7.8 7.8 0 0 0 2.9 6.5L1.5 5C3.3 3.2 5.8 2.2 8.5 2.2Z" />
          <path d="M8.5 5.6c1.7 0 3.3.7 4.5 1.8l-1.5 1.5a4.3 4.3 0 0 0-6 0L4 7.4A6.4 6.4 0 0 1 8.5 5.6Z" />
          <circle cx="8.5" cy="10" r="1.6" />
        </svg>
        {/* battery */}
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
          <rect x="24" y="4" width="1.5" height="5" rx="0.75" fill="currentColor" fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  )
}
