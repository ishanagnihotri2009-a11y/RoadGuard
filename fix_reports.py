import re

with open('backend/routes/reports.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
'''        try:
            bucket = storage.bucket()
            blob_path = f"annotations/{report_id}_{uuid.uuid4().hex}.jpg"
            blob = bucket.blob(blob_path)
            blob.upload_from_filename(ai_result['annotatedImagePath'], content_type='image/jpeg')
            blob.make_public()
            annotated_url = blob.public_url
        except Exception as e:
            print(f"Warning: Failed to upload annotated image: {e}")''',
'''        try:
            import shutil
            fname = f"anno_{report_id}_{uuid.uuid4().hex}.jpg"
            dest = os.path.join("uploads", fname)
            shutil.copy2(ai_result['annotatedImagePath'], dest)
            annotated_url = f"http://localhost:5000/uploads/{fname}"
        except Exception as e:
            print(f"Warning: Failed to copy annotated image: {e}")'''
)

upload_route = '''
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
'''

if '@reports_bp.route(\'/upload\'' not in code:
    code += upload_route

with open('backend/routes/reports.py', 'w', encoding='utf-8') as f:
    f.write(code)