'use client'

import React, { useState, useCallback } from 'react'
import { UploadCloud, File, CheckCircle, Clock, FileText, Image as ImageIcon, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface UploadedFile {
  id?: string
  name: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  type: string
  sessionId?: string
}

export function UploadArea() {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const pollStatus = async (docId: string, fileIndex: number) => {
    const interval = setInterval(async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${baseUrl}/api/documents/${docId}/status`)
        if (res.ok) {
          const data = await res.json()
          if (data.processing_status === 'completed' || data.processing_status === 'failed') {
            clearInterval(interval)
            setFiles(prev => {
              const newFiles = [...prev]
              newFiles[fileIndex] = { ...newFiles[fileIndex], status: data.processing_status }
              return newFiles
            })
          }
        }
      } catch (e) {
        console.error("Polling error:", e)
      }
    }, 2000)
  }

  const handleFiles = async (newFiles: File[]) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const currentUserId = user?.id || 'default-user'

    const MAX_SIZE = 25 * 1024 * 1024; // 25 MB
    const ALLOWED_REGEX = /\.(pdf|jpg|jpeg|png|webp|bmp)$/i;

    for (const f of newFiles) {
      if (f.size > MAX_SIZE) {
        alert(`"${f.name}" is too large. Maximum allowed file size is 25MB.`);
        continue;
      }
      if (!ALLOWED_REGEX.test(f.name)) {
        alert(`"${f.name}" has an unsupported format. Supported formats: PDF, JPG, PNG, WEBP, BMP.`);
        continue;
      }

      const newFileObj: UploadedFile = {
        name: f.name,
        status: 'pending',
        type: f.name.toLowerCase().endsWith('.pdf') ? 'report' : 'image'
      }
      
      setFiles(prev => [...prev, newFileObj])
      const fileIndex = files.length // Approximate index

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        // Create a new chat session for this report
        const sessionRes = await fetch(`${baseUrl}/api/chat/sessions?user_id=${currentUserId}&title=Report:%20${encodeURIComponent(f.name.substring(0, 30))}`, { method: 'POST' })
        const session = await sessionRes.json()

        const formData = new FormData()
        formData.append('file', f)
        formData.append('session_id', session.id)
        formData.append('user_id', currentUserId)

        setFiles(prev => {
          const arr = [...prev]
          arr[arr.length - 1].status = 'processing'
          return arr
        })

        const uploadRes = await fetch(`${baseUrl}/api/documents/upload`, {
          method: 'POST',
          body: formData
        })
        const uploadData = await uploadRes.json()

        if (uploadData.document_id) {
          setFiles(prev => {
            const arr = [...prev]
            arr[arr.length - 1].id = uploadData.document_id
            arr[arr.length - 1].sessionId = session.id
            return arr
          })
          pollStatus(uploadData.document_id, fileIndex)
        }
      } catch (error) {
        console.error("Upload failed", error)
        setFiles(prev => {
          const arr = [...prev]
          arr[arr.length - 1].status = 'failed'
          return arr
        })
      }
    }
  }

  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files))
    }
  }

  return (
    <div className="w-full flex flex-col space-y-6">
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
          isDragging 
            ? 'border-[var(--color-accent-cyan)] bg-[var(--color-accent-blue)]/10 shadow-[0_0_20px_var(--color-accent-glow)]' 
            : 'border-[var(--color-accent-blue)]/40 bg-[var(--color-bg-glass)] hover:border-[var(--color-accent-blue)]/80'
        }`}
      >
        <UploadCloud className={`w-16 h-16 mb-4 ${isDragging ? 'text-[var(--color-accent-cyan)]' : 'text-[var(--color-accent-blue)]'}`} />
        <h3 className="text-xl font-medium mb-2">Drag & Drop Medical Reports</h3>
        <p className="text-[var(--color-text-muted)] text-sm mb-4">Supported formats: PDF, JPG, PNG</p>
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          multiple
          accept=".pdf,image/*"
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-accent-blue)]/50 rounded-lg text-[var(--color-accent-cyan)] hover:bg-[var(--color-accent-blue)]/10 transition-colors"
        >
          Browse Files
        </button>
      </div>

      <div className="space-y-3">
        {files.map((file, idx) => (
          <div key={idx} className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-[var(--color-bg-secondary)] rounded-lg text-[var(--color-accent-blue)]">
                {file.type === 'report' ? <FileText size={24} /> : <ImageIcon size={24} />}
              </div>
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mt-1">{file.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {file.status === 'pending' && <Clock className="text-[var(--color-warning)] animate-pulse" />}
              {file.status === 'processing' && <div className="w-6 h-6 border-2 border-[var(--color-accent-blue)] border-t-transparent rounded-full animate-spin"></div>}
              {file.status === 'completed' && (
                <>
                  <CheckCircle className="text-[var(--color-success)] mr-2" />
                  {file.sessionId && file.id && (
                    <Link 
                      href={`/chat?session=${file.sessionId}&doc=${file.id}`}
                      className="px-4 py-2 bg-gradient-to-r from-[var(--color-accent-blue)] to-[var(--color-accent-cyan)] text-white text-sm rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      <MessageSquare size={16} />
                      Start Chat
                    </Link>
                  )}
                </>
              )}
              {file.status === 'failed' && <span className="text-[var(--color-danger)] text-sm">Upload failed</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
