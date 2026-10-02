import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { reportsService, Report } from '../../services/reports.service'
import { apiService } from '../../services/api.service'
import SeverityBadge from '../../components/SeverityBadge'
import StatusBadge from '../../components/StatusBadge'
import ConfidenceMeter from '../../components/ConfidenceMeter'
import { ArrowLeft, CheckCircle2, Brain, MapPin, Calendar, User, Clock, AlertTriangle, Check, XCircle, AlertOctagon, Copy } from 'lucide-react'

export default function AdminReportDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      return reportsService.subscribeToMapReports((reports) => {
        const found = reports.find(r => r.id === id)
        if (found) setReport(found)
        setLoading(false)
      })
    }
  }, [id])

  const handleAction = async (action: 'verify' | 'reject' | 'suspicious' | 'duplicate') => {
    if (!report || submitting) return
    setSubmitting(true)
    try {
      if (action === 'verify') await apiService.post('/admin/reports/' + report.id + '/verify')
      else await apiService.post('/admin/reports/' + report.id + '/reject', { reason: action })
      navigate('/admin/reports')
    } catch (e) {
      console.error(e)
      alert('Action failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>
  if (!report) return <div className="p-8 text-center text-slate-500">Report not found</div>

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12">
      <div className="flex items-center gap-3">
        <Link to="/admin/reports" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-xl text-slate-800">Report Details</h2>
            <StatusBadge status={report.status || 'pending'} />
          </div>
          <p className="text-sm text-slate-500 font-mono mt-0.5">ID: {report.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <div className="aspect-video bg-slate-900 relative group">
          <img src={report.imageUrl} alt="Original" className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg font-semibold">Original Upload</div>
        </div>
        {report.annotatedImageUrl ? (
          <div className="aspect-video bg-slate-900 relative group">
            <img src={report.annotatedImageUrl} alt="AI Annotated" className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 bg-indigo-500/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5"><Brain size={14}/> AI Annotated</div>
          </div>
        ) : (
          <div className="aspect-video bg-slate-50 flex flex-col items-center justify-center text-slate-400">
            <Brain size={32} className="mb-2 opacity-50" />
            <p className="text-sm font-semibold">No AI annotations available</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3"><Brain size={18} className="text-indigo-500"/> AI Analysis Results</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-400 font-semibold mb-1">Severity</p>
                <SeverityBadge severity={report.severity || 'low'} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold mb-1">Confidence</p>
                <ConfidenceMeter value={report.confidence || 0} size="md" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold mb-1">Potholes Detected</p>
                <p className="font-bold text-slate-800">{report.potholeCount || 0}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold mb-1">Est. Depth</p>
                <p className="font-bold text-slate-800">{(report as any).depth || 'N/A'}</p>
              </div>
            </div>
            <div className="pt-2">
               <p className="text-xs text-slate-400 font-semibold mb-1">Road Condition Note</p>
               <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">{(report as any).roadCondition || 'No specific surface issues flagged by pipeline.'}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3"><AlertTriangle size={18} className="text-amber-500"/> Submission & Context</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <div className="flex items-start gap-3">
                <MapPin className="text-slate-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{report.street}</p>
                  <p className="text-xs text-slate-500">{report.area}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">{report.coords?.lat}, {report.coords?.lng}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="text-slate-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Citizen ID</p>
                  <p className="text-xs font-mono text-slate-700 mt-0.5 break-all">{report.userId}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-slate-400 shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-xs text-slate-500 font-semibold">Reported At</p>
                  <p className="text-sm text-slate-700 mt-0.5">{new Date(report.date || report.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4">Admin Actions</h3>
            <div className="space-y-2">
              <button disabled={submitting || report.status === 'verified'} onClick={() => handleAction('verify')} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors">
                <CheckCircle2 size={16} /> Verify & Award Points
              </button>
              <button disabled={submitting || report.status === 'rejected'} onClick={() => handleAction('reject')} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors">
                <XCircle size={16} /> Reject Report
              </button>
              <button disabled={submitting || report.status === 'duplicate'} onClick={() => handleAction('duplicate')} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 transition-colors">
                <Copy size={16} /> Mark as Duplicate
              </button>
              <button disabled={submitting || report.status === 'suspicious'} onClick={() => handleAction('suspicious')} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-colors">
                <AlertOctagon size={16} /> Flag Suspicious
              </button>
            </div>
          </div>

          {/* Duplicates */}
          {(report as any).duplicateInfo && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Copy size={14}/> Possible Duplicate</h4>
              <p className="text-sm text-amber-900">This report was flagged as a potential duplicate of <span className="font-mono font-bold">{(report as any).duplicateInfo.matchId.slice(0,8)}</span>.</p>
              <p className="text-xs text-amber-700 mt-2">Distance: {Math.round((report as any).duplicateInfo.distance)} meters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

