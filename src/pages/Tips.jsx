import { useState } from 'react'
import { sights, CITY_COLORS } from '../data/tripData.js'

const CITY_EMOJIS = {
  'Bangkok': '🌆',
  'Chiang Mai': '🏔️',
  'Khao Lak': '🌊',
}

export default function Tips() {
  const [checked, setChecked] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('thailand_checked') || '{}')
    } catch {
      return {}
    }
  })

  const [activeCity, setActiveCity] = useState('Bangkok')

  function toggle(id) {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    localStorage.setItem('thailand_checked', JSON.stringify(next))
  }

  const cities = Object.keys(sights)
  const cityColor = CITY_COLORS[activeCity] || '#6b7280'
  const totalChecked = cities.reduce((sum, c) => sum + sights[c].filter(s => checked[s.id]).length, 0)
  const totalSights = cities.reduce((sum, c) => sum + sights[c].length, 0)

  return (
    <div className="fade-in" style={{ padding: '16px 16px 100px' }}>

      {/* Polarsteps dark header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
        borderRadius: 20, padding: '20px', marginBottom: 16, color: 'white',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 80, opacity: 0.15, lineHeight: 1 }}>📍</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4, fontWeight: 600, letterSpacing: '0.08em' }}>THAILAND 2026</div>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>Tips & Activiteiten</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>Vink af wat je hebt gedaan ✓</div>
        <div style={{ display: 'flex', gap: 0, marginTop: 18 }}>
          {[
            { value: totalSights, label: 'Tips' },
            { value: totalChecked, label: 'Gedaan' },
            { value: totalSights - totalChecked, label: 'Te doen' },
            { value: '3', label: 'Steden' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
              <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3, fontWeight: 600, letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* City tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {cities.map(city => {
          const color = CITY_COLORS[city]
          const isActive = activeCity === city
          const doneCount = sights[city].filter(s => checked[s.id]).length
          return (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              style={{
                flex: 1, padding: '10px 6px', borderRadius: 14,
                border: isActive ? `2px solid ${color}` : '1.5px solid #ede9e3',
                background: isActive ? `${color}15` : 'white',
                cursor: 'pointer', textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 18 }}>{CITY_EMOJIS[city]}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: isActive ? color : '#8c8279', marginTop: 3 }}>
                {city}
              </div>
              <div style={{ fontSize: 10, color: '#8c8279', marginTop: 1 }}>
                {doneCount}/{sights[city].length}
              </div>
            </button>
          )
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: '#8c8279', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Gedaan in {activeCity}
          </span>
          <span style={{ fontSize: 12, fontWeight: 800, color: cityColor }}>
            {sights[activeCity].filter(s => checked[s.id]).length} / {sights[activeCity].length}
          </span>
        </div>
        <div style={{ background: '#ede9e3', borderRadius: 8, height: 6 }}>
          <div style={{
            height: 6, borderRadius: 8, background: cityColor,
            width: `${(sights[activeCity].filter(s => checked[s.id]).length / sights[activeCity].length) * 100}%`,
            transition: 'width 0.3s',
          }} />
        </div>
      </div>

      {/* Sights list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sights[activeCity].map(sight => {
          const done = !!checked[sight.id]
          return (
            <button
              key={sight.id}
              onClick={() => toggle(sight.id)}
              style={{
                background: done ? `${cityColor}12` : 'white',
                border: done ? `1.5px solid ${cityColor}44` : '1px solid #ede9e3',
                borderRadius: 14, padding: '14px', textAlign: 'left',
                cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%',
              }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: 8,
                background: done ? cityColor : '#f5f2ee',
                border: done ? 'none' : '2px solid #ede9e3',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginTop: 1, transition: 'all 0.15s',
              }}>
                {done && <span style={{ color: 'white', fontSize: 14, fontWeight: 800 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14, fontWeight: 700,
                  color: done ? cityColor : '#1a1a1a',
                  textDecoration: done ? 'line-through' : 'none',
                  opacity: done ? 0.7 : 1, marginBottom: 3,
                }}>
                  {sight.name}
                </div>
                {sight.tip && (
                  <div style={{ fontSize: 12, color: '#8c8279', lineHeight: 1.4 }}>
                    💡 {sight.tip}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
