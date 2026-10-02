def estimate_severity(detections, image_shape):
    if not detections:
        return "Low"

    img_height, img_width = image_shape[:2]
    img_area = img_height * img_width
    max_severity = 0
    
    for det in detections:
        box = det['box']
        box_area = (box[2] - box[0]) * (box[3] - box[1])
        ratio = box_area / img_area
        
        if ratio > 0.15:
            severity_score = 3
        elif ratio > 0.05:
            severity_score = 2
        elif ratio > 0.01:
            severity_score = 1
        else:
            severity_score = 0
            
        max_severity = max(max_severity, severity_score)

    mapping = {0: "Low", 1: "Medium", 2: "High", 3: "Critical"}
    return mapping.get(max_severity, "Low")

def generate_depth_estimate_disclaimer():
    return "NOTE: Depth and physical size are heuristic estimates based on 2D image ratio. Single-camera systems cannot measure true physical depth accurately."