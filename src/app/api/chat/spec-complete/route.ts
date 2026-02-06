import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendAppSpecEmail, extractAppNameFromSpec } from '@/lib/sendgrid'
import type { Message } from '@/types'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { messages, specContent } = body as {
      messages: Message[]
      specContent: string
    }

    if (!specContent) {
      return NextResponse.json({ error: 'No spec content provided' }, { status: 400 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('full_name, email')
      .eq('id', user.id)
      .single()

    const clientName = profile?.full_name || 'Client'
    const clientEmail = profile?.email || user.email || 'unknown@email.com'
    const appName = extractAppNameFromSpec(specContent)
    const messageCount = messages.filter(m => m.role === 'user').length

    // Send email notification
    const emailSent = await sendAppSpecEmail({
      client_name: clientName,
      client_email: clientEmail,
      app_name: appName,
      message_count: messageCount,
      full_spec: specContent,
    })

    // Optionally update conversation status in database
    // This could be added later if needed

    return NextResponse.json({ 
      success: true, 
      emailSent,
      appName,
    })
  } catch (error) {
    console.error('Spec complete API error:', error)
    return NextResponse.json(
      { error: 'Failed to process spec completion' },
      { status: 500 }
    )
  }
}
