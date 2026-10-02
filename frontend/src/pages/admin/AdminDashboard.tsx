import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiService } from '../../services/api.service'
import StatCard from '../../components/StatCard'
import { FileText, CheckCircle2, Users, AlertTriangle, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import SeverityBadge from '../../components/SeverityBadge'
import StatusBadge from '../../components/StatusBadge'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const COLORS = {
  Critical: '#dc2626',
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981'
}

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiService.get('/admin/analytics')
      .then(res => setData(res))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader2 size={32} className="animate-spin mb-4" />
        <p>Loading analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle size={32} className="mb-4" />
        <p className="font-bold">Error loading analytics</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-5 pb-12">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard label="Total Reports" value={data.totalReports.toLocaleString()} icon={<FileText size={18} />} accent="#1e3a5f" />
        <StatCard label="Verified" value={data.verifiedReports.toLocaleString()} sub={(data.totalReports ? Math.round(data.verifiedReports / data.totalReports * 100) : 0) + '% rate'} icon={<CheckCircle2 size={18} />} accent="#10b981" />
        <StatCard label="Active Citizens" value={data.totalCitizens.toLocaleString()} icon={<Users size={18} />} accent="#0891b2" />
        <StatCard label="Total Potholes" value={data.totalPotholes.toLocaleString()} icon={<AlertTriangle size={18} />} accent="#8b5cf6" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Pending Review', value: data.pendingReports.toLocaleString(), color: '#f59e0b', bg: 'bg-amber-50' },
          { label: 'Suspicious Reports', value: data.suspiciousReports.toLocaleString(), color: '#8b5cf6', bg: 'bg-purple-50' },
          { label: 'Critical / High', value: (data.severityBreakdown.find((s: any) => s.name === 'Critical')?.value + data.severityBreakdown.find((s: any) => s.name === 'High')?.value).toLocaleString(), color: '#ef4444', bg: 'bg-red-50' },
          { label: 'Verified Rate', value: (data.totalReports ? Math.round(data.verifiedReports / data.totalReports * 100) : 0) + '%', color: '#10b981', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={"rounded-2xl border border-white p-4 " + s.bg}>
            <p className="text-xs font-semibold text-slate-500 mb-1">{s.label}</p>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
        {/* Severity */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-bold font-display text-slate-800 mb-4">Severity Distribution</h3>
          <div className="h-48">
            
            {data.severityBreakdown.some((d:any) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.severityBreakdown.filter((d:any) => d.value > 0)} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                    {data.severityBreakdown.filter((d:any) => d.value > 0).map((entry: any, index: number) => (
                      <Cell key={"cell-" + index} fill={(COLORS as any)[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data</div>
            )}

          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {data.severityBreakdown.filter((d:any) => d.value > 0).map((s: any) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: (COLORS as any)[s.name] }} />
                <span className="text-[11px] font-semibold text-slate-600">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hotspots */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 lg:col-span-2">
          <h3 className="text-sm font-bold font-display text-slate-800 mb-4">Top Problem Areas</h3>
          {data.areaBreakdown.length > 0 ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.areaBreakdown} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#0891b2" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-slate-400 text-sm">No area data available</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
        {/* Recent Reports */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:col-span-2">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold font-display text-slate-800">Recent Submissions</h3>
            <Link to="/admin/reports" className="text-xs font-semibold text-cyan-600 hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {data.recentReports.length > 0 ? data.recentReports.map((r: any) => (
              <Link key={r.id} to={"/admin/reports/" + r.id} className="block hover:bg-slate-50 transition-colors p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                    <img src={r.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-slate-800 truncate">{r.street}</p>
                      <span className="text-xs text-slate-400 shrink-0">{new Date(r.date || r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <SeverityBadge severity={r.severity || 'low'} size="sm" />
                      <StatusBadge status={r.status || 'pending'} size="sm" />
                      {r.potholeCount && <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{r.potholeCount} holes</span>}
                    </div>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="p-8 text-center text-slate-400 text-sm">No recent reports found</div>
            )}
          </div>
        </div>

        {/* Map Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 flex flex-col h-96">
          <h3 className="text-sm font-bold font-display text-slate-800 mb-3 px-2">Active Heatmap</h3>
          <div className="flex-1 rounded-xl overflow-hidden bg-[#1a2332] relative border border-slate-200">
             <MapContainer center={[39.8283, -98.5795]} zoom={3} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap"
              />
              {data.mapOverview.filter((m: any) => m.coords && typeof m.coords.lat === "number" && typeof m.coords.lng === "number").map((m: any) => (
                <CircleMarker
                  key={m.id}
                  center={[m.coords.lat, m.coords.lng]}
                  radius={m.severity === 'critical' ? 8 : m.severity === 'high' ? 6 : m.severity === 'medium' ? 4 : 3}
                  pathOptions={{ 
                    color: (COLORS as any)[m.severity.charAt(0).toUpperCase() + m.severity.slice(1)] || COLORS.Low, 
                    fillColor: (COLORS as any)[m.severity.charAt(0).toUpperCase() + m.severity.slice(1)] || COLORS.Low, 
                    fillOpacity: 0.6 
                  }}
                />
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  )
}




