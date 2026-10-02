import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { reportsService, Report } from '../../services/reports.service'
import SeverityBadge from '../../components/SeverityBadge'
import StatusBadge from '../../components/StatusBadge'
import ConfidenceMeter from '../../components/ConfidenceMeter'
import { ArrowLeft, MapPin, Brain, Calendar, Hash, Award, Clock } from 'lucide-react'

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useApp()

  useEffect(() => {
    if (id && user?.uid) {
      return reportsService.subscribeToUserReports(user.uid, (reports) => {
        const found = reports.find(r => r.id === id)
        setReport(found || null)
        setLoading(false)
      })
    }
  }, [id, user])

  if (loading) return <div className="p-8 text-center text-slate-500">Loading report...</div>
  if (!report) return <div className="p-8 text-center text-slate-500">Report not found.</div>

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Link to="/reports" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft size={16} /> Back to Reports
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{report.id}</span>
              <SeverityBadge severity={report.severity} />
              <StatusBadge status={report.status} />
            </div>
            <h1 className="text-xl font-bold font-display text-slate-900">{report.street}</h1>
            <p className="text-sm text-slate-500">{report.area}</p>
          </div>
          {report.points ? (
            <div className="text-right">
              <span className="text-2xl font-bold font-display text-emerald-600">+{report.points}</span>
              <p className="text-xs font-medium text-emerald-700/60 uppercase tracking-wider">Points</p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100">
          <div className="aspect-video bg-slate-100 relative group">
            <img src={report.imageUrl} alt="Original" className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded font-medium">Original</div>
          </div>
          {report.annotatedImageUrl && (
            <div className="aspect-video bg-slate-100 relative group">
              <img src={report.annotatedImageUrl} alt="AI Annotated" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-indigo-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded font-medium">AI Annotated</div>
            </div>
          )}
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><MapPin size={14}/> Location</h3>
            <p className="text-sm font-medium text-slate-700">{report.coords?.lat.toFixed(6)}, {report.coords?.lng.toFixed(6)}</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Calendar size={14}/> Reported On</h3>
            <p className="text-sm font-medium text-slate-700">{new Date(report.date).toLocaleString()}</p>
          </div>
          
          <div className="col-span-2 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Brain size={14}/> AI Analysis</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <p className="text-xs text-slate-500 mb-0.5">Confidence</p>
                 <ConfidenceMeter value={report.confidence || 0} />
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <p className="text-xs text-slate-500 mb-0.5">Potholes Detected</p>
                 <p className="font-bold text-slate-700">{report.potholeCount ?? 1}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <p className="text-xs text-slate-500 mb-0.5">Status</p>
                 <p className="font-bold text-slate-700 capitalize">{report.status.replace('_', ' ')}</p>
              </div>
            </div>
            {report.aiError && (
               <p className="mt-3 text-xs text-red-600">AI Error: {report.aiError}</p>
            )}
            {report.duplicate && report.duplicateInfo && (
               <p className="mt-3 text-xs text-amber-600">Flagged as possible duplicate (Original: {report.duplicateInfo.originalReportId})</p>
            )}
          </div>

          {/* Audit History */}
          <div className="col-span-2 pt-4 border-t border-slate-100">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Clock size={14}/> Status History</h3>
             {report.statusHistory && report.statusHistory.length > 0 ? (
                <div className="space-y-3">
                  {report.statusHistory.map((h, i) => (
                    <div key={i} className="flex gap-3 text-sm border-l-2 border-slate-200 pl-3 ml-2">
                       <div className="text-slate-400 text-xs w-24 shrink-0">{new Date(h.timestamp).toLocaleDateString()}</div>
                       <div>
                         <StatusBadge status={h.status} size="sm" />
                         {h.reason && <p className="text-xs text-slate-500 mt-1">{h.reason}</p>}
                       </div>
                    </div>
                  ))}
                </div>
             ) : (
                <p className="text-xs text-slate-400">No history recorded.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}

