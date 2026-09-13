'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Activity, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Sparkles, MessageCircle, FileText, Heart } from 'lucide-react'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return
    }

    setLoading(true)
    setError(null)
    
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    })

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
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
            <Sparkles size={14} /> Security First
          </div>

          {/* Hero Text */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.1] tracking-tight mb-6 text-[#0F172A]">
            Set a New, <br />
            Secure Password <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">For Your Account</span>
          </h1>

          <p className="text-gray-500 text-base md:text-lg max-w-md leading-relaxed mb-10">
            Choose a strong password to ensure your medical history and AI health analyses stay completely secure.
          </p>

          {/* Feature List */}
          <div className="space-y-6 max-w-md">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A]">Encrypted Credentials</h3>
                <p className="text-sm text-gray-500">End-to-end security for all account data</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A]">Protected Health Records</h3>
                <p className="text-sm text-gray-500">Only you have access to your health vault</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <Heart size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#0F172A]">Peace of Mind</h3>
                <p className="text-sm text-gray-500">Instant update across all devices</p>
              </div>
            </div>
          </div>

          {/* Floating Text Decorative */}
          <div className="mt-12 font-medium text-blue-400/80 text-xl tracking-tight -rotate-6" style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive" }}>
            Your Data <br/>
            Your Control <br/>
            Always
          </div>
        </div>

        {/* Right Column: Update Password Card */}
        <div className="flex-1 w-full max-w-md lg:max-w-lg flex items-center justify-center relative mx-auto lg:mx-0">
          
          <div className="w-full bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white p-8 sm:p-12 relative z-10">
            
            {/* Mobile/Card Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-4">
                <Activity size={32} />
              </div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Update Password</h2>
              <p className="text-sm text-gray-500">Please choose a new password for your account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-600 text-center font-medium">
                {error}
              </div>
            )}

            {success ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shadow-lg shadow-green-500/10 mb-5">
                  <CheckCircle size={36} />
                </div>
                
                <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Password Updated!</h3>
                <p className="text-sm text-gray-500 mb-8">
                  Your password has been changed successfully. You can now use your new password to sign in.
                </p>

                <div className="space-y-3">
                  <Link 
                    href="/dashboard"
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-semibold hover:opacity-95 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                  >
                    Go to Dashboard <ArrowRight size={18} />
                  </Link>
                  <Link 
                    href="/login"
                    className="w-full py-3.5 bg-white border border-gray-200 rounded-2xl text-[#0F172A] text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-12 py-3.5 text-[#0F172A] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
                      placeholder="Minimum 6 characters"
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

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-12 py-3.5 text-[#0F172A] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-400"
                      placeholder="Re-type new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !password || !confirmPassword}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white font-semibold hover:opacity-95 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer mt-2"
                >
                  {loading ? 'Updating password...' : (
                    <>
                      Update Password <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <div className="mt-6 text-center">
                  <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                    Cancel &amp; return to Sign In
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
