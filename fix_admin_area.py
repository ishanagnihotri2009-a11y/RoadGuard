with open('backend/routes/admin.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    "area = r.get('area', 'Unknown')",
    "area = r.get('area') or 'Unknown'"
)

with open('backend/routes/admin.py', 'w', encoding='utf-8') as f:
    f.write(code)