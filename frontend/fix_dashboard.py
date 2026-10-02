import re
with open('src/pages/citizen/CitizenDashboard.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
c = re.sub(r'// A simplistic next tier logic since backend isn\'t there yet\n\s*const nextTierPts = 5000;\n\s*const progressPct = Math\.min\(\(points / nextTierPts\) \* 100, 100\);', 'const { nextTier, progress } = getTierInfo(points);', c)
c = c.replace('width: progressPct', 'width: progress')
c = c.replace("points.toLocaleString() + ' / ' + nextTierPts.toLocaleString()", "points.toLocaleString() + (nextTier ? ' / ' + nextTier.min.toLocaleString() : '')")
with open('src/pages/citizen/CitizenDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(c)