import { useTheme } from '../context/ThemeContext.jsx'

export default function BottomNav({ page, setPage }) {
  const c = useTheme()

  const tabs = [
    { id: 'kaart',  icon: '🗺️', label: 'Kaart' },
    { id: 'vandaag', icon: '📅', label: 'Vandaag' },
    { id: 'tips',   icon: '📍', label: 'Tips' },
    { id: 'reis',   icon: '✈️', label: 'Reis' },
    { id: 'info',   icon: 'ℹ️', label: 'Info' },
  ]

  return (
    <nav style={{
      position: 'fixed', bottom: 0,
      left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: c.navBg, borderTop: `1px solid ${c.border}`,
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom, 6px)',
      zIndex: 100,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setPage(tab.id)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '6px 2px 4px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: page === tab.id ? '#f59e0b' : c.muted,
            fontWeight: page === tab.id ? 800 : 500,
            fontSize: 9, gap: 2, letterSpacing: '0.03em',
          }}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
