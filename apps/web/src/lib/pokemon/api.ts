import type { PokemonCard, PokemonCardApiResponse, PokemonSet } from '@tradedex/types'

const BASE_URL = 'https://api.pokemontcg.io/v2'

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  const apiKey = process.env.POKEMON_TCG_API_KEY
  if (apiKey) headers['X-Api-Key'] = apiKey
  return headers
}

export async function searchCards(
  query: string,
  page = 1,
  pageSize = 20
): Promise<PokemonCardApiResponse> {
  const params = new URLSearchParams({
    q: `name:"${query}*"`,
    page: String(page),
    pageSize: String(pageSize),
    orderBy: 'name',
  })

  const res = await fetch(`${BASE_URL}/cards?${params.toString()}`, {
    headers: getHeaders(),
    next: { revalidate: 3600 }, // cache for 1 hour
  })

  if (!res.ok) throw new Error(`Pokémon TCG API error: ${res.status}`)
  return res.json() as Promise<PokemonCardApiResponse>
}

export async function getCard(cardId: string): Promise<PokemonCard> {
  const res = await fetch(`${BASE_URL}/cards/${encodeURIComponent(cardId)}`, {
    headers: getHeaders(),
    next: { revalidate: 86400 }, // cache for 24 hours
  })

  if (!res.ok) throw new Error(`Pokémon TCG API error: ${res.status}`)
  const json = await res.json() as { data: PokemonCard }
  return json.data
}

export async function getSets(): Promise<PokemonSet[]> {
  const res = await fetch(`${BASE_URL}/sets?orderBy=-releaseDate`, {
    headers: getHeaders(),
    next: { revalidate: 86400 },
  })

  if (!res.ok) throw new Error(`Pokémon TCG API error: ${res.status}`)
  const json = await res.json() as { data: PokemonSet[] }
  return json.data
}

export async function getCardsBySet(
  setId: string,
  page = 1,
  pageSize = 20
): Promise<PokemonCardApiResponse> {
  const params = new URLSearchParams({
    q: `set.id:${setId}`,
    page: String(page),
    pageSize: String(pageSize),
    orderBy: 'number',
  })

  const res = await fetch(`${BASE_URL}/cards?${params.toString()}`, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error(`Pokémon TCG API error: ${res.status}`)
  return res.json() as Promise<PokemonCardApiResponse>
}
