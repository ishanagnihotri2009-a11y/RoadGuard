interface Props { status: string; size?: 'sm' | 'md' }

export default function StatusBadge({ status, size = 'md' }: Props) {
  const configs: Record<string, { label: string; cls: string }> = {
    pending:            { label: 'Pending', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
    processing:         { label: 'Processing', cls: 'bg-purple-100 text-purple-700 border-purple-200' },
    ai_processed:       { label: 'AI Processed', cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    under_review:       { label: 'Under Review', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    verified:           { label: 'Verified', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    rejected:           { label: 'Rejected', cls: 'bg-red-100 text-red-700 border-red-200' },
    duplicate:          { label: 'Duplicate', cls: 'bg-orange-100 text-orange-700 border-orange-200' },
    possible_duplicate: { label: 'Possible Duplicate', cls: 'bg-orange-100 text-orange-700 border-orange-200' },
    suspicious:         { label: 'Suspicious', cls: 'bg-red-200 text-red-800 border-red-300' },
    invalid:            { label: 'Invalid', cls: 'bg-red-100 text-red-700 border-red-200' },
  }
  const cfg = configs[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600 border-gray-200' }
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'
  return (
    <span className={"" + "inline-flex items-center rounded-full border font-medium " + sizeClass + " " + cfg.cls}>
      {cfg.label}
    </span>
  )
}