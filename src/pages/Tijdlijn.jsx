import { days, CITY_COLORS } from '../data/tripData.js'
import { mapsSearch, grabLink } from '../utils/links.js'

function getCityColor(city) {
  if (city.includes('Bangkok')) return CITY_COLORS['Bangkok']
  if (city.includes('Chiang Mai')) return CITY_COLORS['Chiang Mai']
  if (city.includes('Khao Lak')) return CITY_COLORS['Khao Lak']
  return CITY_COLORS['Nederland']
}

function isToday(dateStr) {
  const t = new Date(); t.setHours(0,0,0,0)
  const d = new Date(dateStr); d.setHours(0,0,0,0)
  return d.getTime() === t.getTime()
}

function isPast(dateStr) {
  const t = new Date(); t.setHours(0,0,0,0)
  const d = new Date(dateStr); d.setHours(0,0,0,0)
  return d < t
}

export default function Tijdlijn() {
  return (
    <div className="fade-in" style={{ padding: '16px 16px 100px' }}>

      {/* Polarsteps dark header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
        borderRadius: 20, padding: '20px', marginBottom: 16, color: 'white',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 80, opacity: 0.15, lineHeight: 1 }}>🗓️</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4, fontWeight: 600, letterSpacing: '0.08em' }}>THAILAND 2026</div>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Reisschema</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>6 april – 24 april 2026</div>
        <div style={{ display: 'flex', gap: 0, marginTop: 18 }}>
          {[{ value: '19', label: 'Dagen' }, { value: '3', label: 'Steden' }, { value: '1', label: 'Land' }, { value: '~22K', label: 'Km' }].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
              <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3, fontWeight: 600, letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* City legend */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Bangkok', color: CITY_COLORS['Bangkok'] },
          { label: 'Chiang Mai', color: CITY_COLORS['Chiang Mai'] },
          { label: 'Khao Lak', color: CITY_COLORS['Khao Lak'] },
        ].map(c => (
          <div key={c.label} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: `${c.color}18`, borderRadius: 20, padding: '4px 10px',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
            <span style={{ fontSize: 11, color: c.color, fontWeight: 700 }}>{c.label}</span>
          </div>
        ))}
      </div>

      {days.map((day, i) => {
        const color = getCityColor(day.city)
        const today = isToday(day.date)
        const past = isPast(day.date)
        const isLast = i === days.length - 1

        return (
          <div key={day.date} style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
              <div style={{
                width: today ? 22 : 14, height: today ? 22 : 14,
                borderRadius: '50%',
                background: past ? '#d4cfc9' : color,
                border: today ? `3px solid ${color}` : 'none',
                outline: today ? `3px solid ${color}33` : 'none',
                flexShrink: 0, marginTop: 14, zIndex: 1,
              }} />
              {!isLast && (
                <div style={{ width: 2, flex: 1, minHeight: 16, background: past ? '#e8e3de' : `${color}33`, marginTop: 4 }} />
              )}
            </div>

            <div style={{ flex: 1, marginBottom: 12, opacity: past ? 0.55 : 1 }}>
              <div style={{
                background: 'white', borderRadius: 16, padding: '14px',
                border: today ? `2px solid ${color}` : '1px solid #ede9e3',
                boxShadow: today ? `0 4px 16px ${color}22` : '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {today && (
                      <span style={{ fontSize: 10, background: color, color: 'white', borderRadius: 6, padding: '2px 7px', fontWeight: 800 }}>
                        VANDAAG
                      </span>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 700, color: past ? '#8c8279' : '#1a1a1a' }}>
                      {day.dayLabel}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: '#8c8279', fontVariantNumeric: 'tabular-nums' }}>
                    {new Date(day.date).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: `${color}18`, borderRadius: 20, padding: '3px 10px', marginBottom: 10,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color }}>{day.city}</span>
                </div>

                {day.hotel && (
                  <div style={{ fontSize: 12, color: '#8c8279', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    🏨 {day.hotel}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {day.events.map((ev, j) => (
                    <EventRow key={j} event={ev} color={color} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function EventRow({ event: ev, color }) {
  const isImportant = ev.type === 'flight' || ev.type === 'arrival' || ev.type === 'departure'

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 8,
      padding: '6px 8px', borderRadius: 10,
      background: ev.pending ? '#fffbeb' : isImportant ? `${color}0a` : '#faf8f5',
      border: ev.pending ? '1px dashed #f59e0b' : 'none',
    }}>
      <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{ev.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          {ev.time && (
            <span style={{ fontSize: 12, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>
              {ev.time}
            </span>
          )}
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{ev.title}</span>
          {ev.pending && (
            <span style={{ fontSize: 9, background: '#f59e0b', color: 'white', borderRadius: 4, padding: '1px 5px', fontWeight: 800 }}>
              TE BOEKEN
            </span>
          )}
          {ev.optional && (
            <span style={{ fontSize: 9, background: '#f5f2ee', color: '#8c8279', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>
              optioneel
            </span>
          )}
        </div>
        {ev.sub && (
          <div style={{ fontSize: 11, color: '#8c8279', marginTop: 1 }}>{ev.sub}</div>
        )}
        {(ev.mapsQuery || ev.grab) && (
          <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
            {ev.mapsQuery && (
              <a href={mapsSearch(ev.mapsQuery)} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#EBF3FE', color: '#4285F4', borderRadius: 7, padding: '3px 8px', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
                📍 Maps
              </a>
            )}
            {ev.grab && (
              <a href={grabLink(ev.mapsQuery)} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#E6F7EE', color: '#00B14F', borderRadius: 7, padding: '3px 8px', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
                🟢 Grab
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
