import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendMagicLinkEmail } from '@/lib/sendgrid'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = await createAdminClient()

    // Get the origin for the redirect URL
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // Generate the magic link using Admin API (bypasses Supabase email sending)
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Magic link generation error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Send the magic link email via SendGrid
    const actionLink = data.properties.action_link
    const emailSent = await sendMagicLinkEmail(email, actionLink)

    if (!emailSent) {
      console.error('Failed to send magic link email via SendGrid')
      return NextResponse.json(
        { error: 'Failed to send sign-in email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Magic link API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
