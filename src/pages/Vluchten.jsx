import { flights } from '../data/tripData.js'
import { fr24Link, mapsSearch, LOCATIONS } from '../utils/links.js'
import { useTheme } from '../context/ThemeContext.jsx'

const MAPS_ICON = 'https://www.google.com/s2/favicons?domain=maps.google.com&sz=64'

const AIRPORT_MAPS = {
  'AMS': LOCATIONS.schiphol,
  'DXB': LOCATIONS.dxb,
  'BKK': LOCATIONS.bkk,
  'DMK': LOCATIONS.dmk,
  'CNX': LOCATIONS.cnx,
  'HKT': LOCATIONS.hkt,
}

const AIRCRAFT_PHOTOS = {
  'Boeing 777-300ER': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&q=80',
  'Airbus A380-800': 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=700&q=80',
}

const AIRLINE_COLORS = {
  'Emirates': '#c8102e',
  'AirAsia': '#FF0000',
  'VietJet Air': '#E40013',
  'Intern': '#10b981',
  'Nog te boeken': '#f59e0b',
}

function getAirportCode(str) {
  const m = str.match(/\(([A-Z]{3})\)/)
  return m ? m[1] : null
}

export default function Vluchten() {
  const c = useTheme()
  const heen = flights.filter(f => f.type === 'heen')
  const intern = flights.filter(f => f.type === 'intern')
  const terug = flights.filter(f => f.type === 'terug')
  const confirmed = flights.filter(f => f.status === 'bevestigd').length
  const pending = flights.filter(f => f.status === 'nog-te-boeken').length

  return (
    <div className="fade-in" style={{ padding: '16px 16px 100px', background: c.pageBg, minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)', borderRadius: 20, padding: '20px', marginBottom: 16, color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 80, opacity: 0.15, lineHeight: 1 }}>✈️</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4, fontWeight: 600, letterSpacing: '0.08em' }}>THAILAND 2026</div>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Vluchten</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>Amsterdam → Bangkok · via Dubai</div>
        <div style={{ display: 'flex', gap: 0, marginTop: 18 }}>
          {[{ value: flights.length, label: 'Vluchten' }, { value: confirmed, label: 'Bevestigd' }, { value: pending, label: 'Te boeken' }, { value: '2', label: 'Airlines' }].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
              <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3, fontWeight: 600, letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <FlightSection title="✈️ Heenvlucht" color="#0ea5e9" flights={heen} />
      <FlightSection title="🛫 Interne vluchten" color="#10b981" flights={intern} />
      <FlightSection title="🏠 Terugvlucht" color="#8b5cf6" flights={terug} />
    </div>
  )
}

function FlightSection({ title, color, flights: fls }) {
  const c = useTheme()
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${color}18`, borderRadius: 20, padding: '5px 14px' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 800, color, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{title}</span>
        </div>
      </div>
      {fls.map(f => <FlightCard key={f.id} flight={f} color={color} />)}
    </div>
  )
}

function FlightCard({ flight: f, color }) {
  const c = useTheme()
  const isPending = f.status === 'nog-te-boeken'
  const hasTracker = f.flightNr && f.flightNr !== '—' && !isPending
  const fromCode = getAirportCode(f.from)
  const toCode = getAirportCode(f.to)
  const aircraftPhoto = f.aircraft ? AIRCRAFT_PHOTOS[f.aircraft] : null
  const airlineColor = AIRLINE_COLORS[f.airline] || '#6b7280'

  return (
    <div style={{ background: isPending ? c.pendingBg : c.cardBg, borderRadius: 18, marginBottom: 12, borderLeft: isPending ? `4px solid #f59e0b` : `4px solid ${color}`, boxShadow: '0 4px 20px rgba(0,0,0,0.10)', overflow: 'hidden' }}>

      {/* Aircraft photo */}
      {aircraftPhoto && !isPending && (
        <div style={{ height: 120, overflow: 'hidden', position: 'relative' }}>
          <img
            src={aircraftPhoto}
            alt={f.aircraft}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => { e.target.parentElement.style.display = 'none' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))' }} />
          <div style={{ position: 'absolute', bottom: 10, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>{f.aircraft}</div>
            <div style={{ background: airlineColor, color: 'white', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 800 }}>{f.airline}</div>
          </div>
        </div>
      )}

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: isPending ? '#f59e0b' : airlineColor, borderRadius: 8, padding: '6px 14px' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>{isPending ? '? TE BOEKEN' : f.flightNr}</span>
            </div>
            {!aircraftPhoto && <span style={{ fontSize: 12, color: c.muted, fontWeight: 500 }}>{f.airline}</span>}
          </div>
          <span style={{ fontSize: 12, color: c.muted, fontVariantNumeric: 'tabular-nums' }}>{new Date(f.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, background: `${color}08`, borderRadius: 12, padding: '14px 12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: c.text, fontVariantNumeric: 'tabular-nums' }}>{f.departure}</div>
            <button onClick={() => fromCode && AIRPORT_MAPS[fromCode] && window.open(mapsSearch(AIRPORT_MAPS[fromCode]), '_blank')}
              style={{ fontSize: 13, color: fromCode && AIRPORT_MAPS[fromCode] ? color : c.muted, fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: fromCode && AIRPORT_MAPS[fromCode] ? 'pointer' : 'default', textDecoration: fromCode && AIRPORT_MAPS[fromCode] ? 'underline' : 'none', textAlign: 'left' }}>
              {f.from} {fromCode && AIRPORT_MAPS[fromCode] ? '📍' : ''}
            </button>
          </div>
          <div style={{ textAlign: 'center', padding: '0 8px' }}>
            <div style={{ fontSize: 11, color: c.muted, marginBottom: 4 }}>{f.duration}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 24, height: 1.5, background: c.border }} />
              <span style={{ fontSize: 14 }}>✈️</span>
              <div style={{ width: 24, height: 1.5, background: c.border }} />
            </div>
            <div style={{ fontSize: 10, color, fontWeight: 700, marginTop: 4 }}>Non-stop</div>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: c.text, fontVariantNumeric: 'tabular-nums' }}>{f.arrival}</div>
            <button onClick={() => toCode && AIRPORT_MAPS[toCode] && window.open(mapsSearch(AIRPORT_MAPS[toCode]), '_blank')}
              style={{ fontSize: 13, color: toCode && AIRPORT_MAPS[toCode] ? color : c.muted, fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: toCode && AIRPORT_MAPS[toCode] ? 'pointer' : 'default', textDecoration: toCode && AIRPORT_MAPS[toCode] ? 'underline' : 'none', textAlign: 'right' }}>
              {toCode && AIRPORT_MAPS[toCode] ? '📍 ' : ''}{f.to}
            </button>
          </div>
        </div>

        {f.overstap && (
          <div style={{ background: c.infoBlueBg, border: `1px solid ${c.infoBlueBorder}`, borderRadius: 10, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: c.infoBlueText, fontWeight: 600 }}>
            🔄 {f.overstap}
          </div>
        )}

        {hasTracker && (
          <div style={{ marginBottom: 10 }}>
            <a href={fr24Link(f.flightNr)} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#FF6B00', color: 'white', borderRadius: 10, padding: '7px 12px', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
              📡 Volg live op FR24
            </a>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {f.aircraft && <Chip label={`✈️ ${f.aircraft}`} c={c} />}
          {f.klasse && <Chip label={`🎟️ ${f.klasse}`} c={c} />}
          {f.terminal && <Chip label={`🚪 ${f.terminal}`} c={c} />}
          <Chip label={isPending ? '⚠️ Nog te boeken' : '✅ Bevestigd'} color={isPending ? '#f59e0b' : '#10b981'} c={c} />
        </div>
      </div>
    </div>
  )
}

function Chip({ label, color, c }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: c.chipBg, borderRadius: 8, padding: '4px 8px', fontSize: 11, color: color || c.muted, fontWeight: 500 }}>
      {label}
    </div>
  )
}
