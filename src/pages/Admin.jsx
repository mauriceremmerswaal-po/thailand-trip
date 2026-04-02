import { useState } from 'react'
import { useTripData } from '../context/TripDataContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { sights, CITY_COLORS, flights as staticFlights, hotels as staticHotels } from '../data/tripData.js'

const ADMIN_PIN = '2026'
const TOKEN_KEY = 'thailand_admin_token'
const GITHUB_OWNER = 'mauriceremmerswaal-po'
const GITHUB_REPO = 'thailand-trip'
const GITHUB_FILE = 'src/data/tripData.js'

const EVENT_ICONS = [
  '✈️','🛬','🏨','🗺️','🍜','☕','🚗','🚕','🚢','🌊',
  '🛕','👑','🐘','🛍️','🌿','🥥','👩‍🍳','🚲','⛵','🎉',
  '🌤️','🏠','📍','🎟️','🌅','🏖️','🍹','💆','🛒','🎭',
]

const EVENT_TYPES = [
  { id: 'activity', label: 'Activiteit' },
  { id: 'hotel', label: 'Hotel' },
  { id: 'food', label: 'Eten & drinken' },
  { id: 'flight', label: 'Vlucht' },
  { id: 'arrival', label: 'Aankomst' },
  { id: 'departure', label: 'Vertrek' },
  { id: 'transit', label: 'Transfer' },
  { id: 'relax', label: 'Ontspanning' },
]

function generateFileContent(participants, days) {
  const j = (v) => JSON.stringify(v, null, 2)
  return `export const participants = ${j(participants)}

export const CITY_COLORS = ${j(CITY_COLORS)}

export const flights = ${j(staticFlights)}

export const hotels = ${j(staticHotels)}

export const sights = ${j(sights)}

export const days = ${j(days)}
`
}

async function publishToGitHub(token, participants, days) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE}`
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
  }

  const getRes = await fetch(url, { headers })
  if (!getRes.ok) throw new Error('GitHub verbinding mislukt. Controleer je token.')
  const { sha } = await getRes.json()

  const content = generateFileContent(participants, days)
  const bytes = new TextEncoder().encode(content)
  const encoded = btoa(Array.from(bytes).map(b => String.fromCharCode(b)).join(''))

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Admin: reisdata bijgewerkt via app',
      content: encoded,
      sha,
      branch: 'main',
    }),
  })

  if (!putRes.ok) {
    const err = await putRes.json()
    throw new Error(err.message || 'Publiceren mislukt')
  }
}

// ─── PIN Screen ──────────────────────────────────────────────────────────────
function PinScreen({ pin, setPin, onUnlock, onClose, c }) {
  function press(d) {
    if (d === '⌫') { setPin(p => p.slice(0, -1)); return }
    if (d === '') return
    const next = pin + d
    if (next.length > 4) return
    setPin(next)
    if (next.length === 4) {
      if (next === ADMIN_PIN) setTimeout(onUnlock, 150)
      else setTimeout(() => setPin(''), 400)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1a1a2e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <button onClick={onClose} style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 10, padding: '8px 14px', color: 'white', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>← Terug</button>
      <div style={{ fontSize: 40, marginBottom: 10 }}>🔐</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 6 }}>Beheer</div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 36 }}>Voer je pincode in</div>
      <div style={{ display: 'flex', gap: 18, marginBottom: 44 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i < pin.length ? '#f59e0b' : 'rgba(255,255,255,0.2)', transition: 'background 0.15s' }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 76px)', gap: 12 }}>
        {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((d, i) => (
          <button key={i} onClick={() => press(String(d))}
            style={{ height: 76, borderRadius: 18, border: 'none', background: d === '' ? 'transparent' : 'rgba(255,255,255,0.08)', fontSize: d === '⌫' ? 22 : 26, fontWeight: 600, color: 'white', cursor: d === '' ? 'default' : 'pointer', backdropFilter: 'blur(4px)' }}>
            {d}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Reizigers Tab ───────────────────────────────────────────────────────────
function ReizigerTab({ participants, onChange, c }) {
  const [newName, setNewName] = useState('')

  return (
    <div>
      <div style={{ fontSize: 13, color: c.muted, marginBottom: 16, lineHeight: 1.5 }}>
        Namen die getoond worden in de app-header en overzichten.
      </div>
      {participants.map((name, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: c.cardBg, borderRadius: 14, padding: '14px 16px', marginBottom: 8, border: `1px solid ${c.border}` }}>
          <span style={{ fontSize: 20 }}>👤</span>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: c.text }}>{name}</span>
          {participants.length > 1 && (
            <button onClick={() => onChange(participants.filter((_, j) => j !== i))}
              style={{ background: '#fee2e2', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 13, color: '#dc2626', cursor: 'pointer', fontWeight: 700 }}>✕</button>
          )}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <input value={newName} onChange={e => setNewName(e.target.value)}
          placeholder="Naam toevoegen..."
          onKeyDown={e => { if (e.key === 'Enter' && newName.trim()) { onChange([...participants, newName.trim()]); setNewName('') } }}
          style={{ flex: 1, padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${c.border}`, background: c.cardBg, color: c.text, fontSize: 14 }} />
        <button onClick={() => { if (newName.trim()) { onChange([...participants, newName.trim()]); setNewName('') } }}
          style={{ padding: '12px 18px', borderRadius: 12, background: '#f59e0b', color: 'white', border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>+</button>
      </div>
    </div>
  )
}

// ─── New Event Form ───────────────────────────────────────────────────────────
function NewEventForm({ onAdd, onCancel, c }) {
  const [ev, setEv] = useState({ icon: '📍', type: 'activity', time: '', title: '', sub: '', mapsQuery: '' })
  const set = (k, v) => setEv(e => ({ ...e, [k]: v }))

  function submit() {
    if (!ev.title.trim()) return
    onAdd({
      icon: ev.icon,
      type: ev.type,
      time: ev.time || null,
      title: ev.title.trim(),
      ...(ev.sub.trim() && { sub: ev.sub.trim() }),
      ...(ev.mapsQuery.trim() && { mapsQuery: ev.mapsQuery.trim() }),
    })
  }

  return (
    <div style={{ background: c.cardBg, borderRadius: 18, padding: 18, border: `1.5px solid #f59e0b` }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: c.text, marginBottom: 16 }}>Nieuw event toevoegen</div>

      <div style={{ fontSize: 11, color: c.muted, fontWeight: 700, marginBottom: 8, letterSpacing: '0.06em' }}>ICOON</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
        {EVENT_ICONS.map(icon => (
          <button key={icon} onClick={() => set('icon', icon)}
            style={{ width: 42, height: 42, borderRadius: 10, border: `2px solid ${ev.icon === icon ? '#f59e0b' : c.border}`, background: ev.icon === icon ? '#fef3c7' : c.rowBg, fontSize: 20, cursor: 'pointer' }}>
            {icon}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: c.muted, fontWeight: 700, marginBottom: 6, letterSpacing: '0.06em' }}>TYPE</div>
          <select value={ev.type} onChange={e => set('type', e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${c.border}`, background: c.cardBg, color: c.text, fontSize: 13 }}>
            {EVENT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: c.muted, fontWeight: 700, marginBottom: 6, letterSpacing: '0.06em' }}>TIJD (optioneel)</div>
          <input type="time" value={ev.time} onChange={e => set('time', e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${c.border}`, background: c.cardBg, color: c.text, fontSize: 13 }} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: c.muted, fontWeight: 700, marginBottom: 6, letterSpacing: '0.06em' }}>TITEL *</div>
        <input type="text" value={ev.title} onChange={e => set('title', e.target.value)}
          placeholder="bijv. Bezoek Wat Pho"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${ev.title ? c.border : '#fca5a5'}`, background: c.cardBg, color: c.text, fontSize: 14 }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: c.muted, fontWeight: 700, marginBottom: 6, letterSpacing: '0.06em' }}>DETAILS (optioneel)</div>
        <input type="text" value={ev.sub} onChange={e => set('sub', e.target.value)}
          placeholder="bijv. Open 08:00–18:00 · Entree ฿200"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${c.border}`, background: c.cardBg, color: c.text, fontSize: 13 }} />
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 11, color: c.muted, fontWeight: 700, marginBottom: 6, letterSpacing: '0.06em' }}>GOOGLE MAPS ZOEKOPDRACHT (optioneel)</div>
        <input type="text" value={ev.mapsQuery} onChange={e => set('mapsQuery', e.target.value)}
          placeholder="bijv. Wat Pho Bangkok Thailand"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${c.border}`, background: c.cardBg, color: c.text, fontSize: 13 }} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onCancel}
          style={{ flex: 1, padding: '13px', borderRadius: 12, border: `1px solid ${c.border}`, background: 'transparent', color: c.muted, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Annuleren
        </button>
        <button onClick={submit} disabled={!ev.title.trim()}
          style={{ flex: 2, padding: '13px', borderRadius: 12, border: 'none', background: ev.title.trim() ? '#f59e0b' : c.border, color: ev.title.trim() ? 'white' : c.muted, fontSize: 14, fontWeight: 700, cursor: ev.title.trim() ? 'pointer' : 'default' }}>
          Toevoegen ✓
        </button>
      </div>
    </div>
  )
}

// ─── Schema Tab ───────────────────────────────────────────────────────────────
function SchemaTab({ days, onChange, c }) {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)
  const day = days[selectedIdx]

  function deleteEvent(evIdx) {
    const newDays = days.map((d, i) => i === selectedIdx
      ? { ...d, events: d.events.filter((_, j) => j !== evIdx) }
      : d)
    onChange(newDays)
  }

  function addEvent(ev) {
    const newDays = days.map((d, i) => i === selectedIdx
      ? { ...d, events: [...d.events, ev] }
      : d)
    onChange(newDays)
    setShowAddForm(false)
  }

  return (
    <div>
      <div style={{ fontSize: 13, color: c.muted, marginBottom: 12, lineHeight: 1.5 }}>
        Selecteer een dag om events toe te voegen of te verwijderen.
      </div>

      <select value={selectedIdx} onChange={e => { setSelectedIdx(Number(e.target.value)); setShowAddForm(false) }}
        style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: `1px solid ${c.border}`, background: c.cardBg, color: c.text, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
        {days.map((d, i) => (
          <option key={d.date} value={i}>
            {d.dayLabel} · {new Date(d.date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })} · {d.city}
          </option>
        ))}
      </select>

      <div style={{ marginBottom: 12 }}>
        {day.events.map((ev, j) => (
          <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: c.cardBg, borderRadius: 12, padding: '11px 14px', marginBottom: 6, border: `1px solid ${c.border}` }}>
            <span style={{ fontSize: 16, marginTop: 1 }}>{ev.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.text }}>
                {ev.time ? <span style={{ color: '#f59e0b' }}>{ev.time} · </span> : null}{ev.title}
              </div>
              {ev.sub && <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>{ev.sub}</div>}
            </div>
            <button onClick={() => deleteEvent(j)}
              style={{ background: '#fee2e2', border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: 12, color: '#dc2626', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}>✕</button>
          </div>
        ))}
        {day.events.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: c.muted, fontSize: 13 }}>Geen events voor deze dag</div>
        )}
      </div>

      {showAddForm
        ? <NewEventForm onAdd={addEvent} onCancel={() => setShowAddForm(false)} c={c} />
        : (
          <button onClick={() => setShowAddForm(true)}
            style={{ width: '100%', padding: '14px', borderRadius: 14, border: `2px dashed ${c.border}`, background: 'transparent', color: c.muted, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            + Nieuw event toevoegen
          </button>
        )
      }
    </div>
  )
}

// ─── Instellingen Tab ─────────────────────────────────────────────────────────
function InstellingenTab({ token, setToken, c, onReset }) {
  const [inputVal, setInputVal] = useState(token)
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)

  function saveToken() {
    setToken(inputVal.trim())
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div style={{ background: '#fef3c7', borderRadius: 14, padding: '14px 16px', marginBottom: 20, border: '1px solid #fde68a' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#92400e', marginBottom: 6 }}>⚠️ GitHub Token vereist voor publiceren</div>
        <div style={{ fontSize: 12, color: '#78350f', lineHeight: 1.6 }}>
          1. Ga naar <strong>github.com</strong> → Settings → Developer settings<br/>
          2. Personal access tokens → Tokens (classic) → Generate new token<br/>
          3. Geef een naam, selecteer scope: <strong>repo</strong>, klik Generate<br/>
          4. Kopieer het token en plak hieronder
        </div>
      </div>

      <div style={{ fontSize: 11, color: c.muted, fontWeight: 700, marginBottom: 8, letterSpacing: '0.06em' }}>GITHUB TOKEN</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input
          type={show ? 'text' : 'password'}
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          placeholder="ghp_..."
          style={{ flex: 1, padding: '11px 14px', borderRadius: 12, border: `1px solid ${c.border}`, background: c.cardBg, color: c.text, fontSize: 13, fontFamily: 'monospace' }}
        />
        <button onClick={() => setShow(s => !s)}
          style={{ padding: '11px 14px', borderRadius: 12, background: c.rowBg, color: c.muted, border: `1px solid ${c.border}`, cursor: 'pointer', fontSize: 16 }}>
          {show ? '🙈' : '👁️'}
        </button>
      </div>
      <button onClick={saveToken}
        style={{ width: '100%', padding: '13px', borderRadius: 12, background: saved ? '#10b981' : '#f59e0b', color: 'white', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>
        {saved ? '✅ Opgeslagen!' : 'Token opslaan'}
      </button>

      <div style={{ marginTop: 24, background: c.cardBg, borderRadius: 14, padding: '14px 16px', border: `1px solid ${c.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 8 }}>ℹ️ Hoe werkt publiceren?</div>
        <div style={{ fontSize: 12, color: c.muted, lineHeight: 1.7 }}>
          1. Maak je wijzigingen in Schema of Reizigers<br/>
          2. Druk op <strong>Publiceer ↑</strong> (rechtsboven)<br/>
          3. De app schrijft automatisch naar GitHub<br/>
          4. Vercel bouwt een nieuwe versie (~30 sec)<br/>
          5. Iedereen ziet de update, op elk apparaat 🎉
        </div>
      </div>

      <div style={{ marginTop: 16, background: c.cardBg, borderRadius: 14, padding: '14px 16px', border: `1px solid ${c.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 6 }}>🔄 Lokale data resetten</div>
        <div style={{ fontSize: 12, color: c.muted, marginBottom: 12, lineHeight: 1.5 }}>
          Verwijdert je lokale wijzigingen op dit apparaat en laadt de gepubliceerde versie opnieuw.
        </div>
        <button onClick={onReset}
          style={{ width: '100%', padding: '11px', borderRadius: 12, background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          Lokale data resetten
        </button>
      </div>
    </div>
  )
}

// ─── Main Admin Component ─────────────────────────────────────────────────────
export default function Admin({ onClose }) {
  const c = useTheme()
  const { participants, saveParticipants, days, saveDays, resetLocalData } = useTripData()
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [tab, setTab] = useState('schema')
  const [status, setStatus] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')

  if (!unlocked) {
    return <PinScreen pin={pin} setPin={setPin} onUnlock={() => setUnlocked(true)} onClose={onClose} c={c} />
  }

  async function publish() {
    if (!token) {
      setStatus({ type: 'error', msg: 'Voer eerst een GitHub token in bij Instellingen.' })
      setTab('instellingen')
      return
    }
    setStatus({ type: 'loading', msg: '⏳ Verbinden met GitHub...' })
    try {
      await publishToGitHub(token, participants, days)
      setStatus({ type: 'success', msg: '✅ Gepubliceerd! App wordt bijgewerkt in ~30 seconden.' })
    } catch (e) {
      setStatus({ type: 'error', msg: `❌ ${e.message}` })
    }
  }

  function handleReset() {
    if (window.confirm('Weet je zeker dat je lokale wijzigingen wilt verwijderen?')) {
      resetLocalData()
      setStatus({ type: 'success', msg: '✅ Lokale data gereset naar gepubliceerde versie.' })
    }
  }

  const statusColors = {
    error: { bg: '#fee2e2', color: '#dc2626' },
    success: { bg: '#d1fae5', color: '#065f46' },
    loading: { bg: '#dbeafe', color: '#1e40af' },
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: c.pageBg, zIndex: 100, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, background: c.cardBg, borderBottom: `1px solid ${c.border}`, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, zIndex: 10 }}>
        <button onClick={onClose}
          style={{ background: c.rowBg, border: 'none', borderRadius: 10, padding: '8px 14px', color: c.text, fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>
          ← Terug
        </button>
        <div style={{ flex: 1, fontSize: 16, fontWeight: 800, color: c.text }}>🔐 Beheer</div>
        <button onClick={publish}
          style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: 12, padding: '10px 18px', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
          Publiceer ↑
        </button>
      </div>

      {/* Status banner */}
      {status && (
        <div style={{ margin: '12px 16px 0', padding: '11px 16px', borderRadius: 12, background: statusColors[status.type].bg, fontSize: 13, fontWeight: 600, color: statusColors[status.type].color }}>
          {status.msg}
        </div>
      )}

      {/* Tab bar */}
      <div style={{ display: 'flex', background: c.cardBg, borderBottom: `1px solid ${c.border}` }}>
        {[
          { id: 'schema', label: '📅 Schema' },
          { id: 'reizigers', label: '👥 Reizigers' },
          { id: 'instellingen', label: '⚙️ Instellingen' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: '13px 4px', background: 'none', border: 'none', borderBottom: tab === t.id ? '3px solid #f59e0b' : '3px solid transparent', fontSize: 12, fontWeight: tab === t.id ? 800 : 500, color: tab === t.id ? '#f59e0b' : c.muted, cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 16px 120px' }}>
        {tab === 'schema' && <SchemaTab days={days} onChange={saveDays} c={c} />}
        {tab === 'reizigers' && <ReizigerTab participants={participants} onChange={saveParticipants} c={c} />}
        {tab === 'instellingen' && <InstellingenTab token={token} setToken={(t) => { setToken(t); localStorage.setItem(TOKEN_KEY, t) }} c={c} onReset={handleReset} />}
      </div>
    </div>
  )
}
