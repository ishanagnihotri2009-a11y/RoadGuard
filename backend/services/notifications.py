from datetime import datetime
from google.cloud import firestore

def create_notification(db, user_id, type_str, title, message, related_report_id=None):
    if not user_id: return
    db.collection('notifications').add({
        'userId': user_id,
        'type': type_str,
        'title': title,
        'message': message,
        'read': False,
        'createdAt': datetime.now().isoformat(),
        'relatedReportId': related_report_id
    })