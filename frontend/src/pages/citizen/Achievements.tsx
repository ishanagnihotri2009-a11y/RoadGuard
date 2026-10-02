import { useState, useEffect } from 'react'
import { Award, Lock, Star, Target, Zap, Shield, Crown } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { gamificationService, UserAchievement } from '../../services/gamification.service'

const ALL_ACHIEVEMENTS = [
  { id: 'first_report', title: 'First Report', desc: 'Submit your first pothole report', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: '10_reports', title: '10 Reports', desc: 'Submit 10 pothole reports', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: '50_reports', title: '50 Reports', desc: 'Submit 50 pothole reports', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: '100_verified', title: '100 Verified', desc: 'Get 100 reports verified', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'high_accuracy', title: 'Eagle Eye', desc: 'Maintain 90%+ verification rate', icon: Target, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'community_contributor', title: 'Contributor', desc: 'Earn 1000 points', icon: Award, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'top_reporter', title: 'Top Reporter', desc: 'Earn 2500 points', icon: Crown, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'road_guardian', title: 'Road Guardian', desc: 'Reach Legend tier', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-100' }
]

export default function Achievements() {
  const { user } = useApp()
  const [earned, setEarned] = useState<UserAchievement[]>([])

  useEffect(() => {
    if (user?.uid) {
      return gamificationService.subscribeToUserAchievements(user.uid, (data) => setEarned(data))
    }
  }, [user])

  const earnedIds = earned.map(a => a.achievementId)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-slate-800">Achievements</h2>
        <p className="text-slate-500">You have unlocked {earned.length} of {ALL_ACHIEVEMENTS.length} achievements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_ACHIEVEMENTS.map(ach => {
          const isEarned = earnedIds.includes(ach.id)
          const earnedData = earned.find(e => e.achievementId === ach.id)
          const Icon = ach.icon
          
          return (
            <div 
              key={ach.id} 
              className={"p-5 rounded-2xl border transition-all " + (isEarned ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-transparent opacity-60')}
            >
              <div className="flex items-start gap-4">
                <div className={"w-12 h-12 rounded-xl flex items-center justify-center shrink-0 " + (isEarned ? ach.bg + ' ' + ach.color : 'bg-slate-200 text-slate-400')}>
                  {isEarned ? <Icon size={24} /> : <Lock size={20} />}
                </div>
                <div>
                  <h3 className={'font-bold '   + (isEarned ? 'text-slate-800' : 'text-slate-500')}>{ach.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{ach.desc}</p>
                  {isEarned && earnedData && (
                    <p className="text-[10px] font-bold uppercase text-emerald-600 mt-3 flex items-center gap-1">
                      <Award size={12} /> Unlocked {new Date(earnedData.awardedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

