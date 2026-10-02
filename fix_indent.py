with open('backend/routes/admin.py', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("from datetime import datetime, timedelta\n    dates =", "    from datetime import datetime, timedelta\n    dates =")

with open('backend/routes/admin.py', 'w', encoding='utf-8') as f:
    f.write(code)