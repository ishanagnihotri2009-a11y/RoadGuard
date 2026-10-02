import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Bell, Shield, Eye, ChevronRight, Edit2, Save, Loader2, Target, Award, Star } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getTierInfo } from '../../utils/gamification'
import { gamificationService, UserAchievement } from '../../services/gamification.service'
import { authService } from '../../services/auth.service'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { profile, user } = useApp()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [name, setName] = useState(profile?.name || 'Citizen')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [city, setCity] = useState(profile?.city || '')
  
  const [earned, setEarned] = useState<UserAchievement[]>([])
  
  useEffect(() => {
    if (profile) {
      setName(profile.name || 'Citizen')
      setPhone(profile.phone || '')
      setCity(profile.city || '')
    }
  }, [profile])
  
  useEffect(() => {
    if (user?.uid) {
      return gamificationService.subscribeToUserAchievements(user.uid, (data) => setEarned(data))
    }
  }, [user])
  
  const handleSave = async () => {
    if (!user?.uid) return
    setLoading(true)
    setError(null)
    try {
      await authService.updateProfile(user.uid, { name, phone, city })
      setEditing(false)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  const { currentTier } = getTierInfo(profile?.points || 0)

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-12">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-semibold">{error}</div>}
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-inner"
              style={{ background: 'linear-gradient(135deg, #1e3a5f, #0891b2)' }}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <div className="flex-1 mr-4">
                {editing ? (
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="text-xl font-bold font-display text-slate-800 border-b border-slate-300 focus:outline-none bg-slate-50 px-2 py-1 rounded w-full mb-1" placeholder="Your Name" />
                ) : (
                  <h2 className="text-xl font-bold font-display text-slate-800 truncate">{name}</h2>
                )}
                <p className="text-sm text-slate-500 truncate flex items-center gap-1.5 mt-1">
                  <Mail size={14} /> {profile?.email}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Phone size={14} />
                    {editing ? (
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="border-b border-slate-300 focus:outline-none bg-slate-50 px-1 w-32" placeholder="Phone Number" />
                    ) : (
                      <span>{phone || 'Add phone'}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={14} />
                    {editing ? (
                      <input type="text" value={city} onChange={e => setCity(e.target.value)} className="border-b border-slate-300 focus:outline-none bg-slate-50 px-1 w-32" placeholder="City/Area" />
                    ) : (
                      <span>{city || 'Add city'}</span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => editing ? handleSave() : setEditing(true)} 
                disabled={loading}
                className={"text-white transition-colors p-2.5 rounded-xl shadow-sm flex items-center gap-2 text-sm font-bold " + (editing ? "bg-emerald-500 hover:bg-emerald-600" : "bg-cyan-600 hover:bg-cyan-700")}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : (editing ? <><Save size={16}/> Save</> : <><Edit2 size={16}/> Edit</>)}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <h3 className="text-sm font-bold font-display text-slate-800 mt-6 px-1">Your Stats (Read-Only)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-bold uppercase">Points</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{profile?.points?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-bold uppercase">Rank</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">#{profile?.rank || '--'}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-bold uppercase">Total</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{profile?.totalReports || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-xs text-slate-400 font-bold uppercase">Verified</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{profile?.verifiedReports || 0}</p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-4 text-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">{currentTier.icon}</div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Current Tier</p>
            <p className="text-xl font-bold">{currentTier.name}</p>
          </div>
        </div>
        <Link to="/rewards" className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-sm font-semibold">View Rewards</Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold font-display text-slate-800 flex items-center gap-2"><Award size={16} className="text-amber-500" /> Recent Achievements</h3>
          <Link to="/achievements" className="text-xs font-semibold text-cyan-600 hover:underline flex items-center">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {earned.length > 0 ? earned.slice(0, 4).map(a => (
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-lg text-amber-500"><Star size={20} className="fill-current" /></div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{a.title}</p>
                <p className="text-[10px] text-slate-500 line-clamp-1">{a.description}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-2 text-center p-6 text-slate-400 text-sm">No achievements earned yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
