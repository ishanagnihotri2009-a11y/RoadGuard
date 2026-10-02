# RoadGuard

RoadGuard is an AI-powered civic technology platform designed to streamline pothole reporting and civic maintenance. It leverages Computer Vision to automatically analyze citizen-uploaded road imagery, estimating severity and providing actionable data to municipal administrators through an integrated gamification system.

## 1. Project Overview
RoadGuard consists of two primary applications:
1. **Citizen Portal:** A gamified reporting interface where users can upload photos of potholes, track their repair status, earn points, and climb the civic leaderboard.
2. **Admin Dashboard:** A high-level command center for city planners to review AI-processed submissions, verify repairs, manage suspicious activity, and view geographic analytics.

## 2. Architecture
RoadGuard operates on a robust split-stack architecture:
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Leaflet Maps, and Chart.js.
- **Backend:** Python Flask API, Flask-Limiter for DoS protection, and Ultralytics YOLOv8 for AI inference.
- **Database & Auth:** Google Firebase (Firestore, Storage, Authentication).
- **Security:** Immutable declarative `firestore.rules` and `storage.rules` enforced at the database level.

## 3. Frontend Setup
The frontend is built using Vite and Node.js.
1. Navigate to the frontend directory: `cd frontend`
2. Install Node dependencies: `npm install`
3. The frontend utilizes Firebase Web SDKs to interface natively with the database and authentication layers.

## 4. Firebase Setup
To configure Firebase:
1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password).
3. Enable **Firestore Database** (Native Mode).
4. Enable **Firebase Storage**.
5. Deploy the provided security rules using the Firebase CLI (see Section 13).

## 5. Backend Setup
The Python backend handles the computationally heavy AI model inference and trusted administrative tasks (such as rewarding points or blocking suspicious users). It utilizes the Firebase Admin SDK to bypass standard client security rules.

## 6. Python Virtual Environment
It is highly recommended to isolate the backend dependencies using a virtual environment.
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

## 7. Installing Dependencies
With the virtual environment activated, install the required packages:
```bash
pip install -r requirements.txt
```
This includes Flask, Ultralytics YOLOv8, OpenCV, and Firebase Admin.

## 8. Environment Variables
You must configure your local environment variables before running either application. **Never commit these files to version control.**

**Frontend (`frontend/.env`):**
Copy `frontend/.env.example` to `frontend/.env` and fill in your Firebase public configuration keys.

**Backend (`backend/.env`):**
Copy `backend/.env.example` to `backend/.env`. You will need to generate a Service Account Key from the Firebase Console (Project Settings -> Service Accounts -> Generate New Private Key). Save this JSON file locally and reference its path in the `FIREBASE_CREDENTIALS_PATH` variable.

## 9. Model Weights
The AI relies on the Ultralytics YOLO architecture.
1. By default, the system will attempt to load `yolov8n.pt`. If it does not exist, the Ultralytics library will automatically download the base weights on first boot.
2. For optimal pothole detection, you should train a custom YOLOv8 model on a pothole dataset, rename the weights file to `pothole_model.pt`, and update `YOLO_MODEL_PATH=pothole_model.pt` in your `backend/.env`.

## 10. Running Frontend
To start the Vite development server:
```bash
cd frontend
npm run dev
```

## 11. Running Flask
To start the Python API:
```bash
cd backend
flask run --host=0.0.0.0 --port=5000
```
*Note for Production:* Do not use the Flask development server in a live environment. Use a production WSGI server such as Gunicorn:
`gunicorn -w 4 -b 0.0.0.0:5000 app:app`

## 12. Testing
While RoadGuard does not include a formalized unit testing suite out-of-the-box, comprehensive end-to-end integration tests were performed across all Auth, Gamification, and AI vectors. To test manually:
1. Register a new user on the frontend.
2. Ensure you have location permissions enabled.
3. Submit a `.jpg` less than 10MB to the reporting pipeline and verify the Python console output for AI processing speeds.

## 13. Firebase Deployment
To deploy the frontend, database rules, and storage configurations to production:
1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Login to your account: `firebase login`
3. Build the React application: `cd frontend && npm run build`
4. Deploy the infrastructure from the root directory: `firebase deploy`

## 14. Known AI Limitations
- **False Positives:** Without a custom-trained pothole model (using baseline YOLOv8), the AI may misidentify manhole covers, puddles, or storm drains as road defects.
- **Processing Power:** CPU inference can take 200ms - 800ms depending on the host hardware. For high-throughput scenarios, deploy the Flask backend on GPU-enabled instances (requires CUDA).
- **Image Artifacting:** Images taken in extreme low-light or with motion blur will significantly drop confidence scores, routing the report to the Admin Suspicious queue for manual verification.
