with open('src/pages/admin/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

import re
code = re.sub(
    r'\{data\.severityBreakdown\.map\(\(entry: any, index: number\) => \(',
    r'{data.severityBreakdown.filter((d:any) => d.value > 0).map((entry: any, index: number) => (',
    code
)

with open('src/pages/admin/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(code)