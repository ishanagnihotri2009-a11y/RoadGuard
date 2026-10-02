import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime

if not firebase_admin._apps:
    cred = credentials.Certificate('backend/serviceAccountKey.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()

try:
    user = auth.create_user(
        email='admin@roadguard.com',
        email_verified=True,
        password='admin123',
        display_name='System Admin'
    )
    
    db.collection('users').document(user.uid).set({
        'email': 'admin@roadguard.com',
        'name': 'System Admin',
        'role': 'admin',
        'createdAt': datetime.now().isoformat()
    })
    print("Admin created successfully!")
except Exception as e:
    print("Error:", e)
