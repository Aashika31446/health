import React, { Suspense } from 'react'
import { ChatUI } from '@/components/Chat/ChatUI'

export default function ChatPage() {
  return (
    <div className="flex-1 flex relative overflow-hidden h-full rounded-3xl bg-white border border-slate-200/80 shadow-sm">
      <div className="flex-1 flex flex-col relative overflow-hidden h-full">
        <Suspense fallback={<div className="flex-1 p-6 flex items-center justify-center text-slate-400">Loading chat...</div>}>
          <ChatUI />
        </Suspense>
      </div>
    </div>
  )
}
