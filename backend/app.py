import os
import firebase_admin
from firebase_admin import credentials, firestore
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from config import Config

def create_app():
    app = Flask(__name__)
    os.makedirs('uploads', exist_ok=True)
    @app.route('/uploads/<path:filename>')
    def serve_uploads(filename):
        return send_from_directory('uploads', filename)
    
    limiter = Limiter(get_remote_address, app=app, default_limits=['200 per day', '50 per hour'])
    app.config.from_object(Config)
    
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})
    
    if not firebase_admin._apps:
        cred_path = app.config.get('FIREBASE_CREDENTIALS_PATH')
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred, {'storageBucket': os.environ.get('FIREBASE_STORAGE_BUCKET')})
        else:
            try:
                firebase_admin.initialize_app(options={'storageBucket': os.environ.get('FIREBASE_STORAGE_BUCKET')})
            except Exception as e:
                print(f"Warning: Firebase Admin initialization failed without credentials: {e}")
            
    from routes.reports import reports_bp
    from routes.admin import admin_bp
    
    app.register_blueprint(reports_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'ok', 'message': 'RoadGuard Backend is running'}), 200

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad Request', 'message': str(error)}), 400

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal Server Error', 'message': str(error)}), 500

    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


