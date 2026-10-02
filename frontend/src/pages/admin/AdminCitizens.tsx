import { useState, useEffect } from 'react'
import { apiService } from '../../services/api.service'
import { Search, Users, Trophy, CheckCircle2, Flag, Download, AlertOctagon, Loader2, PlayCircle, Ban } from 'lucide-react'

export default function AdminCitizens() {
  const [citizens, setCitizens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    setLoading(true)
    apiService.get('/admin/users')
      .then(res => setCitizens(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  const handleAction = async (userId: string, action: 'flag' | 'unflag' | 'ban' | 'unban') => {
    if (!window.confirm("Are you sure you want to " + action + " this user?")) return
    setProcessing(userId)
    try {
      await apiService.post('/admin/users/' + userId + '/action', { action })
      await loadUsers()
    } catch (e) {
      console.error(e)
      alert('Failed to update user status')
    } finally {
      setProcessing(null)
    }
  }

  const filtered = citizens.filter(c =>
    (statusFilter === 'all' || c.status === statusFilter) &&
    (search === '' || (c.name || '').toLowerCase().includes(search.toLowerCase()) || (c.email || '').toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader2 size={32} className="animate-spin mb-4" />
        <p>Loading citizens...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-800">Citizens</h2>
          <p className="text-sm text-slate-500">{citizens.length} registered • {citizens.filter(c => c.status === 'active').length} active</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Active Citizens', value: citizens.filter(c => c.status === 'active').length, icon: <Users size={16} />, color: '#10b981' },
          { label: 'Flagged', value: citizens.filter(c => c.status === 'flagged').length, icon: <Flag size={16} />, color: '#f59e0b' },
          { label: 'Banned', value: citizens.filter(c => c.status === 'banned').length, icon: <Ban size={16} />, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div style={{ color: s.color }}>{s.icon}</div>
              <p className="text-xs font-semibold text-slate-500">{s.label}</p>
            </div>
            <p className="text-xl font-bold text-slate-800">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              type="text" placeholder="Search name or email..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-200">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="flagged">Flagged</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Citizen</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Rank & Tier</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stats</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{c.name}</p>
                        <p className="text-xs text-slate-500 truncate">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-700">#{c.rank}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{c.tier}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Points</span>
                        <span className="text-sm font-bold text-amber-600">{c.points.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">Verified</span>
                        <span className="text-sm font-bold text-emerald-600">{c.verifiedReports}/{c.totalReports}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold "
                      + (c.status === 'active' ? "bg-emerald-50 text-emerald-700" 
                      : c.status === 'flagged' ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700")}>
                      {c.status === 'active' && <CheckCircle2 size={14} />}
                      {c.status === 'flagged' && <Flag size={14} />}
                      {c.status === 'banned' && <Ban size={14} />}
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                     <div className="flex items-center justify-end gap-2">
                        {c.status === 'flagged' ? (
                          <button disabled={processing === c.id} onClick={() => handleAction(c.id, 'unflag')} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Unflag">
                            <Check size={16} />
                          </button>
                        ) : (
                          <button disabled={processing === c.id} onClick={() => handleAction(c.id, 'flag')} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Flag">
                            <Flag size={16} />
                          </button>
                        )}
                        
                        {c.status === 'banned' ? (
                          <button disabled={processing === c.id} onClick={() => handleAction(c.id, 'unban')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Unban User">
                            <PlayCircle size={16} />
                          </button>
                        ) : (
                          <button disabled={processing === c.id} onClick={() => handleAction(c.id, 'ban')} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Ban User">
                            <Ban size={16} />
                          </button>
                        )}
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              No citizens found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

