import type { PokemonCard, PokemonCardApiResponse } from '@tradedex/types'
import Constants from 'expo-constants'

const BASE_URL = 'https://api.pokemontcg.io/v2'

function getApiKey(): string | undefined {
  return (
    process.env.EXPO_PUBLIC_POKEMON_TCG_API_KEY ??
    (Constants.expoConfig?.extra?.pokemonTcgApiKey as string | undefined)
  )
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  const apiKey = getApiKey()
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

  const res = await fetch(`${BASE_URL}/cards?${params.toString()}`, { headers: getHeaders() })
  if (!res.ok) throw new Error(`Pokémon TCG API error: ${res.status}`)
  return res.json() as Promise<PokemonCardApiResponse>
}

export async function getCard(cardId: string): Promise<PokemonCard> {
  const res = await fetch(`${BASE_URL}/cards/${encodeURIComponent(cardId)}`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error(`Pokémon TCG API error: ${res.status}`)
  const json = await res.json() as { data: PokemonCard }
  return json.data
}
