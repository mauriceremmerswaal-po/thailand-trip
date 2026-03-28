export const HOME = 'Loosduinenstraat 7, Zoetermeer, Nederland'
export const SCHIPHOL = 'Amsterdam Airport Schiphol'

export function mapsSearch(query) {
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`
}

export function mapsDirections(from, to) {
  return `https://maps.google.com/?saddr=${encodeURIComponent(from)}&daddr=${encodeURIComponent(to)}&travelmode=driving`
}

export function mapsFromHere(to) {
  return `https://maps.google.com/?daddr=${encodeURIComponent(to)}`
}

export function fr24Link(flightNr) {
  const clean = flightNr.replace(/\s/g, '').toLowerCase()
  return `https://www.flightradar24.com/data/flights/${clean}`
}

export function grabLink(destination) {
  return `https://www.grab.com/`
}

export function tripAdvisorSearch(query) {
  return `https://www.tripadvisor.com/Search?q=${encodeURIComponent(query)}`
}

export const LOCATIONS = {
  schiphol: 'Amsterdam Airport Schiphol, Nederland',
  bkk: 'Suvarnabhumi Airport Bangkok, Thailand',
  dmk: 'Don Mueang International Airport Bangkok, Thailand',
  cnx: 'Chiang Mai International Airport, Thailand',
  hkt: 'Phuket International Airport, Thailand',
  dxb: 'Dubai International Airport, UAE',
  surawong: 'Grande Centre Point Surawong Bangkok, Thailand',
  smileLanna: 'Smile Lanna Hotel, Chiang Mai, Thailand',
  lumphini: 'Grande Centre Point Lumphini Bangkok, Thailand',
  grandPalace: 'Grand Palace Bangkok, Thailand',
  watPho: 'Wat Pho Bangkok, Thailand',
  watArun: 'Wat Arun Bangkok, Thailand',
  watSaket: 'Wat Saket Bangkok, Thailand',
  chinatown: 'Yaowarat Road Chinatown Bangkok, Thailand',
  doiSuthep: 'Wat Phra That Doi Suthep Chiang Mai, Thailand',
  chediLaung: 'Wat Chedi Luang Chiang Mai, Thailand',
  elephantPark: 'Elephant Nature Park Chiang Mai, Thailand',
  nightBazaar: 'Chiang Mai Night Bazaar, Thailand',
  sundayMarket: 'Wualai Walking Street Chiang Mai, Thailand',
  phangNga: 'Phang Nga Bay, Thailand',
  khaolakBeach: 'Bang Niang Beach Khao Lak, Thailand',
}
