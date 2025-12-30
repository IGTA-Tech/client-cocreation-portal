'use client'

import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Message } from '@/types'

const IA_LOGO = "https://www.innovativeautomations.dev/wp-content/uploads/2025/04/Innovative-Automation-Studios-Logo-trimmed.png"

export default function ConversationPage() {
  const params = useParams()
  const conversationId = params.id as string

  const [initialMessages, setInitialMessages] = useState<Message[] | null>(null)
  const [title, setTitle] = useState('Loading...')
  const [error, setError] = useState<string | null>(null)

  // Load existing conversation
  useEffect(() => {
    async function loadConversation() {
      try {
        const response = await fetch(`/api/conversations/${conversationId}`)
        if (!response.ok) {
          throw new Error('Conversation not found')
        }
        const data = await response.json()
        setInitialMessages(data.conversation.messages || [])
        setTitle(data.conversation.title || 'Conversation')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conversation')
      }
    }

    if (conversationId) {
      loadConversation()
    }
  }, [conversationId])

  // Save messages to existing conversation
  const handleSave = useCallback(async (messages: Message[]) => {
    if (messages.length === 0) return

    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          title: generateTitle(messages),
        }),
      })
    } catch (error) {
      console.error('Failed to save conversation:', error)
    }
  }, [conversationId])

  if (error) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <header className="flex items-center gap-4 border-b px-4 py-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Link href="/chat" className="text-primary hover:underline">
              Start a new conversation
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (initialMessages === null) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <header className="flex items-center gap-4 border-b px-4 py-3">
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
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 border-b px-4 py-3">
        <Link
          href="/dashboard"
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
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">
            Continue your conversation
          </p>
        </div>
      </header>

      {/* Chat */}
      <main className="flex-1 overflow-hidden">
        <ChatWindow
          conversationId={conversationId}
          initialMessages={initialMessages}
          onSave={handleSave}
        />
      </main>
    </div>
  )
}

function generateTitle(messages: Message[]): string {
  const firstUserMessage = messages.find(m => m.role === 'user')
  if (firstUserMessage) {
    const content = firstUserMessage.content.slice(0, 50)
    return content.length < firstUserMessage.content.length
      ? `${content}...`
      : content
  }
  return 'Conversation'
}
