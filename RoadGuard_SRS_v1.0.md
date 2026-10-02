# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
# RoadGuard — Cloud-Based AI Pothole Detection and Citizen Road Monitoring System

**Document Version:** 1.0  
**Project Type:** Cloud Computing / AI-Based Web Application  
**Primary Users:** Citizens and Administrators  
**Status:** Proposed / Development Specification  
**Technology Baseline:** HTML5, CSS3, Vanilla JavaScript, Firebase, Python/Flask, YOLOv8/Ultralytics, OpenCV, PyTorch, Leaflet, OpenStreetMap, Chart.js

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional and non-functional requirements for **RoadGuard**, a cloud-based web application for citizen-driven pothole reporting and road-condition monitoring.

RoadGuard enables citizens to upload road images, provide or confirm the location, receive AI-based pothole detection and severity analysis, track reports, earn reward points, unlock achievements, and participate in a leaderboard. Administrators can monitor reports, review AI results, investigate suspicious or duplicate reports, manage citizens, and analyze road-condition data.

This SRS is intended to serve as the primary reference for:

- Development
- UI implementation
- Backend implementation
- Database design
- AI integration
- Testing
- Security implementation
- Demonstration and evaluation
- Future maintenance

### 1.2 Scope

The system covers:

1. Citizen registration and authentication.
2. Citizen profile management.
3. Pothole image upload.
4. Location capture and confirmation.
5. Cloud image storage.
6. AI-based pothole detection.
7. Pothole count and confidence analysis.
8. Severity estimation.
9. AI-annotated image generation.
10. Duplicate-report detection.
11. Report lifecycle and status tracking.
12. Citizen report history.
13. Interactive pothole map.
14. Reward points and point history.
15. Reward tiers.
16. Achievements and badges.
17. Citizen leaderboard.
18. Administrator dashboard.
19. Administrator report review.
20. Suspicious-report monitoring.
21. Citizen management.
22. Analytics.
23. AI-processing statistics.
24. Cloud-oriented data and storage architecture.

The initial implementation is designed around free-tier services for development and demonstration. AI inference is initially intended to run through a Python/Flask service rather than requiring a paid cloud GPU.

### 1.3 Product Definition

> **RoadGuard is a cloud-based AI-powered citizen road-monitoring platform that detects potholes from uploaded images, analyzes their severity and location, stores reports in the cloud, and incentivizes citizens through points, achievements, and leaderboards while providing administrators with tools to monitor, verify, and analyze road conditions.**

### 1.4 Intended Audience

This document is intended for:

- Project developers
- AI/ML developers
- Frontend developers
- Backend developers
- Database designers
- Testers
- Project supervisors
- College evaluators
- Future maintainers

### 1.5 Definitions and Acronyms

| Term | Meaning |
|---|---|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| GPS | Global Positioning System |
| UI | User Interface |
| UX | User Experience |
| YOLO | You Only Look Once object-detection architecture |
| MVP | Minimum Viable Product |
| SRS | Software Requirements Specification |
| Firebase Auth | Firebase Authentication service |
| Firestore | Firebase cloud NoSQL database |
| Storage | Firebase cloud object/file storage |
| Citizen | Normal RoadGuard user |
| Admin | Authorized administrator |
| Report | A citizen-submitted road/pothole record |
| Detection | AI-identified pothole object |
| Duplicate | Report potentially representing an already reported pothole |
| Suspicious Report | Report requiring administrative investigation |
| Severity | Estimated pothole seriousness category |
| Reward Transaction | Record describing points awarded or withheld |
| Tier | Citizen reward level based on accumulated points |

---

# 2. Overall Description

## 2.1 Product Perspective

RoadGuard is a web application composed of a citizen-facing interface, an administrator interface, Firebase cloud services, and a Python-based AI/backend service.

### High-Level Architecture

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
                                      |             |
                                  YOLOv8        Rewards
                                  OpenCV        Validation
                                  PyTorch       Duplicate Check
                                      |
                              RoadGuard Reports
```

### Intended MVP Deployment Model

```text
Browser
   |
Firebase Authentication / Firestore / Storage
   |
Flask API
   |
YOLOv8 + OpenCV + PyTorch
```

The Python AI service may initially run locally for development and college demonstration. A later deployment may place the service on a suitable hosting environment.

## 2.2 Product Functions

The major functions are:

### Citizen Functions

- Register/login
- View dashboard
- Upload pothole image
- Capture/confirm location
- Submit report
- Receive AI analysis
- View annotated image
- View report status
- View report history
- View report details
- View potholes on map
- Earn points
- View point history
- Progress through reward tiers
- Unlock achievements
- View leaderboard
- Manage profile

### Administrator Functions

- Secure administrator authentication
- View system dashboard
- View all reports
- Search/filter reports
- Review AI analysis
- Verify/reject reports
- Review duplicate reports
- Review suspicious reports
- Manage citizen records
- View analytics
- View reward statistics
- View AI statistics
- Record administrative actions

## 2.3 User Classes

### 2.3.1 Citizen

A normal registered user who contributes road-condition reports.

Expected characteristics:

- Basic web/mobile-browser knowledge.
- Access to a device capable of uploading images.
- May grant browser location permission.
- Can view only authorized citizen-level information.

### 2.3.2 Administrator

A trusted user responsible for system monitoring and moderation.

Expected characteristics:

- Familiarity with RoadGuard.
- Authorized administrative access.
- Able to review reports and analytics.
- Responsible for handling suspicious or disputed records.

## 2.4 Operating Environment

### Client

- Modern Chrome, Edge, Firefox, or Safari.
- Desktop, laptop, tablet, or smartphone.
- JavaScript-enabled browser.
- Location permission when GPS-based reporting is used.
- Internet connection for cloud functionality.

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- Firebase Web SDK
- Leaflet
- Chart.js

### Backend

- Python
- Flask
- Firebase Admin SDK

### AI Environment

- Python
- Ultralytics / YOLOv8
- PyTorch
- OpenCV
- NumPy
- Pillow

### Cloud

- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Firebase Hosting

### Map

- Leaflet
- OpenStreetMap

## 2.5 Design and Implementation Constraints

1. The project should prioritize free or free-tier services during development and demonstration.
2. The frontend should use the selected baseline of HTML5, CSS3, and Vanilla JavaScript.
3. Firebase should be used for authentication, Firestore, storage, and hosting.
4. Python/Flask should provide the AI/backend API.
5. YOLOv8/Ultralytics is the baseline AI approach.
6. The UI/design supplied for RoadGuard is the primary visual reference.
7. The system must not expose Firebase Admin/service-account credentials to the browser.
8. Reward and role changes must not be controlled directly by untrusted frontend code.
9. A single ordinary image cannot reliably measure physical pothole depth; any depth value shown by the MVP must be treated as an estimate.
10. The AI service should not require a paid GPU for the initial MVP.
11. Large model files may need to be downloaded or stored outside the main Git repository.
12. OpenStreetMap usage must comply with its applicable usage and attribution requirements.

## 2.6 Assumptions

1. Citizens have internet access when submitting reports.
2. Users can provide reasonably clear road images.
3. The device/browser may provide a location when permission is granted.
4. Firebase services are available.
5. The selected pothole model is trained or otherwise configured to detect potholes.
6. AI predictions are probabilistic and may require human review.
7. Administrators are trusted users.
8. Reward rules can be configured during implementation.
9. Severity categories can be configured.
10. Exact production-scale availability and AI accuracy are outside the initial student MVP scope.

## 2.7 Dependencies

- Firebase project
- Firebase Authentication configuration
- Firestore configuration
- Firebase Storage configuration
- Firebase Hosting configuration
- Firebase security rules
- Python runtime
- Flask runtime
- YOLOv8/Ultralytics model
- Model weights
- OpenCV/PyTorch dependencies
- Browser Geolocation API
- Leaflet/OpenStreetMap
- Chart.js
- Internet connectivity

---

# 3. Functional Requirements

## 3.1 Authentication and Authorization

### FR-AUTH-001 — Registration

The system shall allow a citizen to create an account using supported authentication credentials.

### FR-AUTH-002 — Login

The system shall allow a registered user to log in.

### FR-AUTH-003 — Logout

The system shall provide a logout mechanism.

### FR-AUTH-004 — Session Persistence

The system shall preserve authenticated state according to the Firebase Authentication configuration.

### FR-AUTH-005 — Role Assignment

A newly registered public user shall receive the default citizen role.

### FR-AUTH-006 — Administrator Access

Administrator access shall be assigned securely and shall not be available through normal public registration.

### FR-AUTH-007 — Role-Based Authorization

The system shall distinguish between citizen and administrator permissions.

### FR-AUTH-008 — Unauthorized Access

The system shall prevent citizens from accessing administrator-only data and operations.

### FR-AUTH-009 — Secure Credentials

Administrative credentials and Firebase Admin SDK/service-account credentials shall remain server-side.

---

# 3.2 Citizen Profile

### FR-PROFILE-001 — View Profile

A citizen shall be able to view their profile.

### FR-PROFILE-002 — Edit Profile

A citizen shall be able to edit permitted profile fields.

### FR-PROFILE-003 — Display Statistics

The profile shall display relevant statistics including:

- Total reports
- Verified reports
- Points
- Tier
- Rank
- Achievements

### FR-PROFILE-004 — Account Information

The system shall display supported account information such as name and email.

### FR-PROFILE-005 — Restricted Fields

Users shall not be allowed to edit protected fields such as role, reward balance, or administrative status.

---

# 3.3 Citizen Dashboard

### FR-DASH-001 — Dashboard

The system shall provide a personalized citizen dashboard.

### FR-DASH-002 — Report Statistics

The dashboard shall display report-related statistics.

### FR-DASH-003 — Reward Statistics

The dashboard shall display current points and tier.

### FR-DASH-004 — Recent Reports

The dashboard shall display recent reports belonging to the citizen.

### FR-DASH-005 — Achievement Progress

The dashboard may display achievement progress.

### FR-DASH-006 — Quick Reporting

The dashboard shall provide an accessible action for submitting a new pothole report.

---

# 3.4 Pothole Report Creation

### FR-REPORT-001 — Image Selection

The system shall allow a citizen to select or upload a road image.

### FR-REPORT-002 — Image Preview

The system shall display a preview before submission.

### FR-REPORT-003 — File Validation

The system shall validate supported image types and configured size limits.

### FR-REPORT-004 — Supported Image Types

The implementation may support JPG, PNG, and HEIC subject to browser and backend support.

### FR-REPORT-005 — Description

The system shall allow an optional report description.

### FR-REPORT-006 — Location Capture

The system shall support browser/device location capture.

### FR-REPORT-007 — Location Confirmation

The citizen shall be able to confirm the location before final submission.

### FR-REPORT-008 — Map-Based Location

The system may allow a citizen to select or adjust a location using a map.

### FR-REPORT-009 — Coordinates

A report shall store latitude and longitude when available.

### FR-REPORT-010 — Timestamp

The system shall record the report creation timestamp.

### FR-REPORT-011 — Cloud Storage

The original image shall be stored in Firebase Storage or the configured cloud object storage.

### FR-REPORT-012 — Report Record

The system shall create a corresponding report document in Firestore.

### FR-REPORT-013 — Initial Status

A newly submitted report shall receive an initial status such as `pending`.

---

# 3.5 AI Processing

### FR-AI-001 — AI Processing Request

The system shall send a submitted image to the Python/Flask AI service.

### FR-AI-002 — Image Preprocessing

The AI service shall prepare the image for inference when required.

### FR-AI-003 — Pothole Detection

The AI service shall run the configured pothole detection model.

### FR-AI-004 — Pothole Presence

The AI service shall return whether a pothole was detected.

### FR-AI-005 — Pothole Count

The AI service shall return the number of detected potholes.

### FR-AI-006 — Bounding Boxes

The AI service shall return detection boundaries when supported by the model.

### FR-AI-007 — Confidence

The AI service shall return confidence information for detections.

### FR-AI-008 — Severity

The system shall produce a configurable severity classification such as Low, Medium, High, or Critical.

### FR-AI-009 — Estimated Characteristics

The system may provide estimated size/depth or other characteristics where the implemented model supports them.

### FR-AI-010 — Depth Limitation

Any physical depth value derived from a single image shall be explicitly treated as an estimate, not as a precise measurement.

### FR-AI-011 — Annotated Image

The AI service shall generate an annotated image containing detection information when possible.

### FR-AI-012 — AI Result Persistence

AI results shall be stored with the corresponding report.

### FR-AI-013 — AI Failure

The system shall handle unavailable or failed AI processing without corrupting the report.

---

# 3.6 Report Lifecycle

### FR-STATUS-001 — Status Tracking

Every report shall have a status.

### FR-STATUS-002 — Recommended Lifecycle

The system shall support a lifecycle similar to:

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

### FR-STATUS-003 — Alternative Outcomes

The system shall support relevant alternative states including:

- REJECTED
- DUPLICATE
- SUSPICIOUS

### FR-STATUS-004 — Status Visibility

Citizens shall be able to view the current status of their own reports.

### FR-STATUS-005 — Administrative Status Changes

Authorized administrators shall be able to update report status where permitted.

### FR-STATUS-006 — Status Audit

Important administrative status changes should be recorded in administrative action history.

---

# 3.7 Report Details

### FR-DETAIL-001 — Report Detail Page

The system shall provide a detailed report page.

### FR-DETAIL-002 — Basic Information

The report detail page shall display:

- Report ID
- Location
- Coordinates where available
- Date
- Status
- Severity

### FR-DETAIL-003 — Images

The page shall display the original and annotated images where available.

### FR-DETAIL-004 — AI Information

The page shall display:

- Pothole count
- Confidence
- Severity
- Supported estimated characteristics

### FR-DETAIL-005 — Duplicate Information

The page shall show possible duplicate status when applicable.

### FR-DETAIL-006 — Reward Information

The page shall show points associated with the report when applicable.

---

# 3.8 My Reports

### FR-MYREPORTS-001 — Report History

A citizen shall be able to view their submitted reports.

### FR-MYREPORTS-002 — Report Summary

Each report summary shall show relevant information including image, location, date, severity, status, and points.

### FR-MYREPORTS-003 — Filters

The interface shall support filtering by status.

### FR-MYREPORTS-004 — Detail Navigation

The citizen shall be able to open an individual report.

### FR-MYREPORTS-005 — Data Isolation

A citizen shall not be able to retrieve another citizen's private report records through unauthorized Firestore/API requests.

---

# 3.9 Duplicate Detection

### FR-DUP-001 — Duplicate Check

The system shall check a new report against relevant existing reports.

### FR-DUP-002 — Geographic Proximity

The initial implementation shall support location-based duplicate detection.

### FR-DUP-003 — Configurable Radius

The duplicate radius shall be configurable; approximately 100 meters may be used as an initial MVP value.

### FR-DUP-004 — Image Similarity

The system may add image similarity as a later enhancement.

### FR-DUP-005 — Time Comparison

The system may use report timestamps as an additional duplicate signal.

### FR-DUP-006 — Possible Duplicate

A suspected duplicate shall be marked rather than automatically deleted.

### FR-DUP-007 — Administrative Review

Administrators shall be able to review possible duplicate reports.

---

# 3.10 Pothole Map

### FR-MAP-001 — Interactive Map

The system shall provide an interactive pothole map.

### FR-MAP-002 — Report Markers

The map shall display eligible pothole reports geographically.

### FR-MAP-003 — Severity Representation

The map shall provide a visual distinction for severity levels.

### FR-MAP-004 — Marker Information

A marker shall display basic report information when selected.

### FR-MAP-005 — Filtering

The map shall support relevant filters such as severity, status, area, and date.

### FR-MAP-006 — Location

The map may display the citizen's current location when permission is available.

### FR-MAP-007 — Mapping Technology

Leaflet and OpenStreetMap shall be used for the baseline MVP map.

---

# 3.11 Rewards

### FR-REWARD-001 — Reward Points

The system shall award points for eligible citizen activity.

### FR-REWARD-002 — Reward Transaction

Each point award should be represented by a reward transaction/history record.

### FR-REWARD-003 — Verification-Based Reward

Reward rules may depend on successful AI processing and/or report verification.

### FR-REWARD-004 — No Reward for Invalid Reports

Rejected, duplicate, or suspicious reports shall not automatically receive normal verification rewards unless the configured rules explicitly allow it.

### FR-REWARD-005 — Trusted Calculation

Reward values shall be calculated by trusted backend or administrator-controlled logic.

### FR-REWARD-006 — Frontend Protection

The frontend shall not be trusted to directly modify a citizen's points.

---

# 3.12 Reward Tiers

### FR-TIER-001 — Tier Calculation

The system shall calculate a citizen's tier from accumulated points.

### FR-TIER-002 — Baseline Tiers

The initial proposed tiers are:

| Tier | Points |
|---|---:|
| Rookie | 0+ |
| Reporter | 500+ |
| Watcher | 1,500+ |
| Guardian | 3,000+ |
| Legend | 5,000+ |

These values are configurable project rules.

### FR-TIER-003 — Progress Display

The system shall show progress toward the next tier.

### FR-TIER-004 — Automatic Update

Tier shall be recalculated after eligible point changes.

---

# 3.13 Achievements and Badges

### FR-ACH-001 — Achievement Catalog

The system shall maintain an achievement catalog.

### FR-ACH-002 — Achievement Eligibility

The system shall evaluate achievement requirements after relevant citizen activities.

### FR-ACH-003 — Achievement Examples

The implementation may include:

- First Report
- 10 Reports
- 50 Reports
- 100 Verified Reports
- High Accuracy Reporter
- Community Contributor
- Top Reporter
- Road Guardian

### FR-ACH-004 — Unlock Record

An unlocked achievement shall have a record of the citizen and unlock time.

### FR-ACH-005 — Achievement Display

The citizen shall be able to view locked and unlocked achievements.

---

# 3.14 Leaderboard

### FR-LEADER-001 — Global Leaderboard

The system shall provide a leaderboard.

### FR-LEADER-002 — Ranking Basis

The initial ranking basis shall be reward points.

### FR-LEADER-003 — Leaderboard Fields

The leaderboard may display:

- Rank
- Citizen name
- Points
- Reports
- Verified reports
- Tier

### FR-LEADER-004 — Current User Rank

The citizen shall be able to identify their current ranking.

### FR-LEADER-005 — Protected Values

Leaderboard values shall be generated from trusted database records.

---

# 3.15 Notifications

### FR-NOTIFY-001 — In-App Notifications

If enabled in the final MVP, the system shall support Firestore-backed in-app notifications.

### FR-NOTIFY-002 — Notification Examples

Notifications may include:

- Report verified
- Points awarded
- Achievement unlocked
- Possible duplicate
- Report rejected

### FR-NOTIFY-003 — Notification State

Notifications may support read/unread state.

Email/push notification support is considered optional unless explicitly included in the final implementation scope.

---

# 3.16 Administrator Dashboard

### FR-ADMIN-001 — Admin Dashboard

The system shall provide a separate administrator dashboard.

### FR-ADMIN-002 — Summary Metrics

The dashboard shall show relevant system statistics.

### FR-ADMIN-003 — Metrics

Metrics may include:

- Total users
- Total reports
- Verified reports
- Pending reports
- Suspicious reports
- Total potholes detected
- Severity distribution
- Recent reports
- Reward distribution

### FR-ADMIN-004 — Analytics Visualization

Chart.js may be used for analytics charts.

---

# 3.17 Administrator Report Management

### FR-ADMIN-REPORT-001 — View All Reports

Authorized administrators shall be able to view reports within their permission scope.

### FR-ADMIN-REPORT-002 — Search

Administrators shall be able to search reports.

### FR-ADMIN-REPORT-003 — Filters

Administrators shall be able to filter reports by relevant fields.

### FR-ADMIN-REPORT-004 — Report Review

Administrators shall be able to open report details.

### FR-ADMIN-REPORT-005 — Verify

Administrators shall be able to verify eligible reports.

### FR-ADMIN-REPORT-006 — Reject

Administrators shall be able to reject reports with an appropriate reason where supported.

### FR-ADMIN-REPORT-007 — Flag

Administrators shall be able to flag reports for additional review.

---

# 3.18 Suspicious Reports

### FR-SUSP-001 — Suspicious Detection

The system shall identify reports with configured suspicious signals.

### FR-SUSP-002 — Possible Signals

Signals may include:

- Repeated images
- Repeated locations
- Excessive reports within a short period
- Very low AI confidence
- Unusual geographic activity
- Potentially invalid/fake images

### FR-SUSP-003 — Risk Score

The system may assign a configurable risk score.

### FR-SUSP-004 — Review

Administrators shall be able to review suspicious reports.

### FR-SUSP-005 — Resolution

Administrators shall be able to dismiss, reject, or otherwise resolve suspicious reports according to the configured workflow.

### FR-SUSP-006 — No Automatic Punishment

The MVP should not automatically punish a citizen solely because a heuristic signal was triggered; administrative review should be available.

---

# 3.19 Citizen Management

### FR-USERADMIN-001 — User List

Administrators shall be able to view registered citizens.

### FR-USERADMIN-002 — User Statistics

The interface may display:

- Name
- Email
- Registration date
- Reports
- Verified reports
- Points
- Tier
- Rank
- Account status

### FR-USERADMIN-003 — Administrative Investigation

Administrators shall be able to inspect user activity when investigating suspicious behavior.

### FR-USERADMIN-004 — Protected User Data

Administrative changes to important account data shall be restricted and audited where appropriate.

---

# 3.20 Analytics

### FR-ANALYTICS-001 — Report Trends

The system shall support reporting trends over time.

### FR-ANALYTICS-002 — Severity Analytics

The system shall support severity distribution.

### FR-ANALYTICS-003 — Area Analytics

The system shall support reports grouped by area where location data permits.

### FR-ANALYTICS-004 — Citizen Participation

The system shall support citizen participation statistics.

### FR-ANALYTICS-005 — AI Statistics

The system may display:

- Detection count
- Average confidence
- Processing time
- Detection success rate

### FR-ANALYTICS-006 — Reward Analytics

The system may display points distributed over time or across users.

---

# 4. External Interface Requirements

## 4.1 User Interface

The existing RoadGuard UI/design is the primary visual reference.

The implementation shall preserve the intended:

- Navigation structure
- Visual identity
- Cards
- Tables
- Forms
- Buttons
- Status indicators
- Charts
- Map interactions
- Responsive behavior

Mock data and mock interactions shall be replaced by real application behavior.

## 4.2 Frontend Interface

The frontend shall communicate with:

1. Firebase Authentication.
2. Firestore.
3. Firebase Storage.
4. Flask backend API.

Communication shall use secure HTTPS in deployed environments.

## 4.3 Firebase Authentication Interface

The frontend shall use Firebase Authentication for supported login/registration operations.

The system shall not implement a separate plaintext password database.

## 4.4 Firestore Interface

Firestore shall store application data such as:

- Users
- Reports
- Rewards
- Achievements
- User achievements
- Notifications
- Suspicious reports
- Administrative actions

## 4.5 Firebase Storage Interface

Storage shall contain:

- Original uploaded images
- AI-annotated images
- Other supported report media

## 4.6 Flask API Interface

A baseline API may include:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/analyze` | Run AI analysis |
| POST | `/api/reports/process` | Process a report |
| GET | `/api/reports/{id}` | Retrieve report |
| POST | `/api/reports/{id}/verify` | Verify report |
| POST | `/api/reports/{id}/reject` | Reject report |
| POST | `/api/rewards/calculate` | Calculate eligible rewards |
| GET | `/api/admin/analytics` | Retrieve analytics |

The exact API contract may be refined during implementation.

## 4.7 AI Response Interface

The AI service should use a consistent result structure similar to:

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

The exact fields may be extended when the final model supports additional outputs.

## 4.8 Map Interface

Leaflet shall provide the client-side map interface.

OpenStreetMap shall provide the baseline map tiles/data source subject to its usage requirements.

---

# 5. Data Requirements

## 5.1 User Entity

Suggested Firestore document:

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

### User Data Requirements

The system shall maintain:

- Unique user identifier
- Name
- Email
- Role
- Points
- Tier
- Report statistics
- Creation timestamp

Optional profile fields may include phone and city.

## 5.2 Report Entity

Suggested structure:

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

Additional fields may include:

- AI processing time
- Review timestamp
- Reviewer ID
- Rejection reason
- Duplicate reference
- Risk score
- Detection array

## 5.3 Reward Entity

```json
{
  "userId": "uid",
  "reportId": "reportId",
  "points": 100,
  "reason": "Verified pothole report",
  "createdAt": "timestamp"
}
```

## 5.4 Achievement Entity

```json
{
  "name": "First Report",
  "description": "Submit your first valid report",
  "requirement": 1,
  "type": "reports"
}
```

## 5.5 User Achievement Entity

```json
{
  "userId": "uid",
  "achievementId": "achievementId",
  "unlockedAt": "timestamp"
}
```

## 5.6 Suspicious Report Entity

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

## 5.7 Notification Entity

A possible structure:

```json
{
  "userId": "uid",
  "title": "Report Verified",
  "message": "Your report has been verified.",
  "type": "report_status",
  "read": false,
  "createdAt": "timestamp"
}
```

## 5.8 Administrative Action Entity

A possible structure:

```json
{
  "adminId": "uid",
  "action": "verify_report",
  "reportId": "reportId",
  "reason": "AI result confirmed",
  "createdAt": "timestamp"
}
```

---

# 6. Business Rules

## BR-001 — Default Role

Public registration creates a citizen account.

## BR-002 — Admin Role

Admin role assignment is controlled by trusted administrative configuration.

## BR-003 — Point Integrity

Users cannot directly assign points to themselves.

## BR-004 — Tier Integrity

Tier is derived from trusted point data.

## BR-005 — Leaderboard Integrity

Leaderboard ranking is derived from trusted point data.

## BR-006 — Duplicate Handling

Possible duplicates should be flagged rather than silently deleted.

## BR-007 — Suspicious Reports

Suspicious detection is a review signal, not definitive proof of wrongdoing.

## BR-008 — AI Uncertainty

AI predictions are probabilistic and should not be represented as guaranteed facts.

## BR-009 — Depth Estimation

Depth from a single ordinary image is an estimate unless a dedicated measurement system is introduced.

## BR-010 — Reward Eligibility

Reward rules shall be centralized and configurable.

## BR-011 — Verification

Administrative verification may be required before final reward allocation, depending on the selected reward policy.

## BR-012 — Data Ownership

A citizen can access their own private report and profile information according to Firebase/backend authorization rules.

---

# 7. Non-Functional Requirements

## 7.1 Security

### NFR-SEC-001

Firebase Security Rules shall be implemented.

### NFR-SEC-002

Server-side authorization shall be implemented for privileged operations.

### NFR-SEC-003

Users shall not be able to change their own role through client-side requests.

### NFR-SEC-004

Users shall not be able to modify their own points directly.

### NFR-SEC-005

Users shall not be able to modify another user's private reports.

### NFR-SEC-006

Firebase Admin SDK credentials shall never be exposed to the frontend.

### NFR-SEC-007

Secrets shall be stored through environment variables or secure configuration.

### NFR-SEC-008

`.env` and service-account credentials shall not be committed to Git.

### NFR-SEC-009

Deployed communication shall use HTTPS.

## 7.2 Performance

### NFR-PERF-001

The UI should provide immediate feedback for user actions.

### NFR-PERF-002

Loading states shall be displayed during long-running operations.

### NFR-PERF-003

Images should be resized/compressed when appropriate.

### NFR-PERF-004

The application shall avoid loading excessive report records simultaneously.

### NFR-PERF-005

Admin lists should use pagination or limited queries when required.

### NFR-PERF-006

AI inference time shall be monitored during development.

## 7.3 Reliability

### NFR-REL-001

Network/API errors shall not cause silent data loss.

### NFR-REL-002

Failed uploads shall provide a user-visible error.

### NFR-REL-003

AI failures shall leave the report in a recoverable state.

### NFR-REL-004

Critical report state changes should be persisted before showing success to the user.

## 7.4 Availability

The Firebase-hosted frontend should be available whenever the configured hosting and Firebase services are operational.

The local Flask AI service may be unavailable during development when the developer machine is offline.

## 7.5 Usability

### NFR-USE-001

The reporting workflow shall be understandable to first-time users.

### NFR-USE-002

The report form shall provide clear validation messages.

### NFR-USE-003

Long-running AI processing shall display progress/loading feedback.

### NFR-USE-004

Status labels shall be understandable.

### NFR-USE-005

The reporting flow shall be responsive on mobile devices.

## 7.6 Accessibility

The UI should:

- Use readable text.
- Provide labels for form fields.
- Maintain sufficient visual distinction between states.
- Provide keyboard-accessible controls where practical.
- Avoid communicating important information by color alone.

## 7.7 Scalability

The architecture should allow future migration from a local Flask AI service to a deployed service.

Firestore queries should be designed to avoid unnecessarily reading the entire report collection.

Large image files should remain in object storage rather than Firestore documents.

## 7.8 Maintainability

The application shall separate:

- UI logic
- API communication
- Firebase operations
- AI processing
- Business rules
- Reward logic
- Achievement logic
- Duplicate detection
- Administrative operations

## 7.9 Portability

The frontend should work across modern browsers.

The Python backend should run inside an isolated Python virtual environment with dependencies recorded in `requirements.txt`.

---

# 8. Security Requirements and Firebase Rules

## 8.1 Citizen Permissions

A citizen should be able to:

- Read their own profile.
- Update permitted profile fields.
- Create reports.
- Read their own reports.
- Read public leaderboard data.
- Read public map/report information as configured.
- Read their reward and achievement information.

## 8.2 Administrator Permissions

An administrator may:

- Read all authorized reports.
- Review suspicious reports.
- Verify/reject reports.
- Access analytics.
- Access citizen management data.
- Perform administrative actions.

## 8.3 Prohibited Client Operations

A citizen must not directly:

- Set their own points.
- Set their own tier.
- Set their own role to admin.
- Modify another user's reports.
- Mark their report as verified.
- Award themselves rewards.

## 8.4 Backend Authorization

Privileged actions shall be checked by trusted backend/admin logic rather than relying only on hidden UI buttons.

---

# 9. Use Cases

## UC-01 — Citizen Registration

**Actor:** Citizen

**Precondition:** User does not have an account.

**Main Flow:**

1. Citizen opens registration page.
2. Citizen enters required credentials.
3. System validates input.
4. Firebase Authentication creates the account.
5. System creates citizen profile.
6. Default role is assigned.
7. Citizen is redirected to the dashboard.

**Postcondition:** Citizen account exists.

---

## UC-02 — Citizen Login

**Actor:** Citizen

**Main Flow:**

1. Citizen enters login credentials.
2. Firebase validates credentials.
3. System retrieves authorized profile.
4. System redirects to citizen dashboard.

**Alternative:** Invalid credentials produce an error.

---

## UC-03 — Submit Pothole Report

**Actor:** Citizen

**Main Flow:**

1. Citizen opens Report Pothole.
2. Citizen selects image.
3. System validates image.
4. System displays preview.
5. System requests location permission when applicable.
6. Citizen confirms location.
7. Citizen optionally enters description.
8. System uploads image.
9. System creates report.
10. Report enters processing.
11. AI service processes image.
12. AI results are stored.
13. Duplicate detection runs.
14. Reward logic evaluates eligibility.
15. Citizen sees the result/status.

**Postcondition:** A report exists in the system.

---

## UC-04 — View My Reports

**Actor:** Citizen

**Main Flow:**

1. Citizen opens My Reports.
2. System retrieves authorized reports.
3. System displays report list.
4. Citizen filters reports if required.
5. Citizen opens a report for details.

---

## UC-05 — View Pothole Map

**Actor:** Citizen

**Main Flow:**

1. Citizen opens Map.
2. System loads map.
3. System retrieves eligible pothole location data.
4. System displays markers.
5. Citizen filters markers.
6. Citizen selects a marker.
7. System displays report summary.

---

## UC-06 — Earn Rewards

**Actor:** Citizen

**Main Flow:**

1. Citizen submits a report.
2. AI processes the image.
3. Report becomes eligible according to reward rules.
4. Backend calculates points.
5. Reward transaction is recorded.
6. User point balance is updated.
7. Tier is recalculated.
8. Achievement rules are checked.
9. Leaderboard data reflects the updated points.

---

## UC-07 — Unlock Achievement

**Actor:** Citizen / System

**Main Flow:**

1. Citizen completes an achievement requirement.
2. System checks eligibility.
3. System creates user-achievement record.
4. Achievement appears as unlocked.
5. Optional notification is generated.

---

## UC-08 — View Leaderboard

**Actor:** Citizen

**Main Flow:**

1. Citizen opens leaderboard.
2. System retrieves ranked users.
3. System displays rank, points, reports, and tier.
4. Citizen can identify their position.

---

## UC-09 — Admin Review Report

**Actor:** Administrator

**Main Flow:**

1. Admin logs in.
2. Admin opens report management.
3. Admin searches/filters reports.
4. Admin opens a report.
5. System displays image, AI result, location, and report information.
6. Admin verifies, rejects, or flags the report.
7. System records the action.
8. Related status/reward processing occurs according to business rules.

---

## UC-10 — Admin Review Suspicious Report

**Actor:** Administrator

**Main Flow:**

1. System flags a report.
2. Admin opens suspicious-report queue.
3. Admin examines evidence/signals.
4. Admin chooses an appropriate resolution.
5. System records resolution.
6. Report/user state is updated according to policy.

---

## UC-11 — Admin View Analytics

**Actor:** Administrator

**Main Flow:**

1. Admin opens analytics.
2. System retrieves authorized aggregate data.
3. System displays charts.
4. Admin filters by supported period/category.
5. System refreshes visualizations.

---

# 10. Report Processing Workflow

```text
Citizen
   |
   v
Select Image
   |
   v
Validate Image
   |
   v
Confirm Location
   |
   v
Upload to Storage
   |
   v
Create Firestore Report
   |
   v
PENDING
   |
   v
Flask API
   |
   v
Image Preprocessing
   |
   v
YOLOv8 Detection
   |
   +------> No Detection ------> Rejected/Review
   |
   v
Pothole Detection
   |
   v
Severity Estimation
   |
   v
Annotated Image
   |
   v
Duplicate Check
   |
   v
Suspicious Signals
   |
   v
Report Updated
   |
   v
Reward Evaluation
   |
   v
Achievement Check
   |
   v
Leaderboard Update
```

---

# 11. Recommended Folder Structure

```text
RoadGuard/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
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

# 12. Technology Requirements

## 12.1 Frontend

- HTML5
- CSS3
- Vanilla JavaScript

## 12.2 Cloud

- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Firebase Hosting

## 12.3 Backend

- Python
- Flask
- Firebase Admin SDK

## 12.4 AI

- YOLOv8 / Ultralytics
- PyTorch
- OpenCV
- NumPy
- Pillow

## 12.5 Mapping

- Leaflet
- OpenStreetMap

## 12.6 Charts

- Chart.js

## 12.7 Development Tools

- VS Code
- Git
- GitHub
- Python virtual environment

---

# 13. Testing Requirements

## 13.1 Authentication Testing

Test:

- Valid registration
- Invalid registration
- Valid login
- Invalid login
- Logout
- Session restoration
- Unauthorized admin access
- Role protection

## 13.2 Report Testing

Test:

- Valid image
- Unsupported image
- Oversized image
- Missing image
- Missing location
- Location permission denied
- Successful upload
- Upload failure
- Report creation
- Duplicate report

## 13.3 AI Testing

Test:

- Image containing one pothole
- Image containing multiple potholes
- Image containing no pothole
- Low-confidence detection
- Invalid image
- AI service unavailable
- Annotated image generation

## 13.4 Reward Testing

Test:

- Eligible report
- Verified report
- Rejected report
- Duplicate report
- Suspicious report
- Point calculation
- Tier transition
- Achievement unlock
- Leaderboard update

## 13.5 Admin Testing

Test:

- Admin login
- Report search
- Filtering
- Report review
- Verification
- Rejection
- Suspicious report review
- User management
- Analytics

## 13.6 Security Testing

Test attempts to:

- Change own role
- Change own points
- Change another user's report
- Read another user's private data
- Access admin pages without authorization
- Call privileged API endpoints without authorization
- Expose service-account credentials

## 13.7 Responsive UI Testing

Test at:

- Desktop
- Laptop
- Tablet
- Mobile

Especially test:

- Login
- Dashboard
- Report upload
- Report detail
- Map
- Leaderboard
- Admin dashboard

---

# 14. Acceptance Criteria

The MVP shall be considered functionally complete when:

1. A citizen can register and log in.
2. A citizen can submit a road image.
3. A citizen can provide or confirm location.
4. The image is stored in cloud storage.
5. A report is stored in Firestore.
6. The Flask API can process the image.
7. YOLOv8 can return a pothole detection result.
8. Detection confidence and pothole count are stored.
9. Severity is returned according to the implemented rule/model.
10. An annotated image can be generated when detection succeeds.
11. The citizen can view report status.
12. Duplicate checks are performed.
13. Eligible reports can receive points.
14. Tier calculation works.
15. Achievement checks work.
16. Leaderboard data is generated from trusted records.
17. The pothole map displays stored location data.
18. An administrator can review reports.
19. An administrator can verify/reject reports.
20. Suspicious reports can be reviewed.
21. Analytics can display stored system data.
22. Firebase rules prevent unauthorized client operations.
23. Admin credentials and secrets are not exposed.
24. The application works responsively on the target browsers/devices.

---

# 15. MVP vs Future Scope

## 15.1 MVP

The first stable release should contain:

### Citizen

- Registration/login
- Dashboard
- Image upload
- Location
- AI detection
- AI result
- Report status
- My reports
- Report details
- Map
- Reward points
- Tier
- Achievements
- Leaderboard
- Profile

### Admin

- Admin authentication
- Dashboard
- Report management
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

## 15.2 Future Enhancements

Potential future features include:

- Image similarity detection
- Advanced fraud detection
- Improved AI severity model
- More detailed road-condition analysis
- Email notifications
- Push notifications
- Heatmaps
- Advanced geospatial filtering
- Advanced AI performance dashboard
- Automatic report clustering
- Offline report queue
- PWA enhancements
- Dedicated mobile application
- More sophisticated computer-vision measurements

These should not block the initial MVP.

---

# 16. Deployment Requirements

## 16.1 Frontend Deployment

The frontend should be deployable using Firebase Hosting.

## 16.2 Backend Deployment

The Flask AI service may initially run locally for development and demonstration.

For later deployment, the Flask service should be hosted on a suitable Python-compatible environment.

## 16.3 Environment Configuration

Secrets shall be supplied through environment variables or secure deployment configuration.

Example:

```text
FLASK_ENV=development
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
```

The `.env` file must not be committed to Git.

## 16.4 Model Configuration

The YOLO model weights shall be stored or retrieved using a documented mechanism.

If the model is too large for GitHub, the repository shall contain instructions describing how to place/download the model.

---

# 17. Logging and Monitoring

The backend should log:

- API errors
- AI processing failures
- Report processing events
- Important administrative actions
- Authentication/authorization failures where appropriate
- Unexpected application errors

Logs must not expose passwords, service-account private keys, or other sensitive secrets.

---

# 18. Error Handling Requirements

The application shall provide useful errors for:

- Invalid credentials
- Invalid image
- Unsupported format
- Image too large
- Upload failure
- Location unavailable
- Location permission denied
- AI service unavailable
- AI processing failure
- Firestore failure
- Storage failure
- Unauthorized operation
- Network failure

The interface shall distinguish between:

- Recoverable user-input errors
- Temporary service errors
- Authorization errors
- System failures

---

# 19. Loading and Empty States

The application shall provide appropriate UI states for:

### Loading

- Login
- Registration
- Dashboard
- Image upload
- AI processing
- Report submission
- Map loading
- Analytics loading

### Empty

- No reports
- No achievements
- No notifications
- No leaderboard results
- No suspicious reports
- No map results

### Error

- AI failure
- Upload failure
- Database failure
- Unauthorized access

---

# 20. Traceability Matrix

| Requirement Area | Main Features | Verification |
|---|---|---|
| Authentication | Registration, login, logout | Functional + security testing |
| Profiles | View/edit profile | Functional testing |
| Reporting | Image + location + report | End-to-end testing |
| AI | Detection + confidence + severity | AI/API testing |
| Storage | Original/annotated images | Storage testing |
| Duplicate Detection | Nearby/duplicate checks | Functional testing |
| Status | Report lifecycle | Workflow testing |
| Rewards | Points + history | Business-rule testing |
| Tiers | Tier progression | Boundary testing |
| Achievements | Unlock logic | Functional testing |
| Leaderboard | Ranking | Data integrity testing |
| Map | Pothole visualization | UI + data testing |
| Admin | Review/verification | Role/security testing |
| Suspicious Reports | Flag/review | Workflow testing |
| Analytics | Charts/statistics | Data validation |
| Security | Rules + authorization | Security testing |
| Responsive UI | Mobile/tablet/desktop | UI testing |

---

# 21. Development Milestones

## Milestone 1 — Foundation

Deliver:

- Project setup
- UI pages
- Firebase setup
- Authentication
- Database foundation

## Milestone 2 — Reporting

Deliver:

- Image upload
- Location
- Storage
- Report creation
- Report history

## Milestone 3 — AI

Deliver:

- Flask API
- YOLOv8
- AI detection
- Confidence
- Severity
- Annotated image

## Milestone 4 — Citizen Platform

Deliver:

- Rewards
- Tiers
- Achievements
- Leaderboard
- Map
- Profile

## Milestone 5 — Administration

Deliver:

- Admin dashboard
- Report review
- Verification/rejection
- Suspicious reports
- Citizen management
- Analytics

## Milestone 6 — Hardening

Deliver:

- Firebase security rules
- Backend authorization
- Error handling
- Responsive UI
- Performance optimization
- Testing
- Deployment

---

# 22. Project Success Criteria

RoadGuard will satisfy its primary project goals when it demonstrates:

1. Cloud-based user authentication.
2. Cloud-based report persistence.
3. Cloud image storage.
4. AI-based pothole detection.
5. Location-aware road reporting.
6. Duplicate-report detection.
7. Report status tracking.
8. Citizen gamification through points.
9. Achievements and tiers.
10. Leaderboard.
11. Interactive pothole map.
12. Administrator moderation.
13. Suspicious-report handling.
14. Analytics.
15. Secure role-based access.
16. A responsive implementation of the supplied RoadGuard UI.

---

# 23. Final System Summary

RoadGuard combines cloud computing, computer vision, geolocation, database services, authentication, analytics, and gamification into a single citizen road-monitoring platform.

The intended end-to-end system is:

```text
                 ROADGUARD
                     |
          +----------+----------+
          |                     |
       CITIZEN                ADMIN
          |                     |
          v                     v
      Web UI                Admin UI
          |                     |
          +----------+----------+
                     |
              Firebase Services
          +----------+----------+
          |          |          |
         Auth     Firestore   Storage
                     |
                     v
                 Flask API
                     |
          +----------+----------+
          |                     |
       AI Engine          Business Logic
          |                     |
       YOLOv8            Rewards / Tiers
       OpenCV            Achievements
       PyTorch           Duplicate Check
          |              Suspicious Check
          +----------+----------+
                     |
                     v
              RoadGuard Data
                     |
          +----------+----------+
          |          |          |
        Map      Dashboard   Analytics
```

The MVP should prioritize a reliable core flow:

```text
Register/Login
     ↓
Upload Image
     ↓
Confirm Location
     ↓
Cloud Storage
     ↓
AI Detection
     ↓
Severity/Confidence
     ↓
Duplicate Check
     ↓
Report Status
     ↓
Reward Calculation
     ↓
Achievements/Tier
     ↓
Leaderboard
     ↓
Map
     ↓
Admin Review
     ↓
Analytics
```

This SRS should be treated as the baseline requirements document. Any feature added or removed during development should be recorded as a change to the requirements rather than silently changing the system specification.
