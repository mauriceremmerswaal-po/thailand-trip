import { createContext, useContext, useState, useEffect } from 'react'
import {
  participants as defaultParticipants,
  days as defaultDays,
  CITY_COLORS,
  flights,
  hotels,
  sights,
} from '../data/tripData.js'

const STORAGE_KEY = 'thailand_trip_admin'
const Ctx = createContext(null)

export function TripDataProvider({ children }) {
  const [participants, setParticipants] = useState(defaultParticipants)
  const [days, setDays] = useState(defaultDays)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      if (stored.participants?.length) setParticipants(stored.participants)
      if (stored.days?.length) setDays(stored.days)
    } catch {}
  }, [])

  function persist(partial) {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...partial }))
    } catch {}
  }

  function saveParticipants(p) {
    setParticipants(p)
    persist({ participants: p })
  }

  function saveDays(d) {
    setDays(d)
    persist({ days: d })
  }

  function resetLocalData() {
    localStorage.removeItem(STORAGE_KEY)
    setParticipants(defaultParticipants)
    setDays(defaultDays)
  }

  return (
    <Ctx.Provider value={{
      participants, saveParticipants,
      days, saveDays,
      resetLocalData,
      CITY_COLORS, flights, hotels, sights,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useTripData = () => useContext(Ctx)
