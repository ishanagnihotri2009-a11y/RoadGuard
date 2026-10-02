import { useState, useEffect } from 'react'
import { apiService } from '../../services/api.service'
import SeverityBadge from '../../components/SeverityBadge'
import StatusBadge from '../../components/StatusBadge'
import { AlertTriangle, Copy, Eye, XCircle, ChevronRight, Loader2, Check, ShieldAlert, AlertOctagon } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminSuspicious() {
  const [flags, setFlags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    loadFlags()
  }, [])

  const loadFlags = () => {
    setLoading(true)
    apiService.get('/admin/suspicious')
      .then(res => setFlags(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  const handleAction = async (flagId: string, action: 'dismiss' | 'reject_report' | 'flag_user') => {
    setProcessing(flagId)
    try {
      await apiService.post('/admin/suspicious/' + flagId + '/' + action)
      setFlags(flags.filter(f => f.id !== flagId))
    } catch (e) {
      console.error(e)
      alert('Failed to process flag')
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader2 size={32} className="animate-spin mb-4" />
        <p>Loading suspicious reports...</p>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-12">
      <div>
        <h2 className="font-display font-bold text-xl text-slate-800">Suspicious Activity Monitor</h2>
        <p className="text-sm text-slate-500">Review automated flags and potential abuse</p>
      </div>

      {flags.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4">
            <Check size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">All Clear</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">No suspicious activity flags pending review. The automated monitor is active.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flags.map(flag => (
            <div key={flag.id} className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
              <div className="bg-red-50 border-b border-red-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertOctagon size={18} className="text-red-500" />
                  <h3 className="font-bold text-red-900">Risk Level: {flag.riskLevel} (Score: {flag.riskScore})</h3>
                </div>
                <span className="text-xs font-mono text-red-700 bg-red-100 px-2 py-1 rounded">Flag ID: {flag.id.slice(0,8)}</span>
              </div>
              
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detection Reason</h4>
                    <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {flag.reason}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">User Information</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-500">Citizen ID:</span>
                      <span className="font-mono font-bold text-slate-700">{flag.userId}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      disabled={processing === flag.id}
                      onClick={() => handleAction(flag.id, 'dismiss')}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-2 rounded-xl transition-colors"
                    >
                      Dismiss Flag
                    </button>
                    <button
                      disabled={processing === flag.id}
                      onClick={() => handleAction(flag.id, 'reject_report')}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm py-2 rounded-xl transition-colors"
                    >
                      Reject Report
                    </button>
                    <button
                      disabled={processing === flag.id}
                      onClick={() => handleAction(flag.id, 'flag_user')}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-2 rounded-xl transition-colors"
                    >
                      Flag User
                    </button>
                  </div>
                </div>

                {flag.report && (
                  <div className="border border-slate-100 rounded-xl p-4 flex gap-4">
                    <div className="w-24 h-24 rounded-lg bg-slate-100 shrink-0 overflow-hidden">
                      <img src={flag.report.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-800 truncate">{flag.report.street}</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(flag.report.createdAt || flag.report.date).toLocaleString()}</p>
                        <div className="flex gap-2 mt-2">
                          <SeverityBadge severity={flag.report.severity || 'low'} size="sm" />
                          <StatusBadge status={flag.report.status || 'pending'} size="sm" />
                        </div>
                      </div>
                      <Link to={"/admin/reports/" + flag.report.id} className="text-xs font-bold text-cyan-600 hover:underline mt-2 inline-block">
                        View Full Report &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

