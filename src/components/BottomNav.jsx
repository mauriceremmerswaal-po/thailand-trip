export default function BottomNav({ page, setPage }) {
  const tabs = [
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
      background: 'white', borderTop: '1px solid #e2e8f0',
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom, 6px)',
      zIndex: 100,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-pill${page === tab.id ? ' active' : ''}`}
          onClick={() => setPage(tab.id)}
        >
          <span className="tab-icon" style={{ fontSize: 18 }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
