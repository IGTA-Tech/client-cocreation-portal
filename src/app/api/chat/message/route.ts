import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendChatMessage, type ChatMessage, type ClientContext } from '@/lib/claude'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile for context
    const { data: profile } = await supabase
      .from('users')
      .select('full_name, visa_type, field_of_expertise, project_description, company, attorney_name')
      .eq('id', user.id)
      .single()

    const body = await request.json()
    const { messages, userMessage } = body as {
      messages: ChatMessage[]
      userMessage: string
    }

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    // Build client context from profile
    const clientContext: ClientContext | undefined = profile ? {
      full_name: profile.full_name,
      visa_type: profile.visa_type,
      field_of_expertise: profile.field_of_expertise,
      project_description: profile.project_description,
      company: profile.company,
      attorney_name: profile.attorney_name,
    } : undefined

    const content = await sendChatMessage(messages || [], userMessage, clientContext)

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}
