with open('src/pages/admin/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    'url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"',
    'url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"'
)

with open('src/pages/admin/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(code)