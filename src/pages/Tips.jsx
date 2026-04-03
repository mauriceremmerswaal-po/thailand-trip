import { useState } from 'react'
import { sights, CITY_COLORS } from '../data/tripData.js'
import { useTheme } from '../context/ThemeContext.jsx'
import Modal from '../components/Modal.jsx'

const MAPS_ICON = 'https://www.google.com/s2/favicons?domain=maps.google.com&sz=64'
const TA_ICON = 'https://www.google.com/s2/favicons?domain=tripadvisor.com&sz=64'
const CITY_EMOJIS = { 'Bangkok': '🌆', 'Chiang Mai': '🏔️', 'Khao Lak': '🌊' }

// Google Maps restaurant lijsten per stad (voeg Khao Lak toe als de lijst klaar is)
const RESTAURANT_LISTS = {
  'Bangkok':    'https://maps.app.goo.gl/zxSTRyEYq7P4Byum7',
  'Chiang Mai': 'https://maps.app.goo.gl/9PFB7wo96tkNPLps5',
  'Khao Lak':   null, // volgt nog
}

const CITY_DATES = [
  { city: 'Bangkok',    from: '2026-04-07', to: '2026-04-09' },
  { city: 'Chiang Mai', from: '2026-04-09', to: '2026-04-14' },
  { city: 'Khao Lak',   from: '2026-04-14', to: '2026-04-21' },
  { city: 'Bangkok',    from: '2026-04-21', to: '2026-04-24' },
]

function getCurrentCity() {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const found = CITY_DATES.find(({ from, to }) => {
    const f = new Date(from); f.setHours(0, 0, 0, 0)
    const t = new Date(to);   t.setHours(0, 0, 0, 0)
    return today >= f && today < t
  })
  return found?.city || 'Bangkok'
}

export default function Tips() {
  const c = useTheme()
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('thailand_checked') || '{}') } catch { return {} }
  })
  const [activeCity, setActiveCity] = useState(getCurrentCity)
  const [modal, setModal] = useState(null)

  function toggle(id) {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    localStorage.setItem('thailand_checked', JSON.stringify(next))
  }

  const cities = Object.keys(sights)
  const cityColor = CITY_COLORS[activeCity] || '#6b7280'
  const totalChecked = cities.reduce((sum, ct) => sum + sights[ct].filter(s => checked[s.id]).length, 0)
  const totalSights = cities.reduce((sum, ct) => sum + sights[ct].length, 0)

  return (
    <div className="fade-in" style={{ padding: '16px 16px 120px', background: c.pageBg, minHeight: '100vh' }}>
      {modal && (
        <Modal
          title={modal.name}
          content={modal.info}
          mapsQuery={modal.name + ' ' + activeCity}
          tripadvisorQuery={modal.name + ' ' + activeCity}
          onClose={() => setModal(null)}
          color={cityColor}
        />
      )}

      {/* Polarsteps dark header */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)', borderRadius: 20, padding: '20px', marginBottom: 16, color: 'white', position: 'relative', overflow: 'hidden' }}>
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

      {/* Restaurant knoppen */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {/* Google Maps lijstje (alleen als URL beschikbaar) */}
        {RESTAURANT_LISTS[activeCity] && (
          <a
            href={RESTAURANT_LISTS[activeCity]}
            target="_blank" rel="noopener noreferrer"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: '#EBF3FE', color: '#1a73e8', borderRadius: 14,
              padding: '11px', fontSize: 13, fontWeight: 700, textDecoration: 'none',
              border: '1.5px solid #c5d9f7',
            }}
          >
            <img src={MAPS_ICON} width={18} height={18} alt="" />
            Google Maps lijst {activeCity}
          </a>
        )}
        {/* TripAdvisor zoeken */}
        <a
          href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent('restaurants ' + activeCity + ' Thailand')}`}
          target="_blank" rel="noopener noreferrer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: '#e6f7f4', color: '#00af87', borderRadius: 14,
            padding: '11px', fontSize: 13, fontWeight: 700, textDecoration: 'none',
            border: '1.5px solid #b2e8de',
          }}
        >
          <img src={TA_ICON} width={18} height={18} alt="" style={{ borderRadius: 3 }} />
          TripAdvisor
        </a>
      </div>

      {/* City tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {cities.map(city => {
          const color = CITY_COLORS[city]
          const isActive = activeCity === city
          const doneCount = sights[city].filter(s => checked[s.id]).length
          return (
            <button key={city} onClick={() => setActiveCity(city)} style={{ flex: 1, padding: '10px 6px', borderRadius: 14, border: isActive ? `2px solid ${color}` : `1.5px solid ${c.border}`, background: isActive ? `${color}15` : c.cardBg, cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: 18 }}>{CITY_EMOJIS[city]}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: isActive ? color : c.muted, marginTop: 3 }}>{city}</div>
              <div style={{ fontSize: 10, color: c.muted, marginTop: 1 }}>{doneCount}/{sights[city].length}</div>
            </button>
          )
        })}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: c.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gedaan in {activeCity}</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: cityColor }}>{sights[activeCity].filter(s => checked[s.id]).length} / {sights[activeCity].length}</span>
        </div>
        <div style={{ background: c.border, borderRadius: 8, height: 6 }}>
          <div style={{ height: 6, borderRadius: 8, background: cityColor, width: `${(sights[activeCity].filter(s => checked[s.id]).length / sights[activeCity].length) * 100}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Sights list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sights[activeCity].map(sight => {
          const done = !!checked[sight.id]
          return (
            <div key={sight.id} style={{ background: done ? `${cityColor}12` : c.cardBg, border: done ? `1.5px solid ${cityColor}44` : `1px solid ${c.border}`, borderRadius: 14, padding: '14px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              {/* Checkbox */}
              <button
                onClick={() => toggle(sight.id)}
                style={{ width: 26, height: 26, borderRadius: 8, background: done ? cityColor : c.chipBg, border: done ? 'none' : `2px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.15s', cursor: 'pointer' }}
              >
                {done && <span style={{ color: 'white', fontSize: 14, fontWeight: 800 }}>✓</span>}
              </button>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: done ? cityColor : c.text, textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.7 : 1, marginBottom: 3 }}>
                  {sight.name}
                </div>
                {sight.tip && <div style={{ fontSize: 12, color: c.muted, lineHeight: 1.4, marginBottom: 6 }}>💡 {sight.tip}</div>}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(sight.name + ' ' + activeCity + ' Thailand')}`} target="_blank" rel="noopener noreferrer"
                    title="Google Maps"
                    style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EBF3FE', borderRadius: 8, textDecoration: 'none' }}>
                    <img src={MAPS_ICON} width={16} height={16} alt="Maps" />
                  </a>
                  <a href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(sight.name + ' ' + activeCity)}`} target="_blank" rel="noopener noreferrer"
                    title="TripAdvisor"
                    style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6f7f4', borderRadius: 8, textDecoration: 'none' }}>
                    <img src={TA_ICON} width={16} height={16} alt="TripAdvisor" />
                  </a>
                  {sight.info && (
                    <button onClick={() => setModal(sight)}
                      style={{ display: 'flex', alignItems: 'center', gap: 3, background: c.chipBg, color: c.muted, borderRadius: 8, padding: '4px 9px', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                      ℹ️ Info
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
