'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ReportReason, ReviewType } from '@tradedex/types'

export async function submitReview(
  reviewedUserId: string,
  type: ReviewType,
  comment: string | null
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }
  if (user.id === reviewedUserId) return { error: 'Cannot review yourself' }

  // Check for duplicate review
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('reviewer_id', user.id)
    .eq('reviewed_id', reviewedUserId)
    .single()

  if (existing) return { error: 'You have already reviewed this user' }

  const { error } = await supabase.from('reviews').insert({
    reviewer_id: user.id,
    reviewed_id: reviewedUserId,
    type,
    comment,
  })

  if (error) return { error: error.message }

  revalidatePath(`/profile/${reviewedUserId}`)
  return { success: true }
}

export async function reportUser(
  reportedUserId: string,
  reason: ReportReason,
  description: string | null
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }
  if (user.id === reportedUserId) return { error: 'Cannot report yourself' }

  const { error } = await supabase.from('reports').insert({
    reporter_id: user.id,
    reported_user_id: reportedUserId,
    reason,
    description,
    status: 'PENDING',
  })

  if (error) return { error: error.message }

  return { success: true }
}

export async function updateProfile(updates: {
  username?: string
  bio?: string | null
  location?: string | null
  avatar_url?: string | null
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/profile')
  return { success: true }
}
