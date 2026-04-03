import { createContext, useContext, useState, useEffect, useRef } from 'react'

// Thailand sunrise ≈ 06:05, sunset ≈ 18:25 (UTC+7)
const SUNRISE_MIN = 6 * 60 + 5   // 365 minutes
const SUNSET_MIN  = 18 * 60 + 25  // 1105 minutes

function isNightInThailand() {
  // Thai time = UTC + 7h
  const now = new Date()
  const thaiMinutes = ((now.getUTCHours() * 60 + now.getUTCMinutes()) + 7 * 60) % (24 * 60)
  return thaiMinutes < SUNRISE_MIN || thaiMinutes >= SUNSET_MIN
}

const LIGHT = {
  pageBg: '#f5f2ee',
  cardBg: 'white',
  border: '#ede9e3',
  text: '#1a1a1a',
  muted: '#8c8279',
  rowBg: '#faf8f5',
  inputBg: 'white',
  navBg: '#f5f2ee',
  pendingBg: '#fffbeb',
  pendingBorder: '#f59e0b55',
  infoBlueBg: '#f0f9ff',
  infoBlueBorder: '#bae6fd',
  infoBlueText: '#0369a1',
  chipBg: '#f5f2ee',
  isDark: false,
}

const DARK = {
  pageBg: '#0f0f0f',
  cardBg: '#1a1a1a',
  border: '#2d2d2d',
  text: '#f0ede8',
  muted: '#9a9088',
  rowBg: '#141414',
  inputBg: '#1e1e1e',
  navBg: '#111111',
  pendingBg: '#2a2400',
  pendingBorder: '#f59e0b44',
  infoBlueBg: '#0a1f30',
  infoBlueBorder: '#1e4060',
  infoBlueText: '#60aadf',
  chipBg: '#252525',
  isDark: true,
}

const ThemeContext = createContext({ ...LIGHT, toggleDark: () => {} })

export function ThemeProvider({ children }) {
  // Start auto: dark if it's night in Thailand, manual override possible
  const [dark, setDark] = useState(isNightInThailand)
  const manualOverride = useRef(false)

  // Auto-update every 60s — switches at sunrise/sunset unless manually overridden
  useEffect(() => {
    const id = setInterval(() => {
      if (!manualOverride.current) {
        setDark(isNightInThailand())
      }
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  function toggleDark() {
    manualOverride.current = true
    setDark(d => !d)
  }

  const theme = dark ? DARK : LIGHT

  return (
    <ThemeContext.Provider value={{ ...theme, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
