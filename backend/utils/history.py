from datetime import datetime
from firebase_admin import firestore

def append_status_history(report_ref, new_status, changed_by, reason=""):
    history_entry = {
        'status': new_status,
        'timestamp': datetime.now().isoformat(),
        'changedBy': changed_by,
        'reason': reason
    }
    report_ref.update({
        'statusHistory': firestore.ArrayUnion([history_entry])
    })