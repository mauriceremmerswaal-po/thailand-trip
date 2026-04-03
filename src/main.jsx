import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ?date=2026-04-13 in de URL simuleert die datum in de hele app
const urlDate = new URLSearchParams(window.location.search).get('date')
if (urlDate) {
  const FAKE = new Date(`${urlDate}T09:00:00+07:00`).getTime()
  const Orig = Date
  window.Date = class extends Orig {
    constructor(...a) { return a.length ? new Orig(...a) : new Orig(FAKE) }
    static now() { return FAKE }
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
