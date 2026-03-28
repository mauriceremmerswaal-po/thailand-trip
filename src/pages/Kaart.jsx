import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { mapsSearch } from '../utils/links.js'

// Fix default marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const STOPS = [
  {
    id: 'ams',
    name: 'Amsterdam',
    sub: 'Vertrek · 6 april',
    lat: 52.3105, lng: 4.7683,
    color: '#6b7280',
    flag: '🇳🇱',
    days: null,
    mapsQuery: 'Amsterdam Airport Schiphol',
  },
  {
    id: 'dxb',
    name: 'Dubai',
    sub: 'Overstap · 6 april',
    lat: 25.2532, lng: 55.3657,
    color: '#94a3b8',
    flag: '🇦🇪',
    days: null,
    mapsQuery: 'Dubai International Airport',
  },
  {
    id: 'bkk1',
    name: 'Bangkok',
    sub: '7–9 april · 2 nachten',
    lat: 13.7563, lng: 100.5018,
    color: '#f59e0b',
    flag: '🇹🇭',
    days: 2,
    hotel: 'Grande Centre Point Surawong',
    mapsQuery: 'Bangkok Thailand',
  },
  {
    id: 'cnx',
    name: 'Chiang Mai',
    sub: '9–14 april · 5 nachten',
    lat: 18.7883, lng: 98.9853,
    color: '#10b981',
    flag: '🇹🇭',
    days: 5,
    hotel: 'Smile Lanna Hotel',
    mapsQuery: 'Chiang Mai Thailand',
  },
  {
    id: 'kl',
    name: 'Khao Lak',
    sub: '14–21 april · 7 nachten',
    lat: 8.6256, lng: 98.2895,
    color: '#0ea5e9',
    flag: '🇹🇭',
    days: 7,
    hotel: 'JW Marriott Khao Lak Resort & Spa',
    mapsQuery: 'Khao Lak Thailand',
  },
  {
    id: 'bkk2',
    name: 'Bangkok',
    sub: '21–23 april · 2 nachten',
    lat: 13.7863, lng: 100.5218,
    color: '#f59e0b',
    flag: '🇹🇭',
    days: 2,
    hotel: 'Grande Centre Point Lumphini',
    mapsQuery: 'Bangkok Thailand',
  },
  {
    id: 'dxb2',
    name: 'Dubai',
    sub: 'Overstap · 24 april',
    lat: 25.2432, lng: 55.3757,
    color: '#94a3b8',
    flag: '🇦🇪',
    days: null,
    mapsQuery: 'Dubai International Airport',
  },
  {
    id: 'ams2',
    name: 'Amsterdam',
    sub: 'Aankomst · 24 april',
    lat: 52.3205, lng: 4.7583,
    color: '#6b7280',
    flag: '🇳🇱',
    days: null,
    mapsQuery: 'Amsterdam Airport Schiphol',
  },
]

const THAILAND_STOPS = STOPS.filter(s => s.flag === '🇹🇭')

const FULL_ROUTE = STOPS.map(s => [s.lat, s.lng])
const THAILAND_ROUTE = [
  [13.9, 100.6], // BKK airport arrival
  [13.7563, 100.5018], // Bangkok city
  [18.7883, 98.9853], // Chiang Mai
  [8.6256, 98.2895],  // Khao Lak
  [13.7563, 100.5018], // Bangkok return
]

function createMarker(color, label) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:${color};border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      display:flex;align-items:center;justify-content:center;
      font-size:14px;color:white;font-weight:800;
    ">${label}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  })
}

function FlyTo({ center, zoom }) {
  const map = useMap()
  map.flyTo(center, zoom, { duration: 1.2 })
  return null
}

export default function Kaart() {
  const [view, setView] = useState('thailand') // 'thailand' | 'full'

  const center = view === 'thailand' ? [13.5, 100.5] : [25, 75]
  const zoom = view === 'thailand' ? 6 : 4

  const displayStops = view === 'thailand' ? THAILAND_STOPS : STOPS
  const route = view === 'thailand' ? THAILAND_ROUTE : FULL_ROUTE

  return (
    <div className="fade-in" style={{ padding: '16px 16px 100px' }}>

      {/* Polarsteps-style trip header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
        borderRadius: 20, padding: '20px', marginBottom: 16, color: 'white',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -10, top: -10,
          fontSize: 80, opacity: 0.15, lineHeight: 1,
        }}>🇹🇭</div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4, fontWeight: 600, letterSpacing: '0.08em' }}>
          THAILAND 2026
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>
          Maurice & Claire
        </div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>6 apr – 24 apr · 19 dagen</div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 0, marginTop: 18 }}>
          {[
            { value: '19', label: 'Dagen' },
            { value: '3', label: 'Steden' },
            { value: '1', label: 'Land' },
            { value: '~22K', label: 'Km' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.15)' : 'none',
            }}>
              <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, opacity: 0.6, marginTop: 3, fontWeight: 600, letterSpacing: '0.05em' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View toggle */}
      <div style={{
        display: 'flex', background: '#ede9e3', borderRadius: 12,
        padding: 4, marginBottom: 14,
      }}>
        {[
          { id: 'thailand', label: '🇹🇭 Thailand' },
          { id: 'full', label: '🌍 Volledige route' },
        ].map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            style={{
              flex: 1, padding: '9px 8px',
              background: view === v.id ? 'white' : 'transparent',
              border: 'none', borderRadius: 9,
              fontSize: 13, fontWeight: 700,
              color: view === v.id ? '#1a1a1a' : '#8c8279',
              cursor: 'pointer',
              boxShadow: view === v.id ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: 340, width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution=""
          />
          <FlyTo center={center} zoom={zoom} />

          {/* Route line */}
          <Polyline
            positions={route}
            pathOptions={{ color: '#f59e0b', weight: 3, dashArray: '8 5', opacity: 0.8 }}
          />

          {/* Markers */}
          {displayStops.map((stop, i) => (
            <Marker
              key={stop.id}
              position={[stop.lat, stop.lng]}
              icon={createMarker(stop.color, stop.flag)}
            >
              <Popup>
                <div style={{ padding: '12px 14px', minWidth: 170 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: stop.color, flexShrink: 0,
                    }} />
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1a1a' }}>{stop.name}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: stop.hotel ? 8 : 0 }}>
                    {stop.sub}
                  </div>
                  {stop.hotel && (
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>
                      🏨 {stop.hotel}
                    </div>
                  )}
                  <a
                    href={mapsSearch(stop.mapsQuery)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block', textAlign: 'center',
                      background: stop.color, color: 'white',
                      borderRadius: 8, padding: '6px 10px',
                      fontSize: 12, fontWeight: 700, textDecoration: 'none',
                    }}
                  >
                    📍 Open in Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* City stop cards */}
      <div style={{ fontSize: 13, fontWeight: 800, color: '#8c8279', marginBottom: 12, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        Stops
      </div>

      {THAILAND_STOPS.map((stop, i) => (
        <a
          key={stop.id}
          href={mapsSearch(stop.mapsQuery)}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <div style={{
            background: 'white', borderRadius: 14, padding: '14px 16px',
            marginBottom: 10, display: 'flex', alignItems: 'center', gap: 14,
            border: '1px solid #ede9e3',
            boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${stop.color}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
            }}>
              {['🌆', '🏔️', '🏖️', '🌆'][i]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1a1a', marginBottom: 2 }}>
                {stop.name}
              </div>
              <div style={{ fontSize: 12, color: '#8c8279' }}>{stop.sub}</div>
              {stop.hotel && (
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>🏨 {stop.hotel}</div>
              )}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              {stop.days && (
                <div style={{
                  background: `${stop.color}20`, color: stop.color,
                  borderRadius: 20, padding: '4px 10px',
                  fontSize: 12, fontWeight: 800,
                }}>
                  {stop.days}n
                </div>
              )}
              <div style={{ fontSize: 11, color: '#ccc', marginTop: 4 }}>📍</div>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
