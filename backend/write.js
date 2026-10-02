const fs = require('fs');
let code = fs.readFileSync('backend/routes/reports.py', 'utf8');
code = code.replace(
  "final_status = 'possible_duplicate' if dup_result else 'under_review'",
  inal_status = 'possible_duplicate' if dup_result else 'under_review'

    # Suspicious check
    risk_profile = analyze_report(db, report_data, ai_result)
    if risk_profile['level'] == 'HIGH':
        final_status = 'suspicious'
    
);
fs.writeFileSync('backend/routes/reports.py', code);