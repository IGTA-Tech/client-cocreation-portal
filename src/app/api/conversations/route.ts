import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/conversations - List user's conversations
export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch user's conversations
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching conversations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch conversations' },
        { status: 500 }
      )
    }

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('Conversations API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/conversations - Create new conversation
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Get current user (optional - allow anonymous conversations)
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const { title, messages } = body

    // Create conversation
    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user?.id || null,
        title: title || null,
        messages: messages || [],
        status: 'active',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating conversation:', error)
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
