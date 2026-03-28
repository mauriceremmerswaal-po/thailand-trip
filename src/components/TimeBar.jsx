import { useState, useEffect } from 'react'

function fmt(date, tz) {
  return date.toLocaleTimeString('nl-NL', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export default function TimeBar() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10000)
    return () => clearInterval(t)
  }, [])

  const nl = fmt(now, 'Europe/Amsterdam')
  const th = fmt(now, 'Asia/Bangkok')

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginLeft: 'auto',
      flexShrink: 0,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.04em' }}>🇳🇱 NL</div>
        <div style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#1e293b', lineHeight: 1 }}>
          {nl}
        </div>
      </div>
      <div style={{ width: 1, height: 26, background: '#e2e8f0' }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 700, letterSpacing: '0.04em' }}>🇹🇭 TH</div>
        <div style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#f59e0b', lineHeight: 1 }}>
          {th}
        </div>
      </div>
    </div>
  )
}
