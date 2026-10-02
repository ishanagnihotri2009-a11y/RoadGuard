# RoadGuard AI Processing Service

This directory contains the AI processing pipeline for RoadGuard, powering the pothole detection and severity estimation engine.

## Pipeline Overview
The processing pipeline follows these steps:
1. **Loading:** Uploaded image paths/bytes are parsed.
2. **Preprocessing:** Converted into an OpenCV NumPy matrix.
3. **YOLO Inference:** Passed into the configured YOLOv8 object detection model.
4. **Data Extraction:** Bounding boxes, confidence scores, and class labels are extracted.
5. **Counting:** Total pothole count is calculated.
6. **Severity Estimation:** An estimate (Low/Medium/High/Critical) is produced using a 2D bounding box area ratio heuristic. Note: Single-lens camera systems cannot determine true physical depth accurately without stereo vision or LiDAR.
7. **Annotation:** Bounding boxes and scores are drawn directly onto the image.

## Model Configuration & Weights
The system uses ultralytics and requires a PyTorch weights file (.pt). 

By default, the system looks for yolov8n.pt. If this specific file is provided, it will use it (which detects general COCO objects like cars and people). If it is missing, ultralytics will auto-download it as a fallback to ensure the pipeline runs without crashing.

**To configure the real pothole model:**
1. Train a YOLOv8 model on a pothole dataset (e.g., using Roboflow or a custom dataset).
2. Export the est.pt weights file.
3. Place the weights file in the backend directory (e.g., ackend/pothole_model.pt).
4. Update your .env configuration file to point to it:
   `
   YOLO_MODEL_PATH=./pothole_model.pt
   `

**Important:** The detector module explicitly avoids faking successful inference. If you specify a custom YOLO_MODEL_PATH and the file is missing, the detector will throw a FileNotFoundError rather than silently skipping inference.