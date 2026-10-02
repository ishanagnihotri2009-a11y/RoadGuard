import urllib.request
import os
import json
from ai.detector import PotholeDetector

def run_tests():
    print("Initializing YOLO detector (will download yolov8n.pt if missing)...")
    detector = PotholeDetector('yolov8n.pt')
    
    # Create test images
    img_url = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=400&fit=crop'
    test_img = 'test_pothole.jpg'
    print(f"Downloading test image...")
    urllib.request.urlretrieve(img_url, test_img)
    
    print("\n--- TEST 1: Valid Image ---")
    res1 = detector.analyze(test_img)
    print(json.dumps(res1, indent=2))
    
    print("\n--- TEST 2: Invalid Image ---")
    # write bad file
    with open('bad_image.jpg', 'w') as f:
        f.write('this is not an image')
    res2 = detector.analyze('bad_image.jpg')
    print(json.dumps(res2, indent=2))
    
    print("\nTests complete.")

if __name__ == '__main__':
    run_tests()