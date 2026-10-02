with open('src/pages/citizen/CitizenDashboard.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

import re
code = re.sub(
    r'unsubReports = reportsService.subscribeToUserReports\(user\.uid, \(data\) => \{(.*?)\}\);',
    r'unsubReports = reportsService.subscribeToUserReports(user.uid, (data) => {\1}, (err) => { setError(err.message); setLoading(false); });',
    code,
    flags=re.DOTALL
)

with open('src/pages/citizen/CitizenDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(code)