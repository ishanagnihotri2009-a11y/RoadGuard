import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    cred = credentials.Certificate('backend/serviceAccountKey.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()
users = db.collection('users').get()
print('Total users:', len(users))
for u in users:
    print(u.id, u.to_dict())