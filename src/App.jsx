import { useState } from 'react'
import BottomNav from './components/BottomNav.jsx'
import TimeBar from './components/TimeBar.jsx'
import Vandaag from './pages/Vandaag.jsx'
import Tijdlijn from './pages/Tijdlijn.jsx'
import Vluchten from './pages/Vluchten.jsx'
import Hotels from './pages/Hotels.jsx'
import Tips from './pages/Tips.jsx'
import Info from './pages/Info.jsx'
import Kaart from './pages/Kaart.jsx'

const PAGE_TITLES = {
  vandaag: 'Thailand 2026 ✈️',
  tijdlijn: 'Reisschema',
  vluchten: 'Vluchten',
  hotels: 'Verblijven',
  tips: 'Tips & Activiteiten',
  info: 'Info & Handig',
  kaart: 'Reiskaart',
}

export default function App() {
  const [page, setPage] = useState('kaart')

  return (
    <div style={{ minHeight: '100vh', background: '#f5f2ee' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'white', borderBottom: '1px solid #ede9e3',
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>🇹🇭</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1a1a', lineHeight: 1.1 }}>
            {PAGE_TITLES[page]}
          </div>
          <div style={{ fontSize: 11, color: '#8c8279' }}>6 – 24 april 2026</div>
        </div>
        <TimeBar />
      </div>

      {/* Page content */}
      <main>
        {page === 'vandaag' && <Vandaag />}
        {page === 'tijdlijn' && <Tijdlijn />}
        {page === 'vluchten' && <Vluchten />}
        {page === 'hotels' && <Hotels />}
        {page === 'tips' && <Tips />}
        {page === 'info' && <Info />}
        {page === 'kaart' && <Kaart />}
      </main>

      <BottomNav page={page} setPage={setPage} />
    </div>
  )
}
