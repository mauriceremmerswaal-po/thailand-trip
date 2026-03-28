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
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Reisschema</div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>6 april – 24 april 2026</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Bangkok', color: CITY_COLORS['Bangkok'] },
          { label: 'Chiang Mai', color: CITY_COLORS['Chiang Mai'] },
          { label: 'Khao Lak', color: CITY_COLORS['Khao Lak'] },
        ].map(c => (
          <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color }} />
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{c.label}</span>
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
                background: past ? '#e2e8f0' : color,
                border: today ? `3px solid ${color}` : 'none',
                outline: today ? `3px solid ${color}33` : 'none',
                flexShrink: 0, marginTop: 14, zIndex: 1,
              }} />
              {!isLast && (
                <div style={{ width: 2, flex: 1, minHeight: 16, background: past ? '#e2e8f0' : `${color}33`, marginTop: 4 }} />
              )}
            </div>

            <div style={{ flex: 1, marginBottom: 12, opacity: past ? 0.55 : 1 }}>
              <div style={{
                background: 'white', borderRadius: 16, padding: '14px',
                border: today ? `2px solid ${color}` : '1px solid #f1f5f9',
                boxShadow: today ? `0 4px 16px ${color}22` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {today && (
                      <span style={{
                        fontSize: 10, background: color, color: 'white',
                        borderRadius: 6, padding: '2px 7px', fontWeight: 800,
                      }}>VANDAAG</span>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 700, color: past ? '#94a3b8' : '#0f172a' }}>
                      {day.dayLabel}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                    {new Date(day.date).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: `${color}18`, borderRadius: 8, padding: '3px 10px', marginBottom: 10,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color }}>{day.city}</span>
                </div>

                {day.hotel && (
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
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
      background: ev.pending ? '#fffbeb' : isImportant ? `${color}0d` : '#f8fafc',
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
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{ev.title}</span>
          {ev.pending && (
            <span style={{ fontSize: 9, background: '#f59e0b', color: 'white', borderRadius: 4, padding: '1px 5px', fontWeight: 800 }}>
              TE BOEKEN
            </span>
          )}
          {ev.optional && (
            <span style={{ fontSize: 9, background: '#f1f5f9', color: '#64748b', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>
              optioneel
            </span>
          )}
        </div>
        {ev.sub && (
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{ev.sub}</div>
        )}
        {/* Action icons */}
        {(ev.mapsQuery || ev.grab) && (
          <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
            {ev.mapsQuery && (
              <a
                href={mapsSearch(ev.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  background: '#EBF3FE', color: '#4285F4', borderRadius: 7,
                  padding: '3px 8px', fontSize: 11, fontWeight: 700, textDecoration: 'none',
                }}
              >
                📍 Maps
              </a>
            )}
            {ev.grab && (
              <a
                href={grabLink(ev.mapsQuery)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  background: '#E6F7EE', color: '#00B14F', borderRadius: 7,
                  padding: '3px 8px', fontSize: 11, fontWeight: 700, textDecoration: 'none',
                }}
              >
                🟢 Grab
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
