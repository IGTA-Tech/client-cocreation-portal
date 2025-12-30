'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageBubble } from './MessageBubble'
import { InputBar } from './InputBar'
import type { Message } from '@/types'
import { generateId, formatRelativeTime } from '@/lib/utils'
import { Loader2, Save, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Welcome! I'm here to help you discover what custom tool would make your visa journey easier.

I'll ask you a few questions to understand your needs, and then we can design a tool together that's built specifically for you.

Let's start - what type of visa are you working on? (For example: O-1A, O-1B, P-1A, EB-1A, H-1B, etc.)`,
  timestamp: new Date().toISOString(),
}

interface ChatWindowProps {
  conversationId?: string
  initialMessages?: Message[]
  onSave?: (messages: Message[]) => Promise<void>
}

export function ChatWindow({ conversationId, initialMessages, onSave }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || [INITIAL_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Suppress unused variable warnings
  void conversationId

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Save conversation function
  const handleSaveConversation = useCallback(async () => {
    if (!onSave || messages.length <= 1) return

    setIsSaving(true)
    try {
      await onSave(messages.filter(m => m.id !== 'welcome'))
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save conversation:', error)
    } finally {
      setIsSaving(false)
    }
  }, [messages, onSave])

  // Auto-save after each message exchange (debounced)
  useEffect(() => {
    if (messages.length > 1 && !isLoading && onSave) {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      // Set new timeout
      saveTimeoutRef.current = setTimeout(() => {
        handleSaveConversation()
      }, 2000) // Save 2 seconds after last change
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [messages, isLoading, onSave, handleSaveConversation])

  const handleSend = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call API
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.filter((m) => m.id !== 'welcome'),
          userMessage: content,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      // Add assistant message
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Save status bar */}
      {onSave && messages.length > 1 && (
        <div className="flex items-center justify-end gap-2 px-4 py-2 border-b bg-muted/30">
          {isSaving ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </span>
          ) : lastSaved ? (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Saved {formatRelativeTime(lastSaved)}
            </span>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveConversation}
            disabled={isSaving || messages.length <= 1}
            className="h-7 text-xs"
          >
            <Save className="h-3 w-3 mr-1" />
            Save Now
          </Button>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex gap-3 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="mx-auto w-full max-w-3xl">
        <InputBar onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  )
}
