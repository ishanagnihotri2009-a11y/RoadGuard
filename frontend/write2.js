const fs = require('fs');
let code = fs.readFileSync('src/pages/citizen/CitizenDashboard.tsx', 'utf8');

code = code.replace(/const \[publicReports, setPublicReports\] = useState<Report\[\]>\(\[\]\)\n?/, '');
code = code.replace(/let unsubPublic: \(\) => void;\n?/, '');
code = code.replace(/unsubPublic = reportsService\.subscribeToPublicReports\(\(data\) => \{\s*setPublicReports\(data\);\s*\}\);\n?/, '');
code = code.replace(/if \(unsubPublic\) unsubPublic\(\);\n?/, '');
code = code.replace(/const mapMarkers = publicReports\.map/g, 'const mapMarkers = reports.map');

fs.writeFileSync('src/pages/citizen/CitizenDashboard.tsx', code);