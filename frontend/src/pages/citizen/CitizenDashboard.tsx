import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { getTierInfo } from '../../utils/gamification'
import { reportsService, Report } from '../../services/reports.service'
import StatCard from '../../components/StatCard'
import SeverityBadge from '../../components/SeverityBadge'
import StatusBadge from '../../components/StatusBadge'
import {
  FileText, Trophy, TrendingUp, CheckCircle2, ChevronRight,
  MapPin, Plus, Star, AlertCircle
} from 'lucide-react'

export default function CitizenDashboard() {
  const navigate = useNavigate()
  const { user, profile } = useApp()
  
  const [reports, setReports] = useState<Report[]>([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return;
    
    setLoading(true);
    let unsubReports: () => void;
    

    try {
      unsubReports = reportsService.subscribeToUserReports(user.uid, (data) => {
        setReports(data);
        setLoading(false);
      }, (err) => { setError(err.message); setLoading(false); });

          } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      setLoading(false);
    }

    return () => {
      if (unsubReports) unsubReports();
      
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="w-5 h-5 border-2 border-slate-300 border-t-cyan-500 rounded-full animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <AlertCircle size={32} className="mb-2" />
        <p className="font-semibold">Error Loading Dashboard</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const verifiedCount = reports.filter(r => r.status === 'verified').length;
  const recentReports = reports.slice(0, 5);

  // Map public reports to markers (simulated coordinates between 10 and 90 for the CSS grid)
  const mapMarkers = reports.map(r => {
    // In a real map, coords would be plotted geographically.
    // For this mock CSS grid, we hash the string or use random for visual effect based on coords
    const x = Math.abs(r.coords?.lng || 0) % 80 + 10;
    const y = Math.abs(r.coords?.lat || 0) % 80 + 10;
    return { x, y, severity: r.severity, label: r.street };
  }).slice(0, 10);

  const points = profile?.points || 0;
  const { nextTier, progress } = getTierInfo(points);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-800">
            Welcome back, {profile?.name?.split(' ')[0] || 'Citizen'}
          </h2>
          <p className="text-sm text-slate-500">Here's your impact on the community today.</p>
        </div>
        <button
          onClick={() => navigate('/report')}
          className="flex items-center justify-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-all hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: '#0891b2' }}
        >
          <Plus size={16} /> Report Pothole
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard label="Total Reports" value={reports.length.toString()} icon={<FileText size={18} />} accent="#1e3a5f" />
        <StatCard label="Verified" value={verifiedCount.toString()} icon={<CheckCircle2 size={18} />} accent="#10b981" />
        <StatCard label="Points Earned" value={points.toLocaleString()} icon={<Trophy size={18} />} accent="#f59e0b" />
        <StatCard label="Rank & Tier" value={`#${profile?.rank || '--'}`} sub={profile?.tier || 'Rookie'}  icon={<TrendingUp size={18} />} accent="#0891b2" />
      </div>

      <div className="grid lg:grid-cols-5 gap-4 lg:gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-50">
            <h3 className="font-display font-bold text-slate-800">Recent Reports</h3>
            <button onClick={() => navigate('/reports')} className="text-xs font-semibold flex items-center gap-1" style={{ color: '#0891b2' }}>
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50 flex-1">
            {recentReports.length > 0 ? (
              recentReports.map(r => (
                <button
                  key={r.id}
                  onClick={() => navigate('/reports/' + r.id)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-all text-left"
                >
                  <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                    {r.imageUrl ? (
                      <img src={r.imageUrl} alt={r.street} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <MapPin size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800 truncate">{r.street}</span>
                      <SeverityBadge severity={r.severity} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400">{r.id.substring(0, 8)}...</span>
                      <span className="text-slate-200">•</span>
                      <span className="text-xs text-slate-400">
                        {r.date ? new Date(r.date).toLocaleDateString() : 'Unknown Date'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={r.status} size="sm" />
                    {r.points > 0 && (
                      <span className="text-xs font-bold text-amber-500">+{r.points}pts</span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <FileText size={32} className="mb-2 text-slate-200" />
                <p className="text-sm">No reports submitted yet.</p>
                <button onClick={() => navigate('/report')} className="mt-2 text-xs font-semibold text-cyan-600 hover:underline">
                  Submit your first report
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4 flex flex-col">
          {/* Nearby Map */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h3 className="font-display font-bold text-slate-800 text-sm">Nearby Potholes (Public)</h3>
              <button onClick={() => navigate('/map')} className="text-xs font-semibold flex items-center gap-1" style={{ color: '#0891b2' }}>
                Full Map <ChevronRight size={12} />
              </button>
            </div>
            <div className="relative h-40 mx-4 mb-4 rounded-xl overflow-hidden" style={{ backgroundColor: '#1a2332' }}>
              <div className="absolute inset-0 map-grid" />
              {mapMarkers.length > 0 ? mapMarkers.map((m, i) => (
                <div
                  key={i}
                  className="absolute flex flex-col items-center group cursor-pointer"
                  style={{ left: m.x + '%', top: m.y + '%', transform: 'translate(-50%, -100%)' }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                    style={{ backgroundColor: m.severity === 'high' ? '#ef4444' : m.severity === 'medium' ? '#f59e0b' : '#10b981' }}
                  >
                    <MapPin size={8} className="text-white" />
                  </div>
                  <div className="absolute bottom-full mb-1 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity z-10">
                    {m.label}
                  </div>
                </div>
              )) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                  No nearby potholes reported.
                </div>
              )}
              <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-10 bg-slate-900/50 p-1.5 rounded">
                {[{ c: '#ef4444', l: 'High' }, { c: '#f59e0b', l: 'Med' }, { c: '#10b981', l: 'Low' }].map(x => (
                  <div key={x.l} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: x.c }} />
                    <span className="text-[9px] text-slate-300">{x.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievement progress */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-slate-800 text-sm">Achievement Progress</h3>
              <button onClick={() => navigate('/achievements')} className="text-xs font-semibold flex items-center gap-1" style={{ color: '#0891b2' }}>
                All <ChevronRight size={12} />
              </button>
            </div>
            
            <div className="space-y-3">
              {reports.length > 0 ? (
                // Simple placeholder logic for achievements based on real stats
                [{ name: 'First Report', progress: Math.min(reports.length, 1), total: 1, icon: '📍' },
                 { name: 'Active Citizen', progress: Math.min(reports.length, 10), total: 10, icon: '⭐' }].map(a => (
                  <div key={a.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700">{a.icon} {a.name}</span>
                      <span className="text-xs text-slate-400">{a.progress}/{a.total}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: (a.progress / a.total) * 100 + '%', backgroundColor: '#0891b2' }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 py-2 text-center">
                  Start reporting to unlock achievements!
                </div>
              )}
            </div>
          </div>

          {/* Points summary */}
          <div
            className="rounded-2xl p-4 text-white mt-auto"
            style={{ background: 'linear-gradient(135deg, #1e3a5f, #0891b2)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} className="text-amber-300" fill="#fbbf24" />
              <span className="text-sm font-bold">{points.toLocaleString()} Points</span>
            </div>
            <p className="text-blue-200 text-xs mb-3">
              {nextTier ? (nextTier.min - points).toLocaleString() + ' more points to unlock next tier!' : 'You reached the max tier!'}
            </p>
            <div className="h-1.5 bg-white/20 rounded-full">
              <div className="h-full rounded-full" style={{ width: progress + '%', backgroundColor: '#fbbf24' }} />
            </div>
            <button onClick={() => navigate('/rewards')} className="mt-3 text-xs text-cyan-300 font-semibold flex items-center gap-1">
              View Rewards <ChevronRight size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}







