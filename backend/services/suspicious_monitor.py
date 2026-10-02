import math
from datetime import datetime, timedelta
from google.cloud import firestore

RISK_LEVELS = {
    'LOW': 'LOW',
    'MEDIUM': 'MEDIUM',
    'HIGH': 'HIGH'
}

def analyze_report(db, report_dict, ai_result=None):
    """
    Analyzes a report and returns a risk profile.
    Signals:
    - excessive reports within short period
    - very low AI confidence
    - repeated duplicates
    """
    user_id = report_dict.get('userId')
    report_id = report_dict.get('id')
    
    score = 0
    reasons = []
    
    # 1. AI Confidence Signal
    conf = report_dict.get('confidence', 1.0)
    if ai_result:
        conf = ai_result.get('confidence', conf)
        
    if conf < 0.3:
        score += 40
        reasons.append(f"Very low AI confidence ({round(conf*100)}%)")
    elif conf < 0.5:
        score += 20
        reasons.append(f"Low AI confidence ({round(conf*100)}%)")
        
    # 2. User Velocity (Reports in last 24h)
    now = datetime.now()
    yesterday = now - timedelta(days=1)
    
    # Fetch recent reports by this user
    recent_reports = list(db.collection('reports').where('userId', '==', user_id).get())
    recent_count = 0
    duplicate_count = 0
    
    for r in recent_reports:
        d = r.to_dict()
        try:
            r_date = datetime.fromisoformat(d.get('createdAt', '').replace('Z', '+00:00'))
            if r_date > yesterday:
                recent_count += 1
        except:
            pass
        if d.get('status') == 'duplicate' or d.get('status') == 'possible_duplicate':
            duplicate_count += 1
            
    if recent_count > 20:
        score += 60
        reasons.append("Excessive reports (>20) within 24h")
    elif recent_count > 10:
        score += 30
        reasons.append("High report volume (>10) within 24h")
        
    if duplicate_count > 5:
        score += 40
        reasons.append(f"History of multiple duplicates ({duplicate_count})")
        
    # Categorize Risk
    risk_level = RISK_LEVELS['LOW']
    if score >= 70:
        risk_level = RISK_LEVELS['HIGH']
    elif score >= 40:
        risk_level = RISK_LEVELS['MEDIUM']
        
    if score >= 20:
        # Generate Flag Record
        db.collection('suspicious_flags').add({
            'reportId': report_id,
            'userId': user_id,
            'reason': "; ".join(reasons),
            'riskScore': score,
            'riskLevel': risk_level,
            'status': 'pending', # admin needs to review
            'createdAt': now.isoformat()
        })
        
    return {
        'score': score,
        'level': risk_level,
        'reasons': reasons
    }