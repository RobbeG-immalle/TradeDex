// ─────────────────────────────────────────────────────────────────────────────
// Auth & User
// ─────────────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  created_at: string
}

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  bio: string | null
  location: string | null
  rating: number
  rating_count: number
  created_at: string
  updated_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Pokémon TCG API
// ─────────────────────────────────────────────────────────────────────────────

export interface PokemonCard {
  id: string
  name: string
  supertype: string
  subtypes: string[]
  hp?: string
  types?: string[]
  set: PokemonSet
  number: string
  artist?: string
  rarity?: string
  images: PokemonCardImages
  tcgplayer?: TcgPlayer
  cardmarket?: CardMarket
}

export interface PokemonSet {
  id: string
  name: string
  series: string
  printedTotal: number
  total: number
  releaseDate: string
  images: {
    symbol: string
    logo: string
  }
}

export interface PokemonCardImages {
  small: string
  large: string
}

export interface TcgPlayer {
  url: string
  prices?: Record<string, TcgPlayerPrice>
}

export interface TcgPlayerPrice {
  low?: number
  mid?: number
  high?: number
  market?: number
}

export interface CardMarket {
  url: string
  prices?: {
    averageSellPrice?: number
    lowPrice?: number
    trendPrice?: number
  }
}

export interface PokemonCardApiResponse {
  data: PokemonCard[]
  page: number
  pageSize: number
  count: number
  totalCount: number
}

// ─────────────────────────────────────────────────────────────────────────────
// User Cards (Collection)
// ─────────────────────────────────────────────────────────────────────────────

export type CardStatus = 'FOR_TRADE' | 'WANTED' | 'COLLECTION'

export type CardCondition = 'MINT' | 'NEAR_MINT' | 'EXCELLENT' | 'GOOD' | 'LIGHT_PLAYED' | 'PLAYED' | 'POOR'

export type CardLanguage =
  | 'EN'
  | 'JP'
  | 'DE'
  | 'FR'
  | 'ES'
  | 'IT'
  | 'PT'
  | 'KO'
  | 'ZH_HANS'
  | 'ZH_HANT'

export interface UserCard {
  id: string
  user_id: string
  card_id: string
  card_name: string
  card_image_small: string
  card_image_large: string
  card_set_name: string
  card_number: string
  status: CardStatus
  condition: CardCondition | null
  language: CardLanguage
  quantity: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface UserCardWithProfile extends UserCard {
  profile: Profile
}

// ─────────────────────────────────────────────────────────────────────────────
// Conversations & Messages
// ─────────────────────────────────────────────────────────────────────────────

export interface Conversation {
  id: string
  participant_1: string
  participant_2: string
  last_message_at: string | null
  created_at: string
}

export interface ConversationWithParticipants extends Conversation {
  other_profile: Profile
  last_message: Message | null
  unread_count: number
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  read_at: string | null
  created_at: string
}

export interface MessageWithSender extends Message {
  sender: Profile
}

// ─────────────────────────────────────────────────────────────────────────────
// Reviews
// ─────────────────────────────────────────────────────────────────────────────

export type ReviewType = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'

export interface Review {
  id: string
  reviewer_id: string
  reviewed_id: string
  type: ReviewType
  comment: string | null
  created_at: string
}

export interface ReviewWithReviewer extends Review {
  reviewer: Profile
}

// ─────────────────────────────────────────────────────────────────────────────
// Reports
// ─────────────────────────────────────────────────────────────────────────────

export type ReportReason =
  | 'SCAM'
  | 'FAKE_CARDS'
  | 'HARASSMENT'
  | 'SPAM'
  | 'MISLEADING_LISTING'
  | 'OTHER'

export type ReportStatus = 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED'

export interface Report {
  id: string
  reporter_id: string
  reported_user_id: string
  reason: ReportReason
  description: string | null
  status: ReportStatus
  created_at: string
}

// ─────────────────────────────────────────────────────────────────────────────
// API Utilities
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  pageSize: number
  totalCount: number
  hasMore: boolean
}

export interface SearchParams {
  query?: string
  page?: number
  pageSize?: number
}

export interface CardSearchParams extends SearchParams {
  set?: string
  rarity?: string
  type?: string
}
