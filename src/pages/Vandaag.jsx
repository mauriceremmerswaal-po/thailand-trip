import { days, CITY_COLORS } from '../data/tripData.js'
import { mapsDirections, mapsSearch, grabLink, HOME, SCHIPHOL } from '../utils/links.js'

function getCityColor(city) {
  if (city.includes('Bangkok')) return CITY_COLORS['Bangkok']
  if (city.includes('Chiang Mai')) return CITY_COLORS['Chiang Mai']
  if (city.includes('Khao Lak')) return CITY_COLORS['Khao Lak']
  return CITY_COLORS['Nederland']
}

function getDayStatus(dateStr) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(dateStr)
  d.setHours(0, 0, 0, 0)
  const diff = Math.round((d - today) / (1000 * 60 * 60 * 24))
  return diff
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })
}

const TRIP_START = new Date('2026-04-06')
const TRIP_END = new Date('2026-04-24')

export default function Vandaag() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tripStarted = today >= TRIP_START
  const tripEnded = today > TRIP_END

  // Find today's day or the next upcoming day
  let todayDay = days.find(d => {
    const dd = new Date(d.date)
    dd.setHours(0, 0, 0, 0)
    return dd.getTime() === today.getTime()
  })

  // If today is not in trip, show next upcoming day
  let nextDay = null
  if (!todayDay) {
    nextDay = days.find(d => {
      const dd = new Date(d.date)
      dd.setHours(0, 0, 0, 0)
      return dd > today
    })
  }

  const displayDay = todayDay || nextDay

  // Days until trip
  const daysUntil = Math.round((TRIP_START - today) / (1000 * 60 * 60 * 24))
  const totalDays = days.length
  const daysPassed = tripStarted ? Math.min(
    Math.round((today - TRIP_START) / (1000 * 60 * 60 * 24)) + 1,
    totalDays
  ) : 0

  const cityColor = displayDay ? getCityColor(displayDay.city) : '#6b7280'

  return (
    <div className="fade-in" style={{ padding: '16px 16px 100px' }}>
      {/* Header banner */}
      <div style={{
        background: `linear-gradient(135deg, ${cityColor}22, ${cityColor}11)`,
        border: `1.5px solid ${cityColor}44`,
        borderRadius: 20,
        padding: '20px 20px 16px',
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4, fontWeight: 500 }}>
          Thailand 2026 ✈️
        </div>
        {tripEnded ? (
          <div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Welkom thuis! 🏠</div>
            <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Wat een geweldige reis was dat.</div>
          </div>
        ) : !tripStarted ? (
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>
              Nog {daysUntil} dag{daysUntil !== 1 ? 'en' : ''}! 🎉
            </div>
            <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
              Vertrek op 6 april 2026
            </div>
            {/* Countdown progress */}
            <div style={{ marginTop: 12, background: '#e2e8f0', borderRadius: 8, height: 6 }}>
              <div style={{
                height: 6,
                borderRadius: 8,
                background: cityColor,
                width: `${Math.max(2, Math.min(100, 100 - (daysUntil / 200 * 100)))}%`,
                transition: 'width 0.5s',
              }} />
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
              6 apr – 24 apr 2026 · 19 dagen
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {todayDay ? 'Vandaag' : 'Morgen'}
            </div>
            <div style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>
              Dag {daysPassed} van {totalDays}
            </div>
            <div style={{ marginTop: 10, background: '#e2e8f0', borderRadius: 8, height: 6 }}>
              <div style={{
                height: 6,
                borderRadius: 8,
                background: cityColor,
                width: `${(daysPassed / totalDays) * 100}%`,
                transition: 'width 0.5s',
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Departure day: home → Schiphol */}
      {displayDay && displayDay.date === '2026-04-06' && (
        <div style={{
          background: '#fffbeb', border: '2px solid #f59e0b',
          borderRadius: 18, padding: '16px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#92400e', marginBottom: 8 }}>
            🚗 Vertrekadvies vanuit Zoetermeer
          </div>
          <div style={{ fontSize: 13, color: '#78350f', marginBottom: 12 }}>
            Vlucht EK146 vertrekt om <strong>11:25</strong> → uiterlijk om <strong>09:00 op Schiphol</strong> → <strong>vertrek ~07:30</strong> van huis
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href={mapsDirections(HOME, SCHIPHOL)} target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: '#4285F4', color: 'white', borderRadius: 12,
                padding: '10px', fontSize: 13, fontWeight: 700, textDecoration: 'none',
              }}>
              📍 Route naar Schiphol
            </a>
          </div>
        </div>
      )}

      {/* Arrival day: Schiphol → home */}
      {displayDay && displayDay.date === '2026-04-24' && (
        <div style={{
          background: '#f0fdf4', border: '2px solid #10b981',
          borderRadius: 18, padding: '16px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#065f46', marginBottom: 8 }}>
            🏠 Aankomst op Schiphol: 13:15
          </div>
          <div style={{ fontSize: 13, color: '#047857', marginBottom: 12 }}>
            Vlucht EK147 landt om 13:15 op Schiphol (Amsterdam)
          </div>
          <a href={mapsDirections(SCHIPHOL, HOME)} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: '#10b981', color: 'white', borderRadius: 12,
              padding: '10px', fontSize: 13, fontWeight: 700, textDecoration: 'none',
            }}>
            📍 Route naar huis
          </a>
        </div>
      )}

      {/* Today / Next day card */}
      {displayDay && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
          }}>
            <div style={{
              background: cityColor,
              color: 'white',
              borderRadius: 10,
              padding: '4px 12px',
              fontSize: 13,
              fontWeight: 700,
            }}>
              {displayDay.dayLabel}
            </div>
            <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>
              {displayDay.city}
            </div>
          </div>

          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
            {formatDate(displayDay.date)}
          </div>

          {/* Hotel */}
          {displayDay.hotel && (
            <div style={{
              background: 'white',
              borderRadius: 14,
              padding: '12px 14px',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: '1px solid #f1f5f9',
            }}>
              <span style={{ fontSize: 20 }}>🏨</span>
              <div>
                <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Verblijf</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{displayDay.hotel}</div>
              </div>
            </div>
          )}

          {/* Events */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {displayDay.events.map((ev, i) => (
              <EventRow key={i} event={ev} cityColor={cityColor} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming days preview */}
      {!tripEnded && displayDay && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Komende dagen
          </div>
          {days
            .filter(d => {
              const dd = new Date(d.date)
              dd.setHours(0, 0, 0, 0)
              return dd > new Date(displayDay.date) && dd <= new Date(displayDay.date + 'T00:00:00')
            })
            .slice(0, 0)
          }
          {(() => {
            const displayDate = new Date(displayDay.date)
            displayDate.setHours(0, 0, 0, 0)
            const upcoming = days.filter(d => {
              const dd = new Date(d.date)
              dd.setHours(0, 0, 0, 0)
              return dd > displayDate
            }).slice(0, 3)
            return upcoming.map((d, i) => {
              const color = getCityColor(d.city)
              const diff = Math.round((new Date(d.date) - today) / (1000 * 60 * 60 * 24))
              return (
                <div key={i} style={{
                  background: 'white',
                  borderRadius: 14,
                  padding: '12px 14px',
                  marginBottom: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  border: '1px solid #f1f5f9',
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${color}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 20 }}>
                      {d.events[0]?.icon || '📅'}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                      {d.dayLabel} · {d.city}
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>
                      {diff === 1 ? 'Morgen' : `Over ${diff} dagen`} · {formatDate(d.date).split(', ')[0]}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: color, fontWeight: 700 }}>
                    {new Date(d.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              )
            })
          })()}
        </div>
      )}

      {/* Pre-trip info */}
      {!tripStarted && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Eerste dagen
          </div>
          {days.slice(0, 3).map((d, i) => {
            const color = getCityColor(d.city)
            return (
              <div key={i} style={{
                background: 'white',
                borderRadius: 14,
                padding: '12px 14px',
                marginBottom: 8,
                border: '1px solid #f1f5f9',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{d.dayLabel} · {d.city}</span>
                  </div>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>
                    {new Date(d.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                {d.events.map((ev, j) => (
                  <div key={j} style={{ display: 'flex', gap: 8, paddingLeft: 16, marginBottom: 4 }}>
                    <span style={{ fontSize: 14 }}>{ev.icon}</span>
                    <span style={{ fontSize: 13, color: '#475569' }}>
                      {ev.time && <span style={{ fontWeight: 700, color: '#1e293b', marginRight: 4 }}>{ev.time}</span>}
                      {ev.title}
                    </span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function EventRow({ event, cityColor }) {
  const isPending = event.pending
  const isImportant = event.type === 'flight' || event.type === 'arrival' || event.type === 'departure'

  return (
    <div style={{
      background: isPending ? '#fffbeb' : isImportant ? `${cityColor}11` : 'white',
      border: isPending ? '1.5px dashed #f59e0b' : isImportant ? `1px solid ${cityColor}33` : '1px solid #f1f5f9',
      borderRadius: 14,
      padding: '12px 14px',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        background: isPending ? '#fef3c7' : `${cityColor}22`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        flexShrink: 0,
      }}>
        {event.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {event.time && (
            <span style={{
              fontSize: 13,
              fontWeight: 800,
              color: isImportant ? cityColor : '#1e293b',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {event.time}
            </span>
          )}
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{event.title}</span>
          {isPending && (
            <span style={{
              fontSize: 10,
              background: '#f59e0b',
              color: 'white',
              borderRadius: 6,
              padding: '1px 6px',
              fontWeight: 700,
            }}>
              TE BOEKEN
            </span>
          )}
          {event.optional && (
            <span style={{
              fontSize: 10,
              background: '#f1f5f9',
              color: '#64748b',
              borderRadius: 6,
              padding: '1px 6px',
              fontWeight: 600,
            }}>
              optioneel
            </span>
          )}
        </div>
        {event.sub && (
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{event.sub}</div>
        )}
        {(event.mapsQuery || event.grab) && (
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            {event.mapsQuery && (
              <a href={mapsSearch(event.mapsQuery)} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  background: '#EBF3FE', color: '#4285F4', borderRadius: 8,
                  padding: '4px 10px', fontSize: 12, fontWeight: 700, textDecoration: 'none',
                }}>
                📍 Maps
              </a>
            )}
            {event.grab && (
              <a href={grabLink(event.mapsQuery)} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 3,
                  background: '#E6F7EE', color: '#00B14F', borderRadius: 8,
                  padding: '4px 10px', fontSize: 12, fontWeight: 700, textDecoration: 'none',
                }}>
                🟢 Grab
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
