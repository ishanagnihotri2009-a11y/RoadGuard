import re

with open('backend/routes/reports.py', 'r', encoding='utf-8') as f:
    code = f.read()

replacement = '''
    final_status = 'possible_duplicate' if dup_result else 'under_review'
    
    # AI Auto-Verification
    if final_status == 'under_review' and ai_result['confidence'] >= 85 and ai_result['potholeCount'] > 0:
        final_status = 'verified'

    # Suspicious check
    risk_profile = analyze_report(db, report_data, ai_result)
    if risk_profile['level'] == 'HIGH':
        final_status = 'suspicious'

    update_data = {
        'status': final_status,
        'duplicate': bool(dup_result),
        'duplicateInfo': dup_result,
        'potholeDetected': ai_result['potholeDetected'],
        'potholeCount': ai_result['potholeCount'],
        'confidence': ai_result['confidence'],
        'severity': ai_result['severity'],
        'detections': ai_result['detections'],
        'annotatedImageUrl': annotated_url,
        'processedAt': datetime.now().isoformat(),
        'aiData': {
            'model': 'YOLOv8-Pothole (or yolov8n fallback)',
            'inferenceMs': inference_ms,
            'disclaimer': ai_result.get('disclaimer', '')
        }
    }
    
    # Award points if auto-verified
    if final_status == 'verified':
        from services.reward_service import reward_service
        base = reward_service.points_verified
        bonus = 50 if ai_result['severity'] in ['critical', 'high', 'Critical', 'High'] else 0
        user_id = report_data.get('userId')
        
        awarded = 0
        if reward_service.award_points(db, user_id, report_id, base, 'AI Auto-Verified'):
            awarded += base
        if bonus > 0 and reward_service.award_points(db, user_id, report_id, bonus, 'High Severity Bonus'):
            awarded += bonus
            
        update_data['pointsAwarded'] = awarded
        create_notification(db, user_id, 'VERIFIED', 'AI Auto-Verified!', f'Your report was so clear that our AI automatically verified it. You earned {awarded} points!', report_id)

'''

# We need to find the right chunk to replace.
pattern = r"\s+final_status = 'possible_duplicate' if dup_result else 'under_review'.*?'disclaimer': ai_result\.get\('disclaimer', ''\)\n        \}\n    \}"

code = re.sub(pattern, replacement, code, flags=re.DOTALL)

with open('backend/routes/reports.py', 'w', encoding='utf-8') as f:
    f.write(code)