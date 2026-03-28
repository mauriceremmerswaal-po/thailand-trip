import { createContext, useContext, useState } from 'react'

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
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('darkMode') === 'true' } catch { return false }
  })

  const theme = dark ? DARK : LIGHT

  function toggleDark() {
    const next = !dark
    setDark(next)
    try { localStorage.setItem('darkMode', next) } catch {}
  }

  return (
    <ThemeContext.Provider value={{ ...theme, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
