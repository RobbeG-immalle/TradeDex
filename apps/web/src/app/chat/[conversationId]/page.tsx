import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/navbar'
import { ChatWindow } from '@/components/chat/chat-window'

interface Props {
  params: Promise<{ conversationId: string }>
}

export const metadata: Metadata = { title: 'Chat – TradeDex' }

export default async function ConversationPage({ params }: Props) {
  const { conversationId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/chat')

  // Verify the user is a participant
  const { data: conversation } = await supabase
    .from('conversations')
    .select('*, participant_1_profile:profiles!conversations_participant_1_fkey(username, avatar_url), participant_2_profile:profiles!conversations_participant_2_fkey(username, avatar_url)')
    .eq('id', conversationId)
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .single()

  if (!conversation) notFound()

  const otherUserId =
    conversation.participant_1 === user.id
      ? conversation.participant_2
      : conversation.participant_1

  const otherProfile =
    conversation.participant_1 === user.id
      ? conversation.participant_2_profile
      : conversation.participant_1_profile

  const otherProfileData = Array.isArray(otherProfile) ? otherProfile[0] : otherProfile

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-8 flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
        <ChatWindow
          conversationId={conversationId}
          currentUserId={user.id}
          otherUserId={otherUserId}
          otherUsername={otherProfileData?.username ?? 'Unknown'}
          otherAvatarUrl={otherProfileData?.avatar_url ?? null}
        />
      </main>
    </>
  )
}
