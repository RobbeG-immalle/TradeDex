import type { CardCondition, CardLanguage, CardStatus, PokemonCard } from '@tradedex/types'

// ─────────────────────────────────────────────────────────────────────────────
// Pokémon TCG API
// ─────────────────────────────────────────────────────────────────────────────

const POKEMON_TCG_API_BASE = 'https://api.pokemontcg.io/v2'

export function buildPokemonSearchUrl(query: string, page = 1, pageSize = 20): string {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    pageSize: String(pageSize),
    orderBy: 'name',
  })
  return `${POKEMON_TCG_API_BASE}/cards?${params.toString()}`
}

export function buildPokemonCardUrl(cardId: string): string {
  return `${POKEMON_TCG_API_BASE}/cards/${encodeURIComponent(cardId)}`
}

export function buildPokemonSetsUrl(): string {
  return `${POKEMON_TCG_API_BASE}/sets?orderBy=-releaseDate`
}

// ─────────────────────────────────────────────────────────────────────────────
// Card Helpers
// ─────────────────────────────────────────────────────────────────────────────

export function getCardDisplayName(card: PokemonCard): string {
  return `${card.name} (${card.set.name} #${card.number})`
}

export const CONDITION_LABELS: Record<CardCondition, string> = {
  MINT: 'Mint',
  NEAR_MINT: 'Near Mint',
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  LIGHT_PLAYED: 'Light Played',
  PLAYED: 'Played',
  POOR: 'Poor',
}

export const LANGUAGE_LABELS: Record<CardLanguage, string> = {
  EN: 'English',
  JP: 'Japanese',
  DE: 'German',
  FR: 'French',
  ES: 'Spanish',
  IT: 'Italian',
  PT: 'Portuguese',
  KO: 'Korean',
  ZH_HANS: 'Chinese (Simplified)',
  ZH_HANT: 'Chinese (Traditional)',
}

export const STATUS_LABELS: Record<CardStatus, string> = {
  FOR_TRADE: 'For Trade',
  WANTED: 'Wanted',
  COLLECTION: 'Collection',
}

export const STATUS_COLORS: Record<CardStatus, string> = {
  FOR_TRADE: 'green',
  WANTED: 'blue',
  COLLECTION: 'gray',
}

// ─────────────────────────────────────────────────────────────────────────────
// Date / Time
// ─────────────────────────────────────────────────────────────────────────────

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffSeconds < 60) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffWeeks < 5) return `${diffWeeks}w ago`
  if (diffMonths < 12) return `${diffMonths}mo ago`
  return date.toLocaleDateString()
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Rating
// ─────────────────────────────────────────────────────────────────────────────

export function calculateRating(positives: number, total: number): number {
  if (total === 0) return 0
  return Math.round((positives / total) * 100)
}

export function formatRating(rating: number): string {
  return `${rating}%`
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────────────────

export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,30}$/.test(username)
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ─────────────────────────────────────────────────────────────────────────────
// Misc
// ─────────────────────────────────────────────────────────────────────────────

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}…`
}

export function generateInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
