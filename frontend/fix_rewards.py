import re

with open('src/pages/citizen/Rewards.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = re.sub(r'const TIERS = \[[\s\S]*?\]', "import { getTierInfo } from '../../utils/gamification'", code)
code = re.sub(r'const currentTier = TIERS\.find[\s\S]*?100', 'const { currentTier, nextTier, progress } = getTierInfo(currentPoints)', code)

with open('src/pages/citizen/Rewards.tsx', 'w', encoding='utf-8') as f:
    f.write(code)