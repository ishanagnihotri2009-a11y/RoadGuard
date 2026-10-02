FROM python:3.12-slim

# Install system dependencies for OpenCV and YOLO
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download YOLOv8n model weights so it doesn't download on first request
RUN python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"

COPY . .

# Hugging Face Spaces exposes port 7860
EXPOSE 7860

# Command to run the Flask app via Gunicorn
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:7860", "app:app"]
