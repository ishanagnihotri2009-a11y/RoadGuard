import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { reportsService, Report } from '../../services/reports.service'
import SeverityBadge from '../../components/SeverityBadge'
import StatusBadge from '../../components/StatusBadge'
import { Search, Filter, ArrowRight, ArrowDownUp } from 'lucide-react'

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [areaFilter, setAreaFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')

  useEffect(() => {
    return reportsService.subscribeToMapReports((data) => setReports(data))
  }, [])

  const areas = Array.from(new Set(reports.map(r => r.area).filter(Boolean)))

  const filtered = reports.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (severityFilter !== 'all' && r.severity !== severityFilter) return false
    if (areaFilter !== 'all' && r.area !== areaFilter) return false
    if (search && !r.id.toLowerCase().includes(search.toLowerCase()) && !r.street.toLowerCase().includes(search.toLowerCase())) return false
    if (dateFilter !== 'all') {
      const reportDate = new Date(r.date || r.createdAt)
      const now = new Date()
      const days = (now.getTime() - reportDate.getTime()) / (1000 * 3600 * 24)
      if (dateFilter === '24h' && days > 1) return false
      if (dateFilter === '7d' && days > 7) return false
      if (dateFilter === '30d' && days > 30) return false
    }
    return true
  }).sort((a, b) => {
    const dA = new Date(a.date || a.createdAt).getTime()
    const dB = new Date(b.date || b.createdAt).getTime()
    if (sortOrder === 'newest') return dB - dA
    if (sortOrder === 'oldest') return dA - dB
    if (sortOrder === 'severity') {
      const sev: any = { critical: 4, high: 3, medium: 2, low: 1 }
      return sev[b.severity || 'low'] - sev[a.severity || 'low']
    }
    return 0
  })

  return (
    <div className="space-y-4 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-800">Report Management</h2>
          <p className="text-sm text-slate-500">Review and moderate citizen submissions</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search ID or street..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-200">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
              <option value="suspicious">Suspicious</option>
              <option value="possible_duplicate">Possible Duplicate</option>
            </select>
            <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-200">
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <select value={areaFilter} onChange={e => setAreaFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-200 flex-1 md:flex-none">
            <option value="all">All Areas</option>
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-200 flex-1 md:flex-none">
            <option value="all">All Time</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <div className="flex items-center ml-auto gap-2">
            <ArrowDownUp size={14} className="text-slate-400" />
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-200">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="severity">Highest Severity</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Report</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={r.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-mono font-bold text-slate-700">{r.id.slice(0,8)}</p>
                        {r.potholeCount && <p className="text-[10px] text-slate-400">{r.potholeCount} holes</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-800">{r.street}</p>
                    <p className="text-xs text-slate-400">{r.area}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-slate-600">{new Date(r.date || r.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={r.severity || 'low'} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status || 'pending'} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={"/admin/reports/" + r.id}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-cyan-600 hover:bg-cyan-50 transition-colors"
                    >
                      <ArrowRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              No reports match the current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
