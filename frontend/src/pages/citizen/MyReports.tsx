import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { Link } from 'react-router-dom'
import { reportsService, Report } from '../../services/reports.service'
import SeverityBadge from '../../components/SeverityBadge'
import StatusBadge from '../../components/StatusBadge'
import ConfidenceMeter from '../../components/ConfidenceMeter'
import { Search, FileText, ChevronRight, Plus } from 'lucide-react'

export default function MyReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { user } = useApp()

  useEffect(() => {
    if (user?.uid) return reportsService.subscribeToUserReports(user.uid, (data) => setReports(data))
  }, [user])

  const filtered = reports.filter(r =>
    (statusFilter === 'all' || r.status === statusFilter) &&
    (search === '' || r.street.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()))
  ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-800">My Reports</h2>
          <p className="text-sm text-slate-500">{reports.length} total submissions</p>
        </div>
        <Link
          to="/report"
          className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2.5 rounded-xl self-start hover:opacity-90 transition-all"
          style={{ backgroundColor: '#0891b2' }}
        >
          <Plus size={15} /> New Report
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-200"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="under_review">Under Review</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="duplicate">Duplicate</option>
            <option value="suspicious">Suspicious</option>
          </select>
        </div>
      </div>

      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {['Report ID', 'Image', 'Location', 'Date', 'Severity', 'Count', 'AI Conf.', 'Status', 'Points', ''].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-slate-50 transition-all group">
                <td className="px-4 py-3">
                  <span className="text-xs font-mono text-slate-500 bg-slate-50 group-hover:bg-white px-2 py-0.5 rounded">{r.id.slice(0,8)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                    <img src={r.annotatedImageUrl || r.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-800">{r.street}</p>
                  <p className="text-xs text-slate-400">{r.area}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-slate-500">{new Date(r.date).toLocaleDateString()}</span>
                </td>
                <td className="px-4 py-3"><SeverityBadge severity={r.severity} /></td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold text-slate-700">{r.potholeCount ?? '--'}</span>
                </td>
                <td className="px-4 py-3 w-24">
                  <ConfidenceMeter value={r.confidence || 0} size="sm" />
                </td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3">
                  {(r.points || 0) > 0
                    ? <span className="text-sm font-bold text-amber-500">+{r.points}</span>
                    : <span className="text-xs text-slate-300">-</span>
                  }
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={"/reports/" + r.id}
                    className="text-xs font-semibold flex items-center gap-1 hover:underline text-cyan-600"
                  >
                    View <ChevronRight size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <FileText size={32} className="text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No reports match your filters</p>
          </div>
        )}
      </div>

      <div className="lg:hidden space-y-3">
        {filtered.map(r => (
          <Link
            key={r.id}
            to={"/reports/" + r.id}
            className="block w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <img src={r.annotatedImageUrl || r.imageUrl} alt={r.street} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-800 truncate">{r.street}</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <SeverityBadge severity={r.severity} size="sm" />
                  <StatusBadge status={r.status} size="sm" />
                  {(r.points || 0) > 0 && <span className="text-xs font-bold text-amber-500">+{r.points}pts</span>}
                </div>
                <p className="text-xs text-slate-400 mt-1">{r.id.slice(0,8)} • {new Date(r.date).toLocaleDateString()}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 flex-shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}




