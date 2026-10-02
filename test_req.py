import urllib.request
import time

try:
    start = time.time()
    req = urllib.request.Request('https://roadguard-tqed.onrender.com/api/admin/analytics', headers={'User-Agent': 'Mozilla/5.0'})
    response = urllib.request.urlopen(req, timeout=15)
    print("STATUS:", response.status)
    print("BODY:", response.read().decode('utf-8'))
except Exception as e:
    print("ERROR:", e)
print(f"Took {time.time()-start:.2f} seconds")