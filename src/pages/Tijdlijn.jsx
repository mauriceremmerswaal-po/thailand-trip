import { useState, useEffect, useRef } from 'react'
import { CITY_COLORS } from '../data/tripData.js'
import { mapsSearch } from '../utils/links.js'
import { useTheme } from '../context/ThemeContext.jsx'
import { useTripData } from '../context/TripDataContext.jsx'
import Modal from '../components/Modal.jsx'

const MAPS_ICON = 'https://www.google.com/s2/favicons?domain=maps.google.com&sz=64'
const TA_ICON = 'https://www.google.com/s2/favicons?domain=tripadvisor.com&sz=64'

const WEATHER_CITIES = {
  'Bangkok':     { lat: 13.7563, lon: 100.5018 },
  'Chiang Mai':  { lat: 18.7883, lon: 98.9853 },
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
  const c = useTheme()
  const { days } = useTripData()
  const todayRef = useRef(null)
  const [weather, setWeather] = useState({})

  useEffect(() => {
    if (todayRef.current) {
      setTimeout(() => {
        todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 120)
    }
  }, [])

  useEffect(() => {
    Object.entries(WEATHER_CITIES).forEach(([cityName, { lat, lon }]) => {
      const maxEnd = new Date(Math.min(new Date('2026-04-24'), new Date(Date.now() + 15 * 864e5)))
      const endDate = maxEnd.toISOString().slice(0, 10)
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
        })
        .catch(() => {})
    })
  }, [])

  return (
    <div className="fade-in" style={{ padding: '16px 16px 100px', background: c.pageBg, minHeight: '100vh' }}>

      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)', borderRadius: 20, padding: '20px', marginBottom: 16, color: 'white', position: 'relative', overflow: 'hidden' }}>
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

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[{ label: 'Bangkok', color: CITY_COLORS['Bangkok'] }, { label: 'Chiang Mai', color: CITY_COLORS['Chiang Mai'] }, { label: 'Khao Lak', color: CITY_COLORS['Khao Lak'] }].map(ct => (
          <div key={ct.label} style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${ct.color}18`, borderRadius: 20, padding: '4px 10px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ct.color }} />
            <span style={{ fontSize: 11, color: ct.color, fontWeight: 700 }}>{ct.label}</span>
          </div>
        ))}
      </div>

      {days.map((day, i) => {
        const color = getCityColor(day.city)
        const today = isToday(day.date)
        const past = isPast(day.date)
        const isLast = i === days.length - 1
        const weatherCity = getWeatherCity(day.city)
        const dayWeather = weatherCity ? weather[`${weatherCity}-${day.date}`] : null

        return (
          <div key={day.date} ref={today ? todayRef : null} style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
              <div style={{ width: today ? 22 : 14, height: today ? 22 : 14, borderRadius: '50%', background: past ? (c.isDark ? '#3d3d3d' : '#d4cfc9') : color, border: today ? `3px solid ${color}` : 'none', outline: today ? `3px solid ${color}33` : 'none', flexShrink: 0, marginTop: 14, zIndex: 1 }} />
              {!isLast && <div style={{ width: 2, flex: 1, minHeight: 16, background: past ? (c.isDark ? '#2d2d2d' : '#e8e3de') : `${color}33`, marginTop: 4 }} />}
            </div>
            <div style={{ flex: 1, marginBottom: 12, opacity: past ? 0.55 : 1 }}>
              <div style={{ background: c.cardBg, borderRadius: 16, padding: '14px', border: today ? `2px solid ${color}` : `1px solid ${c.border}`, boxShadow: today ? `0 4px 16px ${color}22` : '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {today && <span style={{ fontSize: 10, background: color, color: 'white', borderRadius: 6, padding: '2px 7px', fontWeight: 800 }}>VANDAAG</span>}
                    <span style={{ fontSize: 13, fontWeight: 700, color: past ? c.muted : c.text }}>{day.dayLabel}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontSize: 12, color: c.muted, fontVariantNumeric: 'tabular-nums' }}>
                      {new Date(day.date).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                    {dayWeather && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${color}12`, borderRadius: 10, padding: '4px 8px' }}>
                        <span style={{ fontSize: 18, lineHeight: 1 }}>{wmoEmoji(dayWeather.code)}</span>
                        <div style={{ lineHeight: 1.1 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: c.text }}>{dayWeather.max}°</div>
                          <div style={{ fontSize: 10, color: c.muted }}>{dayWeather.min}°</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: `${color}18`, borderRadius: 20, padding: '3px 10px', marginBottom: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color }}>{day.city}</span>
                </div>
                {day.hotel && <div style={{ fontSize: 12, color: c.muted, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>🏨 {day.hotel}</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {day.events.map((ev, j) => <EventRow key={j} event={ev} color={color} />)}
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
  const c = useTheme()
  const [modal, setModal] = useState(null)
  const isImportant = ev.type === 'flight' || ev.type === 'arrival' || ev.type === 'departure'

  return (
    <>
      {modal && <Modal title={modal.title} content={modal.content} mapsQuery={modal.mapsQuery} tripadvisorQuery={modal.tripadvisorQuery} onClose={() => setModal(null)} color={color} />}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 8px', borderRadius: 10, background: ev.pending ? c.pendingBg : isImportant ? `${color}0a` : c.rowBg, border: ev.pending ? `1px dashed #f59e0b` : 'none' }}>
        <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{ev.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            {ev.time && <span style={{ fontSize: 12, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>{ev.time}</span>}
            <span style={{ fontSize: 13, fontWeight: 600, color: c.text }}>{ev.title}</span>
            {ev.pending && <span style={{ fontSize: 9, background: '#f59e0b', color: 'white', borderRadius: 4, padding: '1px 5px', fontWeight: 800 }}>TE BOEKEN</span>}
            {ev.optional && <span style={{ fontSize: 9, background: c.chipBg, color: c.muted, borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>optioneel</span>}
          </div>
          {ev.sub && <div style={{ fontSize: 11, color: c.muted, marginTop: 1 }}>{ev.sub}</div>}
          <div style={{ display: 'flex', gap: 5, marginTop: 5, flexWrap: 'wrap', alignItems: 'center' }}>
            {ev.mapsQuery && (
              <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                title="Google Maps"
                style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EBF3FE', borderRadius: 7, textDecoration: 'none', flexShrink: 0 }}>
                <img src={MAPS_ICON} width={16} height={16} alt="Maps" />
              </a>
            )}
            {ev.mapsQuery && ['hotel', 'activity', 'food'].includes(ev.type) && (
              <a href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                title="TripAdvisor"
                style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f4', borderRadius: 7, textDecoration: 'none', flexShrink: 0 }}>
                <img src={TA_ICON} width={16} height={16} alt="TripAdvisor" />
              </a>
            )}
            {ev.website && (
              <a href={ev.website} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 3, background: c.chipBg, color: c.muted, borderRadius: 7, padding: '3px 8px', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
                🌐 Website
              </a>
            )}
            {ev.info && (
              <button onClick={() => setModal({ title: ev.title, content: ev.info, mapsQuery: ev.mapsQuery, tripadvisorQuery: ev.mapsQuery })}
                style={{ display: 'flex', alignItems: 'center', gap: 3, background: c.chipBg, color: c.muted, borderRadius: 7, padding: '3px 8px', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                ℹ️ Info
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
