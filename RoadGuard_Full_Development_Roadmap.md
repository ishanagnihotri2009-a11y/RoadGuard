# RoadGuard — Full Development Roadmap

## 1. Project Overview

RoadGuard is a cloud-based AI-powered citizen road-monitoring web application. Citizens can upload road images, provide/confirm the pothole location, receive AI-based pothole detection and severity analysis, track reports, earn reward points, unlock achievements, and compete on a leaderboard.

Administrators can monitor reports, review AI results, manage suspicious reports and citizens, and view analytics.

The development plan below is designed around a **zero-cost/free development approach** using the following stack.

---

# 2. Fixed Technology Stack

## Frontend

- HTML5
- CSS3
- Vanilla JavaScript

## Cloud / Backend Services

- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Firebase Hosting

## Python Backend

- Python
- Flask
- Firebase Admin SDK

## AI / Computer Vision

- YOLOv8 / Ultralytics
- OpenCV
- PyTorch
- NumPy
- Pillow

## Maps

- Leaflet
- OpenStreetMap

## Charts

- Chart.js

## Development Tools

- VS Code
- Git
- GitHub
- Python virtual environment

### Cost Target

The application should be designed to operate within free tiers during development and demonstration. The Python/AI service should initially run locally rather than requiring a paid cloud GPU/server.

---

# 3. High-Level Architecture

```text
                         ROADGUARD
                             |
                    +--------+--------+
                    |                 |
              Citizen UI          Admin UI
                    |                 |
                    +--------+--------+
                             |
                    HTML/CSS/JavaScript
                             |
              +--------------+--------------+
              |                             |
        Firebase Services              Flask API
              |                             |
       +------+-------+              +------+------+
       |      |       |              |             |
      Auth Firestore Storage      AI Service    Business Logic
       |      |       |              |             |
       +------+-------+              |          Rewards
              |                      |          Duplicate Check
              |                  YOLOv8/OpenCV   Validation
              |                      |
              +----------+-----------+
                         |
                  RoadGuard Reports
```

### Important Architecture Decision

The application should not require expensive cloud AI infrastructure for the MVP.

The recommended development setup is:

```text
Browser
   |
Firebase
   |
Flask API running locally
   |
YOLOv8 running locally
```

Once the project is stable, the Python API can be deployed to a suitable free/low-cost environment if required.

---

# 4. Development Roadmap

## Phase 0 — Requirements and Planning

### Goals

Finalize the product before writing the backend.

### Tasks

- Review the existing RoadGuard UI.
- List every page and component.
- Define citizen features.
- Define admin features.
- Define report lifecycle.
- Define reward rules.
- Define achievement rules.
- Define leaderboard rules.
- Define AI output format.
- Define database collections.
- Define Firebase security requirements.
- Define API endpoints.

### Deliverables

- Final feature list
- User flow
- Admin flow
- Database design
- API plan
- Folder structure

---

# 5. Phase 1 — Project Setup

## 5.1 Create Project Repository

Create a GitHub repository:

```text
roadguard
```

Initialize Git:

```bash
git init
git add .
git commit -m "Initial RoadGuard project setup"
```

## 5.2 Create Python Environment

```bash
python -m venv venv
```

Activate it.

Windows:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

## 5.3 Install Python Dependencies

Initial dependencies:

```bash
pip install flask
pip install firebase-admin
pip install ultralytics
pip install opencv-python
pip install numpy
pip install pillow
```

Create:

```text
requirements.txt
```

and freeze dependencies:

```bash
pip freeze > requirements.txt
```

### Deliverable

A clean project that starts successfully with:

```bash
python backend/app.py
```

---

# 6. Phase 2 — Firebase Setup

Create a Firebase project.

Enable:

### Authentication

Enable:

- Email/password authentication

### Firestore

Create the Firestore database.

### Storage

Enable Firebase Storage for uploaded images.

### Hosting

Enable Firebase Hosting for the frontend.

---

# 7. Phase 3 — Database Design

Use Firestore.

Recommended collections:

```text
users
reports
rewards
achievements
user_achievements
notifications
suspicious_reports
admin_actions
```

## users

Example:

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "role": "citizen",
  "points": 1200,
  "tier": "Reporter",
  "totalReports": 15,
  "verifiedReports": 11,
  "createdAt": "timestamp"
}
```

## reports

```json
{
  "userId": "uid",
  "imageUrl": "storage-url",
  "annotatedImageUrl": "storage-url",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "locationName": "Example Road",
  "description": "Large pothole near junction",
  "potholeCount": 2,
  "confidence": 0.91,
  "severity": "High",
  "status": "verified",
  "duplicate": false,
  "createdAt": "timestamp"
}
```

## rewards

```json
{
  "userId": "uid",
  "reportId": "reportId",
  "points": 100,
  "reason": "Verified pothole report",
  "createdAt": "timestamp"
}
```

## achievements

```json
{
  "name": "First Report",
  "description": "Submit your first valid report",
  "requirement": 1,
  "type": "reports"
}
```

## user_achievements

```json
{
  "userId": "uid",
  "achievementId": "achievementId",
  "unlockedAt": "timestamp"
}
```

## suspicious_reports

```json
{
  "reportId": "reportId",
  "userId": "uid",
  "reason": "Repeated image",
  "riskScore": 0.82,
  "status": "pending",
  "createdAt": "timestamp"
}
```

---

# 8. Phase 4 — Firebase Security

This phase is extremely important.

Do not rely only on JavaScript to protect admin pages.

Implement Firebase security rules and backend authorization.

### Citizen permissions

A citizen should be able to:

- Read their own profile.
- Update allowed profile fields.
- Create reports.
- Read their own reports.
- Read public leaderboard information.
- Read public pothole-map information.
- Read their rewards/achievements.

### Admin permissions

Admins can:

- Read all reports.
- Update report status.
- Review suspicious reports.
- Read/manage users.
- Read analytics.
- Perform administrative actions.

### Security Goals

Prevent:

- Users editing their own points.
- Users changing their role to admin.
- Users modifying another user's reports.
- Users awarding themselves points.
- Unauthorized access to admin data.

Reward and role changes should be controlled by trusted backend/admin logic.

---

# 9. Phase 5 — Frontend Foundation

Convert the existing UI design into functional HTML/CSS/JavaScript pages.

Start with:

```text
index.html
login.html
register.html
dashboard.html
```

Then add:

```text
report.html
reports.html
report-detail.html
map.html
rewards.html
achievements.html
leaderboard.html
profile.html
```

Admin:

```text
admin-dashboard.html
admin-reports.html
admin-report-detail.html
admin-users.html
admin-suspicious.html
admin-analytics.html
```

### Goal

At this stage, the application should visually match the provided RoadGuard design.

Do not implement all business logic yet.

---

# 10. Phase 6 — Firebase Authentication

Implement:

- Registration
- Login
- Logout
- Session persistence
- Authentication state
- Role detection

Flow:

```text
Register
   |
Firebase Auth
   |
Create user document
   |
Default role = citizen
   |
Dashboard
```

Admin users should be created/assigned securely rather than allowing public registration as admin.

---

# 11. Phase 7 — Citizen Dashboard

Connect the dashboard to Firestore.

Display real:

- User name
- Total reports
- Verified reports
- Points
- Current tier
- Rank
- Recent reports
- Achievement progress

Remove all hardcoded mock data.

### Milestone

The dashboard should update automatically when Firestore data changes.

---

# 12. Phase 8 — Pothole Reporting

Build the report workflow.

### Step 1

Select/upload image.

### Step 2

Preview image.

### Step 3

Capture location.

Use browser Geolocation API:

```javascript
navigator.geolocation.getCurrentPosition(...)
```

### Step 4

Allow user to confirm location.

### Step 5

Add optional description.

### Step 6

Upload image to Firebase Storage.

### Step 7

Create report record in Firestore.

Initial status:

```text
pending
```

### Step 8

Send image information to the Flask AI service.

---

# 13. Phase 9 — Python Flask Backend

Create the Flask API.

Suggested endpoints:

```text
POST   /api/analyze
GET    /api/health

POST   /api/reports/process
POST   /api/reports/{id}/verify
POST   /api/reports/{id}/reject

GET    /api/reports/{id}
POST   /api/rewards/calculate

GET    /api/admin/analytics
```

The frontend should communicate with Flask using `fetch()`.

Example:

```text
JavaScript
    |
fetch()
    |
Flask API
    |
Python processing
```

---

# 14. Phase 10 — AI Model Integration

Install and configure YOLOv8/Ultralytics.

The AI pipeline:

```text
Uploaded Image
      |
OpenCV
      |
Image Preprocessing
      |
YOLOv8
      |
Detection
      |
Bounding Boxes
      |
Confidence
      |
Pothole Count
      |
Severity Estimation
      |
Annotated Image
```

The output should have a consistent structure:

```json
{
  "potholeDetected": true,
  "potholeCount": 2,
  "confidence": 0.91,
  "severity": "High",
  "detections": [],
  "annotatedImageUrl": ""
}
```

### Important AI limitation

A normal single image does not reliably provide real physical pothole depth.

For the MVP:

- Treat depth as an estimate if displayed.
- Clearly label estimated values.
- Do not present estimates as precise physical measurements.

---

# 15. Phase 11 — AI Result Integration

After AI processing:

```text
AI detects pothole
        |
Save AI result
        |
Update report
        |
Set status
        |
Calculate reward
        |
Check duplicate
        |
Check achievements
```

If no pothole is detected:

```text
status = rejected
reason = "No pothole detected"
```

If a pothole is detected:

```text
status = "under_review"
```

or your chosen workflow.

---

# 16. Phase 12 — Annotated Image

The Python service should generate an annotated image containing:

- Bounding boxes
- Pothole label
- Confidence score

Store the annotated image in Firebase Storage.

Then save its URL to the report:

```text
reports/{reportId}
    |
    └── annotatedImageUrl
```

The report page should show both:

- Original image
- AI annotated image

---

# 17. Phase 13 — Duplicate Detection

Start with location-based duplicate detection.

When a new report arrives:

```text
New report
    |
Latitude + Longitude
    |
Search nearby reports
    |
Within configured radius?
    |
+---+---+
|       |
Yes     No
|       |
Possible  New
duplicate report
```

Initially use a configurable radius such as approximately 100 meters.

Later improve it using:

- Image similarity
- Timestamp comparison
- Similar AI detections

Do not automatically delete duplicate reports.

Mark them as:

```text
possible_duplicate
```

and allow admin review.

---

# 18. Phase 14 — Report Status System

Implement a clear lifecycle.

Recommended:

```text
PENDING
   ↓
PROCESSING
   ↓
AI_PROCESSED
   ↓
UNDER_REVIEW
   ↓
VERIFIED
```

Alternative endings:

```text
REJECTED
DUPLICATE
SUSPICIOUS
```

Every status change should be recorded when appropriate.

---

# 19. Phase 15 — My Reports

Connect the My Reports page to Firestore.

Display:

- Report image
- Report ID
- Location
- Date
- Pothole count
- Severity
- Confidence
- Status
- Reward points

Implement filters:

- All
- Pending
- Verified
- Rejected
- Duplicate
- Suspicious

---

# 20. Phase 16 — Report Detail

Build a complete report-detail page.

Show:

### Basic information

- Report ID
- Date
- Location
- Status

### AI information

- Pothole count
- Confidence
- Severity
- Estimated characteristics
- Annotated image

### Reward

- Points earned
- Reward reason

### Duplicate status

- Possible duplicate
- Nearby matching report if available

---

# 21. Phase 17 — Pothole Map

Implement:

- Leaflet
- OpenStreetMap

Read pothole coordinates from Firestore.

Display markers based on severity.

Example:

```text
Low       → Green marker
Medium    → Yellow marker
High      → Orange marker
Critical  → Red marker
```

Add filters:

- Severity
- Status
- Area
- Date

A marker should open a popup with basic report information.

---

# 22. Phase 18 — Reward System

Create a centralized reward service in Python/backend logic.

Example rules:

```text
Valid report              +50 points
Verified report           +100 points
High-quality report       +bonus
Duplicate report          +0 points
Rejected report           +0 points
Suspicious report         +0 points
```

The exact values can be adjusted.

### Important

Never let the frontend directly set:

```text
points = 5000
```

Points should be calculated by trusted backend/admin logic.

---

# 23. Phase 19 — Reward Tiers

Implement:

| Tier | Points |
|---|---:|
| Rookie | 0+ |
| Reporter | 500+ |
| Watcher | 1,500+ |
| Guardian | 3,000+ |
| Legend | 5,000+ |

Create a reusable tier calculation function.

Whenever points change:

```text
Update points
     ↓
Calculate tier
     ↓
Update user
     ↓
Check achievements
```

---

# 24. Phase 20 — Achievements

Implement achievement rules.

Examples:

```text
First Report
10 Reports
50 Reports
100 Verified Reports
High Accuracy Reporter
Community Contributor
Top Reporter
Road Guardian
```

Create an achievement service that checks eligibility whenever a relevant action occurs.

---

# 25. Phase 21 — Leaderboard

Create a Firestore query ordered by points.

Display:

- Rank
- User
- Points
- Tier
- Reports

The user's current rank should also be shown.

Do not allow users to manually modify leaderboard values.

---

# 26. Phase 22 — Profile

Implement:

- View profile
- Edit allowed profile fields
- Points
- Tier
- Rank
- Reports
- Achievements
- Account information

Avoid exposing sensitive Firebase/internal information.

---

# 27. Phase 23 — Admin Dashboard

Create the admin dashboard.

Display:

- Total users
- Total reports
- Verified reports
- Pending reports
- Suspicious reports
- Total potholes
- Severity breakdown
- Recent reports
- Map overview

All values must come from Firestore.

---

# 28. Phase 24 — Admin Reports

Admin should be able to:

- Search reports
- Filter reports
- Open report details
- Review AI results
- Review duplicates
- Verify reports
- Reject reports
- Flag suspicious reports

When an admin verifies a report:

```text
Report
   ↓
VERIFIED
   ↓
Reward calculation
   ↓
User points update
   ↓
Tier update
   ↓
Achievement check
   ↓
Leaderboard update
```

---

# 29. Phase 25 — Suspicious Reports

Create a suspicious-report workflow.

Possible signals:

- Too many reports in a short period
- Repeated images
- Same image submitted multiple times
- Unusual geographic activity
- Very low AI confidence
- Repeated duplicate reports

Assign a risk score:

```text
Low Risk
Medium Risk
High Risk
```

Admin can:

- Review
- Dismiss
- Reject
- Flag user if necessary

---

# 30. Phase 26 — Citizen Management

Admin can view:

- User
- Email
- Registration date
- Reports
- Verified reports
- Points
- Tier
- Status

Admin should not be able to arbitrarily change important data without an administrative action record.

---

# 31. Phase 27 — Analytics

Use **Chart.js**.

Create:

### Report trend chart

Reports per day/month.

### Severity chart

Low/Medium/High/Critical.

### Area chart

Reports by area.

### Citizen activity

Reports per user or participation trends.

### Reward analytics

Points distributed.

### AI analytics

- Detection count
- Average confidence
- Processing time
- Detection success rate

---

# 32. Phase 28 — Notifications

If included in the UI, implement simple in-app notifications using Firestore.

Examples:

```text
Your report has been verified.
You earned 100 points.
You unlocked the Guardian badge.
Your report was marked as a possible duplicate.
```

Keep this simple for the MVP.

---

# 33. Phase 29 — Error Handling

Implement proper handling for:

- Invalid image
- Large image
- Unsupported format
- Failed upload
- AI service unavailable
- No pothole detected
- Firebase errors
- Network errors
- Unauthorized requests

Every error should show a useful message to the user.

---

# 34. Phase 30 — Loading States

Add loading states for:

- Login
- Registration
- Image upload
- AI processing
- Report submission
- Dashboard loading
- Map loading
- Admin analytics

The UI should never look frozen while an operation is running.

---

# 35. Phase 31 — Testing

Test each module independently.

### Authentication

- Register
- Login
- Logout
- Invalid password
- Unauthorized admin access

### Reporting

- Valid image
- Invalid image
- Location permission
- Upload failure
- Report creation

### AI

- Pothole image
- No-pothole image
- Multiple potholes
- Low-confidence image

### Rewards

- Verified report
- Rejected report
- Duplicate report
- Tier progression

### Admin

- Verify
- Reject
- Suspicious report
- User management

### Security

- Citizen accessing another user's report
- Citizen attempting admin access
- User modifying points
- User modifying role

---

# 36. Phase 32 — UI Testing

Compare the final implementation with the provided UI design.

Check:

- Spacing
- Typography
- Cards
- Buttons
- Navigation
- Responsive layout
- Mobile view
- Tables
- Charts
- Modals
- Empty states
- Error states
- Loading states

The goal is to preserve the original RoadGuard visual identity while replacing mock functionality with real functionality.

---

# 37. Phase 33 — Responsive Design

Test:

- Desktop
- Laptop
- Tablet
- Mobile

Important screens:

- Dashboard
- Report upload
- Map
- Report details
- Leaderboard
- Admin dashboard

The report-upload flow should be especially mobile-friendly because users may submit reports directly from the road.

---

# 38. Phase 34 — Performance Optimization

Optimize:

- Image size before upload
- Image loading
- Firestore queries
- Map markers
- Chart rendering
- AI inference time

Compress images before sending them to storage/AI when appropriate.

Avoid loading thousands of reports at once.

Use pagination or limited queries for admin tables.

---

# 39. Phase 35 — Git/GitHub Workflow

Use branches:

```text
main
develop
feature/auth
feature/reporting
feature/ai
feature/rewards
feature/admin
```

Recommended commits:

```text
feat: add Firebase authentication
feat: add citizen dashboard
feat: add pothole reporting
feat: integrate YOLO detection
feat: add rewards
feat: add leaderboard
feat: add admin analytics
fix: correct report status handling
```

---

# 40. Phase 36 — Firebase Hosting

Build/deploy the frontend using Firebase Hosting.

Typical flow:

```text
HTML/CSS/JS
      ↓
Firebase Hosting
      ↓
Public RoadGuard website
```

The Flask AI service can remain local for the college demonstration if a free Python cloud deployment is not practical.

---

# 41. Phase 37 — Final Integration

Connect everything:

```text
Authentication
      ↓
Dashboard
      ↓
Report
      ↓
Firebase Storage
      ↓
Flask
      ↓
YOLOv8
      ↓
Firestore
      ↓
Rewards
      ↓
Achievements
      ↓
Leaderboard
      ↓
Map
      ↓
Admin
      ↓
Analytics
```

Perform a complete end-to-end test using a real account.

---

# 42. Recommended Development Order

Do not build features randomly.

Follow this order:

```text
1. UI setup
      ↓
2. Firebase setup
      ↓
3. Authentication
      ↓
4. Firestore structure
      ↓
5. Citizen dashboard
      ↓
6. Image upload
      ↓
7. Location
      ↓
8. Flask API
      ↓
9. YOLOv8
      ↓
10. AI results
      ↓
11. Report lifecycle
      ↓
12. Duplicate detection
      ↓
13. Rewards
      ↓
14. Achievements
      ↓
15. Leaderboard
      ↓
16. Map
      ↓
17. Admin dashboard
      ↓
18. Admin reports
      ↓
19. Suspicious reports
      ↓
20. Analytics
      ↓
21. Security
      ↓
22. Testing
      ↓
23. Deployment
```

---

# 43. Complete Folder Structure

Recommended project structure:

```text
RoadGuard/
│
├── frontend/
│   │
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   │
│   ├── dashboard.html
│   ├── report.html
│   ├── reports.html
│   ├── report-detail.html
│   ├── map.html
│   ├── rewards.html
│   ├── achievements.html
│   ├── leaderboard.html
│   ├── profile.html
│   │
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── reports.html
│   │   ├── report-detail.html
│   │   ├── users.html
│   │   ├── suspicious.html
│   │   └── analytics.html
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   ├── report.css
│   │   ├── reports.css
│   │   ├── map.css
│   │   ├── rewards.css
│   │   ├── leaderboard.css
│   │   ├── profile.css
│   │   └── admin.css
│   │
│   ├── js/
│   │   ├── firebase-config.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── report.js
│   │   ├── reports.js
│   │   ├── report-detail.js
│   │   ├── map.js
│   │   ├── rewards.js
│   │   ├── achievements.js
│   │   ├── leaderboard.js
│   │   ├── profile.js
│   │   │
│   │   └── admin/
│   │       ├── dashboard.js
│   │       ├── reports.js
│   │       ├── report-detail.js
│   │       ├── users.js
│   │       ├── suspicious.js
│   │       └── analytics.js
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── badges/
│
├── backend/
│   │
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   │
│   ├── routes/
│   │   ├── health.py
│   │   ├── analysis.py
│   │   ├── reports.py
│   │   ├── rewards.py
│   │   └── admin.py
│   │
│   ├── services/
│   │   ├── firebase_service.py
│   │   ├── storage_service.py
│   │   ├── ai_service.py
│   │   ├── reward_service.py
│   │   ├── achievement_service.py
│   │   ├── duplicate_service.py
│   │   └── suspicious_service.py
│   │
│   ├── ai/
│   │   ├── detector.py
│   │   ├── preprocessing.py
│   │   ├── postprocessing.py
│   │   ├── severity.py
│   │   └── model/
│   │       └── pothole_model.pt
│   │
│   ├── utils/
│   │   ├── image_utils.py
│   │   ├── validation.py
│   │   └── logger.py
│   │
│   └── temp/
│       └── .gitkeep
│
├── firebase/
│   ├── firestore.rules
│   ├── storage.rules
│   ├── firestore.indexes.json
│   └── firebase.json
│
├── tests/
│   ├── test_auth.md
│   ├── test_reports.md
│   ├── test_ai.md
│   ├── test_rewards.md
│   └── test_admin.md
│
├── .gitignore
├── README.md
└── requirements.txt
```

---

# 44. Folder Responsibilities

## frontend/

Contains everything the browser runs.

## frontend/js/

Contains Firebase integration, UI logic, API calls, map logic, rewards, and admin functionality.

## frontend/css/

Contains page-specific and shared styling.

## backend/

Contains the Python Flask server.

## backend/routes/

Contains API endpoints.

## backend/services/

Contains business logic and Firebase operations.

## backend/ai/

Contains the pothole detection pipeline.

## firebase/

Contains Firebase configuration and security rules.

## tests/

Contains the project's testing documentation and test cases.

---

# 45. AI Model Folder

The model file should not be blindly committed if it is large.

Recommended:

```text
backend/
└── ai/
    ├── detector.py
    ├── preprocessing.py
    ├── postprocessing.py
    ├── severity.py
    └── model/
        └── pothole_model.pt
```

If the model is too large for GitHub, document how to download/place it locally.

---

# 46. Environment Variables / Secrets

Never commit Firebase Admin credentials or secret keys.

Use environment variables or a local `.env` file.

Example:

```text
FLASK_ENV=development
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
```

Add `.env` to:

```text
.gitignore
```

Never expose Firebase Admin SDK credentials in frontend JavaScript.

The frontend may contain the normal Firebase web configuration, but privileged service-account credentials must remain server-side.

---

# 47. MVP Definition

The first complete working version should contain:

### Citizen

- Registration/login
- Dashboard
- Upload pothole image
- Location
- AI detection
- AI result
- Report status
- My reports
- Pothole map
- Reward points
- Tier
- Achievements
- Leaderboard
- Profile

### Admin

- Admin login
- Dashboard
- Reports
- Report review
- Verify/reject
- Suspicious reports
- Users
- Analytics

### Backend

- Flask API
- Firebase integration
- YOLOv8
- OpenCV
- Reward logic
- Duplicate detection

---

# 48. Features to Add Later

After the MVP is stable, optional improvements include:

- Image similarity detection
- Better fraud detection
- Advanced AI severity model
- More detailed road-condition analysis
- Email notifications
- Push notifications
- Heatmaps
- Advanced geospatial filtering
- AI model performance dashboard
- Automatic report clustering
- Offline report queue
- PWA/mobile optimization

Do not build these before the core system is stable.

---

# 49. Final Development Milestones

## Milestone 1

**UI + Firebase**

Result:

```text
Working UI
+
Authentication
+
Firestore
+
Storage
```

## Milestone 2

**Reporting**

Result:

```text
Image
+
Location
+
Firestore report
```

## Milestone 3

**AI**

Result:

```text
Image
→ YOLOv8
→ Detection
→ Severity
→ Annotated Image
```

## Milestone 4

**Citizen System**

Result:

```text
Reports
+
Rewards
+
Achievements
+
Leaderboard
+
Map
```

## Milestone 5

**Admin System**

Result:

```text
Reports
+
Verification
+
Suspicious reports
+
Users
+
Analytics
```

## Milestone 6

**Security + Testing + Deployment**

Result:

```text
Production-like RoadGuard MVP
```

---

# 50. Final Recommended Stack

Keep the stack fixed unless there is a strong technical reason to change it:

```text
FRONTEND
HTML5
CSS3
Vanilla JavaScript

CLOUD
Firebase Authentication
Firebase Firestore
Firebase Storage
Firebase Hosting

BACKEND
Python
Flask
Firebase Admin SDK

AI
YOLOv8 / Ultralytics
PyTorch
OpenCV
NumPy
Pillow

MAP
Leaflet
OpenStreetMap

CHARTS
Chart.js

TOOLS
VS Code
Git
GitHub
Python venv
```

This stack keeps RoadGuard simple enough to develop as a student project while still demonstrating the important concepts of **cloud computing, AI, computer vision, geolocation, database management, authentication, gamification, and web application development**.
