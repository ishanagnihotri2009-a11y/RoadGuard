import cv2
import numpy as np

def load_image(image_path_or_bytes):
    if isinstance(image_path_or_bytes, str):
        img = cv2.imread(image_path_or_bytes)
        if img is None:
            raise ValueError(f"Failed to load image from {image_path_or_bytes}")
        return img
    elif isinstance(image_path_or_bytes, bytes):
        np_arr = np.frombuffer(image_path_or_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Failed to decode image bytes")
        return img
    else:
        raise TypeError("Input must be a file path string or bytes.")

def preprocess_image(image):
    # Optimize image size before inference
    max_dim = 1024
    h, w = image.shape[:2]
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        image = cv2.resize(image, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
    return image
