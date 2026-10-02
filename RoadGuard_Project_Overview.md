# RoadGuard — Complete Project Overview

## 1. Project Concept

**RoadGuard** is a cloud-based web application that allows citizens to report potholes by uploading road images. The system uses an **AI-based pothole detection model** to analyze uploaded images, identify potholes, estimate their severity, and provide useful information about road conditions.

The platform combines:

- AI-powered pothole detection
- Cloud-based image/report processing
- GPS/location-based reporting
- Duplicate report detection
- Citizen reward points
- Achievements and badges
- Leaderboard and rankings
- Interactive pothole map
- Admin dashboard
- Analytics and monitoring
- Suspicious/fraudulent report detection

The main objective is to create a system where citizens actively contribute road-condition data while authorities can use the collected information to understand pothole conditions across different areas.

---

## 2. Main User Roles

### Citizen

Citizens can:

- Create an account/login
- Upload pothole images
- Submit pothole reports
- Provide/confirm location
- View AI analysis
- Track submitted reports
- View potholes on a map
- Earn reward points
- Unlock achievements
- Progress through reward tiers
- Compete on the leaderboard
- Manage their profile

### Administrator

Administrators can:

- Monitor the entire reporting system
- View all submitted reports
- Inspect individual reports
- Review AI detection results
- Approve/reject reports
- Monitor suspicious reports
- Manage citizens
- View analytics
- Monitor AI performance
- Monitor reward distribution
- Analyze pothole trends by area

---

## 3. Citizen Application

### Citizen Dashboard

After login, the citizen receives a personalized dashboard.

The dashboard should display:

- Welcome message
- Total reports
- Verified reports
- Total reward points
- Current rank
- Recent reports
- Nearby potholes
- Achievement progress
- Quick action to report a pothole

The dashboard acts as the central hub for the citizen.

---

## 4. Pothole Reporting System

This is the **core feature of RoadGuard**.

The reporting process is divided into four stages:

### Step 1 — Upload

The citizen can:

- Upload an image from their device
- Take/select a road image
- Preview the image
- Add an optional description

Supported formats can include:

- JPG
- PNG
- HEIC

The system should validate file size and image type.

### Step 2 — Location

The system obtains the location of the reported pothole.

The location can come from:

- Device GPS
- User-confirmed location
- Map-based location selection

The user should be able to confirm that the detected location is correct before submitting.

The report stores:

- Latitude
- Longitude
- Area
- Street/location information
- Timestamp

---

## 5. AI Pothole Detection

After the image and location are confirmed, the image is sent to the cloud backend for AI processing.

The system should perform:

### Image preprocessing

The uploaded image is prepared for the detection model.

### AI inference

A pothole detection model such as **YOLOv8** processes the image.

The model should identify:

- Whether potholes are present
- Number of potholes
- Pothole boundaries
- Detection confidence

### Severity analysis

The system estimates the severity of the detected pothole.

Possible classifications:

- Low
- Medium
- High
- Critical

### Additional estimation

The system can calculate/estimate:

- Pothole size/diameter
- Approximate depth
- Road condition
- Detection confidence

---

## 6. AI Processing Pipeline

The application should implement the AI processing pipeline as an actual backend workflow:

1. Load image
2. Run YOLOv8 inference
3. Detect pothole boundaries
4. Estimate severity and depth
5. Check for duplicate reports
6. Calculate reward points
7. Generate final report

The UI processing animation should represent real backend processing rather than only mock behavior.

---

## 7. AI Annotated Image

After detection, the system should return an annotated version of the image.

**Original image → AI detection → Bounding boxes → Annotated image**

The annotated image should display:

- Bounding boxes
- Detection labels
- Confidence information

This provides transparency about what the AI detected.

---

## 8. Duplicate Report Detection

RoadGuard should prevent users from repeatedly reporting the same pothole.

When a new report is submitted, the system checks:

- Geographic proximity
- Existing pothole reports
- Time difference
- Image similarity where possible

For example, a pothole already reported within approximately 100 meters may be flagged as a possible duplicate.

The system should not necessarily delete duplicate reports automatically. Instead, it can mark them as **Possible Duplicate** for review.

---

## 9. Report Status

Every report should have a lifecycle/status.

Example:

**Submitted → AI Processed → Under Review → Verified / Rejected**

Possible statuses:

- Pending
- Processing
- Verified
- Rejected
- Duplicate
- Suspicious

Citizens can see the current status of each report.

---

## 10. My Reports

The citizen has a dedicated **My Reports** section.

It should show:

- Report ID
- Image
- Location
- Date
- Number of potholes
- Severity
- AI confidence
- Status
- Reward points

Users can open a report to view its detailed report page.

---

## 11. Report Detail Page

The report detail screen provides complete information about a submitted report.

### Report information

- Report ID
- Street
- Area
- Coordinates
- Submission date
- Status
- Severity

### Image

- Original/annotated image
- AI bounding boxes

### AI results

- Number of potholes
- Confidence score
- Average diameter
- Estimated depth
- Road condition
- AI model/inference information

### Duplicate detection

Display whether another nearby report may represent the same pothole.

### Reward

Display the points earned from the report.

---

## 12. Pothole Map

RoadGuard includes an interactive pothole map.

The map should visualize reported potholes geographically.

Each pothole marker can contain:

- Location
- Severity
- Report status
- Number of reports
- Date
- Basic AI information

Different marker styles can represent severity levels.

The map can support:

- Current location
- Area filtering
- Severity filtering
- Status filtering
- Date filtering
- Pothole density visualization

---

## 13. Reward System

Citizens earn points for legitimate pothole reports.

**Citizen uploads image → AI verifies pothole → Report accepted → Points awarded**

The points system encourages citizens to actively contribute road-condition information.

Points should be associated with the report and recorded in a point history.

---

## 14. Reward Tiers

The reward progression system can use:

| Tier | Points |
|---|---:|
| 🌱 Rookie | 0+ |
| 📋 Reporter | 500+ |
| 👁️ Watcher | 1,500+ |
| 🛡️ Guardian | 3,000+ |
| 👑 Legend | 5,000+ |

The system automatically determines the citizen's current tier based on accumulated points.

Citizens can see:

- Current tier
- Total points
- Progress to next tier
- Points remaining
- Rank

---

## 15. Leaderboard

RoadGuard includes a global citizen leaderboard.

Users are ranked based on reward points.

The leaderboard can display:

- Rank
- Citizen name
- Profile/avatar
- Points
- Reports
- Verified reports
- Tier

The citizen should be able to easily identify their own ranking.

This introduces a **gamification element** into the application.

---

## 16. Achievements & Badges

Citizens can unlock achievements for different activities.

Examples:

- First Report
- 10 Reports
- 50 Reports
- High Accuracy Reporter
- Road Guardian
- Community Contributor
- Top Reporter

Each achievement should contain:

- Badge/icon
- Name
- Description
- Unlock requirement
- Locked/unlocked state
- Date earned

The citizen profile should display earned badges.

---

## 17. Profile

The profile page allows citizens to manage their account.

It includes:

- Profile information
- Name
- Email
- Phone
- City
- Current tier
- Rank
- Total reports
- Verified reports
- Total points
- Earned badges

Users should be able to edit their profile.

Notification preferences can include:

- Email notifications
- Push notifications
- Weekly summaries

---

## 18. Admin Dashboard

The administrator gets a separate dashboard.

The dashboard should provide an overview of the entire RoadGuard platform.

Important metrics include:

- Total reports
- Verified reports
- Pending reports
- Suspicious reports
- Total citizens
- Total potholes detected
- Reports by severity
- Reports by area
- Recent reports
- Pothole density map

---

## 19. Admin Reports Management

Administrators can access all submitted reports.

The reports management page should support:

- Search
- Filtering
- Sorting
- Status filtering
- Severity filtering
- Area filtering
- Date filtering

Each report can be opened for detailed inspection.

---

## 20. Admin Report Review

The administrator can inspect an individual report.

The admin report detail page should display:

- Uploaded image
- AI annotated image
- AI confidence
- Pothole count
- Severity
- Estimated depth
- Road condition
- Location
- Submission information
- Duplicate detection
- Citizen information

The administrator can then:

- Verify
- Reject
- Flag for review

---

## 21. Suspicious Reports

RoadGuard should include suspicious-report monitoring.

Reports can be flagged based on signals such as:

- Multiple submissions from the same location
- Repeated images
- Image duplication
- Unusual reporting behavior
- Excessive reports in a short period
- Potential fake images
- Abnormally low AI confidence

Administrators can inspect suspicious reports and take appropriate action.

This is important because the reward system creates an incentive for users to submit fake reports.

---

## 22. Citizen Management

Administrators can view registered citizens.

Citizen management can include:

- Name
- Email
- Registration date
- Total reports
- Verified reports
- Points
- Tier
- Rank
- Account status

Admins should be able to investigate users with unusual reporting activity.

---

## 23. Admin Analytics

The analytics dashboard provides deeper insights.

### Monthly Report Trends

Shows reporting activity over time.

### Severity Breakdown

Shows distribution of:

- Low
- Medium
- High
- Critical

### Reports by Area

Identifies areas with higher pothole activity.

### Citizen Participation

Shows how actively citizens are contributing.

### AI Model Statistics

Can display:

- Total detections
- Average confidence
- Detection success rate
- Processing time
- Model performance metrics

### Reward Distribution

Shows how reward points are distributed among citizens.

---

## 24. Cloud Architecture

Since this is a **Cloud Computing project**, the application should be designed around cloud services.

A suitable architecture:

```text
Citizen Web App
       ↓
Cloud Frontend
       ↓
Backend API
       ↓
Authentication Service
       ↓
Report Processing Service
       ↓
AI Detection Service
       ↓
Database
       ↓
Cloud Image Storage
```

A report can flow through:

```text
User uploads image
        ↓
Cloud Storage
        ↓
Backend API
        ↓
AI Processing Service
        ↓
YOLOv8 Pothole Detection
        ↓
Severity Analysis
        ↓
Duplicate Detection
        ↓
Database
        ↓
Reward Calculation
        ↓
Citizen Dashboard
```

---

## 25. Suggested Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide icons
- Interactive map library

The provided UI should be treated as the frontend/product design reference and its design language should be preserved.

### Backend

Possible choices:

- Node.js + Express/Fastify
- Python + FastAPI

Python/FastAPI is particularly convenient if the AI model runs directly in the backend.

### AI

- YOLOv8 / YOLO-based detection model
- Python
- OpenCV
- PyTorch
- Ultralytics

### Database

Possible options:

- PostgreSQL
- MongoDB

**PostgreSQL is recommended** because users, reports, rewards, achievements, locations, and administrative actions have clear relationships.

### Cloud Storage

Use cloud object storage for:

- Original images
- Annotated images
- AI/model outputs

### Authentication

Implement:

- Registration
- Login
- Password hashing
- JWT/session authentication
- Role-based authorization

Roles:

```text
CITIZEN
ADMIN
```

---

## 26. Important Database Entities

The backend should roughly contain:

```text
User
 ├── Profile
 ├── Reports
 ├── Rewards
 ├── Achievements
 └── Notifications

Report
 ├── Image
 ├── Location
 ├── AI Analysis
 ├── Severity
 ├── Status
 ├── Duplicate Information
 └── Reward

Achievement
RewardTransaction
PotholeDetection
Location
AdminAction
SuspiciousReport
```

---

## 27. End-to-End User Flow

```text
Landing Page
      ↓
Register / Login
      ↓
Citizen Dashboard
      ↓
Report Pothole
      ↓
Upload Image
      ↓
Confirm Location
      ↓
Cloud Upload
      ↓
AI Processing
      ↓
Pothole Detection
      ↓
Severity Analysis
      ↓
Duplicate Check
      ↓
Report Created
      ↓
Reward Points Calculated
      ↓
Result Displayed
      ↓
My Reports
      ↓
Map / Rewards / Achievements / Leaderboard
```

---

## 28. Production Implementation Requirement

The provided ZIP contains the **UI/design and mock-data implementation**. Antigravity should convert this UI into a functional application.

The implementation should replace mock behavior with real services:

```text
Mock report
      ↓
Real database report

Mock AI result
      ↓
Real AI inference API

Mock points
      ↓
Real reward transaction

Mock leaderboard
      ↓
Database-generated leaderboard

Mock map data
      ↓
Real geolocation/report data

Mock login
      ↓
Real authentication
```

The existing UI should be treated as the **frontend/product design reference**. Backend, database, AI pipeline, authentication, cloud storage, and business logic need to be implemented.

---

## 29. Recommended MVP Development Phases

### Phase 1 — Foundation

- Project setup
- Authentication
- Citizen dashboard
- Admin dashboard
- User roles
- Database setup

### Phase 2 — Reporting

- Image upload
- Location capture
- Report creation
- Cloud image storage
- Report history

### Phase 3 — AI

- AI pothole detection
- Confidence score
- Severity classification
- Annotated image
- AI processing pipeline

### Phase 4 — Intelligence

- Duplicate detection
- Pothole map
- Report status management
- Admin verification/rejection

### Phase 5 — Gamification

- Reward points
- Reward tiers
- Achievements
- Badges
- Leaderboard

### Phase 6 — Administration & Analytics

- Admin report management
- Suspicious reports
- Citizen management
- Analytics
- AI performance statistics
- Reward analytics

---

## 30. One-Line Project Definition

> **RoadGuard is a cloud-based AI-powered citizen road-monitoring platform that detects potholes from uploaded images, analyzes their severity and location, stores reports in the cloud, and incentivizes citizens through points, achievements, and leaderboards while providing administrators with tools to monitor, verify, and analyze road conditions.**

---

## 31. Final Product Goal

The final RoadGuard application should feel like a **real production-ready platform**, not a static UI prototype.

A successful implementation should provide:

1. A polished citizen-facing web application.
2. Secure authentication and role-based access.
3. Real image uploads to cloud storage.
4. Real AI pothole detection.
5. Real location-based reporting.
6. Real report persistence in a database.
7. Real duplicate detection.
8. Real reward calculation.
9. Real achievements and leaderboard rankings.
10. An interactive pothole map.
11. A complete admin monitoring system.
12. Analytics for pothole and citizen activity.
13. Suspicious/fraudulent report detection.
14. A scalable cloud-oriented architecture.

The existing UI design should remain the primary visual reference while the underlying system is implemented as a fully functional cloud-based application.
