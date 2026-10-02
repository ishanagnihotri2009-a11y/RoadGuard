interface Props {
  severity: 'low' | 'medium' | 'high' | string
  size?: 'sm' | 'md'
}

export default function SeverityBadge({ severity, size = 'md' }: Props) {
  const configs: Record<string, { label: string; cls: string }> = {
    low:    { label: 'Low', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    medium: { label: 'Medium', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    high:   { label: 'High', cls: 'bg-red-100 text-red-700 border-red-200' },
    critical: { label: 'Critical', cls: 'bg-rose-100 text-rose-800 border-rose-200' },
  }
  const cfg = configs[severity] ?? { label: severity, cls: 'bg-gray-100 text-gray-600 border-gray-200' }
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${sizeClass} ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${severity === 'low' ? 'bg-emerald-500' : severity === 'medium' ? 'bg-amber-500' : severity === 'high' ? 'bg-red-500' : 'bg-rose-600'}`} />
      {cfg.label}
    </span>
  )
}

