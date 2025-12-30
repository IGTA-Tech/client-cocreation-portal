import { NextResponse } from 'next/server'
import { sendChatMessage, type ChatMessage } from '@/lib/claude'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, userMessage } = body as {
      messages: ChatMessage[]
      userMessage: string
    }

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      )
    }

    const content = await sendChatMessage(messages || [], userMessage)

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
