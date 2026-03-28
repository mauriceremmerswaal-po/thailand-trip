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

  return (
    <div className="fade-in" style={{ padding: '16px 16px 100px' }}>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Tips & Activiteiten</div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>Vink af wat je hebt gedaan ✓</div>

      {/* City tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {cities.map(city => {
          const color = CITY_COLORS[city]
          const isActive = activeCity === city
          const doneCount = sights[city].filter(s => checked[s.id]).length
          return (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              style={{
                flex: 1,
                padding: '10px 6px',
                borderRadius: 14,
                border: isActive ? `2px solid ${color}` : '2px solid transparent',
                background: isActive ? `${color}18` : '#f8fafc',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 18 }}>{CITY_EMOJIS[city]}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? color : '#94a3b8', marginTop: 3 }}>
                {city}
              </div>
              <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>
                {doneCount}/{sights[city].length}
              </div>
            </button>
          )
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Gedaan in {activeCity}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: cityColor }}>
            {sights[activeCity].filter(s => checked[s.id]).length} / {sights[activeCity].length}
          </span>
        </div>
        <div style={{ background: '#e2e8f0', borderRadius: 8, height: 6 }}>
          <div style={{
            height: 6,
            borderRadius: 8,
            background: cityColor,
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
                background: done ? `${cityColor}18` : 'white',
                border: done ? `1.5px solid ${cityColor}44` : '1px solid #f1f5f9',
                borderRadius: 14,
                padding: '14px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                width: '100%',
              }}
            >
              {/* Checkbox */}
              <div style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background: done ? cityColor : '#f1f5f9',
                border: done ? 'none' : '2px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
                transition: 'all 0.15s',
              }}>
                {done && <span style={{ color: 'white', fontSize: 14, fontWeight: 800 }}>✓</span>}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: done ? cityColor : '#1e293b',
                  textDecoration: done ? 'line-through' : 'none',
                  opacity: done ? 0.7 : 1,
                  marginBottom: 3,
                }}>
                  {sight.name}
                </div>
                {sight.tip && (
                  <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4 }}>
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
