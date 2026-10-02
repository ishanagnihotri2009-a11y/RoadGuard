with open('backend/routes/admin.py', 'r', encoding='utf-8') as f:
    code = f.read()

replacement = '''
    db = firestore.client()
    report_ref = db.collection('reports').document(report_id)
    doc = report_ref.get()
    if not doc.exists:
        return jsonify({'error': 'Report not found'}), 404
    
    report_dict = doc.to_dict()
    report_ref.update({'status': reason})
'''

code = code.replace('''
    db = firestore.client()
    report_ref = db.collection('reports').document(report_id)
    if not report_ref.get().exists:
        return jsonify({'error': 'Report not found'}), 404
        
    report_ref.update({'status': reason})
'''.strip(), replacement.strip())

with open('backend/routes/admin.py', 'w', encoding='utf-8') as f:
    f.write(code)