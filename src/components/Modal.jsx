import { useTheme } from '../context/ThemeContext.jsx'

export default function Modal({ title, content, mapsQuery, tripadvisorQuery, onClose, color }) {
  const c = useTheme()

  function tripAdvisorLink(q) {
    return `https://www.tripadvisor.com/Search?q=${encodeURIComponent(q)}`
  }
  function mapsLink(q) {
    return `https://maps.google.com/?q=${encodeURIComponent(q)}`
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />

      {/* Sheet */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          background: c.cardBg,
          borderRadius: '22px 22px 0 0',
          padding: '16px 20px 32px',
          width: '100%',
          maxWidth: 430,
          maxHeight: '75vh',
          overflowY: 'auto',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.25)',
        }}
      >
        {/* Handle */}
        <div style={{ width: 40, height: 4, background: c.border, borderRadius: 2, margin: '0 auto 18px' }} />

        {/* Title */}
        <div style={{ fontSize: 19, fontWeight: 900, color: c.text, marginBottom: 10, lineHeight: 1.2 }}>{title}</div>

        {/* Content */}
        <div style={{ fontSize: 14, color: c.muted, lineHeight: 1.7, marginBottom: 20 }}>{content}</div>

        {/* Action buttons */}
        {(mapsQuery || tripadvisorQuery) && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {mapsQuery && (
              <a href={mapsLink(mapsQuery)} target="_blank" rel="noopener noreferrer"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: '#4285F4', color: 'white', borderRadius: 12,
                  padding: '11px', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                }}>
                📍 Google Maps
              </a>
            )}
            {tripadvisorQuery && (
              <a href={tripAdvisorLink(tripadvisorQuery)} target="_blank" rel="noopener noreferrer"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: '#00af87', color: 'white', borderRadius: 12,
                  padding: '11px', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                }}>
                🍽️ TripAdvisor
              </a>
            )}
          </div>
        )}

        {/* Close */}
        <button onClick={onClose} style={{
          width: '100%', padding: '13px',
          background: color || '#1a1a2e', color: 'white', borderRadius: 14,
          border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>
          Sluiten
        </button>
      </div>
    </div>
  )
}
