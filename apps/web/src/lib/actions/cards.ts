'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CardCondition, CardLanguage, CardStatus, PokemonCard } from '@tradedex/types'

export async function addCardToCollection(
  card: PokemonCard,
  options: {
    status: CardStatus
    condition?: CardCondition
    language?: CardLanguage
    quantity?: number
    notes?: string
  }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('user_cards').insert({
    user_id: user.id,
    card_id: card.id,
    card_name: card.name,
    card_image_small: card.images.small,
    card_image_large: card.images.large,
    card_set_name: card.set.name,
    card_number: card.number,
    status: options.status,
    condition: options.condition ?? null,
    language: options.language ?? 'EN',
    quantity: options.quantity ?? 1,
    notes: options.notes ?? null,
  })

  if (error) return { error: error.message }

  revalidatePath('/cards/my')
  return { success: true }
}

export async function updateUserCard(
  userCardId: string,
  updates: Partial<{
    status: CardStatus
    condition: CardCondition | null
    language: CardLanguage
    quantity: number
    notes: string | null
  }>
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('user_cards')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userCardId)
    .eq('user_id', user.id) // RLS: only owner can update

  if (error) return { error: error.message }

  revalidatePath('/cards/my')
  return { success: true }
}

export async function removeUserCard(userCardId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('user_cards')
    .delete()
    .eq('id', userCardId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/cards/my')
  return { success: true }
}
