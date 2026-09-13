'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Activity, Mail, ArrowLeft, ArrowRight, Sparkles, MessageCircle, FileText, Heart, CheckCircle2, RotateCw } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<string | null>(null)
  
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    setResendStatus(null)
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  const handleResend = async () => {
    if (!email) return
    setResending(true)
    setResendStatus(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    })
    if (error) {
      setResendStatus(`Failed to resend: ${error.message}`)
    } else {
      setResendStatus(`Reset link resent to ${email}!`)
    }
    setResending(false)
  }

  return (
    <div className="min-h-screen w-full flex bg-[#F0F5FA] font-sans text-[#0F172A] relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-100/60 blur-[120px] rounded-full"></div>
         <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-purple-100/60 blur-[120px] rounded-full"></div>
         <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-100/40 blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row relative z-10 p-6 sm:p-8 lg:p-12 gap-8 lg:gap-16 items-center lg:items-stretch">
        
        {/* Left Content Column */}
        <div className="hidden lg:flex flex-1 w-full max-w-xl flex-col justify-center pt-8 lg:pt-0">
          
          {/* Logo (Top Left) */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Activity size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl tracking-tight text-[#0F172A]">CuraMind <span className="text-blue-600">AI</span></span>
              <span className="text-[10px] text-gray-500 font-medium">Your Health. Our Intelligence.</span>
            </div>
          </div>

          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold w-fit mb-6">
            <Sparkles size={14} /> Account Recovery
          </div>

          {/* Hero Text */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.1] tracking-tight mb-6 text-[#0F172A]">
            Reset Your <br />
            Password &amp; Regain <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Access to Care</span>
          </h1>

          <p className="text-gray-500 text-base md:text-lg max-w-md leading-relaxed mb-10">
            We will email you a secure, one-time link to safely reset your password and get back into your account.
          </p>

          {/* Feature List */}
          <div className="space-y-6 max-w-md">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A]">Instant Recovery</h3>
                <p className="text-sm text-gray-500">Fast, encrypted password recovery link</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A]">Secure &amp; Private</h3>
                <p className="text-sm text-gray-500">Your health data remains protected</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Heart size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A]">24/7 Access</h3>
                <p className="text-sm text-gray-500">Pick up right where you left off</p>
              </div>
            </div>
          </div>

          {/* Floating Text Decorative */}
          <div className="mt-12 font-medium text-blue-400/80 text-xl tracking-tight -rotate-6" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}>
            Safe <br/>
            Seamless <br/>
            Secure
          </div>
        </div>

        {/* Right Column: Forgot Password Card */}
        <div className="flex-1 w-full max-w-md lg:max-w-lg flex items-center justify-center relative mx-auto lg:mx-0">
          
          <div className="w-full bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white p-8 sm:p-12 relative z-10">
            
            {/* Mobile/Card Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-4">
                <Activity size={32} />
              </div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Reset Password</h2>
              <p className="text-sm text-gray-500">Enter your email to receive a recovery link</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 text-center font-medium">
                {error}
              </div>
            )}

            {success ? (
              <div className="text-center py-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 mb-5">
                  <Mail size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Check Your Email</h3>
                <p className="text-sm text-gray-500 mb-6">
                  We sent a password reset link to: <br/>
                  <span className="font-semibold text-blue-600 break-all">{email}</span>
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900 leading-relaxed text-left mb-6 space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <span>Click the link in the email to choose a new password.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <span>Didn&apos;t see it? Please check your <strong>Spam</strong> or <strong>Promotions</strong> tab.</span>
                  </div>
                </div>

                {resendStatus && (
                  <div className={`mb-4 p-3 rounded-xl text-xs ${resendStatus.startsWith('Failed') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                    {resendStatus}
                  </div>
                )}

                <div className="space-y-3">
                  <button 
                    onClick={handleResend}
                    disabled={resending}
                    className="w-full py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0F172A] text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RotateCw size={16} className={resending ? 'animate-spin' : ''} />
                    {resending ? 'Resending...' : 'Resend Reset Link'}
                  </button>

                  <Link 
                    href="/login"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white text-sm font-semibold hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    Back to Sign In <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Registered Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-[#0F172A] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !email}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-semibold hover:opacity-95 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  {loading ? 'Sending link...' : (
                    <>
                      Send Reset Link <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <div className="mt-6 text-center">
                  <Link href="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors gap-1.5">
                    <ArrowLeft size={16} /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}

          </div>

          {/* Decorative graphic element behind the card */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-200/50 rounded-full blur-[80px] -z-10"></div>
        </div>

      </div>
    </div>
  )
}
