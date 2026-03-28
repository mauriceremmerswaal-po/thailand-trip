export default function BottomNav({ page, setPage }) {
  const tabs = [
    { id: 'kaart', icon: '🗺️', label: 'Kaart' },
    { id: 'vandaag', icon: '📅', label: 'Vandaag' },
    { id: 'tijdlijn', icon: '🗓️', label: 'Schema' },
    { id: 'vluchten', icon: '✈️', label: 'Vluchten' },
    { id: 'hotels', icon: '🏨', label: 'Hotels' },
    { id: 'tips', icon: '📍', label: 'Tips' },
    { id: 'info', icon: 'ℹ️', label: 'Info' },
  ]

  return (
    <nav style={{
      position: 'fixed', bottom: 0,
      left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: '#f5f2ee', borderTop: '1px solid #ede9e3',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom, 6px)',
      zIndex: 100,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setPage(tab.id)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px 2px 4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: page === tab.id ? '#1a1a1a' : '#8c8279',
            fontWeight: page === tab.id ? 800 : 500,
            fontSize: 9,
            gap: 2,
            letterSpacing: '0.03em',
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
