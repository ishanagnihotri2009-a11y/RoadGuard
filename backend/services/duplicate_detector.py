import math
import os
from datetime import datetime

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371e3 # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi/2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda/2.0)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    return R * c

class DuplicateDetector:
    def __init__(self):
        self.radius_m = float(os.environ.get('DUPLICATE_RADIUS_METERS', 100.0))

    def check_for_duplicates(self, new_report, existing_reports):
        new_coords = new_report.get('coords')
        if not new_coords:
            return None
            
        new_lat = new_coords.get('lat')
        new_lng = new_coords.get('lng')
        
        closest_dist = float('inf')
        closest_report = None
        
        for rep in existing_reports:
            # Skip self
            if rep.get('id') == new_report.get('id'):
                continue
                
            status = rep.get('status')
            if status in ['invalid', 'duplicate', 'rejected']:
                continue
                
            coords = rep.get('coords')
            if not coords:
                continue
                
            try:
                dist = calculate_distance(float(new_lat), float(new_lng), float(coords.get('lat')), float(coords.get('lng')))
                if dist < self.radius_m and dist < closest_dist:
                    closest_dist = dist
                    closest_report = rep
            except (TypeError, ValueError):
                continue
                
        if closest_report:
            return {
                'isDuplicate': True,
                'originalReportId': closest_report.get('id'),
                'distanceMeters': round(closest_dist, 2),
                'reason': 'Geographic proximity within {}m (Actual: {}m)'.format(self.radius_m, round(closest_dist, 2)),
                'detectedAt': datetime.now().isoformat()
            }
            
        return None

duplicate_detector = DuplicateDetector()