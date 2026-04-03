import { useTheme } from '../context/ThemeContext.jsx'

export default function BottomNav({ page, setPage }) {
  const c = useTheme()

  const tabs = [
    { id: 'kaart',   icon: '🗺️', label: 'Kaart' },
    { id: 'vandaag', icon: '📅', label: 'Vandaag' },
    { id: 'tips',    icon: '📍', label: 'Tips' },
    { id: 'reis',    icon: '✈️', label: 'Reis' },
    { id: 'info',    icon: 'ℹ️', label: 'Info' },
  ]

  const glassBase = c.isDark
    ? 'rgba(28, 28, 32, 0.72)'
    : 'rgba(255, 255, 255, 0.62)'

  const glassBorder = c.isDark
    ? 'rgba(255, 255, 255, 0.10)'
    : 'rgba(255, 255, 255, 0.80)'

  const glassShadow = c.isDark
    ? '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)'
    : '0 8px 32px rgba(0,0,0,0.13), inset 0 1px 0 rgba(255,255,255,0.95)'

  const activePill = c.isDark
    ? 'rgba(255,255,255,0.10)'
    : 'rgba(0,0,0,0.055)'

  const activePillBorder = c.isDark
    ? 'rgba(255,255,255,0.13)'
    : 'rgba(0,0,0,0.08)'

  return (
    <nav style={{
      position: 'fixed',
      bottom: 'calc(env(safe-area-inset-bottom, 8px) + 10px)',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 28px)',
      maxWidth: 406,
      background: glassBase,
      backdropFilter: 'blur(28px) saturate(1.9) brightness(1.05)',
      WebkitBackdropFilter: 'blur(28px) saturate(1.9) brightness(1.05)',
      borderRadius: 30,
      border: `1.2px solid ${glassBorder}`,
      boxShadow: glassShadow,
      display: 'flex',
      padding: '5px 5px',
      zIndex: 100,
    }}>
      {tabs.map(tab => {
        const active = page === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setPage(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px 2px 5px',
              background: active ? activePill : 'none',
              border: active ? `1px solid ${activePillBorder}` : '1px solid transparent',
              borderRadius: 24,
              cursor: 'pointer',
              color: active ? '#f59e0b' : c.muted,
              fontWeight: active ? 800 : 500,
              fontSize: 9,
              gap: 2,
              letterSpacing: '0.03em',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            <span style={{
              fontSize: 20,
              lineHeight: 1,
              filter: active ? 'drop-shadow(0 0 6px rgba(245,158,11,0.5))' : 'none',
              transition: 'filter 0.2s',
            }}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
