import re

with open('src/pages/citizen/CitizenDashboard.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = re.sub(r'const \[publicReports, setPublicReports\] = useState<Report\[\]>\(\[\]\)\n?', '', code)
code = re.sub(r'let unsubPublic: \(\) => void;\n?', '', code)
code = re.sub(r'unsubPublic = reportsService\.subscribeToPublicReports\(\(data\) => \{\s*setPublicReports\(data\);\s*\}\);\n?', '', code)
code = re.sub(r'if \(unsubPublic\) unsubPublic\(\);\n?', '', code)
code = code.replace('const mapMarkers = publicReports.map', 'const mapMarkers = reports.map')

with open('src/pages/citizen/CitizenDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(code)