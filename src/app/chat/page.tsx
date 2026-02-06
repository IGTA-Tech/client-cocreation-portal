'use client'

import { useState, useCallback, useEffect } from 'react'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Message } from '@/types'

const IA_LOGO = "https://www.innovativeautomations.dev/wp-content/uploads/2025/04/Innovative-Automation-Studios-Logo-trimmed.png"

export default function ChatPage() {
  const [conversationId, setConversationId] = useState<string | null>(null)

  // Create a new conversation on first message
  const handleSave = useCallback(async (messages: Message[]) => {
    if (messages.length === 0) return

    try {
      if (!conversationId) {
        // Create new conversation
        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: generateTitle(messages),
            messages,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setConversationId(data.conversation.id)
        }
      } else {
        // Update existing conversation
        await fetch(`/api/conversations/${conversationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
        })
      }
    } catch (error) {
      console.error('Failed to save conversation:', error)
    }
  }, [conversationId])

  // Update URL when conversation is created
  useEffect(() => {
    if (conversationId) {
      window.history.replaceState({}, '', `/chat/${conversationId}`)
    }
  }, [conversationId])

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 border-b px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Link href="/" className="flex items-center">
          <Image
            src={IA_LOGO}
            alt="Innovative Automations"
            width={120}
            height={35}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Co-Creation Studio</h1>
          <p className="text-sm text-muted-foreground">
            Design your O-1 itinerary app with AI guidance
          </p>
        </div>
      </header>

      {/* Chat */}
      <main className="flex-1 overflow-hidden">
        <ChatWindow onSave={handleSave} />
      </main>
    </div>
  )
}

function generateTitle(messages: Message[]): string {
  // Generate a title from the first user message
  const firstUserMessage = messages.find(m => m.role === 'user')
  if (firstUserMessage) {
    const content = firstUserMessage.content.slice(0, 50)
    return content.length < firstUserMessage.content.length
      ? `${content}...`
      : content
  }
  return 'New Conversation'
}
