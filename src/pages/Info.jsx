import { useState, useEffect } from 'react'

const WEATHER_CITIES = [
  { name: 'Bangkok', wttr: 'Bangkok', color: '#f59e0b', emoji: '🌆' },
  { name: 'Chiang Mai', wttr: 'Chiang+Mai', color: '#10b981', emoji: '🏔️' },
  { name: 'Khao Lak', wttr: 'Khao+Lak+Phang+Nga', color: '#0ea5e9', emoji: '🏖️' },
]

const EMERGENCY = [
  { name: 'Thai politie', number: '191', icon: '🚔', color: '#ef4444' },
  { name: 'Ambulance / nood', number: '1669', icon: '🚑', color: '#ef4444' },
  { name: 'Tourist politie', number: '1155', icon: '👮', color: '#3b82f6' },
  { name: 'NL Ambassade Bangkok', number: '+66 2 309 5200', icon: '🇳🇱', color: '#6366f1' },
  { name: 'Brandweer', number: '199', icon: '🚒', color: '#f97316' },
]

function weatherEmoji(code) {
  const n = parseInt(code)
  if (n === 113) return '☀️'
  if (n === 116) return '⛅'
  if (n === 119 || n === 122) return '☁️'
  if (n >= 143 && n <= 260) return '🌫️'
  if (n === 200 || n >= 386) return '⛈️'
  if (n >= 263 && n <= 296) return '🌧️'
  if (n >= 299 && n <= 321) return '🌧️'
  if (n >= 323 && n <= 377) return '❄️'
  return '🌤️'
}

function dayName(dateStr) {
  const days = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za']
  const d = new Date(dateStr)
  return days[d.getDay()]
}

const THB_RATE_FALLBACK = 38.0

export default function Info() {
  const [weather, setWeather] = useState({})
  const [rate, setRate] = useState(THB_RATE_FALLBACK)
  const [eur, setEur] = useState('')

  useEffect(() => {
    WEATHER_CITIES.forEach(city => {
      fetch(`https://wttr.in/${city.wttr}?format=j1`)
        .then(r => r.json())
        .then(data => {
          const c = data.current_condition[0]
          const forecast = (data.weather || []).slice(0, 3).map(day => ({
            date: day.date,
            max: day.maxtempC,
            min: day.mintempC,
            code: day.hourly?.[4]?.weatherCode || '113',
            desc: day.hourly?.[4]?.weatherDesc?.[0]?.value || '',
          }))
          setWeather(prev => ({
            ...prev,
            [city.name]: {
              temp: c.temp_C,
              feels: c.FeelsLikeC,
              desc: c.weatherDesc[0].value,
              humidity: c.humidity,
              code: c.weatherCode,
              forecast,
            }
          }))
        })
        .catch(() => {})
    })
  }, [])

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/EUR')
      .then(r => r.json())
      .then(data => { if (data.rates?.THB) setRate(data.rates.THB) })
      .catch(() => {})
  }, [])

  const thb = eur ? (parseFloat(eur) * rate).toFixed(0) : ''

  return (
    <div className="fade-in" style={{ padding: '16px 16px 100px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Info & Handig</div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Weer · Wisselkoers · Noodgevallen</div>

      {/* Weather */}
      <Section title="🌤️ Huidig weer & voorspelling">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {WEATHER_CITIES.map(city => {
            const w = weather[city.name]
            return (
              <div key={city.name} style={{
                background: 'white', borderRadius: 16,
                border: `1px solid ${city.color}33`,
                overflow: 'hidden',
              }}>
                {/* Current */}
                <div style={{
                  background: `${city.color}12`,
                  padding: '14px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 26 }}>{city.emoji}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{city.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>
                        {w ? `${weatherEmoji(w.code)} ${w.desc}` : 'Laden...'}
                      </div>
                      {w && (
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>
                          💧 {w.humidity}% · Gevoeld {w.feels}°C
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: city.color, lineHeight: 1 }}>
                    {w ? `${w.temp}°` : '—'}
                  </div>
                </div>

                {/* Forecast */}
                {w?.forecast?.length > 0 && (
                  <div style={{
                    display: 'flex', borderTop: `1px solid ${city.color}22`,
                  }}>
                    {w.forecast.map((day, i) => (
                      <div key={i} style={{
                        flex: 1, padding: '10px 8px', textAlign: 'center',
                        borderRight: i < w.forecast.length - 1 ? `1px solid ${city.color}22` : 'none',
                      }}>
                        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 3 }}>
                          {i === 0 ? 'Vandaag' : dayName(day.date)}
                        </div>
                        <div style={{ fontSize: 22, lineHeight: 1, marginBottom: 3 }}>
                          {weatherEmoji(day.code)}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
                          {day.max}°
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>
                          {day.min}°
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Section>

      {/* EUR/THB Calculator */}
      <Section title="💱 Wisselkoers EUR → THB">
        <div style={{ background: 'white', borderRadius: 16, padding: '16px', border: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>
            Live koers: 1 EUR = {rate.toFixed(2)} THB
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 16, fontWeight: 700, color: '#94a3b8',
              }}>€</span>
              <input
                type="number"
                value={eur}
                onChange={e => setEur(e.target.value)}
                placeholder="0"
                style={{
                  width: '100%', padding: '12px 12px 12px 30px',
                  fontSize: 18, fontWeight: 700, borderRadius: 12,
                  border: '2px solid #e2e8f0', outline: 'none',
                  fontVariantNumeric: 'tabular-nums',
                }}
              />
            </div>
            <div style={{ fontSize: 20, color: '#94a3b8' }}>→</div>
            <div style={{ flex: 1, background: '#f8fafc', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                {thb ? `฿ ${parseInt(thb).toLocaleString()}` : '—'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[10, 20, 50, 100, 200, 500].map(amt => (
              <button key={amt} onClick={() => setEur(String(amt))}
                style={{
                  background: eur == amt ? '#10b981' : '#f1f5f9',
                  color: eur == amt ? 'white' : '#475569',
                  border: 'none', borderRadius: 8, padding: '6px 12px',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                €{amt}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Emergency */}
      <Section title="🚨 Noodgevallen Thailand">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {EMERGENCY.map(e => (
            <a key={e.name} href={`tel:${e.number}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'white', borderRadius: 14, padding: '12px 14px',
                border: '1px solid #f1f5f9', textDecoration: 'none',
              }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `${e.color}15`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 18, flexShrink: 0,
              }}>{e.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{e.name}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: e.color, fontVariantNumeric: 'tabular-nums' }}>
                  {e.number}
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#94a3b8' }}>📞</div>
            </a>
          ))}
        </div>
      </Section>

      {/* Familie */}
      <Section title="👨‍👩‍👧 Deel met familie">
        <div style={{ background: 'white', borderRadius: 16, padding: '16px', border: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: 14, color: '#475569', marginBottom: 12, lineHeight: 1.5 }}>
            Familie kan deze app ook gebruiken om te zien waar jullie zijn en wanneer vluchten landen!
          </div>
          <button
            onClick={() => {
              const text = `🇹🇭 Thailand reis tracker — volg ons hier live!\n\nWaar zijn we? Wanneer landen we? Alle vluchten en hotels in één app.\n\n${window.location.href}`
              if (navigator.share) {
                navigator.share({ title: 'Thailand 2026', text, url: window.location.href })
              } else if (navigator.clipboard) {
                navigator.clipboard.writeText(text)
                alert('Link gekopieerd! Plak dit in WhatsApp.')
              }
            }}
            style={{
              width: '100%', background: '#25D366', color: 'white',
              border: 'none', borderRadius: 14, padding: '14px',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            💬 Deel via WhatsApp
          </button>
        </div>
      </Section>

      {/* Handige apps */}
      <Section title="📱 Handige apps in Thailand">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { name: 'Grab', desc: 'Taxi/Grab rijden — altijd veiliger dan tuk-tuk', color: '#00B14F', icon: '🟢' },
            { name: 'Google Maps', desc: 'Navigatie en OV Thailand', color: '#4285F4', icon: '📍' },
            { name: 'Google Translate', desc: 'Thai vertalen met camera', color: '#34A853', icon: '🌐' },
            { name: 'XE Currency', desc: 'Wisselkoersen en betalingen', color: '#1d4ed8', icon: '💱' },
          ].map(app => (
            <div key={app.name} style={{
              background: 'white', borderRadius: 14, padding: '12px 14px',
              border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 22 }}>{app.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: app.color }}>{app.name}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{app.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  )
}
