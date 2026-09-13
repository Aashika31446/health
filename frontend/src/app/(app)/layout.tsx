import React, { Suspense } from 'react'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ClientAuthGuard } from '@/components/Auth/ClientAuthGuard'

export const dynamic = 'force-dynamic'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (err: any) {
    if (err?.digest?.includes('DYNAMIC_SERVER_USAGE') || err?.digest?.includes('NEXT_REDIRECT')) {
      throw err
    }
    console.warn("Server auth check notice in AppLayout:", err?.message || err)
  }

  if (!user) {
    redirect('/')
  }

  return (
    <div className="flex h-screen bg-[#F0F5FA] p-0 md:p-4 lg:p-5 gap-0 md:gap-3.5 font-sans">
      <ClientAuthGuard />
      <Suspense fallback={<div className="w-64 bg-white rounded-2xl border border-slate-200/80 hidden md:flex h-full p-4 text-slate-400">Loading...</div>}>
        <Sidebar />
      </Suspense>
      <div className="flex-1 overflow-hidden flex flex-col relative pt-16 md:pt-0 pb-0">
        {children}
      </div>
    </div>
  )
}

