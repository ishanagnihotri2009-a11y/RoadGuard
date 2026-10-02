import { useState, useEffect } from 'react'
import { Trophy, Star, Medal } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { leaderboardService, LeaderboardUser } from '../../services/leaderboard.service'

const RANK_ICONS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function Leaderboard() {
  const { user, profile } = useApp()
  const [users, setUsers] = useState<LeaderboardUser[]>([])

  

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return leaderboardService.subscribeToLeaderboard((data) => { setUsers(data); setLoading(false); })
  }, [])

  if (loading) return <div className="p-8 text-center text-slate-500">Loading leaderboard...</div>
  if (users.length === 0) return <div className="p-8 text-center text-slate-500">No users on the leaderboard yet.</div>

  const top3 = [users[0], users[1], users[2]]
  const currentUser = user?.uid ? users.find(c => c.id === user.uid) : null
  const currentRank = currentUser?.rank || 0

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div>
        <h2 className="font-display font-bold text-xl text-slate-800">Leaderboard</h2>
        <p className="text-sm text-slate-500">Top contributors this month</p>
      </div>

      {users.length >= 3 && (
        <div className="flex items-end justify-center gap-3 py-4">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-600">
                {top3[1].name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div className="absolute -bottom-1 -right-1 text-lg">🥈</div>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-700">{top3[1].name.split(' ')[0]}</p>
              <p className="text-xs text-slate-500">{top3[1].points.toLocaleString()} pts</p>
            </div>
            <div className="w-20 rounded-t-xl flex items-center justify-center" style={{ height: 60, backgroundColor: '#c0c0c020', border: '1px solid #c0c0c040' }}>
              <span className="text-slate-500 font-bold font-display">2</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 -mt-4">
            <div className="text-2xl">👑</div>
            <div className="relative">
              <div className="w-18 h-18 rounded-2xl flex items-center justify-center text-xl font-bold text-white ring-4 ring-amber-300" style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #1e3a5f, #0891b2)' }}>
                {top3[0].name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div className="absolute -bottom-1 -right-1 text-lg">🥇</div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-800">{top3[0].name.split(' ')[0]}</p>
              <p className="text-xs text-slate-500">{top3[0].points.toLocaleString()} pts</p>
            </div>
            <div className="w-20 rounded-t-xl flex items-center justify-center" style={{ height: 80, background: 'linear-gradient(180deg, #fbbf2420, #fbbf2410)', border: '1px solid #fbbf2440' }}>
              <span className="text-amber-500 font-bold font-display text-lg">1</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-xl font-bold text-amber-700">
                {top3[2].name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div className="absolute -bottom-1 -right-1 text-lg">🥉</div>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-700">{top3[2].name.split(' ')[0]}</p>
              <p className="text-xs text-slate-500">{top3[2].points.toLocaleString()} pts</p>
            </div>
            <div className="w-20 rounded-t-xl flex items-center justify-center" style={{ height: 44, backgroundColor: '#cd7f3220', border: '1px solid #cd7f3240' }}>
              <span className="text-amber-700 font-bold font-display">3</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-display font-bold text-slate-800 text-sm">Full Rankings</h3>
          <span className="text-xs text-slate-400">{users.length} citizens</span>
        </div>
        <div className="divide-y divide-slate-50">
          {users.map(c => {
            const isMe = c.id === user?.uid;
            return (
              <div
                key={c.id}
                className={"flex items-center gap-3 px-5 py-3.5 " + (isMe ? "border-l-4" : "")}
                style={isMe ? { backgroundColor: '#f0f9ff', borderLeftColor: '#0891b2' } : {}}
              >
                <div className="w-7 text-center flex-shrink-0">
                  {RANK_ICONS[c.rank!]
                    ? <span className="text-base">{RANK_ICONS[c.rank!]}</span>
                    : <span className="text-sm font-bold text-slate-400">#{c.rank}</span>
                  }
                </div>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: isMe ? 'linear-gradient(135deg, #1e3a5f, #0891b2)' : '#e2e8f0', color: isMe ? 'white' : '#64748b' }}
                >
                  {c.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={"text-sm font-semibold " + (isMe ? "text-cyan-700" : "text-slate-800")}>{c.name}</p>
                    {isMe && <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded-full">You</span>}
                  </div>
                  <p className="text-xs text-slate-400">{c.tier} • {c.verifiedReports} verified / {c.totalReports} total</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-800">{c.points.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">pts</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {currentUser && (
        <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 lg:left-auto lg:right-8 lg:w-80 bg-white rounded-2xl shadow-lg border border-slate-200 p-4 flex items-center gap-3 z-50">
          <div className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-bold text-xs flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1e3a5f, #0891b2)' }}>
            {currentUser.name.split(' ').map(n => n[0]).join('').slice(0,2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-500">Rank #{currentUser.rank} • {currentUser.points.toLocaleString()} pts</p>
          </div>
          {currentRank > 1 && (
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-slate-400">Next rank</p>
              <p className="text-sm font-bold text-cyan-600">
                {((users[currentRank - 2]?.points || 0) - currentUser.points).toLocaleString()} pts
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

