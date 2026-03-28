import { useState } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext.jsx'
import BottomNav from './components/BottomNav.jsx'
import TimeBar from './components/TimeBar.jsx'
import Vandaag from './pages/Vandaag.jsx'
import Reis from './pages/Reis.jsx'
import Tips from './pages/Tips.jsx'
import Info from './pages/Info.jsx'
import Kaart from './pages/Kaart.jsx'

const PAGE_TITLES = {
  kaart: 'Reiskaart',
  vandaag: 'Thailand 2026 ✈️',
  tips: 'Tips & Activiteiten',
  reis: 'Reis & Schema',
  info: 'Info & Handig',
}

function AppContent() {
  const [page, setPage] = useState('kaart')
  const c = useTheme()

  function changePage(newPage) {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <div style={{ minHeight: '100vh', background: c.pageBg }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: c.cardBg, borderBottom: `1px solid ${c.border}`,
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>🇹🇭</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: c.text, lineHeight: 1.1 }}>
            {PAGE_TITLES[page]}
          </div>
          <div style={{ fontSize: 11, color: c.muted }}>6 – 24 april 2026</div>
        </div>
        <TimeBar />
        <button
          onClick={c.toggleDark}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 20, padding: '4px', lineHeight: 1,
            opacity: 0.8,
          }}
          title={c.isDark ? 'Lichte modus' : 'Donkere modus'}
        >
          {c.isDark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Page content */}
      <main>
        {page === 'kaart' && <Kaart />}
        {page === 'vandaag' && <Vandaag />}
        {page === 'tips' && <Tips />}
        {page === 'reis' && <Reis />}
        {page === 'info' && <Info />}
      </main>

      <BottomNav page={page} setPage={changePage} />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
