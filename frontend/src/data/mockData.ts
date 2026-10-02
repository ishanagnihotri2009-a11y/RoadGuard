export const REPORTS = [
  {
    id: 'R-2024-001', date: '2024-01-15T09:23:00Z', street: 'Main St & 4th Ave',
    area: 'Downtown', severity: 'high', status: 'verified', confidence: 94,
    count: 3, roadCondition: 'Poor', points: 150, duplicate: false,
    coords: { lat: 37.7749, lng: -122.4194 },
    description: 'Large pothole near the intersection causing vehicles to swerve.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=400&fit=crop&auto=format',
    citizen: 'Marcus Chen', citizenId: 'U-001',
    aiData: { model: 'YOLOv8-RG', inferenceMs: 312, potholeCount: 3, avgDiameter: '45cm', depthEst: '8cm' }
  },
  {
    id: 'R-2024-002', date: '2024-01-15T11:45:00Z', street: 'Oak Blvd',
    area: 'Westside', severity: 'medium', status: 'verified', confidence: 87,
    count: 1, roadCondition: 'Fair', points: 75, duplicate: false,
    coords: { lat: 37.7751, lng: -122.4180 },
    description: 'Single pothole with water pooling after rain.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format',
    citizen: 'Priya Sharma', citizenId: 'U-002',
    aiData: { model: 'YOLOv8-RG', inferenceMs: 289, potholeCount: 1, avgDiameter: '28cm', depthEst: '4cm' }
  },
  {
    id: 'R-2024-003', date: '2024-01-14T16:12:00Z', street: 'Harbor Dr',
    area: 'Eastside', severity: 'low', status: 'verified', confidence: 79,
    count: 2, roadCondition: 'Fair', points: 60, duplicate: false,
    coords: { lat: 37.7760, lng: -122.4170 },
    description: 'Two shallow surface cracks near the curb.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=400&fit=crop&auto=format',
    citizen: 'James Okafor', citizenId: 'U-003',
    aiData: { model: 'YOLOv8-RG', inferenceMs: 304, potholeCount: 2, avgDiameter: '15cm', depthEst: '2cm' }
  },
  {
    id: 'R-2024-004', date: '2024-01-14T08:30:00Z', street: 'Central Ave',
    area: 'Midtown', severity: 'high', status: 'pending', confidence: 91,
    count: 4, roadCondition: 'Poor', points: 0, duplicate: false,
    coords: { lat: 37.7740, lng: -122.4210 },
    description: 'Multiple large potholes spanning both lanes.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format',
    citizen: 'Sofia Rodriguez', citizenId: 'U-004',
    aiData: { model: 'YOLOv8-RG', inferenceMs: 298, potholeCount: 4, avgDiameter: '52cm', depthEst: '12cm' }
  },
  {
    id: 'R-2024-005', date: '2024-01-13T14:55:00Z', street: 'Pine Street',
    area: 'Northside', severity: 'medium', status: 'duplicate', confidence: 83,
    count: 1, roadCondition: 'Fair', points: 0, duplicate: true,
    coords: { lat: 37.7770, lng: -122.4200 },
    description: 'Pothole near bus stop — possible duplicate of R-2024-001.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=400&fit=crop&auto=format',
    citizen: 'Aiden Walsh', citizenId: 'U-005',
    aiData: { model: 'YOLOv8-RG', inferenceMs: 318, potholeCount: 1, avgDiameter: '22cm', depthEst: '5cm' }
  },
  {
    id: 'R-2024-006', date: '2024-01-13T10:20:00Z', street: 'River Rd',
    area: 'Southside', severity: 'low', status: 'invalid', confidence: 41,
    count: 0, roadCondition: 'Good', points: 0, duplicate: false,
    coords: { lat: 37.7730, lng: -122.4160 },
    description: 'Reported surface issue — AI found no significant potholes.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&auto=format',
    citizen: 'Nina Patel', citizenId: 'U-006',
    aiData: { model: 'YOLOv8-RG', inferenceMs: 276, potholeCount: 0, avgDiameter: 'N/A', depthEst: 'N/A' }
  },
]

export const CITIZENS = [
  { id: 'U-001', name: 'Marcus Chen', email: 'marcus@example.com', joined: '2023-08-12', reports: 47, verified: 39, points: 4820, rank: 1, badges: 12, status: 'active', lastActive: '2024-01-15' },
  { id: 'U-002', name: 'Priya Sharma', email: 'priya@example.com', joined: '2023-09-03', reports: 38, verified: 31, points: 3950, rank: 2, badges: 10, status: 'active', lastActive: '2024-01-15' },
  { id: 'U-003', name: 'James Okafor', email: 'james@example.com', joined: '2023-07-21', reports: 34, verified: 28, points: 3340, rank: 3, badges: 9, status: 'active', lastActive: '2024-01-14' },
  { id: 'U-004', name: 'Sofia Rodriguez', email: 'sofia@example.com', joined: '2023-10-15', reports: 29, verified: 22, points: 2610, rank: 4, badges: 7, status: 'active', lastActive: '2024-01-14' },
  { id: 'U-005', name: 'Aiden Walsh', email: 'aiden@example.com', joined: '2023-11-08', reports: 21, verified: 14, points: 1720, rank: 5, badges: 5, status: 'active', lastActive: '2024-01-13' },
  { id: 'U-006', name: 'Nina Patel', email: 'nina@example.com', joined: '2023-12-01', reports: 15, verified: 7, points: 840, rank: 6, badges: 3, status: 'flagged', lastActive: '2024-01-13' },
  { id: 'U-007', name: 'Carlos Lima', email: 'carlos@example.com', joined: '2024-01-02', reports: 8, verified: 6, points: 560, rank: 7, badges: 2, status: 'active', lastActive: '2024-01-12' },
]

export const ACHIEVEMENTS = [
  { id: 1, name: 'First Report', desc: 'Submit your first pothole report', icon: '🚧', earned: true, earnedDate: '2023-08-12', points: 50, category: 'milestone' },
  { id: 2, name: 'Road Watcher', desc: 'Submit 10 verified reports', icon: '👁️', earned: true, earnedDate: '2023-09-05', points: 150, category: 'milestone' },
  { id: 3, name: 'Street Guardian', desc: 'Submit 25 verified reports', icon: '🛡️', earned: true, earnedDate: '2023-10-18', points: 300, category: 'milestone' },
  { id: 4, name: 'Community Hero', desc: 'Submit 50 verified reports', icon: '⭐', earned: false, progress: 39, total: 50, points: 500, category: 'milestone' },
  { id: 5, name: 'Accuracy Expert', desc: 'Maintain 90%+ verification rate for 20 reports', icon: '🎯', earned: true, earnedDate: '2023-11-02', points: 200, category: 'quality' },
  { id: 6, name: 'High Alert', desc: 'Report 5 high-severity potholes', icon: '🔴', earned: true, earnedDate: '2023-09-28', points: 100, category: 'severity' },
  { id: 7, name: 'Area Scout', desc: 'Report potholes in 5 different areas', icon: '🗺️', earned: false, progress: 3, total: 5, points: 120, category: 'exploration' },
  { id: 8, name: 'Daily Reporter', desc: 'Submit reports 7 days in a row', icon: '📅', earned: false, progress: 4, total: 7, points: 175, category: 'streak' },
  { id: 9, name: 'Top Contributor', desc: 'Reach #1 on the leaderboard', icon: '🏆', earned: false, progress: 0, total: 1, points: 1000, category: 'ranking' },
  { id: 10, name: 'Night Owl', desc: 'Submit 3 reports after 8 PM', icon: '🌙', earned: true, earnedDate: '2023-12-15', points: 80, category: 'time' },
  { id: 11, name: 'Quick Draw', desc: 'Report a pothole within 5 minutes of discovering it', icon: '⚡', earned: true, earnedDate: '2023-10-05', points: 90, category: 'speed' },
  { id: 12, name: 'City Legend', desc: 'Earn 5000 total points', icon: '👑', earned: false, progress: 4820, total: 5000, points: 2000, category: 'points' },
]

export const POINT_HISTORY = [
  { id: 1, date: '2024-01-15', action: 'Verified Report — R-2024-001', points: 150, type: 'earned' },
  { id: 2, date: '2024-01-15', action: 'Verified Report — R-2024-002', points: 75, type: 'earned' },
  { id: 3, date: '2024-01-14', action: 'Verified Report — R-2024-003', points: 60, type: 'earned' },
  { id: 4, date: '2024-01-12', action: 'Streak Bonus — 5 days', points: 50, type: 'bonus' },
  { id: 5, date: '2024-01-10', action: 'Achievement: Accuracy Expert', points: 200, type: 'achievement' },
  { id: 6, date: '2024-01-08', action: 'Verified Report — R-2024-089', points: 150, type: 'earned' },
  { id: 7, date: '2024-01-05', action: 'Verified Report — R-2024-076', points: 75, type: 'earned' },
  { id: 8, date: '2024-01-03', action: 'Achievement: High Alert', points: 100, type: 'achievement' },
]

export const TREND_DATA = [
  { month: 'Aug', reports: 142, verified: 118 },
  { month: 'Sep', reports: 189, verified: 154 },
  { month: 'Oct', reports: 213, verified: 177 },
  { month: 'Nov', reports: 267, verified: 221 },
  { month: 'Dec', reports: 198, verified: 162 },
  { month: 'Jan', reports: 312, verified: 256 },
]

export const SEVERITY_DATA = [
  { name: 'High', value: 127, color: '#ef4444' },
  { name: 'Medium', value: 208, color: '#f59e0b' },
  { name: 'Low', value: 177, color: '#10b981' },
]

export const AREA_DATA = [
  { area: 'Downtown', reports: 142, color: '#0891b2' },
  { area: 'Westside', reports: 98, color: '#0891b2' },
  { area: 'Eastside', reports: 87, color: '#0891b2' },
  { area: 'Midtown', reports: 76, color: '#0891b2' },
  { area: 'Northside', reports: 65, color: '#0891b2' },
  { area: 'Southside', reports: 44, color: '#0891b2' },
]
