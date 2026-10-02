from flask import Blueprint, request, jsonify
from utils.auth import require_admin
from firebase_admin import firestore
from utils.history import append_status_history
from services.rewards import reward_service
from services.gamification import gamification_service
from services.notifications import create_notification
from datetime import datetime

def log_admin_action(db, admin_id, action_type, report_id, details=""):
    db.collection('admin_actions').add({
        'adminId': admin_id,
        'action': action_type,
        'reportId': report_id,
        'details': details,
        'timestamp': datetime.now().isoformat()
    })

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@require_admin
def get_users():
    db = firestore.client()
    users = []
    
    docs = db.collection('users').get()
    
    # Sort for rank logic (or frontend can do rank logic based on points)
    for doc in docs:
        d = doc.to_dict()
        if d.get('role') == 'admin':
            continue
            
        u = {
            'id': doc.id,
            'name': d.get('name', 'Unknown'),
            'email': d.get('email', ''),
            'points': d.get('points', 0),
            'tier': d.get('tier', 'Rookie'),
            'totalReports': d.get('totalReports', 0),
            'verifiedReports': d.get('verifiedReports', 0),
            'status': 'flagged' if d.get('flagged') else ('banned' if d.get('banned') else 'active'),
            'createdAt': d.get('createdAt', '')
        }
        users.append(u)
        
    users.sort(key=lambda x: x['points'], reverse=True)
    for i, u in enumerate(users):
        u['rank'] = i + 1
        
    return jsonify(users), 200

@admin_bp.route('/users/<user_id>/action', methods=['POST'])
@require_admin
def action_user(user_id):
    db = firestore.client()
    data = request.json
    action = data.get('action')
    
    u_ref = db.collection('users').document(user_id)
    doc = u_ref.get()
    if not doc.exists:
        return jsonify({'error': 'Not found'}), 404
        
    if action == 'flag':
        u_ref.update({'flagged': True})
        log_admin_action(db, request.user.get('uid', 'admin'), 'FLAG_USER', user_id, 'Flagged citizen')
    elif action == 'unflag':
        u_ref.update({'flagged': False})
        log_admin_action(db, request.user.get('uid', 'admin'), 'UNFLAG_USER', user_id, 'Unflagged citizen')
    elif action == 'ban':
        u_ref.update({'banned': True})
        log_admin_action(db, request.user.get('uid', 'admin'), 'BAN_USER', user_id, 'Banned citizen')
    elif action == 'unban':
        u_ref.update({'banned': False})
        log_admin_action(db, request.user.get('uid', 'admin'), 'UNBAN_USER', user_id, 'Unbanned citizen')
    else:
        return jsonify({'error': 'Invalid action'}), 400
        
    return jsonify({'success': True}), 200

@admin_bp.route('/suspicious', methods=['GET'])
@require_admin
def get_suspicious():
    db = firestore.client()
    flags = []
    
    # Get all pending flags
    docs = db.collection('suspicious_flags').where('status', '==', 'pending').get()
    
    for doc in docs:
        d = doc.to_dict()
        d['id'] = doc.id
        
        # Attach report details
        r_doc = db.collection('reports').document(d['reportId']).get()
        if r_doc.exists:
            rd = r_doc.to_dict()
            rd['id'] = r_doc.id
            d['report'] = rd
            
        flags.append(d)
        
    return jsonify(flags), 200

@admin_bp.route('/suspicious/<flag_id>/<action>', methods=['POST'])
@require_admin
def handle_suspicious(flag_id, action):
    db = firestore.client()
    flag_ref = db.collection('suspicious_flags').document(flag_id)
    doc = flag_ref.get()
    if not doc.exists:
        return jsonify({'error': 'Not found'}), 404
        
    data = doc.to_dict()
    report_id = data.get('reportId')
    
    if action == 'dismiss':
        flag_ref.update({'status': 'dismissed'})
        log_admin_action(db, request.user.get('uid', 'admin'), 'DISMISS_FLAG', report_id, 'Dismissed suspicious flag')
    elif action == 'reject_report':
        flag_ref.update({'status': 'resolved'})
        r_ref = db.collection('reports').document(report_id)
        r_ref.update({'status': 'rejected'})
        append_status_history(r_ref, 'rejected', request.user.get('uid', 'admin'), 'Rejected via Suspicious Flag')
        log_admin_action(db, request.user.get('uid', 'admin'), 'REJECT_REPORT', report_id, 'Rejected via Suspicious Flag')
    elif action == 'flag_user':
        flag_ref.update({'status': 'resolved'})
        u_ref = db.collection('users').document(data.get('userId'))
        u_ref.update({'flagged': True})
        log_admin_action(db, request.user.get('uid', 'admin'), 'FLAG_USER', report_id, f"Flagged user {data.get('userId')}")
    else:
        return jsonify({'error': 'Invalid action'}), 400
        
    return jsonify({'success': True}), 200

@admin_bp.route('/reports/<report_id>/verify', methods=['POST'])
@require_admin
def verify_report(report_id):
    db = firestore.client()
    report_ref = db.collection('reports').document(report_id)
    report = report_ref.get()
    
    if not report.exists:
        return jsonify({'error': 'Report not found'}), 404
        
    report_data = report.to_dict()
    if report_data.get('status') == 'verified':
        return jsonify({'error': 'Already verified'}), 400
        
    report_ref.update({'status': 'verified'})
    append_status_history(report_ref, 'verified', request.user.get('uid', 'admin'), 'Admin manual verification')
    
    user_id = report_data.get('userId')
    if user_id:
        base = reward_service.points_verified
        bonus = 0
        if report_data.get('severity') in ['critical', 'high']:
            bonus += 50
        
        awarded = 0
        tx1 = reward_service.award_points(db, user_id, report_id, base, 'Verified Report')
        if tx1: awarded += base
        if bonus > 0:
            tx2 = reward_service.award_points(db, user_id, report_id, bonus, 'High Severity Bonus')
            if tx2: awarded += bonus
            
        report_ref.update({'pointsAwarded': awarded})
        gamification_service.evaluate_achievements(db, user_id)
        create_notification(db, user_id, 'VERIFIED', 'Report Verified', 'Your pothole report has been verified by an administrator!', report_id)
        log_admin_action(db, request.user.get('uid', 'admin'), 'VERIFY_REPORT', report_id, 'Verified report manually')
        
    return jsonify({'status': 'verified', 'reportId': report_id}), 200

@admin_bp.route('/reports/<report_id>/reject', methods=['POST'])
@require_admin
def reject_report(report_id):
    data = request.get_json() or {}
    reason = data.get('reason', 'invalid')
    
    db = firestore.client()
    report_ref = db.collection('reports').document(report_id)
    doc = report_ref.get()
    if not doc.exists:
        return jsonify({'error': 'Report not found'}), 404
    
    report_dict = doc.to_dict()
    report_ref.update({'status': reason})
    append_status_history(report_ref, reason, request.user.get('uid', 'admin'), 'Admin manual action')
    create_notification(db, report_dict.get('userId'), 'REJECTED', 'Report Rejected', f'Your report was rejected. Reason: {reason}', report_id)
    log_admin_action(db, request.user.get('uid', 'admin'), 'REJECT_REPORT', report_id, f'Rejected with reason: {reason}')
    
    return jsonify({'status': 'rejected', 'reportId': report_id, 'reason': reason}), 200

@admin_bp.route('/analytics', methods=['GET'])
@require_admin
def get_analytics():
    db = firestore.client()
    
    reports = db.collection('reports').get()
    users = db.collection('users').get()
    
    total_citizens = len(users)
    total_reports = len(reports)
    
    verified = 0
    pending = 0
    suspicious = 0
    
    severity_breakdown = {'critical': 0, 'high': 0, 'medium': 0, 'low': 0}
    area_breakdown = {}
    
    total_potholes = 0
    
    parsed_reports = []
    for r in reports:
        d = r.to_dict()
        d['id'] = r.id
        parsed_reports.append(d)
        
    parsed_reports.sort(key=lambda x: str(x.get('date') or x.get('createdAt') or ''), reverse=True)
    
    for r in parsed_reports:
        st = r.get('status', 'pending')
        if st == 'verified': verified += 1
        elif st == 'pending': pending += 1
        elif st == 'suspicious': suspicious += 1
        
        sev = r.get('severity', 'low').lower()
        if sev in severity_breakdown:
            severity_breakdown[sev] += 1
            
        area = r.get('area') or 'Unknown'
        if area not in area_breakdown: area_breakdown[area] = 0
        area_breakdown[area] += 1
        
        try:
            total_potholes += int(r.get('potholeCount', 0) or 0)
        except:
            pass
            
    recent_reports = parsed_reports[:5]
    
    sorted_areas = [{'name': k, 'value': v, 'area': k, 'count': v} for k, v in area_breakdown.items()]
    sorted_areas.sort(key=lambda x: x['value'], reverse=True)
    
    map_points = []
    for r in parsed_reports[:50]:
        if 'coords' in r and r['coords'] is not None:
            map_points.append({
                'id': r.get('id'),
                'coords': r.get('coords'),
                'severity': r.get('severity', 'low'),
                'status': r.get('status', 'pending')
            })

    from datetime import datetime, timedelta
    dates = [(datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(7, -1, -1)]
    
    # Real data aggregation
    reportTrends = [{'date': d, 'total': 0, 'verified': 0} for d in dates]
    participation = [{'date': d, 'newUsers': 0} for d in dates]
    rewardDistribution = [{'date': d, 'points': 0} for d in dates]
    
    # Process reports for trends
    for r in parsed_reports:
        d_str = str(r.get('date') or r.get('createdAt') or '')[:10]
        for rt in reportTrends:
            if rt['date'] == d_str:
                rt['total'] += 1
                if r.get('status') == 'verified':
                    rt['verified'] += 1
        
        for rd in rewardDistribution:
            if rd['date'] == d_str:
                rd['points'] += int(r.get('pointsAwarded') or 0)
                
    # Process users for participation
    for u in users:
        ud = u.to_dict()
        d_str = str(ud.get('createdAt') or '')[:10]
        for p in participation:
            if p['date'] == d_str:
                p['newUsers'] += 1

    # Real AI stats
    total_detections = sum(int(r.get('potholeCount') or 0) for r in parsed_reports)
    confidences = [int(r.get('confidence') or 0) for r in parsed_reports if r.get('confidence')]
    avg_confidence = sum(confidences) // len(confidences) if confidences else 0
    total_rewards = sum(int(r.get('pointsAwarded') or 0) for r in parsed_reports)

    return jsonify({
        'totalReports': total_reports,
        'verifiedReports': verified,
        'totalVerified': verified,
        'pendingReports': pending,
        'suspiciousReports': suspicious,
        'totalCitizens': total_citizens,
        'totalPotholes': total_potholes,
        'severityBreakdown': [
            {'name': 'Critical', 'value': severity_breakdown['critical']},
            {'name': 'High', 'value': severity_breakdown['high']},
            {'name': 'Medium', 'value': severity_breakdown['medium']},
            {'name': 'Low', 'value': severity_breakdown['low']}
        ],
        'areaBreakdown': sorted_areas[:5],
        'recentReports': recent_reports,
        'mapOverview': map_points,
        'reportTrends': reportTrends,
        'participation': participation,
        'rewardDistribution': rewardDistribution,
        'aiStats': {
            'totalDetections': total_detections,
            'avgConfidence': avg_confidence,
            'successRate': int((verified / total_reports * 100)) if total_reports > 0 else 0,
            'avgProcessingTime': 240 # Static as we don't store inference time in DB for all
        },
        'totalRewards': total_rewards
    }), 200






