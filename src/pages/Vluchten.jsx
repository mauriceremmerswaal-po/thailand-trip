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

  return (
    <div className="fade-in" style={{ padding: '16px 16px 100px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Vluchten</div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Alle vliegtuiginfo op één plek</div>

      <Section title="✈️ Heenvlucht" color="#0ea5e9" flights={heen} />
      <Section title="🛫 Interne vluchten" color="#10b981" flights={intern} />
      <Section title="🏠 Terugvlucht" color="#8b5cf6" flights={terug} />
    </div>
  )
}

function Section({ title, color, flights: fls }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color, marginBottom: 12 }}>{title}</div>
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
      borderRadius: 18,
      padding: '16px',
      marginBottom: 12,
      border: isPending ? '2px dashed #f59e0b' : '1px solid #f1f5f9',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: isPending ? '#f59e0b' : '#c8102e', borderRadius: 8, padding: '4px 10px' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>
              {isPending ? '? TE BOEKEN' : f.flightNr}
            </span>
          </div>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{f.airline}</span>
        </div>
        <span style={{ fontSize: 12, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
          {new Date(f.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Route */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
            {f.departure}
          </div>
          <button
            onClick={() => fromCode && AIRPORT_MAPS[fromCode] && window.open(mapsSearch(AIRPORT_MAPS[fromCode]), '_blank')}
            style={{
              fontSize: 13, color: fromCode && AIRPORT_MAPS[fromCode] ? color : '#64748b',
              fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: fromCode && AIRPORT_MAPS[fromCode] ? 'pointer' : 'default',
              textDecoration: fromCode && AIRPORT_MAPS[fromCode] ? 'underline' : 'none', textAlign: 'left',
            }}
          >
            {f.from} {fromCode && AIRPORT_MAPS[fromCode] ? '📍' : ''}
          </button>
        </div>

        <div style={{ textAlign: 'center', padding: '0 8px' }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{f.duration}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 24, height: 1.5, background: '#e2e8f0' }} />
            <span style={{ fontSize: 14 }}>✈️</span>
            <div style={{ width: 24, height: 1.5, background: '#e2e8f0' }} />
          </div>
          <div style={{ fontSize: 10, color, fontWeight: 700, marginTop: 4 }}>Non-stop</div>
        </div>

        <div style={{ flex: 1, textAlign: 'right' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
            {f.arrival}
          </div>
          <button
            onClick={() => toCode && AIRPORT_MAPS[toCode] && window.open(mapsSearch(AIRPORT_MAPS[toCode]), '_blank')}
            style={{
              fontSize: 13, color: toCode && AIRPORT_MAPS[toCode] ? color : '#64748b',
              fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: toCode && AIRPORT_MAPS[toCode] ? 'pointer' : 'default',
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
          background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10,
          padding: '8px 12px', marginBottom: 10, fontSize: 12, color: '#0369a1', fontWeight: 600,
        }}>
          🔄 {f.overstap}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {hasTracker && (
          <a
            href={fr24Link(f.flightNr)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: '#FF6B00', color: 'white', borderRadius: 10,
              padding: '7px 12px', fontSize: 12, fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            📡 Volg live op FR24
          </a>
        )}
      </div>

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
      background: '#f8fafc', borderRadius: 8, padding: '4px 8px',
      fontSize: 11, color: color || '#64748b', fontWeight: 500,
    }}>
      <span>{icon}</span><span>{label}</span>
    </div>
  )
}
