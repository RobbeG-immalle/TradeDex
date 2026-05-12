'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Props {
  targetUserId: string
  targetUsername: string
}

export function StartChatButton({ targetUserId, targetUsername }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(
          `and(participant_1.eq.${user.id},participant_2.eq.${targetUserId}),and(participant_1.eq.${targetUserId},participant_2.eq.${user.id})`
        )
        .single()

      if (existing) {
        router.push(`/chat/${existing.id}`)
        return
      }

      // Create new conversation
      const { data: newConvo, error } = await supabase
        .from('conversations')
        .insert({
          participant_1: user.id,
          participant_2: targetUserId,
        })
        .select('id')
        .single()

      if (error || !newConvo) {
        toast.error('Failed to start conversation')
        return
      }

      router.push(`/chat/${newConvo.id}`)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
    >
      {isPending ? 'Opening…' : `💬 Message ${targetUsername}`}
    </button>
  )
}
