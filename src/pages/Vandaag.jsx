import { useState, useEffect } from 'react'
import { CITY_COLORS } from '../data/tripData.js'
import { mapsDirections, mapsSearch, HOME, SCHIPHOL } from '../utils/links.js'
import { useTheme } from '../context/ThemeContext.jsx'
import { useTripData } from '../context/TripDataContext.jsx'
import Modal from '../components/Modal.jsx'

const WEATHER_COORDS = {
  'Bangkok':    { lat: 13.7563, lon: 100.5018 },
  'Chiang Mai': { lat: 18.7883, lon: 98.9853 },
  'Khao Lak':   { lat: 8.6256,  lon: 98.2895 },
}

function wmoEmoji(code) {
  if (code === 0) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 48) return '🌫️'
  if (code <= 55) return '🌦️'
  if (code <= 65) return '🌧️'
  if (code <= 82) return '🌦️'
  return '⛈️'
}

function getWeatherCity(city) {
  if (city.includes('Chiang Mai')) return 'Chiang Mai'
  if (city.includes('Khao Lak')) return 'Khao Lak'
  if (city.includes('Bangkok')) return 'Bangkok'
  return null
}

const MAPS_ICON = 'https://www.google.com/s2/favicons?domain=maps.google.com&sz=64'
const TA_ICON = 'https://www.google.com/s2/favicons?domain=tripadvisor.com&sz=64'

function getCityColor(city) {
  if (city.includes('Bangkok')) return CITY_COLORS['Bangkok']
  if (city.includes('Chiang Mai')) return CITY_COLORS['Chiang Mai']
  if (city.includes('Khao Lak')) return CITY_COLORS['Khao Lak']
  return CITY_COLORS['Nederland']
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })
}

const TRIP_START = new Date('2026-04-06')
const TRIP_END = new Date('2026-04-24')

export default function Vandaag() {
  const c = useTheme()
  const { days } = useTripData()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [weather, setWeather] = useState({})

  useEffect(() => {
    const maxEnd = new Date(Math.min(new Date('2026-04-24'), new Date(Date.now() + 15 * 864e5)))
    const endDate = maxEnd.toISOString().slice(0, 10)
    Object.entries(WEATHER_COORDS).forEach(([cityName, { lat, lon }]) => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia%2FBangkok&start_date=2026-04-06&end_date=${endDate}`)
        .then(r => r.json())
        .then(data => {
          const lookup = {}
          data.daily.time.forEach((date, i) => {
            lookup[`${cityName}-${date}`] = {
              max: Math.round(data.daily.temperature_2m_max[i]),
              min: Math.round(data.daily.temperature_2m_min[i]),
              code: data.daily.weathercode[i],
            }
          })
          setWeather(prev => ({ ...prev, ...lookup }))
        }).catch(() => {})
    })
  }, [])

  const tripStarted = today >= TRIP_START
  const tripEnded = today > TRIP_END

  let todayDay = days.find(d => {
    const dd = new Date(d.date); dd.setHours(0, 0, 0, 0)
    return dd.getTime() === today.getTime()
  })

  let nextDay = null
  if (!todayDay) {
    nextDay = days.find(d => {
      const dd = new Date(d.date); dd.setHours(0, 0, 0, 0)
      return dd > today
    })
  }

  const displayDay = todayDay || nextDay
  const daysUntil = Math.round((TRIP_START - today) / (1000 * 60 * 60 * 24))
  const totalDays = days.length
  const daysPassed = tripStarted ? Math.min(Math.round((today - TRIP_START) / (1000 * 60 * 60 * 24)) + 1, totalDays) : 0
  const cityColor = displayDay ? getCityColor(displayDay.city) : '#6b7280'

  return (
    <div className="fade-in" style={{ padding: '16px 16px 100px', background: c.pageBg, minHeight: '100vh' }}>

      {/* Polarsteps dark header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
        borderRadius: 20, padding: '20px', marginBottom: 16, color: 'white',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 80, opacity: 0.15, lineHeight: 1 }}>
          {tripEnded ? '🏠' : !tripStarted ? '🎉' : '📍'}
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4, fontWeight: 600, letterSpacing: '0.08em' }}>THAILAND 2026</div>
        {tripEnded ? (
          <>
            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Welkom thuis! 🏠</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>Wat een geweldige reis was dat.</div>
          </>
        ) : !tripStarted ? (
          <>
            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Nog {daysUntil} dagen! 🎉</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>Vertrek op 6 april 2026</div>
            <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.15)', borderRadius: 8, height: 4 }}>
              <div style={{ height: 4, borderRadius: 8, background: '#f59e0b', width: `${Math.max(2, Math.min(100, 100 - (daysUntil / 200 * 100)))}%` }} />
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Dag {daysPassed} van {totalDays}</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>{displayDay?.city}</div>
            <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.15)', borderRadius: 8, height: 4 }}>
              <div style={{ height: 4, borderRadius: 8, background: '#f59e0b', width: `${(daysPassed / totalDays) * 100}%` }} />
            </div>
          </>
        )}
        <div style={{ display: 'flex', gap: 0, marginTop: 18 }}>
          {[
            { value: !tripStarted && !tripEnded ? daysUntil : tripEnded ? 19 : daysPassed, label: !tripStarted && !tripEnded ? 'Tot vertrek' : tripEnded ? 'Reisdagen' : 'Dag' },
            { value: '19', label: 'Dagen' },
            { value: '3', label: 'Steden' },
            { value: '~22K', label: 'Km' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
              <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3, fontWeight: 600, letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Departure day banner */}
      {displayDay && displayDay.date === '2026-04-06' && (
        <div style={{ background: c.pendingBg, border: `1.5px solid ${c.pendingBorder}`, borderRadius: 18, padding: '16px', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#92400e', marginBottom: 8 }}>🚗 Vertrekadvies vanuit Zoetermeer</div>
          <div style={{ fontSize: 13, color: '#78350f', marginBottom: 12 }}>
            Vlucht EK146 vertrekt om <strong>11:25</strong> → uiterlijk om <strong>09:00 op Schiphol</strong> → <strong>vertrek ~07:30</strong> van huis
          </div>
          <a href={mapsDirections(HOME, SCHIPHOL)} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#4285F4', color: 'white', borderRadius: 12, padding: '10px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            📍 Route naar Schiphol
          </a>
        </div>
      )}

      {/* Arrival day banner */}
      {displayDay && displayDay.date === '2026-04-24' && (
        <div style={{ background: 'linear-gradient(135deg, #f0fdf8, #f7fdf4)', border: '1.5px solid #10b98155', borderRadius: 18, padding: '16px', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#065f46', marginBottom: 8 }}>🏠 Aankomst op Schiphol: 13:15</div>
          <div style={{ fontSize: 13, color: '#047857', marginBottom: 12 }}>Vlucht EK147 landt om 13:15 op Schiphol (Amsterdam)</div>
          <a href={mapsDirections(SCHIPHOL, HOME)} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#10b981', color: 'white', borderRadius: 12, padding: '10px', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            📍 Route naar huis
          </a>
        </div>
      )}

      {/* Today / Next day */}
      {displayDay && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: cityColor, color: 'white', borderRadius: 10, padding: '4px 12px', fontSize: 13, fontWeight: 700 }}>
                {displayDay.dayLabel}
              </div>
              <div style={{ fontSize: 14, color: c.muted, fontWeight: 500 }}>{displayDay.city}</div>
            </div>
            {(() => {
              const wCity = getWeatherCity(displayDay.city)
              const w = wCity ? weather[`${wCity}-${displayDay.date}`] : null
              return w ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: `${cityColor}14`, borderRadius: 12, padding: '6px 12px' }}>
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{wmoEmoji(w.code)}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: c.text }}>{w.max}°</span>
                    <span style={{ fontSize: 11, color: c.muted }}>{w.min}°</span>
                  </div>
                </div>
              ) : null
            })()}
          </div>
          <div style={{ fontSize: 12, color: c.muted, marginBottom: 12 }}>{formatDate(displayDay.date)}</div>

          {displayDay.hotel && (
            <div style={{ background: c.cardBg, borderRadius: 14, padding: '12px 14px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${c.border}` }}>
              <span style={{ fontSize: 20 }}>🏨</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: c.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verblijf</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.text }}>{displayDay.hotel}</div>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(displayDay.hotel)}`}
                target="_blank" rel="noopener noreferrer"
                title="Navigeer naar hotel"
                style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EBF3FE', borderRadius: 10, textDecoration: 'none', flexShrink: 0 }}
              >
                <img src={MAPS_ICON} width={18} height={18} alt="Maps" />
              </a>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {displayDay.events.map((ev, i) => (
              <EventRow key={i} event={ev} cityColor={cityColor} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming days */}
      {!tripEnded && displayDay && (() => {
        const displayDate = new Date(displayDay.date); displayDate.setHours(0, 0, 0, 0)
        const upcoming = days.filter(d => { const dd = new Date(d.date); dd.setHours(0,0,0,0); return dd > displayDate }).slice(0, 3)
        if (!upcoming.length) return null
        return (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: c.muted, marginBottom: 12, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Komende dagen</div>
            {upcoming.map((d, i) => {
              const color = getCityColor(d.city)
              const diff = Math.round((new Date(d.date) - today) / (1000 * 60 * 60 * 24))
              const wCity = getWeatherCity(d.city)
              const w = wCity ? weather[`${wCity}-${d.date}`] : null
              return (
                <div key={i} style={{ background: c.cardBg, borderRadius: 14, padding: '12px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${c.border}` }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 20 }}>{d.events[0]?.icon || '📅'}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{d.dayLabel} · {d.city}</div>
                    <div style={{ fontSize: 12, color: c.muted }}>{diff === 1 ? 'Morgen' : `Over ${diff} dagen`}</div>
                  </div>
                  {w ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                      <span style={{ fontSize: 20 }}>{wmoEmoji(w.code)}</span>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>{w.max}°</div>
                        <div style={{ fontSize: 11, color: c.muted }}>{w.min}°</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color, fontWeight: 800 }}>
                      {new Date(d.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })()}

      {/* Pre-trip preview */}
      {!tripStarted && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: c.muted, marginBottom: 12, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Eerste dagen</div>
          {days.slice(0, 3).map((d, i) => {
            const color = getCityColor(d.city)
            const wCity = getWeatherCity(d.city)
            const w = wCity ? weather[`${wCity}-${d.date}`] : null
            return (
              <div key={i} style={{ background: c.cardBg, borderRadius: 14, padding: '12px 14px', marginBottom: 8, border: `1px solid ${c.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{d.dayLabel} · {d.city}</span>
                  </div>
                  {w ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 16 }}>{wmoEmoji(w.code)}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: c.text }}>{w.max}°</span>
                      <span style={{ fontSize: 11, color: c.muted }}>/ {w.min}°</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: c.muted }}>{new Date(d.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}</span>
                  )}
                </div>
                {d.events.map((ev, j) => (
                  <div key={j} style={{ display: 'flex', gap: 8, paddingLeft: 16, marginBottom: 4 }}>
                    <span style={{ fontSize: 14 }}>{ev.icon}</span>
                    <span style={{ fontSize: 13, color: c.muted }}>
                      {ev.time && <span style={{ fontWeight: 700, color: c.text, marginRight: 4 }}>{ev.time}</span>}
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
  const c = useTheme()
  const [modal, setModal] = useState(null)
  const isPending = event.pending
  const isImportant = event.type === 'flight' || event.type === 'arrival' || event.type === 'departure'

  return (
    <>
      {modal && (
        <Modal
          title={modal.title}
          content={modal.content}
          mapsQuery={modal.mapsQuery}
          tripadvisorQuery={modal.tripadvisorQuery}
          onClose={() => setModal(null)}
          color={cityColor}
        />
      )}
      <div style={{
        background: isPending ? c.pendingBg : isImportant ? `${cityColor}0a` : c.cardBg,
        border: isPending ? `1.5px dashed #f59e0b` : isImportant ? `1px solid ${cityColor}33` : `1px solid ${c.border}`,
        borderRadius: 14, padding: '12px 14px',
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: isPending ? '#fef3c7' : `${cityColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
          {event.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {event.time && <span style={{ fontSize: 13, fontWeight: 800, color: isImportant ? cityColor : c.text, fontVariantNumeric: 'tabular-nums' }}>{event.time}</span>}
            <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{event.title}</span>
            {isPending && <span style={{ fontSize: 10, background: '#f59e0b', color: 'white', borderRadius: 6, padding: '1px 6px', fontWeight: 700 }}>TE BOEKEN</span>}
            {event.optional && <span style={{ fontSize: 10, background: c.chipBg, color: c.muted, borderRadius: 6, padding: '1px 6px', fontWeight: 600 }}>optioneel</span>}
          </div>
          {event.sub && <div style={{ fontSize: 12, color: c.muted, marginTop: 2 }}>{event.sub}</div>}
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {event.mapsQuery && (
              <a href={`https://maps.google.com/?q=${encodeURIComponent(event.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                title="Google Maps"
                style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EBF3FE', borderRadius: 8, textDecoration: 'none' }}>
                <img src={MAPS_ICON} width={16} height={16} alt="Maps" />
              </a>
            )}
            {event.mapsQuery && (
              <a href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(event.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                title="TripAdvisor"
                style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f4', borderRadius: 8, textDecoration: 'none' }}>
                <img src={TA_ICON} width={16} height={16} alt="TripAdvisor" />
              </a>
            )}
            {event.info && (
              <button
                onClick={() => setModal({ title: event.title, content: event.info, mapsQuery: event.mapsQuery, tripadvisorQuery: event.mapsQuery })}
                style={{ display: 'flex', alignItems: 'center', gap: 3, background: c.chipBg, color: c.muted, borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                ℹ️ Info
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
