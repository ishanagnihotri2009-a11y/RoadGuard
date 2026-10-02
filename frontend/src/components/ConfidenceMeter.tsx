interface Props { value: number; size?: 'sm' | 'md' }

export default function ConfidenceMeter({ value, size = 'md' }: Props) {
  const color = value >= 85 ? '#10b981' : value >= 65 ? '#f59e0b' : '#ef4444'
  const label = value >= 85 ? 'High Confidence' : value >= 65 ? 'Moderate' : 'Low Confidence'
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">AI Confidence</span>
        <span className="text-sm font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className={`w-full ${size === 'sm' ? 'h-1.5' : 'h-2'} bg-slate-100 rounded-full overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      {size === 'md' && <p className="text-xs" style={{ color }}>{label}</p>}
    </div>
  )
}
