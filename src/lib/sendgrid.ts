import sgMail from '@sendgrid/mail'

// Initialize SendGrid with API key
const apiKey = process.env.SENDGRID_API_KEY
if (apiKey) {
  sgMail.setApiKey(apiKey)
}

const FROM_EMAIL = 'noreply@coinnovations.online'
const NOTIFY_EMAIL = 'sherrod@sherrodsportsvisas.com'

interface OnboardingData {
  full_name: string
  email: string
  phone?: string | null
  company?: string | null
  visa_type: string
  field_of_expertise: string
  project_description: string
  attorney_name?: string | null
}

interface AppSpecData {
  client_name: string
  client_email: string
  app_name: string
  message_count: number
  full_spec: string
}

/**
 * Send email notification when a new client completes onboarding
 */
export async function sendOnboardingEmail(data: OnboardingData): Promise<boolean> {
  if (!apiKey) {
    console.warn('SendGrid API key not configured - skipping onboarding email')
    return false
  }

  const msg = {
    to: NOTIFY_EMAIL,
    from: FROM_EMAIL,
    subject: `🆕 New Co-Creation Client: ${data.full_name}`,
    text: `New client onboarded to Co-Creation Studio:

Name: ${data.full_name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Company: ${data.company || 'Not provided'}
Visa Type: ${data.visa_type}
Field: ${data.field_of_expertise}

Project Idea:
${data.project_description}

Attorney: ${data.attorney_name || 'Sherrod Seward'}`,
    html: `
      <h2>🆕 New Co-Creation Client</h2>
      <p>A new client has onboarded to Co-Creation Studio:</p>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.full_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.phone || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.company || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Visa Type</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.visa_type}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Field</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.field_of_expertise}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Attorney</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${data.attorney_name || 'Sherrod Seward'}</td>
        </tr>
      </table>
      <h3 style="margin-top: 20px;">Project Idea:</h3>
      <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${data.project_description.replace(/\n/g, '<br>')}</p>
    `,
  }

  try {
    await sgMail.send(msg)
    console.log('Onboarding email sent successfully to', NOTIFY_EMAIL)
    return true
  } catch (error) {
    console.error('Failed to send onboarding email:', error)
    return false
  }
}

/**
 * Send email notification when a client generates an app spec
 */
export async function sendAppSpecEmail(data: AppSpecData): Promise<boolean> {
  if (!apiKey) {
    console.warn('SendGrid API key not configured - skipping app spec email')
    return false
  }

  const completedDate = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles',
  })

  const msg = {
    to: NOTIFY_EMAIL,
    from: FROM_EMAIL,
    subject: `📋 App Spec Ready: ${data.app_name} - ${data.client_name}`,
    text: `${data.client_name} has completed their O-1 itinerary app specification!

Conversation Summary:
- ${data.message_count} messages exchanged
- Completed on: ${completedDate}

--- APP SPECIFICATION ---
${data.full_spec}
---

Client Email: ${data.client_email}`,
    html: `
      <h2>📋 App Specification Ready!</h2>
      <p><strong>${data.client_name}</strong> has completed their O-1 itinerary app specification!</p>
      
      <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">Conversation Summary</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li><strong>${data.message_count}</strong> messages exchanged</li>
          <li>Completed on: <strong>${completedDate}</strong></li>
        </ul>
      </div>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; font-family: monospace; white-space: pre-wrap; overflow-x: auto;">
--- APP SPECIFICATION ---

${data.full_spec.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
      </div>

      <p style="margin-top: 20px;">
        <strong>Client Email:</strong> <a href="mailto:${data.client_email}">${data.client_email}</a>
      </p>
    `,
  }

  try {
    await sgMail.send(msg)
    console.log('App spec email sent successfully to', NOTIFY_EMAIL)
    return true
  } catch (error) {
    console.error('Failed to send app spec email:', error)
    return false
  }
}

/**
 * Send magic link email for authentication
 */
export async function sendMagicLinkEmail(email: string, magicLink: string): Promise<boolean> {
  if (!apiKey) {
    console.warn('SendGrid API key not configured - skipping magic link email')
    return false
  }

  const msg = {
    to: email,
    from: FROM_EMAIL,
    subject: 'Your Co-Creation Studio Sign-In Link',
    text: `Click the link below to sign in to Co-Creation Studio:\n\n${magicLink}\n\nThis link expires in 1 hour. If you didn't request this, you can safely ignore this email.`,
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2 style="color: #333;">Sign in to Co-Creation Studio</h2>
        <p>Click the button below to sign in to your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${magicLink}"
             style="background-color: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; display: inline-block;">
            Sign In
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #2563eb; font-size: 14px; word-break: break-all;">${magicLink}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="color: #999; font-size: 12px;">
          This link expires in 1 hour. If you didn't request this sign-in link, you can safely ignore this email.
        </p>
      </div>
    `,
  }

  try {
    await sgMail.send(msg)
    console.log('Magic link email sent successfully to', email)
    return true
  } catch (error) {
    console.error('Failed to send magic link email:', error)
    return false
  }
}

/**
 * Extract app name from the spec content
 */
export function extractAppNameFromSpec(specContent: string): string {
  // Try to find app name from markdown headers
  const nameMatch = specContent.match(/##?\s*(?:App Name|Application Name|Tool Name)[:\s]+([^\n]+)/i)
  if (nameMatch) return nameMatch[1].trim()

  // Try to find it from the main title
  const titleMatch = specContent.match(/##\s*O-1 Itinerary App Specification[:\s]*([^\n]*)/i)
  if (titleMatch && titleMatch[1]) return titleMatch[1].trim()

  // Fallback
  return 'O-1 Itinerary App'
}
