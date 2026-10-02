import requests
try:
    # Actually wait, the backend requires a valid Firebase Auth token, 
    # we can't easily mock it unless we bypass it.
    print('Testing skipped because of require_admin middleware')
except Exception as e:
    print(e)