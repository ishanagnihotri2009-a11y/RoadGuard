import os
from datetime import datetime
from firebase_admin import firestore

class RewardService:
    def __init__(self):
        self.points_verified = int(os.environ.get('REWARD_VERIFIED', 100))
        self.points_valid = int(os.environ.get('REWARD_VALID', 50))

    def award_points(self, db, user_id, report_id, amount, reason):
        if amount <= 0:
            return None
            
        # Prevent duplicate transactions for the exact same event
        existing_txs = db.collection('rewards').where('reportId', '==', report_id).where('reason', '==', reason).get()
        if len(existing_txs) > 0:
            return None
            
        tx_data = {
            'userId': user_id,
            'reportId': report_id,
            'amount': amount,
            'reason': reason,
            'createdAt': datetime.now().isoformat()
        }
        
        db.collection('rewards').add(tx_data)
        
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        if user_doc.exists:
            user_ref.update({
                'points': firestore.Increment(amount),
                'verifiedReports': firestore.Increment(1 if 'Verified' in reason else 0)
            })
        
        return tx_data

reward_service = RewardService()
