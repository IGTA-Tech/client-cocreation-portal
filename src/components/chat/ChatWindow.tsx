'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageBubble } from './MessageBubble'
import { InputBar } from './InputBar'
import type { Message } from '@/types'
import { generateId, formatRelativeTime } from '@/lib/utils'
import { Loader2, Save, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatWindowProps {
  conversationId?: string
  initialMessages?: Message[]
  onSave?: (messages: Message[]) => Promise<void>
}

export function ChatWindow({ conversationId, initialMessages, onSave }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || [])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  void conversationId

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-start conversation to get personalized greeting
  useEffect(() => {
    if (!hasStarted && messages.length === 0) {
      setHasStarted(true)
      handleInitialGreeting()
    }
  }, [hasStarted, messages.length])

  const handleInitialGreeting = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [],
          userMessage: 'Hello, I\'m ready to start designing my app.',
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()

      const greetingMessage: Message = {
        id: 'greeting',
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
      }
      setMessages([greetingMessage])
    } catch (error) {
      console.error('Greeting error:', error)
      const fallbackMessage: Message = {
        id: 'greeting',
        role: 'assistant',
        content: 'Welcome to Co-Creation Studio! I\'m excited to help you design your O-1 itinerary app. Tell me about the app you\'d like to build.',
        timestamp: new Date().toISOString(),
      }
      setMessages([fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveConversation = useCallback(async () => {
    if (!onSave || messages.length <= 1) return

    setIsSaving(true)
    try {
      await onSave(messages.filter(m => m.id !== 'greeting'))
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save conversation:', error)
    } finally {
      setIsSaving(false)
    }
  }, [messages, onSave])

  useEffect(() => {
    if (messages.length > 1 && !isLoading && onSave) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        handleSaveConversation()
      }, 2000)
    }

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [messages, isLoading, onSave, handleSaveConversation])

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.filter((m) => m.id !== 'greeting'),
          userMessage: content,
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
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

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl">
          {messages.length === 0 && isLoading ? (
            <div className="flex gap-3 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-3">
                <p className="text-sm text-muted-foreground">Preparing your personalized studio...</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
          {isLoading && messages.length > 0 && (
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

      <div className="mx-auto w-full max-w-3xl">
        <InputBar onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  )
}
