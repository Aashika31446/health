'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Send, 
  Mic, 
  Paperclip, 
  StopCircle, 
  Square, 
  Copy, 
  RefreshCw, 
  Check, 
  Loader2, 
  FileText, 
  Volume2, 
  VolumeX,
  Share2,
  AudioLines,
  MessageSquare,
  Bot,
  User,
  CheckCheck,
  ThumbsUp,
  ThumbsDown,
  X,
  Sparkles,
  ArrowRight,
  ClipboardList,
  Activity,
  Pill,
  Stethoscope,
  Apple,
  ChevronDown,
  Lock,
  ShieldCheck,
  HeartPulse
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'

interface MessageItem {
  id: string
  role: 'user' | 'ai'
  content: string
  time?: string
  imageUrl?: string
  imageName?: string
}

interface StagedFile {
  id: string
  file: File
  name: string
  size: number
  previewUrl: string
  isImage: boolean
}

export function ChatUI() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlSessionId = searchParams.get('session')
  const urlDocId = searchParams.get('doc')
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(urlSessionId)
  const [currentDocId, setCurrentDocId] = useState<string | null>(urlDocId)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({})

  // Share with Doctor state
  const [isSharing, setIsSharing] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [shareCopied, setShareCopied] = useState(false)

  const starterPrompts = [
    {
      title: "Explain Medical Report",
      description: "Upload a blood test, MRI, or lab report for a plain-English breakdown",
      prompt: "Can you explain my medical report? Here are the findings: ",
      icon: FileText,
      tag: "Reports & Labs",
      iconBg: "bg-blue-50 text-[#0284C7] border-blue-100",
      hoverBorder: "hover:border-blue-300 hover:bg-blue-50/20",
    },
    {
      title: "Medication & Dosage Guide",
      description: "Check usage, precautions, and interactions for your medicines",
      prompt: "Can you explain the dosage, best time to take, and precautions for this medicine: ",
      icon: Pill,
      tag: "Prescriptions",
      iconBg: "bg-purple-50 text-purple-600 border-purple-100",
      hoverBorder: "hover:border-purple-300 hover:bg-purple-50/20",
    },
    {
      title: "Symptom Checker",
      description: "Describe what you're feeling for preliminary AI insights",
      prompt: "I have been experiencing the following symptoms: ",
      icon: Stethoscope,
      tag: "Health Check",
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      hoverBorder: "hover:border-emerald-300 hover:bg-emerald-50/20",
    },
    {
      title: "Diet & Wellness Advice",
      description: "Get personalized lifestyle and nutritional recommendations",
      prompt: "What diet and lifestyle recommendations do you suggest for maintaining healthy vitals?",
      icon: Apple,
      tag: "Lifestyle",
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      hoverBorder: "hover:border-amber-300 hover:bg-amber-50/20",
    },
  ]

  const handlePromptClick = (starter: typeof starterPrompts[0]) => {
    setInput(starter.prompt)
    const inputEl = document.querySelector('input[placeholder="Message CuraMind..."]') as HTMLInputElement | null
    inputEl?.focus()
  }

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const activeSessionIdRef = useRef<string | null>(urlSessionId)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollBottom, setShowScrollBottom] = useState(false)

  const handleContainerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const isScrolledUp = target.scrollHeight - target.scrollTop - target.clientHeight > 120
    setShowScrollBottom(isScrolledUp)
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  useEffect(() => {
    // Only switch session or fetch messages if urlSessionId is genuinely different
    if (urlSessionId === activeSessionIdRef.current) {
      return
    }

    activeSessionIdRef.current = urlSessionId
    setCurrentSessionId(urlSessionId)

    // User is switching away to a different chat: stop any audio and abort previous generation
    stopAudio()
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    if (urlSessionId) {
      fetchMessages(urlSessionId)
    } else {
      // User clicked "New Chat" (/chat)
      setCurrentDocId(null)
      setMessages([
        { 
          id: 'welcome-1', 
          role: 'ai', 
          content: 'Hello! I am **CuraMind**. Upload your medical report or ask me a question.\n\nI can help you with symptoms, medications, test reports, lifestyle advice and more.',
          time: getCurrentTime()
        }
      ])
    }
  }, [urlSessionId])

  useEffect(() => {
    setCurrentDocId(urlDocId)
  }, [urlDocId])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async (sid: string) => {
    setLoadingHistory(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/chat/sessions/${sid}/messages`)
      if (res.ok) {
        const data = await res.json().catch(() => null)
        if (Array.isArray(data) && data.length > 0) {
          setMessages(data.map(m => ({
            id: m.id,
            role: m.sender_type as 'user' | 'ai',
            content: m.content,
            time: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : getCurrentTime()
          })))
        } else {
          setMessages([{ 
            id: '1', 
            role: 'ai', 
            content: 'Hello! I am **CuraMind**. I am ready to assist you in this chat.',
            time: getCurrentTime()
          }])
        }
      } else {
        setMessages([{ 
          id: '1', 
          role: 'ai', 
          content: 'Hello! I am **CuraMind**. I am ready to assist you in this chat.',
          time: getCurrentTime()
        }])
      }
    } catch (e) {
      console.error("Failed to fetch messages", e)
    } finally {
      setLoadingHistory(false)
    }
  }

  // --- Audio / Avatar Control ---
  const stopAudio = () => {
    window.speechSynthesis.cancel()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsSpeaking(false)
  }

  const handleAvatarClick = () => {
    if (isSpeaking) stopAudio()
  }

  const playTTS = (text: string) => {
    stopAudio() // Stop any currently playing audio first
    
    // Clean text: remove emojis and markdown before speaking
    const cleanText = text
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '') 
      .replace(/[\*#_~`]/g, '') 
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("TTS error:", e)
      setIsSpeaking(false)
    }
  }

  // --- Recording Control ---
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        await handleAudioUpload(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error("Error accessing microphone:", err)
      alert("Could not access microphone.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleAudioUpload = async (blob: Blob) => {
    const formData = new FormData()
    formData.append('file', blob, 'voice.wav')

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/voice/transcribe`, {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = await res.json().catch(() => null)
        if (data?.text) {
          setInput(data.text)
        }
      }
    } catch (e) {
      console.error("Transcription error:", e)
    }
  }

  // --- Auto Session Creation Helper ---
  const ensureSession = async (defaultTitle: string = 'New Chat'): Promise<string> => {
    let sid = activeSessionIdRef.current || currentSessionId || urlSessionId;
    if (sid) {
      activeSessionIdRef.current = sid;
      return sid;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
      const userId = data?.user?.id || 'default-user';

      const createRes = await fetch(`${baseUrl}/api/chat/sessions?user_id=${userId}&title=${encodeURIComponent(defaultTitle.substring(0, 30))}`, {
        method: 'POST'
      });
      if (createRes.ok) {
        const newSession = await createRes.json().catch(() => null);
        if (newSession?.id) {
          sid = newSession.id;
        }
      }
    } catch (e) {
      console.error("Auto session creation notice:", e);
    }

    if (!sid) {
      sid = crypto.randomUUID();
    }

    activeSessionIdRef.current = sid;
    setCurrentSessionId(sid);
    window.history.replaceState({}, '', `/chat?session=${sid}`);
    window.dispatchEvent(new CustomEvent('session-created', { detail: { sessionId: sid } }));
    return sid;
  };

  // --- Staged File Handling ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_SIZE = 25 * 1024 * 1024; // 25 MB
    const validFiles: StagedFile[] = [];

    for (const file of Array.from(files)) {
      if (file.size > MAX_SIZE) {
        alert(`"${file.name}" exceeds the maximum allowed file size of 25MB.`);
        continue;
      }
      const isImg = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|bmp)$/i.test(file.name);
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      
      if (!isImg && !isPdf) {
        alert(`"${file.name}" is not a supported format. Please upload PDF or image files.`);
        continue;
      }

      validFiles.push({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        previewUrl: URL.createObjectURL(file),
        isImage: isImg,
      });
    }

    if (validFiles.length > 0) {
      setStagedFiles((prev) => [...prev, ...validFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeStagedFile = (id: string) => {
    setStagedFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  // --- Chat Stream Control ---
  const handleSend = async (messageText: string = input) => {
    const trimmedInput = messageText.trim();
    if (!trimmedInput && stagedFiles.length === 0) return;

    const effectiveText = trimmedInput || "Please analyze this medical report and explain all findings, key parameters, and recommendations in simple language.";

    stopAudio(); // Stop TTS when sending a new message

    const userMsgId = crypto.randomUUID();
    const aiMsgId = crypto.randomUUID();
    const currentTime = getCurrentTime();

    // Preserve references to staged files
    const filesToUpload = [...stagedFiles];
    const firstImg = filesToUpload.find((f) => f.isImage);
    const attachedPreviewUrl = firstImg ? firstImg.previewUrl : undefined;
    const attachedName = filesToUpload.length > 0 ? filesToUpload[0].name : undefined;

    // Reset input and staged files immediately
    if (messageText === input) setInput('');
    setStagedFiles([]);

    // Add user message with thumbnail preview
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: 'user',
        content: effectiveText,
        time: currentTime,
        imageUrl: attachedPreviewUrl,
        imageName: attachedName,
      },
    ]);

    setIsGenerating(true);
    setMessages((prev) => [...prev, { id: aiMsgId, role: 'ai', content: '', time: currentTime }]);

    let fullAiResponse = "";
    abortControllerRef.current = new AbortController();

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const sessionTitle = filesToUpload.length > 0 
        ? `Report: ${filesToUpload[0].name.substring(0, 20)}` 
        : effectiveText.substring(0, 30);
      const activeSessionId = await ensureSession(sessionTitle);

      let docIdToUse: string | null = currentDocId;

      // If files were staged, upload them to the backend now
      if (filesToUpload.length > 0) {
        let currentUserId = 'default-user';
        try {
          const { createClient } = await import('@/lib/supabase/client');
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.id) currentUserId = user.id;
        } catch (_) {}

        const uploadPromises = filesToUpload.map(async (item) => {
          const formData = new FormData();
          formData.append('file', item.file);
          formData.append('session_id', activeSessionId);
          formData.append('user_id', currentUserId);

          const res = await fetch(`${baseUrl}/api/documents/upload`, {
            method: 'POST',
            body: formData,
          });
          if (!res.ok) throw new Error(`Upload failed for ${item.name}`);
          const data = await res.json();
          return data.document_id as string;
        });

        const docIds = (await Promise.all(uploadPromises)).filter(Boolean);
        if (docIds.length > 0) {
          docIdToUse = docIds[docIds.length - 1];
          setCurrentDocId(docIdToUse);
          window.history.replaceState({}, '', `/chat?session=${activeSessionId}&doc=${docIdToUse}`);

          // Give background OCR up to 4s to extract text
          for (let i = 0; i < 10; i++) {
            try {
              const stRes = await fetch(`${baseUrl}/api/documents/${docIdToUse}/status`);
              if (stRes.ok) {
                const stData = await stRes.json();
                if (stData.processing_status === 'completed' || stData.processing_status === 'failed') {
                  break;
                }
              }
            } catch (_) {}
            await new Promise((r) => setTimeout(r, 400));
          }
        }
      }

      const response = await fetch(`${baseUrl}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSessionId, 
          message: effectiveText,
          language: 'en',
          document_id: docIdToUse || undefined
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.substring(6);
            if (!dataStr.trim()) continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.token) {
                fullAiResponse += data.token
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMsgId ? { ...msg, content: msg.content + data.token } : msg
                ));
              }
              if (data.error) {
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMsgId ? { ...msg, content: "Error: " + data.error } : msg
                ));
                setIsGenerating(false);
              }
              if (data.event === 'done') {
                setIsGenerating(false);
              }
            } catch (e) {
              // Ignore partial JSON parsing errors
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log("Generation aborted")
        // Optionally play TTS for what was generated so far
        if (fullAiResponse.trim()) playTTS(fullAiResponse)
      } else {
        console.error("Chat error:", error);
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId ? { ...msg, content: 'Sorry, I encountered an error connecting to the server.' } : msg
        ));
      }
      setIsGenerating(false)
    } finally {
      abortControllerRef.current = null
    }
  }

  const handleStopGenerate = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsGenerating(false)
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRegenerate = (index: number) => {
    // Find the last user message before this AI message
    let lastUserMsg = ""
    for (let i = index; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMsg = messages[i].content
        break
      }
    }
    if (lastUserMsg) {
      handleSend(lastUserMsg)
    }
  }

  const handleThumbs = (id: string, type: 'up' | 'down') => {
    setFeedback(prev => ({
      ...prev,
      [id]: prev[id] === type ? (undefined as any) : type
    }))
  }

  // --- Share with Doctor ---
  const handleShareWithDoctor = async () => {
    setIsSharing(true)
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('Please log in to share medical data with your doctor.');
        setIsSharing(false);
        return;
      }

      const token = crypto.randomUUID();
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      // Fetch user profile if available
      let profile: any = {};
      try {
        const { data: prof } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
        if (prof) profile = prof;
      } catch {}

      // Fetch active prescriptions
      let prescriptions: any[] = [];
      try {
        const pRes = await fetch(`${baseUrl}/api/chat/prescriptions?user_id=${user.id}`);
        if (pRes.ok) {
          const pData = await pRes.json();
          if (pData.data) prescriptions = pData.data;
        }
      } catch {}

      // Fetch metrics if profile has id
      let metrics: any[] = [];
      if (profile?.id) {
        try {
          const { data: met } = await supabase.from('metrics').select('*').eq('profile_id', profile.id);
          if (met) metrics = met;
        } catch {}
      }

      try {
        const res = await fetch(`${baseUrl}/api/chat/doctor-links`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            user_id: user.id,
            userName: user.user_metadata?.full_name || profile?.full_name || 'Patient',
            profile,
            metrics,
            prescriptions
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.token) {
            setShareLink(`${window.location.origin}/shared/${data.token}`);
            setShareCopied(false);
            setIsSharing(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Doctor link API notice:", err);
      }

      setShareLink(`${window.location.origin}/shared/${token}`);
      setShareCopied(false);
    } catch (e) {
      console.error("Error creating doctor share link:", e);
    } finally {
      setIsSharing(false);
    }
  }

  const copyShareLink = () => {
    if (!shareLink) return
    navigator.clipboard.writeText(shareLink)
    setShareCopied(true)
    setTimeout(() => setShareCopied(false), 2000)
  }

  // Render markdown helper for AI responses
  const renderFormattedAiContent = (text: string) => {
    if (!text) return null
    const lines = text.split('\n')
    
    return lines.map((line, idx) => {
      const trimmed = line.trim()
      if (!trimmed) return <div key={idx} className="h-2" />

      // Section: How it happens
      if (trimmed.toLowerCase().includes('how it happens')) {
        return (
          <div key={idx} className="flex items-center gap-2 font-bold text-[#0F172A] text-sm mt-3.5 mb-1.5 pt-1">
            <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0284C7] flex items-center justify-center shrink-0">
              <Activity size={14} className="text-[#0284C7]" />
            </div>
            <span>How it happens</span>
          </div>
        )
      }

      // Section: Typical signs and symptoms
      if (trimmed.toLowerCase().includes('signs and symptoms') || trimmed.toLowerCase().includes('typical signs')) {
        return (
          <div key={idx} className="flex items-center gap-2 font-bold text-[#0F172A] text-sm mt-3.5 mb-1.5 pt-1">
            <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0284C7] flex items-center justify-center shrink-0">
              <ClipboardList size={14} className="text-[#0284C7]" />
            </div>
            <span>Typical signs and symptoms</span>
          </div>
        )
      }

      // Bullet points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const bulletText = trimmed.replace(/^[\*\-•]\s*/, '')
        return (
          <div key={idx} className="flex items-start gap-2.5 pl-3 py-0.5 text-slate-700 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-2 shrink-0"></span>
            <div className="flex-1 leading-relaxed">
              {formatInlineStyles(bulletText)}
            </div>
          </div>
        )
      }

      // Disclaimer / Warning callout
      if (trimmed.includes('⚠️') || (trimmed.toLowerCase().includes('informational') && trimmed.toLowerCase().includes('diagnos'))) {
        return (
          <div key={idx} className="mt-4 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed font-medium shadow-xs">
            <span className="text-base shrink-0 leading-none">⚠️</span>
            <span className="flex-1">
              {trimmed.replace(/^⚠️\s*/, '') || "This is for informational purposes only and not a medical diagnosis. In any medical emergency, please consult a doctor immediately."}
            </span>
          </div>
        )
      }

      // Standard paragraph
      return (
        <p key={idx} className="text-slate-700 text-sm leading-relaxed">
          {formatInlineStyles(trimmed)}
        </p>
      )
    })
  }

  // Format bold **text**
  const formatInlineStyles = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-[#0F172A]">{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Top Header Bar matching reference image */}
      <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-center justify-between shrink-0 relative z-20">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-100 text-[#0284C7] flex items-center justify-center shrink-0 shadow-xs">
            <MessageSquare size={20} className="text-[#0284C7]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
              Chat with CuraMind
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Your personal health assistant. Ask anything, anytime.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={handleShareWithDoctor}
            disabled={isSharing}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 hover:bg-sky-100 text-[#0284C7] border border-sky-200/70 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            {isSharing ? (
              <div className="w-3.5 h-3.5 border-2 border-[#0284C7] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Share2 size={15} />
            )}
            <span>Share with Doctor</span>
          </button>

          <button
            onClick={() => {
              if (isSpeaking) {
                stopAudio()
              } else {
                const lastAi = [...messages].reverse().find(m => m.role === 'ai' && m.content)
                if (lastAi) playTTS(lastAi.content)
              }
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              isSpeaking 
                ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-md shadow-sky-500/20 animate-pulse' 
                : 'bg-sky-50 text-[#0284C7] border-sky-100 hover:bg-sky-100'
            }`}
            title={isSpeaking ? "Stop voice" : "Read aloud latest message"}
          >
            <AudioLines size={18} />
          </button>
        </div>
      </div>

      {/* Middle: Chat Messages and Optional Side Panel */}
      <div 
        ref={chatContainerRef}
        onScroll={handleContainerScroll}
        className="flex-1 flex overflow-y-auto relative custom-scrollbar bg-[#FAFBFD]"
      >
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-8 space-y-6 relative bg-[#FAFBFD] min-w-0">
          {loadingHistory && (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin text-[#0284C7]" size={24} />
            </div>
          )}

          <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
            {messages.map((msg, index) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                
                {/* User Message */}
                {msg.role === 'user' ? (
                  <div className="flex flex-col items-end gap-1 max-w-[85%] sm:max-w-[70%]">
                    <div className="flex items-start gap-2.5">
                      <div className="rounded-2xl rounded-tr-sm bg-[#0284C7] text-white px-4 py-2.5 text-sm font-medium shadow-xs">
                        {msg.imageUrl && (
                          <div className="mb-2.5 rounded-xl overflow-hidden border border-white/20 bg-black/10">
                            <img 
                              src={msg.imageUrl} 
                              alt={msg.imageName || "Uploaded document"} 
                              className="max-w-[240px] max-h-[170px] object-cover rounded-xl"
                            />
                            {msg.imageName && (
                              <div className="text-[10px] px-2 py-0.5 bg-black/35 backdrop-blur-xs text-white/95 truncate max-w-[240px]">
                                {msg.imageName}
                              </div>
                            )}
                          </div>
                        )}
                        {msg.content}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 text-[#0284C7] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <User size={16} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pr-10 font-medium">
                      <span>{msg.time || '10:24 AM'}</span>
                      <CheckCheck size={14} className="text-[#0284C7]" />
                    </div>
                  </div>
                ) : (
                  /* AI Message */
                  msg.content ? (
                    <div className="flex items-start gap-3 max-w-[95%] sm:max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 text-[#0284C7] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <Bot size={16} />
                      </div>
                      
                      <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-200/80 p-5 shadow-xs flex-1 text-slate-800 text-sm leading-relaxed">
                        <div className="space-y-2">
                          {renderFormattedAiContent(msg.content)}
                        </div>
                        
                        {/* Fallback disclaimer with warning emoji if not already present in content */}
                        {msg.content && !msg.content.includes('⚠️') && !msg.content.toLowerCase().includes('informational') && msg.id !== 'welcome-1' && (
                          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed font-medium shadow-xs">
                            <span className="text-base shrink-0 leading-none">⚠️</span>
                            <span className="flex-1">
                              This is for informational purposes only and not a medical diagnosis. In any medical emergency, please consult a doctor immediately.
                            </span>
                          </div>
                        )}

                        {msg.content && (
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                            <span className="font-medium text-[11px]">{msg.time || '10:24 AM'}</span>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => handleCopy(msg.content, msg.id)} 
                                className="p-1.5 hover:text-[#0284C7] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                title="Copy"
                              >
                                {copiedId === msg.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                              </button>
                              
                              <button 
                                onClick={() => handleThumbs(msg.id, 'up')}
                                className={`p-1.5 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${feedback[msg.id] === 'up' ? 'text-emerald-600' : ''}`}
                                title="Helpful"
                              >
                                <ThumbsUp size={14} />
                              </button>
                              
                              <button 
                                onClick={() => handleThumbs(msg.id, 'down')}
                                className={`p-1.5 hover:text-rose-500 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer ${feedback[msg.id] === 'down' ? 'text-rose-500' : ''}`}
                                title="Not helpful"
                              >
                                <ThumbsDown size={14} />
                              </button>

                              <button 
                                onClick={() => isSpeaking ? stopAudio() : playTTS(msg.content)}
                                className="p-1.5 hover:text-[#0284C7] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                title={isSpeaking ? "Stop speaking" : "Read aloud"}
                              >
                                {isSpeaking ? <Square size={14} className="text-rose-500" fill="currentColor" /> : <Volume2 size={14} />}
                              </button>

                              <button 
                                onClick={() => handleRegenerate(index)}
                                className="p-1.5 hover:text-[#0284C7] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                title="Regenerate"
                              >
                                <RefreshCw size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            ))}

            {/* In initial welcome state, display 2x2 Interactive Quick-Prompt Cards */}
            {messages.length <= 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="mt-6 mb-6 max-w-4xl"
              >
                <div className="flex items-center gap-2 mb-3 px-1">
                  <Sparkles size={14} className="text-[#0284C7]" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Suggested topics to explore
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {starterPrompts.map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.015, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePromptClick(item)}
                        className={`p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left group ${item.hoverBorder}`}
                      >
                        <div className="flex items-center justify-between mb-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs ${item.iconBg}`}>
                            <Icon size={18} />
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 group-hover:bg-sky-100 group-hover:text-[#0284C7] transition-colors">
                            {item.tag}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-[#0F172A] group-hover:text-[#0284C7] transition-colors mb-1 flex items-center justify-between">
                          <span>{item.title}</span>
                          <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 text-[#0284C7]" />
                        </h4>
                        
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {item.description}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* In initial welcome state on small screens, display sleek medical companion card */}
            {messages.length <= 1 && (
              <div className="pt-2 pb-4 flex justify-center 2xl:hidden">
                <div className="flex flex-col items-center bg-white border border-sky-100 rounded-3xl p-6 shadow-sm max-w-sm text-center">
                  <div className="mb-3 bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200/60 flex items-center gap-1.5">
                    <HeartPulse size={13} className="text-rose-500 animate-pulse" />
                    <span className="text-xs font-bold text-[#0284C7]">AI Clinical Companion</span>
                  </div>
                  <div className="w-full h-44 rounded-2xl overflow-hidden mb-3 border border-sky-100/80 bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
                    <img 
                      src="/medical_shield.jpg" 
                      alt="CuraMind AI Health" 
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ask any health question, describe symptoms, or attach a lab report to get instant medical insights.
                  </p>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-100 text-[#0284C7] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-slate-200/80 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2.5 shadow-xs text-sm text-slate-500">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Loader2 size={16} className="text-[#0284C7]" />
                  </motion.div>
                  <span>CuraMind is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Dedicated Right Side Panel (Rich, Filled, Medical Companion Telemetry) */}
        <div className="hidden 2xl:flex w-84 shrink-0 border-l border-slate-200/80 bg-gradient-to-b from-sky-50/50 via-white to-slate-50/50 flex-col p-5 select-none sticky top-0 self-start h-full max-h-[calc(100vh-140px)] overflow-y-auto space-y-4">
          
          {/* 1. AI Health Companion Header & Status */}
          <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
                </div>
                <span className="text-xs font-bold text-[#0F172A]">AI Medical Companion</span>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-200/60">
                Active 24/7
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Real-time report analysis, prescription guidance & symptom explanation.
            </p>
          </div>

          {/* 2. AI Clinical Visual Card with 3D Holographic Heart (No hardcoded fake stats) */}
          <div className="bg-white rounded-2xl overflow-hidden border border-sky-100 shadow-xs group">
            {/* Header info bar */}
            <div className="px-4 py-3 border-b border-sky-50 bg-gradient-to-r from-sky-50/60 to-white flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <HeartPulse size={14} className="text-rose-500 animate-pulse" /> Clinical AI System
              </span>
              <span className="text-[10px] font-semibold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60">
                CuraMind 2.0
              </span>
            </div>

            {/* 3D Heart Visual - Generous height, crisp and fitted */}
            <div className="relative h-60 w-full overflow-hidden flex items-center justify-center bg-radial from-sky-100/50 via-white to-white">
              <img 
                src="/medical_shield.jpg" 
                alt="AI Health & Cardiovascular Intelligence" 
                className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Real capabilities (no fake hardcoded stats) */}
            <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Multimodal Lab Report & Prescription OCR</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] shrink-0" />
                <span>Evidence-based Clinical AI Guidance</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                <span>Private & HIPAA-Ready Data Protection</span>
              </div>
            </div>
          </div>

          {/* 4. Quick Clinical Question Starters */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#0284C7]" /> Suggested Prompts
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                { title: "Explain my CBC blood report", icon: "🧪" },
                { title: "Check medicine safety & dosage", icon: "💊" },
                { title: "Understand high or low lab values", icon: "📊" },
                { title: "Tips for managing blood pressure", icon: "🩺" }
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(p.title);
                  }}
                  className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-200 text-slate-700 hover:text-[#0284C7] text-xs font-medium transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span>{p.icon}</span>
                    <span className="truncate">{p.title}</span>
                  </span>
                  <ArrowRight size={11} className="text-slate-400 group-hover:text-[#0284C7] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* 5. Trust & Security Banner */}
          <div className="pt-1 text-center">
            <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
              <Lock size={11} className="text-slate-400" />
              Private & Encrypted Health Consultation
            </div>
          </div>
        </div>

        {/* Floating Scroll to Bottom Button (positioned on right side) */}
        <AnimatePresence>
          {showScrollBottom && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              onClick={scrollToBottom}
              className="fixed 2xl:absolute bottom-28 2xl:bottom-6 right-8 2xl:right-88 z-30 p-2.5 bg-white/95 backdrop-blur-xs border border-slate-200 text-[#0284C7] rounded-full shadow-lg hover:bg-sky-50 hover:border-sky-300 transition-all cursor-pointer flex items-center justify-center hover:scale-105"
              title="Scroll to latest messages"
            >
              <ChevronDown size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: Floating Input Pill matching reference design */}
      <div className="p-4 border-t border-slate-100 bg-white z-20 relative">
        <div className="max-w-4xl mx-auto">
          {/* Staged File Previews (matching reference image) */}
          <AnimatePresence>
            {stagedFiles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="mb-3 flex flex-wrap gap-3 items-center"
              >
                {stagedFiles.map((item) => (
                  <div 
                    key={item.id} 
                    className="relative group flex items-center gap-2.5 p-2 pr-3 bg-slate-50/90 hover:bg-slate-100/90 rounded-2xl border border-slate-200 shadow-xs transition-all"
                  >
                    {item.isImage ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200 shadow-2xs">
                        <img 
                          src={item.previewUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100 shrink-0">
                        <FileText size={24} />
                      </div>
                    )}
                    <div className="flex flex-col max-w-[170px] min-w-0">
                      <span className="text-xs font-semibold text-slate-800 truncate" title={item.name}>
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {(item.size / 1024).toFixed(0)} KB • Ready to analyze
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStagedFile(item.id)}
                      className="ml-1 w-6 h-6 rounded-full bg-slate-200 hover:bg-rose-100 hover:text-rose-600 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove attachment"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center px-4 py-2 rounded-full border border-slate-200 bg-white shadow-xs focus-within:border-[#0284C7] focus-within:ring-2 focus-within:ring-sky-500/10 transition-all gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,.pdf" 
              multiple
              onChange={handleFileSelect} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-slate-400 hover:text-[#0284C7] transition-colors cursor-pointer"
              title="Attach a medical report or image"
            >
              <Paperclip size={18} />
            </button>

            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={stagedFiles.length > 0 ? "Ask a question about this report (or press Enter to send)..." : "Message CuraMind..."}
              className="flex-1 bg-transparent border-none outline-none px-2 text-[#0F172A] placeholder-slate-400 text-sm font-normal"
            />

            {isGenerating ? (
              <button 
                onClick={handleStopGenerate}
                className="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title="Stop generating"
              >
                <Square fill="currentColor" size={12} />
              </button>
            ) : isRecording ? (
              <button 
                onClick={stopRecording}
                className="w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center animate-pulse transition-colors cursor-pointer shadow-xs"
                title="Stop recording"
              >
                <StopCircle size={16} />
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={startRecording}
                  className="p-1.5 text-slate-400 hover:text-[#0284C7] transition-colors cursor-pointer"
                  title="Voice input"
                >
                  <Mic size={18} />
                </button>
                
                <button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() && stagedFiles.length === 0}
                  className="w-8 h-8 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
                  title="Send message"
                >
                  <Send size={14} className="translate-x-[1px]" />
                </button>
              </div>
            )}
          </div>

          <div className="text-center mt-2 text-[11px] text-slate-400">
            CuraMind can make mistakes. Always consult a healthcare professional.
          </div>
        </div>
      </div>

      {/* Share Link Modal Dialog */}
      {shareLink && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100">
                  <Share2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Share with Doctor</h3>
                  <p className="text-xs text-slate-400">Secure Read-Only Access</p>
                </div>
              </div>
              <button 
                onClick={() => setShareLink('')} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Share this secure link with your healthcare provider. It grants temporary read-only access to your health summary, lab reports, and prescriptions. Valid for 7 days.
              </p>
              
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-2 rounded-2xl">
                <input 
                  type="text" 
                  readOnly 
                  value={shareLink}
                  className="bg-transparent border-none outline-none text-slate-700 w-full px-2 text-xs font-mono select-all"
                />
                <button 
                  onClick={copyShareLink}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${shareCopied ? 'bg-emerald-500 text-white shadow-sm' : 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sm'}`}
                >
                  {shareCopied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-500" /> Auto-expires in 7 days
                </span>
                <a 
                  href={shareLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[#0284C7] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  Preview Portal <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
