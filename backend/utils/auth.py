from functools import wraps
from flask import request, jsonify
from firebase_admin import auth, firestore

def verify_token(req):
    auth_header = req.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split('Bearer ')[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Token verification error: {e}")
        return None

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        decoded_token = verify_token(request)
        if not decoded_token:
            return jsonify({'error': 'Unauthorized'}), 401
        request.user = decoded_token
        return f(*args, **kwargs)
    return decorated_function

def require_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        decoded_token = verify_token(request)
        if not decoded_token:
            return jsonify({'error': 'Unauthorized'}), 401
        
        db = firestore.client()
        user_ref = db.collection('users').document(decoded_token['uid']).get()
        if not user_ref.exists or user_ref.to_dict().get('role') != 'admin':
            if not decoded_token.get('admin'):
                return jsonify({'error': 'Forbidden - Admin access required'}), 403
        
        request.user = decoded_token
        return f(*args, **kwargs)
    return decorated_function