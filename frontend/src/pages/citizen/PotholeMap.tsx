import { useState, useEffect } from 'react'
import { Search, MapPin, X, Navigation, Layers, Loader2, AlertCircle } from 'lucide-react'
import { reportsService, Report } from '../../services/reports.service'
import { useNavigate } from 'react-router-dom'
import SeverityBadge from '../../components/SeverityBadge'
import StatusBadge from '../../components/StatusBadge'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

type Severity = 'all' | 'high' | 'medium' | 'low' | 'critical'

const SEVERITY_COLOR: Record<string, string> = {
  critical: '#dc2626', high: '#ef4444', medium: '#f59e0b', low: '#10b981'
}

const createIcon = (severity: string, isSelected: boolean) => {
  const color = SEVERITY_COLOR[severity] || '#64748b'
  const html = '<div style="background-color: ' + color + '; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); transform: scale(' + (isSelected ? "1.25" : "1") + '); transition: transform 0.2s;"></div>'
  return L.divIcon({ html, className: '', iconSize: [24, 24], iconAnchor: [12, 12] })
}

function LocationButton() {
  const map = useMap();
  const locateUser = () => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, 15);
    });
  };
  return (
    <button onClick={locateUser} className="absolute bottom-6 right-4 z-[400] bg-slate-900/80 backdrop-blur text-white p-3 rounded-xl shadow-lg border border-white/10 hover:bg-slate-800 transition-all">
       <Navigation size={18} />
    </button>
  )
}

export default function PotholeMap() {
  const navigate = useNavigate()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState<Severity>('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    return reportsService.subscribeToMapReports(
      (data) => { setReports(data); setLoading(false) },
      (err) => { setError(err.message); setLoading(false) }
    )
  }, [])

  const filteredReports = reports.filter(r => {
    if (severityFilter !== 'all' && r.severity !== severityFilter) return false
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (search && !r.street.toLowerCase().includes(search.toLowerCase())) return false
    if (dateFilter !== 'all') {
      const reportDate = new Date(r.date || r.createdAt)
      const now = new Date()
      const days = (now.getTime() - reportDate.getTime()) / (1000 * 3600 * 24)
      if (dateFilter === '24h' && days > 1) return false
      if (dateFilter === '7d' && days > 7) return false
      if (dateFilter === '30d' && days > 30) return false
    }
    return true
  })

  const selectedReport = filteredReports.find(r => r.id === selectedId)

  if (loading) return <div className="flex items-center justify-center h-[calc(100vh-140px)] text-slate-400"><Loader2 size={32} className="animate-spin"/></div>
  if (error) return <div className="m-4 p-4 bg-red-50 text-red-600 rounded-xl flex gap-2 items-start"><AlertCircle size={20}/><p>{error}</p></div>

  return (
    <div className="h-[calc(100vh-140px)] -mx-4 lg:-mx-6 -my-4 lg:-my-6 relative flex flex-col">
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col gap-2">
        <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-100 flex-1 overflow-hidden">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" placeholder="Search by street or area..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value as Severity)} className="bg-white/90 backdrop-blur-md border border-slate-100 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 shadow-sm focus:outline-none">
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white/90 backdrop-blur-md border border-slate-100 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 shadow-sm focus:outline-none">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="verified">Verified</option>
          </select>
        </div>
      </div>

      <MapContainer center={[51.505, -0.09]} zoom={13} zoomControl={false} className="w-full flex-1 z-[1]">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationButton />
        
        {filteredReports.map(report => report.coords && (
          <Marker
            key={report.id}
            position={[report.coords.lat, report.coords.lng]}
            icon={createIcon(report.severity || 'low', selectedId === report.id)}
            eventHandlers={{ click: () => setSelectedId(report.id) }}
          >
            <Popup offset={[0, -10]} className="custom-popup">
              <div className="p-1 min-w-[200px]">
                <img src={report.imageUrl} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
                <p className="font-bold text-slate-800 text-sm mb-0.5 leading-tight">{report.street}</p>
                <p className="text-[10px] text-slate-500 mb-2">{new Date(report.date || report.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-1.5">
                   <SeverityBadge severity={report.severity || 'low'} size="sm" />
                   <StatusBadge status={report.status || 'pending'} size="sm" />
                </div>
                <button onClick={() => navigate('/reports/' + report.id)} className="w-full mt-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-bold hover:bg-cyan-100 transition-colors">
                   View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        
      </MapContainer>
    </div>
  )
}



