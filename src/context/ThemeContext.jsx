import { createContext, useContext, useState, useEffect, useRef } from 'react'

// Thailand sunrise ≈ 06:05, sunset ≈ 18:25 (UTC+7)
const SUNRISE_MIN = 6 * 60 + 5
const SUNSET_MIN  = 18 * 60 + 25

function isNightInThailand() {
  const now = new Date()
  const thaiMinutes = ((now.getUTCHours() * 60 + now.getUTCMinutes()) + 7 * 60) % (24 * 60)
  return thaiMinutes < SUNRISE_MIN || thaiMinutes >= SUNSET_MIN
}

// Apple iOS system colors
const LIGHT = {
  pageBg:        '#F2F2F7',   // systemGroupedBackground
  cardBg:        '#FFFFFF',
  border:        'rgba(60,60,67,0.18)',
  text:          '#000000',
  muted:         '#8E8E93',   // secondaryLabel
  rowBg:         '#F2F2F7',
  inputBg:       '#FFFFFF',
  navBg:         'rgba(242,242,247,0.82)',
  pendingBg:     '#FFF9EC',
  pendingBorder: 'rgba(255,149,0,0.35)',
  infoBlueBg:    '#EBF5FF',
  infoBlueBorder:'rgba(0,122,255,0.25)',
  infoBlueText:  '#007AFF',
  chipBg:        '#E5E5EA',   // systemFill
  isDark:        false,
}

const DARK = {
  pageBg:        '#000000',   // systemBackground dark
  cardBg:        '#1C1C1E',   // secondarySystemBackground dark
  border:        'rgba(84,84,88,0.60)',
  text:          '#FFFFFF',
  muted:         '#8E8E93',
  rowBg:         '#2C2C2E',   // tertiarySystemBackground dark
  inputBg:       '#1C1C1E',
  navBg:         'rgba(0,0,0,0.82)',
  pendingBg:     '#2A1F00',
  pendingBorder: 'rgba(255,159,10,0.4)',
  infoBlueBg:    '#001833',
  infoBlueBorder:'rgba(10,132,255,0.35)',
  infoBlueText:  '#0A84FF',   // systemBlue dark
  chipBg:        '#3A3A3C',   // systemFill dark
  isDark:        true,
}

const ThemeContext = createContext({ ...LIGHT, toggleDark: () => {} })

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(isNightInThailand)
  const manualOverride = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      if (!manualOverride.current) setDark(isNightInThailand())
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  function toggleDark() {
    manualOverride.current = true
    setDark(d => !d)
  }

  return (
    <ThemeContext.Provider value={{ ...(dark ? DARK : LIGHT), toggleDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
