import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/chat', '/dashboard']

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check if user has completed onboarding
    const { data: profile } = await supabase
      .from('users')
      .select('full_name, visa_type')
      .eq('id', user.id)
      .single()

    if (!profile?.full_name || !profile?.visa_type) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  // Handle onboarding page - only allow authenticated users
  if (pathname === '/onboarding') {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // If user already has complete profile, redirect to dashboard
    const { data: profile } = await supabase
      .from('users')
      .select('full_name, visa_type')
      .eq('id', user.id)
      .single()

    if (profile?.full_name && profile?.visa_type) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
