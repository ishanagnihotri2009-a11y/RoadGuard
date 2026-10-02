import { useState, useEffect } from 'react'
import { Trophy, Star, TrendingUp, Gift, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { rewardsService, RewardTransaction } from '../../services/rewards.service'

import { getTierInfo } from '../../utils/gamification'

export default function Rewards() {
  const { user, profile } = useApp()
  const [history, setHistory] = useState<RewardTransaction[]>([])

  useEffect(() => {
    if (user?.uid) {
      return rewardsService.subscribeToUserRewards(user.uid, (data) => setHistory(data))
    }
  }, [user])

  const currentPoints = profile?.points || 0
  const { currentTier, nextTier, progress } = getTierInfo(currentPoints)

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Points card */}
      <div className="rounded-2xl text-white p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0891b2 100%)' }}>
        <div className="absolute inset-0 map-grid opacity-20" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-200 text-sm font-semibold mb-1">Total Points</p>
              <p className="text-5xl font-bold font-display">{currentPoints.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-white/20 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
                  <span>{currentTier.icon}</span> {currentTier.name}
                </span>
              </div>
            </div>
            <Trophy size={48} className="text-white/20 rotate-12" />
          </div>

          {/* Progress */}
          {nextTier && (
            <div className="mt-8">
              <div className="flex justify-between text-xs font-semibold text-blue-200 mb-2">
                <span>Progress to {nextTier.name}</span>
                <span>{currentPoints} / {nextTier.min} pts</span>
              </div>
              <div className="h-2.5 bg-black/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-cyan-300 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: progress + '%' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Star size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold mb-0.5">Verified Reports</p>
            <p className="text-lg font-bold text-slate-800">{history.filter(h => h.reason.includes('Verified')).length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold mb-0.5">Recent Activity</p>
            <p className="text-lg font-bold text-slate-800">{history.length} awards</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Gift size={16} className="text-cyan-600" />
            Reward History
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No rewards earned yet. Keep reporting!</div>
          ) : (
            history.map(item => (
              <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{item.reason}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(item.createdAt).toLocaleDateString()} • Report ID: {item.reportId.slice(0, 8)}...</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">+{item.amount}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide font-semibold">Points</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

