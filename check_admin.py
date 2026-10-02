import firebase_admin
from firebase_admin import credentials, firestore, auth

if not firebase_admin._apps:
    cred = credentials.Certificate('backend/serviceAccountKey.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()
users = db.collection('users').where('role', '==', 'admin').get()
for u in users:
    print(u.id, u.to_dict())

try:
    user = auth.get_user_by_email('admin@roadguard.com')
    print('Auth user exists:', user.uid)
except Exception as e:
    print('Auth error:', e)