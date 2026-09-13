'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function ClientAuthGuard() {
  useEffect(() => {
    const supabase = createClient()

    // 1. Initial check on mount
    supabase.auth.getUser()
      .then(({ data }) => {
        if (!data?.user) {
          window.location.replace('/')
        }
      })
      .catch((err) => {
        console.warn("Auth check notice on mount:", err?.message || err)
      })

    // 2. Real-time auth state listener (catches logout across tabs or sessions)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        window.location.replace('/')
      }
    })

    // 3. Listen to browser pageshow events (handles bfcache / browser back button)
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        supabase.auth.getUser()
          .then(({ data }) => {
            if (!data?.user) {
              window.location.replace('/')
            }
          })
          .catch((err) => {
            console.warn("Auth check notice on pageshow:", err?.message || err)
          })
      }
    }

    window.addEventListener('pageshow', handlePageShow)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [])

  return null
}
