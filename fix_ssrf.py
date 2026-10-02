import re

with open('backend/routes/reports.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the SSRF check
code = code.replace(
    "if not image_url or not image_url.startswith('https://firebasestorage.googleapis.com/'):",
    "if not image_url or not (image_url.startswith('https://firebasestorage.googleapis.com/') or image_url.startswith('https://i.ibb.co/') or image_url.startswith('http://localhost')): "
)

with open('backend/routes/reports.py', 'w', encoding='utf-8') as f:
    f.write(code)