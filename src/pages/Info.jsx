import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext.jsx'

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
  if (n >= 263 && n <= 321) return '🌧️'
  if (n >= 323 && n <= 377) return '❄️'
  return '🌤️'
}

function dayName(dateStr) {
  const days = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za']
  return days[new Date(dateStr).getDay()]
}

const THB_RATE_FALLBACK = 38.0

export default function Info() {
  const c = useTheme()
  const [weather, setWeather] = useState({})
  const [rate, setRate] = useState(THB_RATE_FALLBACK)
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState('eur2thb') // 'eur2thb' or 'thb2eur'

  useEffect(() => {
    WEATHER_CITIES.forEach(city => {
      fetch(`https://wttr.in/${city.wttr}?format=j1`)
        .then(r => r.json())
        .then(data => {
          const curr = data.current_condition[0]
          const forecast = (data.weather || []).slice(0, 3).map(day => ({
            date: day.date,
            max: day.maxtempC,
            min: day.mintempC,
            code: day.hourly?.[4]?.weatherCode || '113',
          }))
          setWeather(prev => ({ ...prev, [city.name]: { temp: curr.temp_C, feels: curr.FeelsLikeC, desc: curr.weatherDesc[0].value, humidity: curr.humidity, code: curr.weatherCode, forecast } }))
        }).catch(() => {})
    })
  }, [])

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/EUR')
      .then(r => r.json())
      .then(data => { if (data.rates?.THB) setRate(data.rates.THB) })
      .catch(() => {})
  }, [])

  const num = parseFloat(amount) || 0
  const converted = mode === 'eur2thb'
    ? (num * rate).toFixed(0)
    : (num / rate).toFixed(2)

  return (
    <div className="fade-in" style={{ padding: '16px 16px 120px', background: c.pageBg, minHeight: '100vh' }}>

      {/* Polarsteps dark header */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)', borderRadius: 20, padding: '20px', marginBottom: 16, color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 80, opacity: 0.15, lineHeight: 1 }}>ℹ️</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4, fontWeight: 600, letterSpacing: '0.08em' }}>THAILAND 2026</div>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Info & Handig</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>Weer · Wisselkoers · Noodgevallen</div>
        <div style={{ display: 'flex', gap: 0, marginTop: 18 }}>
          {[{ value: '🌤️', label: 'Weer' }, { value: '฿', label: 'Koers' }, { value: '🚨', label: 'Nood' }, { value: '📱', label: 'Apps' }].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
              <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3, fontWeight: 600, letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather */}
      <Section title="🌤️ Huidig weer & voorspelling" c={c}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {WEATHER_CITIES.map(city => {
            const w = weather[city.name]
            return (
              <div key={city.name} style={{ background: c.cardBg, borderRadius: 16, border: `1px solid ${city.color}33`, overflow: 'hidden' }}>
                <div style={{ background: `${city.color}0f`, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 26 }}>{city.emoji}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: c.text }}>{city.name}</div>
                      <div style={{ fontSize: 12, color: c.muted }}>{w ? `${weatherEmoji(w.code)} ${w.desc}` : 'Laden...'}</div>
                      {w && <div style={{ fontSize: 11, color: c.muted }}>💧 {w.humidity}% · Gevoeld {w.feels}°C</div>}
                    </div>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: city.color, lineHeight: 1 }}>{w ? `${w.temp}°` : '—'}</div>
                </div>
                {w?.forecast?.length > 0 && (
                  <div style={{ display: 'flex', borderTop: `1px solid ${city.color}22` }}>
                    {w.forecast.map((day, i) => (
                      <div key={i} style={{ flex: 1, padding: '10px 8px', textAlign: 'center', borderRight: i < w.forecast.length - 1 ? `1px solid ${city.color}22` : 'none' }}>
                        <div style={{ fontSize: 11, color: c.muted, fontWeight: 600, marginBottom: 3 }}>{i === 0 ? 'Vandaag' : dayName(day.date)}</div>
                        <div style={{ fontSize: 22, lineHeight: 1, marginBottom: 3 }}>{weatherEmoji(day.code)}</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: c.text }}>{day.max}°</div>
                        <div style={{ fontSize: 11, color: c.muted }}>{day.min}°</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Section>

      {/* Sunrise & Sunset */}
      <Section title="🌅 Zonsopgang & zonsondergang" c={c}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { name: 'Bangkok', emoji: '🌆', color: '#f59e0b', rise: '06:08', set: '18:28' },
            { name: 'Chiang Mai', emoji: '🏔️', color: '#10b981', rise: '06:04', set: '18:24' },
            { name: 'Khao Lak', emoji: '🏖️', color: '#0ea5e9', rise: '06:12', set: '18:28' },
          ].map(city => (
            <div key={city.name} style={{ background: c.cardBg, borderRadius: 14, padding: '14px 16px', border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${city.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{city.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: c.text, marginBottom: 6 }}>{city.name}</div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>🌅</span>
                    <div>
                      <div style={{ fontSize: 10, color: c.muted, fontWeight: 600 }}>OPGANG</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#f59e0b', fontVariantNumeric: 'tabular-nums' }}>{city.rise}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 16 }}>🌇</span>
                    <div>
                      <div style={{ fontSize: 10, color: c.muted, fontWeight: 600 }}>ONDERGANG</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#6366f1', fontVariantNumeric: 'tabular-nums' }}>{city.set}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ background: `${city.color}15`, borderRadius: 10, padding: '6px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: c.muted, fontWeight: 600 }}>DAGLICHT</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: city.color }}>~12u</div>
              </div>
            </div>
          ))}
          <div style={{ fontSize: 11, color: c.muted, textAlign: 'center', marginTop: 2 }}>Tijden zijn lokale tijd (UTC+7) · geldig voor april 2026</div>
        </div>
      </Section>

      {/* EUR ↔ THB Calculator */}
      <Section title="💱 Wisselkoers EUR ↔ THB" c={c}>
        <div style={{ background: c.cardBg, borderRadius: 16, padding: '16px', border: `1px solid ${c.border}` }}>
          <div style={{ fontSize: 12, color: c.muted, marginBottom: 12 }}>
            Live koers: 1 EUR = {rate.toFixed(2)} THB &nbsp;·&nbsp; 1 THB = {(1/rate).toFixed(4)} EUR
          </div>

          {/* Mode toggle */}
          <div style={{ display: 'flex', background: c.rowBg, borderRadius: 10, padding: 3, marginBottom: 14 }}>
            {[{ id: 'eur2thb', label: '€ → ฿ EUR naar THB' }, { id: 'thb2eur', label: '฿ → € THB naar EUR' }].map(m => (
              <button key={m.id} onClick={() => { setMode(m.id); setAmount('') }}
                style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: mode === m.id ? '#10b981' : 'transparent', color: mode === m.id ? 'white' : c.muted, transition: 'all 0.15s' }}>
                {m.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, fontWeight: 700, color: c.muted }}>
                {mode === 'eur2thb' ? '€' : '฿'}
              </span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                style={{ width: '100%', padding: '12px 12px 12px 30px', fontSize: 18, fontWeight: 700, borderRadius: 12, border: `1.5px solid ${c.border}`, outline: 'none', fontVariantNumeric: 'tabular-nums', background: c.inputBg, color: c.text }}
              />
            </div>
            <div style={{ fontSize: 20, color: c.muted }}>→</div>
            <div style={{ flex: 1, background: c.rowBg, borderRadius: 12, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                {amount ? `${mode === 'eur2thb' ? '฿' : '€'} ${mode === 'eur2thb' ? parseInt(converted).toLocaleString() : converted}` : '—'}
              </div>
            </div>
          </div>

          {/* Quick amounts */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(mode === 'eur2thb' ? [10, 20, 50, 100, 200, 500] : [100, 500, 1000, 2000, 5000, 10000]).map(amt => (
              <button key={amt} onClick={() => setAmount(String(amt))}
                style={{ background: amount == amt ? '#10b981' : c.rowBg, color: amount == amt ? 'white' : c.muted, border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                {mode === 'eur2thb' ? `€${amt}` : `฿${amt.toLocaleString()}`}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Emergency */}
      <Section title="🚨 Noodgevallen Thailand" c={c}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {EMERGENCY.map(e => (
            <a key={e.name} href={`tel:${e.number}`}
              style={{ display: 'flex', alignItems: 'center', gap: 12, background: c.cardBg, borderRadius: 14, padding: '12px 14px', border: `1px solid ${c.border}`, textDecoration: 'none' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${e.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{e.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{e.name}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: e.color, fontVariantNumeric: 'tabular-nums' }}>{e.number}</div>
              </div>
              <div style={{ fontSize: 13, color: c.muted }}>📞</div>
            </a>
          ))}
        </div>
      </Section>

      {/* Familie */}
      <Section title="👨‍👩‍👧 Deel met familie" c={c}>
        <div style={{ background: c.cardBg, borderRadius: 16, padding: '16px', border: `1px solid ${c.border}` }}>
          <div style={{ fontSize: 14, color: c.muted, marginBottom: 12, lineHeight: 1.5 }}>
            Familie kan deze app ook gebruiken om te zien waar jullie zijn en wanneer vluchten landen!
          </div>
          <button onClick={() => {
            const text = `🇹🇭 Thailand reis tracker — volg ons hier live!\n\nWaar zijn we? Wanneer landen we? Alle vluchten en hotels in één app.\n\n${window.location.href}`
            if (navigator.share) { navigator.share({ title: 'Thailand 2026', text, url: window.location.href }) }
            else if (navigator.clipboard) { navigator.clipboard.writeText(text); alert('Link gekopieerd! Plak dit in WhatsApp.') }
          }} style={{ width: '100%', background: '#25D366', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            💬 Deel via WhatsApp
          </button>
        </div>
      </Section>

      {/* Handige apps */}
      <Section title="📱 Handige apps in Thailand" c={c}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { name: 'Grab', desc: 'Taxi/Grab rijden — altijd veiliger dan tuk-tuk', color: '#00B14F', icon: '🟢' },
            { name: 'Google Maps', desc: 'Navigatie en OV Thailand', color: '#4285F4', icon: '📍' },
            { name: 'Google Translate', desc: 'Thai vertalen met camera', color: '#34A853', icon: '🌐' },
            { name: 'XE Currency', desc: 'Wisselkoersen en betalingen', color: '#1d4ed8', icon: '💱' },
          ].map(app => (
            <div key={app.name} style={{ background: c.cardBg, borderRadius: 14, padding: '12px 14px', border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>{app.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: app.color }}>{app.name}</div>
                <div style={{ fontSize: 12, color: c.muted }}>{app.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children, c }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: c.muted, marginBottom: 12, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{title}</div>
      {children}
    </div>
  )
}
