with open('backend/routes/admin.py', 'r', encoding='utf-8') as f:
    code = f.read()

replacement = '''
    from datetime import datetime, timedelta
    dates = [(datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d') for i in range(7, -1, -1)]
    
    # Real data aggregation
    reportTrends = [{'date': d, 'total': 0, 'verified': 0} for d in dates]
    participation = [{'date': d, 'newUsers': 0} for d in dates]
    rewardDistribution = [{'date': d, 'points': 0} for d in dates]
    
    # Process reports for trends
    for r in parsed_reports:
        d_str = str(r.get('date') or r.get('createdAt') or '')[:10]
        for rt in reportTrends:
            if rt['date'] == d_str:
                rt['total'] += 1
                if r.get('status') == 'verified':
                    rt['verified'] += 1
        
        for rd in rewardDistribution:
            if rd['date'] == d_str:
                rd['points'] += int(r.get('pointsAwarded') or 0)
                
    # Process users for participation
    for u in users:
        ud = u.to_dict()
        d_str = str(ud.get('createdAt') or '')[:10]
        for p in participation:
            if p['date'] == d_str:
                p['newUsers'] += 1

    # Real AI stats
    total_detections = sum(int(r.get('potholeCount') or 0) for r in parsed_reports)
    confidences = [int(r.get('confidence') or 0) for r in parsed_reports if r.get('confidence')]
    avg_confidence = sum(confidences) // len(confidences) if confidences else 0
    total_rewards = sum(int(r.get('pointsAwarded') or 0) for r in parsed_reports)

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
            'totalDetections': total_detections,
            'avgConfidence': avg_confidence,
            'successRate': int((verified / total_reports * 100)) if total_reports > 0 else 0,
            'avgProcessingTime': 240 # Static as we don't store inference time in DB for all
        },
        'totalRewards': total_rewards
    }), 200
'''

import re
code = re.sub(r"    import random.*?\}\), 200", replacement.strip(), code, flags=re.DOTALL)

with open('backend/routes/admin.py', 'w', encoding='utf-8') as f:
    f.write(code)