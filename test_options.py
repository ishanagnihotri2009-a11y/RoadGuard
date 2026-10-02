import urllib.request
import time

try:
    req = urllib.request.Request(
        'https://roadguard-tqed.onrender.com/api/admin/analytics',
        method='OPTIONS',
        headers={
            'Origin': 'https://road-guard-ochre.vercel.app',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Authorization'
        }
    )
    start = time.time()
    response = urllib.request.urlopen(req, timeout=30)
    print("STATUS:", response.status)
    print("HEADERS:", response.headers)
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print("HEADERS:", e.headers)
except Exception as e:
    print("ERROR:", e)