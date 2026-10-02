import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Brain } from 'lucide-react'
import { authService } from '../services/auth.service'

export default function Auth() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [pw, setPw] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const { profile } = await authService.login(email, pw)
      if (profile.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    setLoading(true)
    setError(null)
    try {
      await authService.register(email, pw, name)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-10 relative overflow-hidden" style={{ background: 'linear-gradient(155deg, #050d1a 0%, #1e3a5f 100%)' }}>
        <div className="absolute inset-0 map-grid opacity-20" />
        <div className="relative">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} /> Back to home
          </button>
        </div>
        <div className="relative space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#0891b2' }}>
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-xl">RoadGuard</h2>
              <p className="text-slate-400 text-sm">Smart City Platform</p>
            </div>
          </div>
          <blockquote className="text-white text-2xl font-display font-bold leading-snug max-w-xs">
            "Every report makes a road safer for thousands."
          </blockquote>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: '12,847', l: 'Reports' },
              { v: '4,291', l: 'Citizens' },
              { v: '94.2%', l: 'AI Accuracy' },
              { v: '9,203', l: 'Verified' },
            ].map(s => (
              <div key={s.l} className="bg-white/10 rounded-xl p-3 border border-white/10">
                <p className="text-white font-bold font-display">{s.v}</p>
                <p className="text-slate-400 text-xs">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center gap-2">
          <Brain size={14} className="text-cyan-400" />
          <p className="text-slate-400 text-xs">Powered by YOLOv8 + Gemini API</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <button onClick={() => navigate('/')} className="lg:hidden flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Home
          </button>

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1e3a5f' }}>
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-bold font-display text-slate-800">RoadGuard</span>
          </div>

          <h1 className="font-display font-bold text-2xl text-slate-800 mb-1">
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            {tab === 'login' ? 'Sign in to your RoadGuard account' : 'Join thousands of road guardians'}
          </p>

          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={"flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize " + (tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500')}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>
          
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>}

          <div className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="Marcus Chen"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={pw} onChange={e => setPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400"
                />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {tab === 'login' && (
              <div className="text-right">
                <a href="#" className="text-xs font-semibold hover:underline" style={{ color: '#0891b2' }}>Forgot password?</a>
              </div>
            )}

            <button
              onClick={tab === 'login' ? handleLogin : handleRegister}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#0891b2' }}
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
              ) : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>

          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setTab(tab === 'login' ? 'register' : 'login')} className="font-semibold hover:underline" style={{ color: '#0891b2' }}>
              {tab === 'login' ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}