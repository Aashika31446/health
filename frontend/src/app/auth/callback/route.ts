import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  // If Supabase forwarded an error directly (e.g. otp_expired, link invalid)
  const errorDescription = searchParams.get('error_description') || searchParams.get('error')
  if (errorDescription) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription)}`)
  }

  if (code || (token_hash && type)) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    )

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`)
      }
      console.error('exchangeCodeForSession error:', error.message)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    } else if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({ token_hash, type })
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`)
      }
      console.error('verifyOtp error:', error.message)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
    }
  }

  // return the user to login with error details
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
