import { useState, useEffect } from 'react'
import { apiService } from '../../services/api.service'
import { Loader2, AlertCircle, FileText, CheckCircle2, Award, Brain } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function AdminAnalytics() {
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
        <p>Loading analytics data...</p>
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

  // Format dates
  const formatLabel = (d: string) => {
    const dt = new Date(d)
    return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  // Chart Configs
  const reportTrendsData = {
    labels: data.reportTrends.map((d: any) => formatLabel(d.date)),
    datasets: [
      {
        label: 'Total Reports',
        data: data.reportTrends.map((d: any) => d.total),
        borderColor: '#0891b2',
        backgroundColor: 'rgba(8, 145, 178, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3
      },
      {
        label: 'Verified',
        data: data.reportTrends.map((d: any) => d.verified),
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3
      }
    ]
  }

  const participationData = {
    labels: data.participation.map((d: any) => formatLabel(d.date)),
    datasets: [
      {
        label: 'New Citizens',
        data: data.participation.map((d: any) => d.newUsers),
        backgroundColor: '#8b5cf6',
        borderRadius: 4,
      }
    ]
  }

  const severityData = {
    labels: data.severityBreakdown.map((d: any) => d.name),
    datasets: [
      {
        data: data.severityBreakdown.map((d: any) => d.value),
        backgroundColor: ['#dc2626', '#ef4444', '#f59e0b', '#10b981'],
        borderWidth: 0
      }
    ]
  }

  const areaData = {
    labels: data.areaBreakdown.map((d: any) => d.area),
    datasets: [
      {
        label: 'Reports',
        data: data.areaBreakdown.map((d: any) => d.count),
        backgroundColor: '#3b82f6',
        borderRadius: 4,
        barPercentage: 0.7
      }
    ]
  }

  const rewardData = {
    labels: data.rewardDistribution.map((d: any) => formatLabel(d.date)),
    datasets: [
      {
        label: 'Points Rewarded',
        data: data.rewardDistribution.map((d: any) => d.points),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' } }, x: { grid: { display: false } } }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' as const, labels: { boxWidth: 12, font: { size: 11 } } } },
    cutout: '70%'
  }

  const horizontalBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: { legend: { display: false } },
    scales: { x: { beginAtZero: true, grid: { color: '#f1f5f9' } }, y: { grid: { display: false } } }
  }

  return (
    <div className="space-y-5 pb-12">
      <div>
        <h2 className="font-display font-bold text-xl text-slate-800">Analytics</h2>
        <p className="text-sm text-slate-500">Performance, AI, and Citizen Metrics</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Reports', value: data.totalReports.toLocaleString(), icon: <FileText size={18}/>, color: '#1e3a5f' },
          { label: 'Verified Rate', value: (data.totalReports ? Math.round(data.totalVerified / data.totalReports * 100) : 0) + '%', icon: <CheckCircle2 size={18}/>, color: '#10b981' },
          { label: 'AI Success', value: data.aiStats.successRate + '%', icon: <Brain size={18}/>, color: '#0891b2' },
          { label: 'Points Paid', value: data.totalRewards.toLocaleString(), icon: <Award size={18}/>, color: '#f59e0b' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">{k.label}</p>
              <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center opacity-80" style={{ backgroundColor: k.color + '20', color: k.color }}>
              {k.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Report Trends */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-bold font-display text-slate-800 mb-4">Submission & Verification Trends</h3>
          {data.reportTrends.length > 0 ? (
             <div className="h-64">
               <Line data={reportTrendsData} options={chartOptions} />
             </div>
          ) : (
             <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No trend data available</div>
          )}
        </div>

        {/* Participation Trends */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-bold font-display text-slate-800 mb-4">Citizen Registrations</h3>
          {data.participation.length > 0 ? (
             <div className="h-64">
               <Bar data={participationData} options={chartOptions} />
             </div>
          ) : (
             <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No participation data available</div>
          )}
        </div>

        {/* Severity Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-bold font-display text-slate-800 mb-4">Severity Breakdown</h3>
          <div className="h-64">
            <Doughnut data={severityData} options={doughnutOptions} />
          </div>
        </div>

        {/* Areas */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-bold font-display text-slate-800 mb-4">Reports by Area</h3>
          {data.areaBreakdown.length > 0 ? (
             <div className="h-64">
               <Bar data={areaData} options={horizontalBarOptions} />
             </div>
          ) : (
             <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No area data available</div>
          )}
        </div>

        {/* Reward Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-bold font-display text-slate-800 mb-4">Reward Distribution Trend</h3>
          {data.rewardDistribution.length > 0 ? (
             <div className="h-64">
               <Line data={rewardData} options={chartOptions} />
             </div>
          ) : (
             <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No reward data available</div>
          )}
        </div>

        {/* AI Stats */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-5 text-white">
          <h3 className="text-sm font-bold font-display text-white flex items-center gap-2 mb-6"><Brain size={18} className="text-indigo-400"/> AI Model Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-semibold mb-1">Total Detections</p>
              <p className="text-2xl font-bold">{data.aiStats.totalDetections.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-semibold mb-1">Avg Confidence</p>
              <p className="text-2xl font-bold text-emerald-400">{data.aiStats.avgConfidence}%</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-semibold mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-cyan-400">{data.aiStats.successRate}%</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-slate-400 font-semibold mb-1">Processing Time</p>
              <p className="text-2xl font-bold text-purple-400">{data.aiStats.avgProcessingTime} ms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

