'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Activity, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, MessageCircle, FileText, Heart, Sparkles, User, CheckCircle2, RotateCw } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResendStatus(null)
    
    const { error: authError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName
        }
      }
    })

    if (authError) {
      const msg = typeof authError.message === 'string' && authError.message.trim() !== '' 
        ? authError.message 
        : 'Error sending confirmation email. Please check your SMTP settings or try again.';
      setError(msg)
      setLoading(false)
    } else {
      if (!data.session) {
        // Email confirmation required
        setIsSuccess(true)
        setLoading(false)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    }
  }

  const handleResend = async () => {
    if (!email) return
    setResending(true)
    setResendStatus(null)
    setError(null)

    const { error: resendErr } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (resendErr) {
      setResendStatus(`Failed: ${resendErr.message}`)
    } else {
      setResendStatus('Verification email has been resent! Please check your inbox & spam.')
    }
    setResending(false)
  }

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) setError(error.message)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    }
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
          <Link href="/" className="flex items-center gap-3 mb-12 hover:opacity-85 transition-opacity w-fit cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Activity size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl tracking-tight text-[#0F172A]">CuraMind <span className="text-blue-600">AI</span></span>
              <span className="text-[10px] text-gray-500 font-medium">Your Health. Our Intelligence.</span>
            </div>
          </Link>

          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold w-fit mb-6">
            <Sparkles size={14} /> Join Our Community
          </div>

          {/* Hero Text */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.1] tracking-tight mb-6 text-[#0F172A]">
            Begin Your <br />
            Journey to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Better Health</span>
          </h1>

          <p className="text-gray-500 text-base md:text-lg max-w-md leading-relaxed mb-10">
            Create an account to unlock personalized AI insights, simplify medical reports, and take control of your well-being.
          </p>

          {/* Feature List */}
          <div className="space-y-6 max-w-md">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <MessageCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A]">Ask Questions</h3>
                <p className="text-sm text-gray-500">Get instant, reliable answers</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A]">Understand Reports</h3>
                <p className="text-sm text-gray-500">Simplify complex medical reports</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Heart size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A]">Take Better Care</h3>
                <p className="text-sm text-gray-500">Personalized insights for a healthier you</p>
              </div>
            </div>
          </div>

          {/* Floating Text Decorative */}
          <div className="mt-12 font-medium text-blue-400/80 text-xl tracking-tight -rotate-6" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}>
            People <br/>
            Technology <br/>
            Better Health <br/>
            Together
          </div>
        </div>

        {/* Right Column: Signup Card */}
        <div className="flex-1 w-full max-w-md lg:max-w-lg flex items-center justify-center relative mx-auto lg:mx-0">
          <div className="w-full bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white p-8 sm:p-12 relative z-10">
            {/* Top Navigation Row: Back to Home */}
            <div className="flex items-center justify-between mb-6">
              <Link 
                href="/" 
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors py-1.5 px-3 rounded-full hover:bg-slate-100/80 border border-slate-100"
              >
                <ArrowLeft size={14} /> Back to Home
              </Link>
            </div>

            {isSuccess ? (
              /* Success / Email Verification Screen */
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 mb-6">
                  <Mail size={32} />
                </div>
                
                <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Check Your Email</h2>
                <p className="text-sm text-gray-500 mb-6">
                  We sent a confirmation link to: <br/>
                  <span className="font-semibold text-blue-600 break-all">{email}</span>
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900 leading-relaxed text-left mb-6 space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <span>Click the link inside the email to verify and activate your account.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <span>If you don&apos;t see it, check your <strong>Spam</strong> or <strong>Promotions</strong> folder.</span>
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
                    {resending ? 'Resending...' : 'Resend Verification Email'}
                  </button>

                  <Link 
                    href="/login"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white text-sm font-semibold hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    Go to Sign In <ArrowRight size={16} />
                  </Link>
                </div>

                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-6 text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  Entered wrong email? Change email
                </button>
              </div>
            ) : (
              /* Normal Signup Form */
              <>
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-4">
                    <Activity size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Create Account</h2>
                  <p className="text-sm text-gray-500">Join CuraMind today</p>
                </div>

                {error && (
                  <div className="mb-6 p-3 rounded-xl text-sm text-center bg-red-50 border border-red-100 text-red-600">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <User size={18} />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3.5 text-[#0F172A] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Email Address</label>
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

                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Lock size={18} />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-12 py-3.5 text-[#0F172A] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 mt-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-semibold hover:opacity-95 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    {loading ? 'Creating account...' : (
                      <>
                        Sign Up <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 flex items-center justify-between">
                  <hr className="w-full border-gray-100" />
                  <span className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">OR</span>
                  <hr className="w-full border-gray-100" />
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleSignup}
                  className="mt-8 w-full py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0F172A] font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 shadow-sm cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <p className="mt-8 text-center text-sm text-gray-500">
                  Already have an account? <Link href="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
                </p>
              </>
            )}

          </div>

          {/* Decorative graphic element behind the card */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-200/50 rounded-full blur-[80px] -z-10"></div>
        </div>

      </div>
    </div>
  )
}
