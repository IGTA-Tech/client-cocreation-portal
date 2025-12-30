import { createClient } from '@/lib/supabase/client'
import type { Message, Conversation, ExtractedContext } from '@/types'

// Client-side conversation management

export async function createConversation(userId?: string): Promise<string | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId || null,
      messages: [],
      status: 'active',
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating conversation:', error)
    return null
  }

  return data.id
}

export async function saveMessages(
  conversationId: string,
  messages: Message[]
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('conversations')
    .update({
      messages: messages,
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId)

  if (error) {
    console.error('Error saving messages:', error)
    return false
  }

  return true
}

export async function updateConversationContext(
  conversationId: string,
  context: ExtractedContext
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('conversations')
    .update({
      extracted_context: context,
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId)

  if (error) {
    console.error('Error updating context:', error)
    return false
  }

  return true
}

export async function updateConversationTitle(
  conversationId: string,
  title: string
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('conversations')
    .update({
      title,
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId)

  if (error) {
    console.error('Error updating title:', error)
    return false
  }

  return true
}

export async function getConversation(conversationId: string): Promise<Conversation | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single()

  if (error) {
    console.error('Error fetching conversation:', error)
    return null
  }

  return data as Conversation
}

export async function getUserConversations(userId: string): Promise<Conversation[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching conversations:', error)
    return []
  }

  return data as Conversation[]
}

export async function markConversationSpecGenerated(
  conversationId: string
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from('conversations')
    .update({
      status: 'spec_generated',
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId)

  if (error) {
    console.error('Error updating conversation status:', error)
    return false
  }

  return true
}

// Generate a title from conversation content
export function generateConversationTitle(messages: Message[]): string {
  // Find first user message with substance
  const firstUserMessage = messages.find(
    (m) => m.role === 'user' && m.content.length > 10
  )

  if (!firstUserMessage) {
    return 'New Conversation'
  }

  // Extract first ~50 chars
  const title = firstUserMessage.content.slice(0, 50)
  return title.length < firstUserMessage.content.length ? `${title}...` : title
}
