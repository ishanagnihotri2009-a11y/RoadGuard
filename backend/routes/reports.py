import os
import uuid
import urllib.request
from datetime import datetime
from flask import Blueprint, request, jsonify
from utils.auth import require_auth
from firebase_admin import firestore, storage
from ai.detector import PotholeDetector
from services.duplicate_detector import duplicate_detector
from services.suspicious_monitor import analyze_report
from services.gamification import gamification_service
from services.notifications import create_notification
from utils.history import append_status_history
from services.gamification import gamification_service
from services.notifications import create_notification

reports_bp = Blueprint('reports', __name__)
detector = None

def get_detector():
    global detector
    if detector is None:
        detector = PotholeDetector()
    return detector

@reports_bp.route('/analyze', methods=['POST'])
@require_auth
def analyze():
    return jsonify({'status': 'analyze_queued'}), 200

@reports_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        db = firestore.client()
        # Top 100 users ordered by points
        users_ref = db.collection('users').order_by('points', direction=firestore.Query.DESCENDING).limit(100).stream()
        leaderboard = []
        for i, u in enumerate(users_ref):
            d = u.to_dict()
            leaderboard.append({
                'id': u.id,
                'name': d.get('name', 'Anonymous'),
                'points': d.get('points', 0),
                'tier': d.get('tier', 'Rookie'),
                'totalReports': d.get('totalReports', 0),
                'verifiedReports': d.get('verifiedReports', 0),
                'rank': i + 1
            })
        return jsonify(leaderboard), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def analyze():
    return jsonify({'status': 'analyze_queued'}), 200

@reports_bp.route('/reports/process', methods=['POST'])
@require_auth
def process_report():
    data = request.get_json() or {}
    report_id = data.get('reportId')
    if not report_id:
        return jsonify({'error': 'Missing reportId'}), 400
        
    db = firestore.client()
    report_ref = db.collection('reports').document(report_id)
    report = report_ref.get()
    
    if not report.exists:
        return jsonify({'error': 'Report not found'}), 404
        
    report_data = report.to_dict()
    
    if report_data.get('userId') != request.user['uid']:
        user_doc = db.collection('users').document(request.user['uid']).get()
        if not user_doc.exists or user_doc.to_dict().get('role') != 'admin':
            return jsonify({'error': 'Forbidden'}), 403

    report_ref.update({'status': 'processing'})
    append_status_history(report_ref, 'processing', 'system', 'AI pipeline started')
    
    image_url = report_data.get('imageUrl')
    if not image_url or not (image_url.startswith('https://firebasestorage.googleapis.com/') or image_url.startswith('https://i.ibb.co/') or image_url.startswith('http://localhost')): 
        report_ref.update({'status': 'pending', 'aiError': 'Invalid image source'})
        return jsonify({'error': 'Invalid image URL'}), 400
    if not image_url:
        report_ref.update({'status': 'pending', 'aiError': 'No image URL found'})
        return jsonify({'error': 'No image URL'}), 400
        
    temp_img_path = f"/tmp/temp_in_{uuid.uuid4().hex}.jpg"
    try:
        urllib.request.urlretrieve(image_url, temp_img_path)
    except Exception as e:
        report_ref.update({'status': 'pending', 'aiError': f'Failed to download image: {str(e)}'})
        return jsonify({'error': 'Image download failed'}), 500

    try:
        det = get_detector()
        start_time = datetime.now()
        ai_result = det.analyze(temp_img_path, output_dir="/tmp")
        inference_ms = int((datetime.now() - start_time).total_seconds() * 1000)
    except Exception as e:
        if os.path.exists(temp_img_path): os.remove(temp_img_path)
        report_ref.update({'status': 'pending', 'aiError': f'AI Inference failed: {str(e)}'})
        return jsonify({'error': 'AI Inference failed', 'details': str(e)}), 500
        
    if ai_result.get('error'):
        if os.path.exists(temp_img_path): os.remove(temp_img_path)
        report_ref.update({'status': 'pending', 'aiError': ai_result['error']})
        return jsonify({'error': 'AI processing error', 'details': ai_result['error']}), 500
        
    annotated_url = ""
    imgbb_err = ""
    if ai_result.get('annotatedImagePath') and os.path.exists(ai_result['annotatedImagePath']):
        try:
            import cv2
            import base64
            img = cv2.imread(ai_result['annotatedImagePath'])
            
            # Resize to max 1280px width to save space
            h, w = img.shape[:2]
            if w > 1280:
                ratio = 1280 / w
                img = cv2.resize(img, (1280, int(h * ratio)))
                
            # Compress to JPEG
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 65]
            success, encimg = cv2.imencode('.jpg', img, encode_param)
            
            if success:
                b64 = base64.b64encode(encimg).decode('utf-8')
                data_uri = f"data:image/jpeg;base64,{b64}"
                if len(data_uri) < 900000: # Ensure < 900KB
                    annotated_url = data_uri
                else:
                    imgbb_err = f"Image too large for Firestore: {len(data_uri)} bytes"
        except Exception as e:
            imgbb_err = f"Base64 Exception: {str(e)}"
        
        try:
            os.remove(ai_result['annotatedImagePath'])
        except: pass
        
    try:
        os.remove(temp_img_path)
    except: pass

    active_reports_ref = db.collection('reports').where('status', 'in', ['verified', 'under_review']).stream()
    active_reports = []
    for r in active_reports_ref:
        rd = r.to_dict()
        rd['id'] = r.id
        active_reports.append(rd)
        
    report_data['id'] = report_id
    dup_result = duplicate_detector.check_for_duplicates(report_data, active_reports)
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
        'annotatedImageUrl': annotated_url, 'imgbbError': imgbb_err,
        'processedAt': datetime.now().isoformat(),
        'aiData': {
            'model': 'YOLOv8-Pothole (or yolov8n fallback)',
            'inferenceMs': inference_ms,
            'disclaimer': ai_result.get('disclaimer', '')
        }
    }
    
    # Award points if auto-verified
    if final_status == 'verified':
        from services.rewards import reward_service
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


    
    report_ref.update(update_data)
    append_status_history(report_ref, final_status, 'system', 'AI pipeline finished')
    gamification_service.evaluate_achievements(db, report_data.get('userId'))
    
    
    
    return jsonify({'status': 'ai_processed', 'reportId': report_id}), 200

@reports_bp.route('/reports/<report_id>', methods=['GET'])
@require_auth
def get_report(report_id):
    db = firestore.client()
    report = db.collection('reports').document(report_id).get()
    if not report.exists:
        return jsonify({'error': 'Report not found'}), 404
        
    data = report.to_dict()
    is_owner = data.get('userId') == request.user['uid']
    is_verified = data.get('status') in ['verified', 'under_review', 'ai_processed']
    
    if not (is_owner or is_verified):
        user_doc = db.collection('users').document(request.user['uid']).get()
        if not user_doc.exists or user_doc.to_dict().get('role') != 'admin':
            return jsonify({'error': 'Forbidden'}), 403

    return jsonify(data), 200





@reports_bp.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image provided'}), 400
    
    import uuid
    ext = file.filename.split('.')[-1]
    if ext.lower() not in ['jpg', 'jpeg', 'png']: ext = 'jpg'
    filename = f"report_{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join('uploads', filename)
    file.save(filepath)
    
    return jsonify({'url': f"http://localhost:5000/uploads/{filename}"}), 200







