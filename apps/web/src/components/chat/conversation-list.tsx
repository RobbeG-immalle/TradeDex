import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatRelativeTime } from '@tradedex/utils'

interface Props {
  userId: string
}

export async function ConversationList({ userId }: Props) {
  const supabase = await createClient()

  const { data: conversations } = await supabase
    .from('conversations')
    .select(
      `*,
      participant_1_profile:profiles!conversations_participant_1_fkey(username, avatar_url),
      participant_2_profile:profiles!conversations_participant_2_fkey(username, avatar_url),
      last_message:messages(content, created_at, sender_id)`
    )
    .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
    .order('last_message_at', { ascending: false })
    .limit(50)

  if (!conversations || conversations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-12 text-center text-slate-400">
        <p className="text-4xl mb-4">💬</p>
        <p className="text-xl font-semibold mb-2">No conversations yet</p>
        <p className="text-sm">
          Visit a user&apos;s profile and click &quot;Message&quot; to start chatting
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {conversations.map((convo) => {
        const isParticipant1 = convo.participant_1 === userId
        const otherProfile = isParticipant1
          ? (Array.isArray(convo.participant_2_profile) ? convo.participant_2_profile[0] : convo.participant_2_profile)
          : (Array.isArray(convo.participant_1_profile) ? convo.participant_1_profile[0] : convo.participant_1_profile)

        const lastMessages = Array.isArray(convo.last_message) ? convo.last_message : []
        const lastMsg = lastMessages.sort(
          (a: { created_at: string }, b: { created_at: string }) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0]

        return (
          <li key={convo.id}>
            <Link
              href={`/chat/${convo.id}`}
              className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                {otherProfile?.username?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{otherProfile?.username ?? 'Unknown'}</span>
                  {lastMsg && (
                    <span className="text-xs text-slate-400">{formatRelativeTime(lastMsg.created_at)}</span>
                  )}
                </div>
                {lastMsg && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {lastMsg.sender_id === userId ? 'You: ' : ''}
                    {lastMsg.content}
                  </p>
                )}
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
