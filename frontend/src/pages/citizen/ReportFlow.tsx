import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
  Upload, MapPin, Brain, CheckCircle2, ArrowRight, ArrowLeft,
  Camera, AlertTriangle, X, Info
} from 'lucide-react'
import ConfidenceMeter from '../../components/ConfidenceMeter'
import SeverityBadge from '../../components/SeverityBadge'
import { storageService } from '../../services/storage.service'
import { apiService } from '../../services/api.service'
import { reportsService, Report } from '../../services/reports.service'

const STEPS = ['Upload', 'Location', 'AI Analysis', 'Result']

const AI_STAGES = [
  { label: 'Uploading securely...', duration: 1000 },
  { label: 'Waiting for AI processing...', duration: 2000 },
  { label: 'Running YOLOv8 inference...', duration: 2000 },
  { label: 'Checking duplicates...', duration: 1000 },
]

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={"w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all " +
                (i < step ? 'text-white' : i === step ? 'text-white ring-4' : 'bg-slate-100 text-slate-400')
              }
              style={
                i < step
                  ? { backgroundColor: '#10b981' }
                  : i === step
                  ? { backgroundColor: '#0891b2', outline: '4px solid #cffafe' }
                  : {}
              }
            >
              {i < step ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span className={"text-[10px] font-medium hidden sm:block " + (i === step ? 'text-cyan-600' : i < step ? 'text-emerald-600' : 'text-slate-400')}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={"w-12 sm:w-20 h-0.5 mx-1 mb-4 sm:mb-5 " + (i < step ? 'bg-emerald-400' : 'bg-slate-200')} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function ReportFlow() {
  const navigate = useNavigate()
  const { user } = useApp()
  const [step, setStep] = useState(0)
  
  const [file, setFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [desc, setDesc] = useState('')

  const [uploading, setUploading] = useState(false)
  const [reportId, setReportId] = useState<string | null>(null)
  const [realReport, setRealReport] = useState<Report | null>(null)

  const [aiStage, setAiStage] = useState(0)
  const [aiProgress, setAiProgress] = useState(0)

  useEffect(() => {
    if (step === 1 && !coords && !locating) {
      setLocating(true)
      setError(null)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          setLocating(false)
        },
        (err) => {
          setError('Failed to get location. Please enable location permissions.')
          setLocating(false)
        }
      )
    }
  }, [step, coords, locating])

  // Listen to Firestore doc once created
  useEffect(() => {
    if (reportId) {
      const unsub = reportsService.subscribeToReport(reportId, (rep) => {
        if (rep) {
          setRealReport(rep)
          // If backend processed it, jump to step 3
          if (rep.status !== 'pending' && rep.status !== 'processing' && step === 2) {
            setStep(3)
          }
        }
      })
      return () => unsub()
    }
  }, [reportId, step])

  // Fake AI loading bar for UI
  useEffect(() => {
    if (step !== 2) return
    let stageIdx = 0
    let totalDuration = AI_STAGES.reduce((a, s) => a + s.duration, 0)
    let elapsed = 0

    const runStage = () => {
      if (stageIdx >= AI_STAGES.length) {
        // If it finishes, it stays at 100% waiting for realReport to change
        return
      }
      setAiStage(stageIdx)
      const dur = AI_STAGES[stageIdx].duration
      elapsed += dur
      setAiProgress(Math.min(Math.round((elapsed / totalDuration) * 100), 99)) // Cap at 99% until real
      stageIdx++
      setTimeout(runStage, dur)
    }
    const t = setTimeout(runStage, 200)
    return () => clearTimeout(t)
  }, [step])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const f = e.target.files?.[0]
    if (f) {
      if (!f.type.startsWith('image/')) {
          setError('Please upload a valid image file (JPEG, PNG, etc).')
          return
        }
        if (f.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB')
        return
      }
      setFile(f)
      setImagePreview(URL.createObjectURL(f))
    }
  }

  const handleSubmit = async () => {
    if (!user || !file || !coords) return
    setUploading(true)
    setError(null)
    setStep(2)
    try {
      const imageUrl = await storageService.uploadReportImage(user.uid, file)
      const id = await reportsService.createReport({
        userId: user.uid,
        street: 'Location (' + coords.lat.toFixed(4) + ', ' + coords.lng.toFixed(4) + ')',
        area: 'Unknown Area',
        coords,
        status: 'pending',
        severity: 'medium', // Default until AI updates
        date: new Date().toISOString(),
        imageUrl,
        points: 0,
        confidence: 0,
        description: desc,
      })
            setReportId(id)
      
      // Trigger backend AI processing (Simulation of webhook)
      apiService.post('/reports/process', { reportId: id }).catch(err => {
        console.error('AI processing trigger failed:', err);
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit report')
      setStep(1)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => step > 0 && step < 3 ? setStep(s => s - 1) : navigate('/dashboard')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800">
          <ArrowLeft size={16} /> {step === 0 || step === 3 ? 'Back to Dashboard' : 'Back'}
        </button>
        <span className="text-xs text-slate-400">Step {Math.min(step + 1, STEPS.length)} of {STEPS.length}</span>
      </div>

      <StepIndicator step={step} />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-start gap-2 text-sm">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Step 0: Upload */}
      {step === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="font-display font-bold text-xl text-slate-800 mb-2">Upload Pothole Photo</h2>
            <p className="text-sm text-slate-500">Ensure the pothole is clearly visible in the image.</p>
          </div>

          {!imagePreview ? (
            <label className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group">
              <input type="file" className="hidden" accept="image/png, image/jpeg, image/heic" onChange={handleImageChange} />
              <div className="w-14 h-14 bg-cyan-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera size={24} className="text-cyan-600" />
              </div>
              <p className="font-semibold text-slate-700 mb-1">Tap to take photo</p>
              <p className="text-xs text-slate-400">or browse from gallery</p>
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
                <img src={imagePreview} alt="Preview" className="max-w-full max-h-full object-contain" />
                <button onClick={() => { setImagePreview(null); setFile(null); }} className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur transition-all">
                  <X size={16} />
                </button>
              </div>
              <button onClick={() => setStep(1)} className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2" style={{ backgroundColor: '#0891b2' }}>
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 space-y-6">
          <h2 className="font-display font-bold text-xl text-slate-800">Confirm Details</h2>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Location GPS</label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div className="flex-1 min-w-0">
                {locating ? (
                  <p className="text-sm font-semibold text-slate-700 animate-pulse">Acquiring GPS...</p>
                ) : coords ? (
                  <>
                    <p className="text-sm font-semibold text-slate-700 truncate">Current Location</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</p>
                  </>
                ) : (
                  <p className="text-sm text-red-500">Location required</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Optional)</label>
            <textarea
              value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="E.g. Middle lane, near the traffic light..."
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400"
            />
          </div>

          <button onClick={handleSubmit} disabled={!coords || locating} className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50" style={{ backgroundColor: '#0891b2' }}>
            Submit Report <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Step 2: Processing */}
      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl text-slate-800">Processing Report</h2>
            <p className="text-sm text-slate-500 mt-1">Waiting for cloud backend...</p>
          </div>

          <div className="relative mx-auto w-40 h-40">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent transition-all duration-500"
              style={{ borderTopColor: '#0891b2', borderRightColor: aiProgress > 25 ? '#0891b2' : 'transparent', borderBottomColor: aiProgress > 50 ? '#0891b2' : 'transparent', borderLeftColor: aiProgress > 75 ? '#0891b2' : 'transparent', transform: 'rotate(' + ((aiProgress / 100) * 360) + 'deg)' }}
            />
            <div className="absolute inset-4 rounded-full flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #050d1a, #1e3a5f)' }}>
              <Brain size={28} className="text-cyan-400 mb-1" />
              <span className="text-white text-lg font-bold font-display">{aiProgress}%</span>
            </div>
          </div>

          <div className="space-y-2 text-left max-w-xs mx-auto">
            {AI_STAGES.map((s, i) => (
              <div key={i} className={"flex items-center gap-2 transition-all " + (i <= aiStage ? 'opacity-100' : 'opacity-30')}>
                <div className={"w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 " + (i < aiStage ? 'bg-emerald-500' : i === aiStage ? 'bg-cyan-500 animate-pulse' : 'bg-slate-200')}>
                  {i < aiStage && <CheckCircle2 size={10} className="text-white" />}
                </div>
                <span className={"text-xs " + (i === aiStage ? 'text-slate-800 font-semibold' : i < aiStage ? 'text-emerald-600' : 'text-slate-400')}>{s.label}</span>
              </div>
            ))}
          </div>

          {imagePreview && (
            <div className="relative rounded-xl overflow-hidden h-32 ai-scan" style={{ backgroundColor: '#0a1628' }}>
              <img src={imagePreview} alt="Processing" className="w-full h-full object-cover opacity-60" />
            </div>
          )}
          
          {realReport?.aiError ? (
            <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-2 text-left">
               <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
               <p><strong>AI Processing Failed:</strong> {realReport.aiError}. The report is saved and will be reviewed manually.</p>
            </div>
          ) : realReport?.status === 'processing' ? (
            <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-2 text-left">
               <Info size={14} className="flex-shrink-0 mt-0.5" />
               <p><strong>Processing:</strong> AI is currently analyzing your image...</p>
            </div>
          ) : (
            <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start gap-2 text-left">
               <Info size={14} className="flex-shrink-0 mt-0.5 text-blue-500" />
               <p>Your report is safely stored in Firestore. It is currently marked as <strong>PENDING</strong>. A backend service will pick this up shortly.</p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Result */}
      {step === 3 && realReport && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden space-y-0">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl text-slate-800">AI Analysis Complete</h2>
                <p className="text-sm text-slate-500 mt-0.5">Report finalized</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={22} className="text-emerald-500" />
              </div>
            </div>
          </div>

          <div className="relative h-60 bg-slate-900">
            <img src={(realReport.annotatedImageUrl || realReport.imageUrl)} alt="Analyzed" className="w-full h-full object-contain opacity-90" />
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur text-xs text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <Brain size={11} className="text-cyan-400" /> YOLOv8 processed
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-red-600 font-display">{realReport.potholeCount !== undefined ? realReport.potholeCount : 1}</p>
                <p className="text-xs text-red-500">Potholes</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-slate-700 font-display">{realReport.roadCondition || 'Unknown'}</p>
                <p className="text-xs text-slate-500">Road Cond.</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-slate-700 font-display">{realReport.aiData?.avgDiameter || '--'}</p>
                <p className="text-xs text-slate-500">Avg Diameter</p>
              </div>
            </div>

            <ConfidenceMeter value={realReport.confidence || 0} />

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">Severity:</span>
              <SeverityBadge severity={realReport.severity} />
            {realReport.status === 'possible_duplicate' && (
               <div className="mt-4 p-3 bg-amber-50 rounded-lg text-amber-800 text-sm border border-amber-200">
                 <AlertTriangle size={16} className="inline mr-2 -mt-1" />
                 This report was flagged as a potential duplicate of a nearby report. It is currently under manual admin review.
               </div>
            )}
            </div>

            {realReport.points > 0 && (
              <div className="flex items-center gap-4 p-4 rounded-xl border border-amber-200 bg-amber-50">
                <div className="text-3xl">🏆</div>
                <div>
                  <p className="font-bold text-amber-700">+{realReport.points} Points Earned</p>
                  <p className="text-xs text-amber-600">Points added to your account!</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/dashboard')} className="py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 font-semibold hover:bg-slate-50 transition-all">
                Go to Dashboard
              </button>
              <button onClick={() => navigate('/reports/' + realReport.id)} className="py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ backgroundColor: '#0891b2' }}>
                View Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}








