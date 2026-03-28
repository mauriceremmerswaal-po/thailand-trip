import { hotels, CITY_COLORS } from '../data/tripData.js'
import { mapsSearch, grabLink } from '../utils/links.js'

const CITY_EMOJIS = { 'Bangkok': '🌆', 'Chiang Mai': '🏔️', 'Khao Lak': '🏖️' }
const CITY_BG = {
  'Bangkok': 'linear-gradient(135deg, #f59e0b22, #fbbf2410)',
  'Chiang Mai': 'linear-gradient(135deg, #10b98122, #34d39910)',
  'Khao Lak': 'linear-gradient(135deg, #0ea5e922, #38bdf810)',
}

const HOTEL_FEATURES = {
  'h1': ['Zwembad', 'Spa', 'Fitness', 'Restaurant', 'Wifi'],
  'h2': ['Zwembad', 'Tuin', 'Restaurant', 'Wifi'],
  'h3': ['Privéstrand', 'Zwembad', 'Spa', 'Duiken', 'Restaurant', 'Wifi'],
  'h4': ['Zwembad', 'Spa', 'Fitness', 'Restaurant', 'Wifi'],
}

export default function Hotels() {
  return (
    <div className="fade-in" style={{ padding: '16px 16px 100px' }}>

      {/* Header summary - Booking.com style */}
      <div style={{
        background: '#003580',
        borderRadius: 16, padding: '18px 20px', marginBottom: 20, color: 'white',
      }}>
        <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>Jouw verblijven</div>
        <div style={{ fontSize: 22, fontWeight: 900 }}>4 hotels · 19 nachten</div>
        <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>14 apr – 23 apr 2026 · Alle reserveringen bevestigd</div>
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

  const dayNames = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za']

  return (
    <div style={{
      background: 'white',
      borderRadius: 12,
      marginBottom: 16,
      border: '1px solid #e7e7e7',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      overflow: 'hidden',
    }}>
      {/* Image area */}
      <div style={{
        background: CITY_BG[h.city] || '#f8fafc',
        padding: '20px 18px 16px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 10,
          background: `${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, flexShrink: 0,
        }}>
          {emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e', lineHeight: 1.2, marginBottom: 3 }}>
            {h.name}
          </div>
          {/* Clickable address */}
          <a
            href={mapsSearch(h.mapsQuery || h.name)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              fontSize: 12, color: '#0071c2', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 3, marginBottom: 4,
            }}>
              📍 <span style={{ textDecoration: 'underline' }}>{h.address || h.city}</span>
            </div>
          </a>
          {h.phone && (
            <a href={`tel:${h.phone}`} style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 3 }}>
                📞 {h.phone}
              </div>
            </a>
          )}
        </div>
        <div style={{
          background: '#008009', color: 'white',
          fontSize: 11, fontWeight: 700, borderRadius: 6,
          padding: '4px 10px', flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>
          ✓ Bevestigd
        </div>
      </div>

      {/* Check-in / Check-out */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{
          display: 'flex', alignItems: 'stretch', gap: 0,
        }}>
          {/* Check-in */}
          <div style={{ flex: 1, paddingRight: 12 }}>
            <div style={{ fontSize: 10, color: '#888', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }}>
              CHECK-IN
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#1a1a2e', lineHeight: 1 }}>
              {checkInDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
            </div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
              {checkInDate.toLocaleDateString('nl-NL', { weekday: 'long' })}
            </div>
          </div>

          {/* Duration */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '0 12px',
          }}>
            <div style={{
              background: '#f2f2f2', borderRadius: 20,
              padding: '4px 10px', fontSize: 12, fontWeight: 700, color: '#444',
              whiteSpace: 'nowrap',
            }}>
              {h.nights} nachten
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 4 }}>
              <div style={{ width: 20, height: 1.5, background: '#ccc' }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ccc' }} />
              <div style={{ width: 20, height: 1.5, background: '#ccc' }} />
            </div>
          </div>

          {/* Check-out */}
          <div style={{ flex: 1, paddingLeft: 12, borderLeft: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: 10, color: '#888', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }}>
              CHECK-OUT
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#1a1a2e', lineHeight: 1 }}>
              {checkOutDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
            </div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
              {checkOutDate.toLocaleDateString('nl-NL', { weekday: 'long' })}
            </div>
          </div>
        </div>

        {/* Confirmation number */}
        {h.confirmation && (
          <div style={{
            marginTop: 12, background: '#f8f9fa', borderRadius: 8,
            padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 12, color: '#666' }}>Bevestigingsnummer</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#1a1a2e', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.03em' }}>
              {h.confirmation}
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      {features.length > 0 && (
        <div style={{ padding: '12px 18px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {features.map(f => (
              <span key={f} style={{
                background: '#f2f8ff', color: '#0071c2',
                fontSize: 11, fontWeight: 600, borderRadius: 6,
                padding: '3px 8px', border: '1px solid #d0e8ff',
              }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ padding: '12px 18px', display: 'flex', gap: 8 }}>
        <a
          href={mapsSearch(h.mapsQuery || h.name)}
          target="_blank" rel="noopener noreferrer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: '#0071c2', color: 'white', borderRadius: 8,
            padding: '11px', fontSize: 13, fontWeight: 700, textDecoration: 'none',
          }}
        >
          📍 Google Maps
        </a>
        <a
          href={grabLink(h.mapsQuery)}
          target="_blank" rel="noopener noreferrer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: '#00B14F', color: 'white', borderRadius: 8,
            padding: '11px', fontSize: 13, fontWeight: 700, textDecoration: 'none',
          }}
        >
          🟢 Grab
        </a>
      </div>
    </div>
  )
}
