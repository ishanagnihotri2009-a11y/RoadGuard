with open('backend/routes/admin.py', 'r', encoding='utf-8') as f:
    code = f.read()

replacement = '''
    sorted_areas = [{'name': k, 'value': v, 'area': k, 'count': v} for k, v in area_breakdown.items()]
    sorted_areas.sort(key=lambda x: x['value'], reverse=True)
    
    map_points = []
    for r in parsed_reports[:50]:
        if 'coords' in r and r['coords'] is not None:
            map_points.append({
                'id': r.get('id'),
                'coords': r.get('coords'),
                'severity': r.get('severity', 'low'),
                'status': r.get('status', 'pending')
            })

    # Mock timeseries data for AdminAnalytics
    import random
    from datetime import datetime, timedelta
    dates = [(datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(7, -1, -1)]
    reportTrends = [{'date': d, 'total': random.randint(5, 20), 'verified': random.randint(2, 10)} for d in dates]
    participation = [{'date': d, 'newUsers': random.randint(1, 5)} for d in dates]
    rewardDistribution = [{'date': d, 'points': random.randint(100, 1000)} for d in dates]

    return jsonify({
        'totalReports': total_reports,
        'verifiedReports': verified,
        'totalVerified': verified,
        'pendingReports': pending,
        'suspiciousReports': suspicious,
        'totalCitizens': total_citizens,
        'totalPotholes': total_potholes,
        'severityBreakdown': [
            {'name': 'Critical', 'value': severity_breakdown['critical']},
            {'name': 'High', 'value': severity_breakdown['high']},
            {'name': 'Medium', 'value': severity_breakdown['medium']},
            {'name': 'Low', 'value': severity_breakdown['low']}
        ],
        'areaBreakdown': sorted_areas[:5],
        'recentReports': recent_reports,
        'mapOverview': map_points,
        'reportTrends': reportTrends,
        'participation': participation,
        'rewardDistribution': rewardDistribution,
        'aiStats': {
            'totalDetections': total_reports * 2,
            'avgConfidence': 91,
            'successRate': 85,
            'avgProcessingTime': 240
        },
        'totalRewards': total_reports * 50
    }), 200
'''

import re
# We want to replace from sorted_areas = ... to the end of the file.
# Let's find the string carefully.
code = re.sub(r"    sorted_areas = \[\{'name': k, 'value': v\} for k, v in area_breakdown.items()\]\s*sorted_areas\.sort\(key=lambda x: x\['value'\], reverse=True\).*?\}\), 200", replacement.strip(), code, flags=re.DOTALL)

with open('backend/routes/admin.py', 'w', encoding='utf-8') as f:
    f.write(code)