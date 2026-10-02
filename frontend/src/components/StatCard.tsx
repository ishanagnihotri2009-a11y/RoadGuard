import type { ReactNode } from 'react'

interface Props {
  label: string
  value: string | number
  sub?: string
  icon: ReactNode
  accent?: string
  trend?: { value: number; label: string }
}

export default function StatCard({ label, value, sub, icon, accent = '#0891b2', trend }: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${accent}18` }}
        >
          <span style={{ color: accent }}>{icon}</span>
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.value >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold font-display text-slate-800">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
