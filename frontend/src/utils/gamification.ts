export const TIERS = [
  { name: 'Rookie', min: 0, max: 500, icon: '🔰', color: '#94a3b8' },
  { name: 'Reporter', min: 500, max: 1500, icon: '📸', color: '#10b981' },
  { name: 'Watcher', min: 1500, max: 3000, icon: '👀', color: '#0891b2' },
  { name: 'Guardian', min: 3000, max: 5000, icon: '🛡️', color: '#8b5cf6' },
  { name: 'Legend', min: 5000, max: 9999999, icon: '👑', color: '#f59e0b' },
]

export function getTierInfo(points: number) {
  const currentTier = TIERS.find(t => points >= t.min && points < t.max) ?? TIERS[TIERS.length - 1]
  const currentIndex = TIERS.indexOf(currentTier)
  const nextTier = TIERS[currentIndex + 1]
  
  const progress = nextTier 
    ? ((points - currentTier.min) / (nextTier.min - currentTier.min)) * 100 
    : 100
    
  const remaining = nextTier ? nextTier.min - points : 0

  return { currentTier, nextTier, progress, remaining }
}

export const ACHIEVEMENTS = [
  { id: 'first_report', name: 'First Report', desc: 'Submit your first pothole report', icon: '📝' },
  { id: '10_reports', name: '10 Reports', desc: 'Submit 10 total reports', icon: '🎯' },
  { id: '50_reports', name: '50 Reports', desc: 'Submit 50 total reports', icon: '🔥' },
  { id: '100_verified', name: '100 Verified', desc: 'Get 100 reports officially verified', icon: '💯' },
  { id: 'high_accuracy', name: 'High Accuracy', desc: 'Maintain high accuracy over 10+ reports', icon: '🎯' },
  { id: 'community_contributor', name: 'Community Contributor', desc: 'Earn 1,500 points', icon: '🤝' },
  { id: 'top_reporter', name: 'Top Reporter', desc: 'Earn 5,000 points', icon: '🏆' },
  { id: 'road_guardian', name: 'Road Guardian', desc: 'Earn 10,000 points', icon: '⭐' },
]