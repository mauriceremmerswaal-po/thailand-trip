import { flights } from '../data/tripData.js'
import { fr24Link, mapsSearch, LOCATIONS } from '../utils/links.js'

const AIRPORT_MAPS = {
  'AMS': LOCATIONS.schiphol,
  'DXB': LOCATIONS.dxb,
  'BKK': LOCATIONS.bkk,
  'DMK': LOCATIONS.dmk,
  'CNX': LOCATIONS.cnx,
  'HKT': LOCATIONS.hkt,
}

function getAirportCode(str) {
  const m = str.match(/\(([A-Z]{3})\)/)
  return m ? m[1] : null
}

export default function Vluchten() {
  const heen = flights.filter(f => f.type === 'heen')
  const intern = flights.filter(f => f.type === 'intern')
  const terug = flights.filter(f => f.type === 'terug')
  const confirmed = flights.filter(f => f.status === 'bevestigd').length
  const pending = flights.filter(f => f.status === 'nog-te-boeken').length

  return (
    <div className="fade-in" style={{ padding: '16px 16px 100px' }}>

      {/* Polarsteps dark header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
        borderRadius: 20, padding: '20px', marginBottom: 16, color: 'white',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 80, opacity: 0.15, lineHeight: 1 }}>✈️</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4, fontWeight: 600, letterSpacing: '0.08em' }}>THAILAND 2026</div>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Vluchten</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>Amsterdam → Bangkok · via Dubai</div>
        <div style={{ display: 'flex', gap: 0, marginTop: 18 }}>
          {[
            { value: flights.length, label: 'Vluchten' },
            { value: confirmed, label: 'Bevestigd' },
            { value: pending, label: 'Te boeken' },
            { value: '2', label: 'Airlines' },
          ].map((s, i) => (
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
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#8c8279', marginBottom: 12, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        {title}
      </div>
      {fls.map(f => <FlightCard key={f.id} flight={f} color={color} />)}
    </div>
  )
}

function FlightCard({ flight: f, color }) {
  const isPending = f.status === 'nog-te-boeken'
  const hasTracker = f.flightNr && f.flightNr !== '—' && !isPending

  const fromCode = getAirportCode(f.from)
  const toCode = getAirportCode(f.to)

  return (
    <div style={{
      background: isPending ? '#fffbeb' : 'white',
      borderRadius: 18, padding: '16px', marginBottom: 12,
      border: isPending ? '1.5px dashed #f59e0b' : '1px solid #ede9e3',
      boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: isPending ? '#f59e0b' : '#c8102e', borderRadius: 8, padding: '4px 10px' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>
              {isPending ? '? TE BOEKEN' : f.flightNr}
            </span>
          </div>
          <span style={{ fontSize: 12, color: '#8c8279', fontWeight: 500 }}>{f.airline}</span>
        </div>
        <span style={{ fontSize: 12, color: '#8c8279', fontVariantNumeric: 'tabular-nums' }}>
          {new Date(f.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Route */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#1a1a1a', fontVariantNumeric: 'tabular-nums' }}>
            {f.departure}
          </div>
          <button
            onClick={() => fromCode && AIRPORT_MAPS[fromCode] && window.open(mapsSearch(AIRPORT_MAPS[fromCode]), '_blank')}
            style={{
              fontSize: 13, color: fromCode && AIRPORT_MAPS[fromCode] ? color : '#8c8279',
              fontWeight: 600, background: 'none', border: 'none', padding: 0,
              cursor: fromCode && AIRPORT_MAPS[fromCode] ? 'pointer' : 'default',
              textDecoration: fromCode && AIRPORT_MAPS[fromCode] ? 'underline' : 'none', textAlign: 'left',
            }}
          >
            {f.from} {fromCode && AIRPORT_MAPS[fromCode] ? '📍' : ''}
          </button>
        </div>

        <div style={{ textAlign: 'center', padding: '0 8px' }}>
          <div style={{ fontSize: 11, color: '#8c8279', marginBottom: 4 }}>{f.duration}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 24, height: 1.5, background: '#ede9e3' }} />
            <span style={{ fontSize: 14 }}>✈️</span>
            <div style={{ width: 24, height: 1.5, background: '#ede9e3' }} />
          </div>
          <div style={{ fontSize: 10, color, fontWeight: 700, marginTop: 4 }}>Non-stop</div>
        </div>

        <div style={{ flex: 1, textAlign: 'right' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#1a1a1a', fontVariantNumeric: 'tabular-nums' }}>
            {f.arrival}
          </div>
          <button
            onClick={() => toCode && AIRPORT_MAPS[toCode] && window.open(mapsSearch(AIRPORT_MAPS[toCode]), '_blank')}
            style={{
              fontSize: 13, color: toCode && AIRPORT_MAPS[toCode] ? color : '#8c8279',
              fontWeight: 600, background: 'none', border: 'none', padding: 0,
              cursor: toCode && AIRPORT_MAPS[toCode] ? 'pointer' : 'default',
              textDecoration: toCode && AIRPORT_MAPS[toCode] ? 'underline' : 'none', textAlign: 'right',
            }}
          >
            {toCode && AIRPORT_MAPS[toCode] ? '📍 ' : ''}{f.to}
          </button>
        </div>
      </div>

      {/* Overstap */}
      {f.overstap && (
        <div style={{
          background: '#f0f9ff', border: '1px solid #bae6fd',
          borderRadius: 10, padding: '8px 12px', marginBottom: 10,
          fontSize: 12, color: '#0369a1', fontWeight: 600,
        }}>
          🔄 {f.overstap}
        </div>
      )}

      {/* Action buttons */}
      {hasTracker && (
        <div style={{ marginBottom: 10 }}>
          <a href={fr24Link(f.flightNr)} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: '#FF6B00', color: 'white', borderRadius: 10,
              padding: '7px 12px', fontSize: 12, fontWeight: 700, textDecoration: 'none',
            }}>
            📡 Volg live op FR24
          </a>
        </div>
      )}

      {/* Chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {f.aircraft && <Chip icon="✈️" label={f.aircraft} />}
        {f.klasse && <Chip icon="🎟️" label={f.klasse} />}
        {f.terminal && <Chip icon="🚪" label={f.terminal} />}
        <Chip
          icon={isPending ? '⚠️' : '✅'}
          label={isPending ? 'Nog te boeken' : 'Bevestigd'}
          color={isPending ? '#f59e0b' : '#10b981'}
        />
      </div>
    </div>
  )
}

function Chip({ icon, label, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: '#f5f2ee', borderRadius: 8, padding: '4px 8px',
      fontSize: 11, color: color || '#8c8279', fontWeight: 500,
    }}>
      <span>{icon}</span><span>{label}</span>
    </div>
  )
}
