import requests

BASE_URL = 'http://localhost:5000/api'

def test_unauthorized_admin():
    print('Testing unauthorized admin access...')
    # Hitting an admin route without token
    r = requests.get(f'{BASE_URL}/admin/analytics')
    if r.status_code in [401, 403]:
        print('PASS: Unauthorized admin blocked')
    else:
        print(f'FAIL: Unauthorized admin got {r.status_code}')
        
def test_missing_report_id():
    print('Testing process_report with missing ID...')
    r = requests.post(f'{BASE_URL}/reports/process', json={})
    if r.status_code in [400, 401]:
        print('PASS: Missing ID or missing Auth blocked')
    else:
        print(f'FAIL: Got {r.status_code}')

if __name__ == '__main__':
    test_unauthorized_admin()
    test_missing_report_id()