'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatRelativeTime, generateInitials } from '@tradedex/utils'
import type { Message } from '@tradedex/types'
import Link from 'next/link'

interface Props {
  conversationId: string
  currentUserId: string
  otherUserId: string
  otherUsername: string
  otherAvatarUrl: string | null
}

export function ChatWindow({
  conversationId,
  currentUserId,
  otherUsername,
  otherAvatarUrl,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Load initial messages
  useEffect(() => {
    async function loadMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(100)

      if (data) setMessages(data)
    }
    void loadMessages()
  }, [conversationId, supabase])

  // Subscribe to real-time messages
  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [conversationId, supabase])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const content = input.trim()
    if (!content || isSending) return
    setInput('')
    setIsSending(true)

    try {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        content,
      })

      // Update last_message_at on conversation
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 px-4 py-3 bg-white dark:bg-slate-800">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
          {otherAvatarUrl ? (
            <img src={otherAvatarUrl} alt={otherUsername} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            generateInitials(otherUsername)
          )}
        </div>
        <Link href={`/profile/${otherUsername}`} className="font-semibold hover:underline">
          {otherUsername}
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/50">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            <p className="text-3xl mb-2">👋</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2.5 text-sm ${
                  isOwn
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-bl-sm'
                }`}
              >
                <p>{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwn ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {formatRelativeTime(msg.created_at)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void sendMessage()
              }
            }}
            placeholder="Type a message…"
            maxLength={2000}
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isSending}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 transition-colors"
          >
            {isSending ? '…' : '➤'}
          </button>
        </div>
      </div>
    </div>
  )
}
