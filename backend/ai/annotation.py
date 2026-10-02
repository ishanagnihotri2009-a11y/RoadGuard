import cv2

def annotate_image(image, detections):
    annotated = image.copy()
    for det in detections:
        box = det['box']
        conf = det['confidence']
        class_name = det.get('class_name', 'Pothole')
        x1, y1, x2, y2 = map(int, box)
        
        cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 0, 255), 2)
        label = f"{class_name} {conf:.2f}"
        (w, h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
        cv2.rectangle(annotated, (x1, y1 - 20), (x1 + w, y1), (0, 0, 255), -1)
        cv2.putText(annotated, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
    return annotated

def save_annotated_image(annotated_image, output_path):
    cv2.imwrite(output_path, annotated_image)
    return output_path