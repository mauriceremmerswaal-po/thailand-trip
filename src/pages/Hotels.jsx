import { hotels, CITY_COLORS } from '../data/tripData.js'
import { mapsSearch, grabLink } from '../utils/links.js'

const CITY_EMOJIS = { 'Bangkok': '🌆', 'Chiang Mai': '🏔️', 'Khao Lak': '🏖️' }

const HOTEL_FEATURES = {
  'h1': ['Zwembad', 'Spa', 'Fitness', 'Restaurant', 'Wifi'],
  'h2': ['Zwembad', 'Tuin', 'Restaurant', 'Wifi'],
  'h3': ['Privéstrand', 'Zwembad', 'Spa', 'Duiken', 'Restaurant', 'Wifi'],
  'h4': ['Zwembad', 'Spa', 'Fitness', 'Restaurant', 'Wifi'],
}

export default function Hotels() {
  return (
    <div className="fade-in" style={{ padding: '16px 16px 100px' }}>

      {/* Polarsteps dark header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
        borderRadius: 20, padding: '20px', marginBottom: 16, color: 'white',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 80, opacity: 0.15, lineHeight: 1 }}>🏨</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4, fontWeight: 600, letterSpacing: '0.08em' }}>THAILAND 2026</div>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Verblijven</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>7 april – 23 april · alle bevestigd ✓</div>
        <div style={{ display: 'flex', gap: 0, marginTop: 18 }}>
          {[
            { value: '4', label: 'Hotels' },
            { value: '16', label: 'Nachten' },
            { value: '3', label: 'Steden' },
            { value: '✓', label: 'Bevestigd' },
          ].map((s, i) => (
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
  const color = CITY_COLORS[h.city] || '#6b7280'
  const emoji = CITY_EMOJIS[h.city] || '🏨'
  const features = HOTEL_FEATURES[h.id] || []
  const checkInDate = new Date(h.checkIn)
  const checkOutDate = new Date(h.checkOut)

  return (
    <div style={{
      background: 'white', borderRadius: 18, marginBottom: 16,
      border: '1px solid #ede9e3', overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    }}>
      {/* Hotel header */}
      <div style={{
        background: `linear-gradient(135deg, ${color}18, ${color}08)`,
        padding: '18px 18px 14px',
        borderBottom: '1px solid #ede9e3',
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: `${color}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, flexShrink: 0,
        }}>
          {emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.2, marginBottom: 4 }}>
            {h.name}
          </div>
          <a href={mapsSearch(h.mapsQuery || h.name)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 12, color: '#4285F4', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
              📍 <span style={{ textDecoration: 'underline' }}>{h.address || h.city}</span>
            </div>
          </a>
          {h.phone && (
            <a href={`tel:${h.phone}`} style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: 12, color: '#8c8279', display: 'flex', alignItems: 'center', gap: 3 }}>
                📞 {h.phone}
              </div>
            </a>
          )}
        </div>
        <div style={{
          background: '#10b98120', color: '#10b981',
          fontSize: 11, fontWeight: 800, borderRadius: 8,
          padding: '4px 10px', flexShrink: 0, whiteSpace: 'nowrap',
          border: '1px solid #10b98133',
        }}>
          ✓ Bevestigd
        </div>
      </div>

      {/* Check-in / Check-out */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #ede9e3' }}>
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <div style={{ fontSize: 10, color: '#8c8279', fontWeight: 800, letterSpacing: '0.07em', marginBottom: 4 }}>CHECK-IN</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>
              {checkInDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
            </div>
            <div style={{ fontSize: 12, color: '#8c8279', marginTop: 2 }}>
              {checkInDate.toLocaleDateString('nl-NL', { weekday: 'long' })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 12px' }}>
            <div style={{
              background: `${color}18`, color, borderRadius: 20,
              padding: '4px 10px', fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap',
            }}>
              {h.nights} nachten
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 4 }}>
              <div style={{ width: 20, height: 1.5, background: '#ede9e3' }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
              <div style={{ width: 20, height: 1.5, background: '#ede9e3' }} />
            </div>
          </div>

          <div style={{ flex: 1, paddingLeft: 12, borderLeft: '1px solid #ede9e3' }}>
            <div style={{ fontSize: 10, color: '#8c8279', fontWeight: 800, letterSpacing: '0.07em', marginBottom: 4 }}>CHECK-OUT</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>
              {checkOutDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
            </div>
            <div style={{ fontSize: 12, color: '#8c8279', marginTop: 2 }}>
              {checkOutDate.toLocaleDateString('nl-NL', { weekday: 'long' })}
            </div>
          </div>
        </div>

        {h.confirmation && (
          <div style={{
            marginTop: 12, background: '#f5f2ee', borderRadius: 10,
            padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 12, color: '#8c8279' }}>Bevestigingsnummer</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.03em' }}>
              {h.confirmation}
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      {features.length > 0 && (
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #ede9e3' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {features.map(f => (
              <span key={f} style={{
                background: `${color}12`, color,
                fontSize: 11, fontWeight: 700, borderRadius: 20,
                padding: '3px 10px', border: `1px solid ${color}33`,
              }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ padding: '12px 18px', display: 'flex', gap: 8 }}>
        <a href={mapsSearch(h.mapsQuery || h.name)} target="_blank" rel="noopener noreferrer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: '#4285F4', color: 'white', borderRadius: 10,
            padding: '11px', fontSize: 13, fontWeight: 700, textDecoration: 'none',
          }}>
          📍 Google Maps
        </a>
        <a href={grabLink(h.mapsQuery)} target="_blank" rel="noopener noreferrer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: '#00B14F', color: 'white', borderRadius: 10,
            padding: '11px', fontSize: 13, fontWeight: 700, textDecoration: 'none',
          }}>
          🟢 Grab
        </a>
      </div>
    </div>
  )
}
