import { useApp } from '../context/AppContext'
import { Shield, MapPin, Award, Brain, Cloud, Users, ChevronRight, Star, CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react'

const STATS = [
  { value: '12,847', label: 'Reports Submitted' },
  { value: '9,203', label: 'Potholes Verified' },
  { value: '4,291', label: 'Active Citizens' },
  { value: '94.2%', label: 'AI Accuracy' },
]

const FEATURES = [
  {
    icon: <Brain size={22} />,
    title: 'AI-Powered Detection',
    desc: 'YOLOv8 computer vision detects potholes, estimates severity, and counts occurrences from a single photo in under a second.',
    color: '#0891b2',
  },
  {
    icon: <MapPin size={22} />,
    title: 'GPS & Live Map',
    desc: 'Every report is geo-tagged automatically. View real-time heatmaps and filter by severity to understand road conditions citywide.',
    color: '#1e3a5f',
  },
  {
    icon: <Award size={22} />,
    title: 'Reward System',
    desc: 'Earn points for every verified submission. Climb the leaderboard, unlock achievements, and earn recognition for your contributions.',
    color: '#10b981',
  },
  {
    icon: <Cloud size={22} />,
    title: 'Cloud-Backed Storage',
    desc: 'Reports, images, AI annotations, and GPS data are stored securely in Cloud SQL and Cloud Storage — always available, never lost.',
    color: '#8b5cf6',
  },
  {
    icon: <Shield size={22} />,
    title: 'Duplicate Prevention',
    desc: 'Gemini API cross-checks new reports against existing ones by location and visual similarity, preventing noise in the system.',
    color: '#f59e0b',
  },
  {
    icon: <Users size={22} />,
    title: 'Community-Driven',
    desc: "Citizens are the city's eyes. Together you build a comprehensive, real-time picture of road infrastructure that authorities can act on.",
    color: '#ef4444',
  },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Capture a Photo', desc: 'Take a photo of a pothole directly in the app or upload from your gallery. GPS coordinates are attached automatically.' },
  { step: '02', title: 'AI Analyzes', desc: 'Our YOLOv8 model detects and annotates potholes, estimates severity (low/medium/high), and generates a confidence score.' },
  { step: '03', title: 'Report is Verified', desc: 'Gemini checks for duplicates. Admins review AI flagged reports. Unique, accurate reports earn you points immediately.' },
  { step: '04', title: 'Earn Rewards', desc: 'Accumulate points, unlock badges, rise on the leaderboard, and be recognized as a Road Guardian in your community.' },
]

export default function Landing() {
  const { setView, setUserRole } = useApp()

  const handleCitizenLogin = () => { setView('login') }
  const handleAdminLogin = () => {
    setUserRole('admin')
    setView('admin-dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1e3a5f' }}>
              <Shield size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 font-display">RoadGuard</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-slate-500">
            <a href="#features" className="hover:text-slate-800 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-800 transition-colors">How It Works</a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdminLogin}
              className="text-sm text-slate-500 hover:text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all"
            >
              Admin
            </button>
            <button
              onClick={handleCitizenLogin}
              className="text-sm font-semibold text-white px-4 py-2 rounded-xl transition-all hover:opacity-90"
              style={{ backgroundColor: '#0891b2' }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #050d1a 0%, #1e3a5f 60%, #0f2547 100%)' }}>
        <div className="absolute inset-0 map-grid opacity-30" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-cyan-300 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 backdrop-blur-sm border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AI-Powered Smart City Platform
            </div>
            <h1 className="font-display font-extrabold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
              Help Make Every
              <br />
              <span style={{ color: '#06b6d4' }}>Road Safer</span>
            </h1>
            <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl">
              Report potholes with AI-powered detection, earn rewards for verified contributions, and help build a real-time picture of road safety in your city.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCitizenLogin}
                className="flex items-center gap-2 text-sm font-bold text-white px-6 py-3 rounded-xl transition-all hover:opacity-90 hover:scale-105"
                style={{ backgroundColor: '#0891b2' }}
              >
                Start Reporting <ArrowRight size={16} />
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 text-sm font-semibold text-white/80 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-all"
              >
                Learn How It Works
              </button>
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <div className="absolute right-6 top-24 hidden xl:block">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 w-56 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-red-400" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">High Severity</p>
                <p className="text-slate-400 text-xs">Central Ave</p>
              </div>
              <span className="ml-auto text-xs text-emerald-400 font-bold">94%</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Brain size={14} className="text-cyan-400" />
              <span className="text-xs text-slate-300">YOLOv8 detected 4 potholes</span>
            </div>
            <div className="bg-white/5 rounded-lg p-2.5">
              <div className="h-1.5 bg-slate-700 rounded-full">
                <div className="h-1.5 rounded-full" style={{ width: '94%', backgroundColor: '#10b981' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-6 bottom-8 hidden xl:block">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 w-48">
            <div className="flex items-center gap-1.5 mb-2">
              <Star size={14} className="text-amber-400" fill="#f59e0b" />
              <span className="text-xs text-white font-semibold">+150 Points Earned!</span>
            </div>
            <p className="text-slate-400 text-xs">Report verified by admin. You ranked #3 on the leaderboard.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display font-extrabold text-3xl lg:text-4xl" style={{ color: '#1e3a5f' }}>{s.value}</p>
                <p className="text-sm text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#0891b2' }}>Platform Features</p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-slate-800 mb-4">
              Built for Citizens.<br />Trusted by Cities.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">Every feature is designed to make reporting effortless, verification accurate, and contribution rewarding.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${f.color}15` }}>
                  <span style={{ color: f.color }}>{f.icon}</span>
                </div>
                <h3 className="font-display font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#0891b2' }}>Simple Process</p>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-slate-800">From Pothole to Points in Minutes</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((h, i) => (
              <div key={h.step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-slate-200 z-0" style={{ transform: 'translateX(-50%)' }}>
                    <ChevronRight size={14} className="absolute right-0 -top-2 text-slate-300" />
                  </div>
                )}
                <div className="text-center lg:text-left">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white font-bold font-display text-sm mb-4"
                    style={{ backgroundColor: '#1e3a5f' }}
                  >
                    {h.step}
                  </div>
                  <h3 className="font-display font-bold text-slate-800 mb-2">{h.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl p-8 lg:p-14 text-white text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a5f, #0891b2)' }}>
            <div className="absolute inset-0 map-grid opacity-20" />
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp size={18} className="text-cyan-300" />
                <span className="text-cyan-200 text-sm font-semibold">Join 4,291 active citizens</span>
              </div>
              <h2 className="font-display font-extrabold text-3xl lg:text-4xl mb-4">Ready to Guard Your Roads?</h2>
              <p className="text-blue-100 mb-8 max-w-lg mx-auto">Create your account in 30 seconds and start earning rewards for making your city safer.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleCitizenLogin}
                  className="flex items-center gap-2 bg-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-slate-50 transition-all"
                  style={{ color: '#1e3a5f' }}
                >
                  Create Free Account <ArrowRight size={16} />
                </button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-6 text-xs text-blue-200">
                {['No credit card required', 'Free forever', 'Instant rewards'].map(t => (
                  <span key={t} className="flex items-center gap-1"><CheckCircle2 size={12} /> {t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#1e3a5f' }}>
              <Shield size={12} className="text-white" />
            </div>
            <span className="font-bold text-sm text-slate-700 font-display">RoadGuard</span>
          </div>
          <p className="text-xs text-slate-400">© 2024 RoadGuard. AI-Powered Pothole Detection & Citizen Reward System.</p>
        </div>
      </footer>
    </div>
  )
}
