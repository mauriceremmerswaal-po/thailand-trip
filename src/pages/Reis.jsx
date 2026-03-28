import { useState } from 'react'
import { useTheme } from '../context/ThemeContext.jsx'
import Tijdlijn from './Tijdlijn.jsx'
import Vluchten from './Vluchten.jsx'
import Hotels from './Hotels.jsx'

const TABS = [
  { id: 'schema', icon: '🗓️', label: 'Schema' },
  { id: 'vluchten', icon: '✈️', label: 'Vluchten' },
  { id: 'hotels', icon: '🏨', label: 'Hotels' },
]

export default function Reis() {
  const c = useTheme()
  const [tab, setTab] = useState('schema')

  return (
    <div style={{ minHeight: '100vh', background: c.pageBg }}>
      {/* Sub-tab bar */}
      <div style={{
        display: 'flex', background: c.cardBg,
        borderBottom: `1px solid ${c.border}`,
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '11px 8px',
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: tab === t.id ? 800 : 500,
              color: tab === t.id ? c.text : c.muted,
              borderBottom: tab === t.id ? `2.5px solid #f59e0b` : '2.5px solid transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'schema' && <Tijdlijn />}
      {tab === 'vluchten' && <Vluchten />}
      {tab === 'hotels' && <Hotels />}
    </div>
  )
}
