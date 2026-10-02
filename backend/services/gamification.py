import os
from datetime import datetime
from firebase_admin import firestore

TIERS = [
    {'name': 'Rookie', 'min': int(os.environ.get('TIER_ROOKIE_MIN', 0))},
    {'name': 'Reporter', 'min': int(os.environ.get('TIER_REPORTER_MIN', 500))},
    {'name': 'Watcher', 'min': int(os.environ.get('TIER_WATCHER_MIN', 1500))},
    {'name': 'Guardian', 'min': int(os.environ.get('TIER_GUARDIAN_MIN', 3000))},
    {'name': 'Legend', 'min': int(os.environ.get('TIER_LEGEND_MIN', 5000))}
]

ACHIEVEMENTS_CONFIG = {
    'first_report': {'title': 'First Report', 'desc': 'Submit your first pothole report.'},
    '10_reports': {'title': '10 Reports', 'desc': 'Submit 10 pothole reports.'},
    '50_reports': {'title': '50 Reports', 'desc': 'Submit 50 pothole reports.'},
    '100_verified': {'title': '100 Verified Reports', 'desc': 'Get 100 reports verified.'},
    'high_accuracy': {'title': 'High Accuracy Reporter', 'desc': 'Maintain over 90% verification rate on 20+ reports.'},
    'community_contributor': {'title': 'Community Contributor', 'desc': 'Earn 1000 points.'},
    'top_reporter': {'title': 'Top Reporter', 'desc': 'Earn 2500 points.'},
    'road_guardian': {'title': 'Road Guardian', 'desc': 'Reach the Legend tier.'}
}

class GamificationService:
    def evaluate_achievements(self, db, user_id):
        user_ref = db.collection('users').document(user_id)
        user = user_ref.get().to_dict()
        if not user: return
        
        # Calculate stats
        reports_ref = db.collection('reports').where('userId', '==', user_id).get()
        total_reports = len(reports_ref)
        verified_reports = len([r for r in reports_ref if r.to_dict().get('status') == 'verified'])
        points = user.get('points', 0)
        
        # Evaluate Tier
        current_tier = 'Rookie'
        for t in reversed(TIERS):
            if points >= t['min']:
                current_tier = t['name']
                break
                
        user_ref.update({
            'tier': current_tier,
            'totalReports': total_reports,
            'verifiedReports': verified_reports
        })
        
        # Check achievements
        earned_achievements_ref = db.collection('user_achievements').where('userId', '==', user_id).get()
        earned_keys = [a.to_dict().get('achievementId') for a in earned_achievements_ref]
        
        def award(ach_id):
            if ach_id not in earned_keys:
                db.collection('user_achievements').add({
                    'userId': user_id,
                    'achievementId': ach_id,
                    'title': ACHIEVEMENTS_CONFIG[ach_id]['title'],
                    'description': ACHIEVEMENTS_CONFIG[ach_id]['desc'],
                    'awardedAt': datetime.now().isoformat()
                })
        
        if total_reports >= 1: award('first_report')
        if total_reports >= 10: award('10_reports')
        if total_reports >= 50: award('50_reports')
        if verified_reports >= 100: award('100_verified')
        
        if total_reports >= 20 and (verified_reports / total_reports) >= 0.9:
            award('high_accuracy')
            
        if points >= 1000: award('community_contributor')
        if points >= 2500: award('top_reporter')
        if current_tier == 'Legend': award('road_guardian')

gamification_service = GamificationService()
