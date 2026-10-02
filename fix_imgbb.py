import re

with open('backend/routes/reports.py', 'r', encoding='utf-8') as f:
    code = f.read()

replacement = '''        try:
            import requests
            imgbb_key = os.environ.get('IMGBB_API_KEY')
            if imgbb_key:
                with open(ai_result['annotatedImagePath'], 'rb') as img_file:
                    res = requests.post(
                        f"https://api.imgbb.com/1/upload?key={imgbb_key}",
                        files={"image": img_file}
                    )
                if res.status_code == 200:
                    annotated_url = res.json()['data']['url']
            else:
                print("Warning: IMGBB_API_KEY not set.")
        except Exception as e:
            print(f"Warning: Failed to upload annotated image to ImgBB: {e}")'''

# We need to find the old try block that we replaced earlier.
# The old block was:
#        try:
#            import shutil
#            fname = f"anno_{report_id}_{uuid.uuid4().hex}.jpg"
#            dest = os.path.join("uploads", fname)
#            shutil.copy2(ai_result['annotatedImagePath'], dest)
#            annotated_url = f"http://localhost:5000/uploads/{fname}"
#        except Exception as e:
#            print(f"Warning: Failed to copy annotated image: {e}")

code = re.sub(r'        try:\n            import shutil.*?print\(f"Warning: Failed to copy annotated image: \{e\}"\)', replacement, code, flags=re.DOTALL)

with open('backend/routes/reports.py', 'w', encoding='utf-8') as f:
    f.write(code)