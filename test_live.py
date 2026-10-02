import urllib.request
import json
import time

try:
    req = urllib.request.Request(
        'https://roadguard-tqed.onrender.com/api/admin/analytics',
        headers={
            'User-Agent': 'Mozilla/5.0',
            'Origin': 'https://road-guard-ochre.vercel.app',
            'Authorization': 'Bearer test-token'
        }
    )
    start = time.time()
    response = urllib.request.urlopen(req, timeout=30)
    print("STATUS:", response.status)
    print("HEADERS:", response.headers)
    print("BODY:", response.read().decode('utf-8')[:200])
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print("HEADERS:", e.headers)
    print("BODY:", e.read().decode('utf-8')[:200])
except Exception as e:
    print("ERROR:", e)
print(f"Took {time.time()-start:.2f} seconds")