import { hotels, CITY_COLORS } from '../data/tripData.js'
import { mapsSearch } from '../utils/links.js'
import { useTheme } from '../context/ThemeContext.jsx'

const MAPS_ICON = 'https://www.google.com/s2/favicons?domain=maps.google.com&sz=64'
const TA_ICON = 'https://www.google.com/s2/favicons?domain=tripadvisor.com&sz=64'

const CITY_EMOJIS = { 'Bangkok': '🌆', 'Chiang Mai': '🏔️', 'Khao Lak': '🏖️' }

const HOTEL_FEATURES = {
  'h1': ['Zwembad', 'Spa', 'Fitness', 'Restaurant', 'Wifi'],
  'h2': ['Zwembad', 'Tuin', 'Restaurant', 'Wifi'],
  'h3': ['Privéstrand', 'Zwembad', 'Spa', 'Duiken', 'Restaurant', 'Wifi'],
  'h4': ['Zwembad', 'Spa', 'Fitness', 'Restaurant', 'Wifi'],
}

const HOTEL_PHOTOS = {
  'h1': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=80',
  'h2': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=700&q=80',
  'h3': 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=700&q=80',
  'h4': 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=700&q=80',
}

export default function Hotels() {
  const c = useTheme()

  return (
    <div className="fade-in" style={{ padding: '16px 16px 100px', background: c.pageBg, minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)', borderRadius: 20, padding: '20px', marginBottom: 16, color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 80, opacity: 0.15, lineHeight: 1 }}>🏨</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4, fontWeight: 600, letterSpacing: '0.08em' }}>THAILAND 2026</div>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Verblijven</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>7 april – 23 april · alle bevestigd ✓</div>
        <div style={{ display: 'flex', gap: 0, marginTop: 18 }}>
          {[{ value: '4', label: 'Hotels' }, { value: '16', label: 'Nachten' }, { value: '3', label: 'Steden' }, { value: '✓', label: 'Bevestigd' }].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
              <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3, fontWeight: 600, letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      {hotels.map(h => <HotelCard key={h.id} hotel={h} />)}
    </div>
  )
}

function HotelCard({ hotel: h }) {
  const c = useTheme()
  const color = CITY_COLORS[h.city] || '#6b7280'
  const emoji = CITY_EMOJIS[h.city] || '🏨'
  const features = HOTEL_FEATURES[h.id] || []
  const photo = HOTEL_PHOTOS[h.id]
  const checkInDate = new Date(h.checkIn)
  const checkOutDate = new Date(h.checkOut)

  return (
    <div style={{ background: c.cardBg, borderRadius: 18, marginBottom: 16, border: `1px solid ${c.border}`, borderTop: `3px solid ${color}`, overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.10)' }}>

      {/* Hotel photo */}
      {photo && (
        <div style={{ height: 190, overflow: 'hidden', position: 'relative' }}>
          <img
            src={photo}
            alt={h.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => { e.target.parentElement.style.display = 'none' }}
          />
          <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ background: color, color: 'white', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 800 }}>{h.city}</div>
          </div>
        </div>
      )}

      <div style={{ background: `${color}12`, padding: '18px 18px 14px', borderBottom: `1px solid ${c.border}`, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: c.text, lineHeight: 1.2, marginBottom: 4, letterSpacing: '-0.01em' }}>{h.name}</div>
          <a href={mapsSearch(h.mapsQuery || h.name)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 13, color: '#4285F4', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
              📍 <span style={{ textDecoration: 'underline' }}>{h.address || h.city}</span>
            </div>
          </a>
          {h.phone && <a href={`tel:${h.phone}`} style={{ textDecoration: 'none' }}><div style={{ fontSize: 12, color: c.muted, display: 'flex', alignItems: 'center', gap: 3 }}>📞 {h.phone}</div></a>}
        </div>
        <div style={{ background: '#10b98120', color: '#10b981', fontSize: 11, fontWeight: 800, borderRadius: 8, padding: '4px 10px', flexShrink: 0, whiteSpace: 'nowrap', border: '1px solid #10b98133' }}>✓ Bevestigd</div>
      </div>

      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${c.border}` }}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <div style={{ fontSize: 10, color: c.muted, fontWeight: 800, letterSpacing: '0.07em', marginBottom: 4 }}>CHECK-IN</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: c.text, lineHeight: 1 }}>{checkInDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}</div>
            <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{checkInDate.toLocaleDateString('nl-NL', { weekday: 'long' })}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 12px' }}>
            <div style={{ background: `${color}18`, color, borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' }}>{h.nights} nachten</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 4 }}>
              <div style={{ width: 20, height: 1.5, background: c.border }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
              <div style={{ width: 20, height: 1.5, background: c.border }} />
            </div>
          </div>
          <div style={{ flex: 1, paddingLeft: 12, borderLeft: `1px solid ${c.border}` }}>
            <div style={{ fontSize: 10, color: c.muted, fontWeight: 800, letterSpacing: '0.07em', marginBottom: 4 }}>CHECK-OUT</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: c.text, lineHeight: 1 }}>{checkOutDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}</div>
            <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{checkOutDate.toLocaleDateString('nl-NL', { weekday: 'long' })}</div>
          </div>
        </div>
        {h.confirmation && (
          <div style={{ marginTop: 12, background: c.rowBg, borderRadius: 10, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: c.muted }}>Bevestigingsnummer</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: c.text, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.03em' }}>{h.confirmation}</span>
          </div>
        )}
      </div>

      {features.length > 0 && (
        <div style={{ padding: '12px 18px', borderBottom: `1px solid ${c.border}` }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {features.map(f => (
              <span key={f} style={{ background: `${color}12`, color, fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '3px 10px', border: `1px solid ${color}33` }}>{f}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '12px 18px', display: 'flex', gap: 10, justifyContent: 'stretch' }}>
        <a href={mapsSearch(h.mapsQuery || h.name)} target="_blank" rel="noopener noreferrer"
          title="Google Maps"
          style={{ flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#4285F4', color: 'white', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
          <img src={MAPS_ICON} width={20} height={20} alt="Maps" style={{ filter: 'brightness(0) invert(1)' }} />
          Navigeer
        </a>
        <a href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(h.name)}`} target="_blank" rel="noopener noreferrer"
          title="TripAdvisor"
          style={{ flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#00af87', color: 'white', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
          <img src={TA_ICON} width={20} height={20} alt="TripAdvisor" style={{ filter: 'brightness(0) invert(1)' }} />
          Restaurants
        </a>
      </div>
    </div>
  )
}
