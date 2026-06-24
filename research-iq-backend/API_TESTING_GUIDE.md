# ResearchIQ API Testing Guide

**Status:** Once backend shows "Started ResearchiqApplication", open this URL in your browser

---

## 🌐 Access Swagger UI

**URL:** http://localhost:8080/swagger-ui.html

You'll see all 100+ endpoints organized by category with full documentation.

---

## 📝 Testing Workflow

### **Phase 1: Authentication (Start Here)**

Before testing any other endpoints, you need a user account and JWT token.

#### **1.1 Register a New User**

**Endpoint:** `POST /api/v1/auth/register`

**In Swagger UI:**
1. Click **"AuthController"** section
2. Click **"POST /api/v1/auth/register"**
3. Click **"Try it out"**
4. Enter this JSON in request body:

```json
{
  "name": "Dr. John Smith",
  "email": "john.smith@university.edu",
  "password": "SecurePassword123!",
  "institution": "University of Rwanda",
  "department": "Computer Science",
  "orcid": "0000-0001-2345-6789",
  "role": "RESEARCHER"
}
```

5. Click **"Execute"**
6. Expected response (201):
```json
{
  "id": "uuid-here",
  "name": "Dr. John Smith",
  "email": "john.smith@university.edu",
  "role": "RESEARCHER",
  "status": "PENDING"
}
```

#### **1.2 Admin Approves Your Account**

**Note:** In real system, admin would approve. For testing, request as admin instead:

```json
{
  "name": "Admin User",
  "email": "admin@university.edu",
  "password": "AdminPass123!",
  "institution": "University of Rwanda",
  "department": "Administration",
  "orcid": "0000-0001-9999-9999",
  "role": "ADMIN"
}
```

#### **1.3 Login to Get JWT Token**

**Endpoint:** `POST /api/v1/auth/login`

1. Click **"POST /api/v1/auth/login"**
2. Enter credentials:
```json
{
  "email": "john.smith@university.edu",
  "password": "SecurePassword123!"
}
```

3. Response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "name": "Dr. John Smith",
    "email": "john.smith@university.edu",
    "role": "RESEARCHER"
  },
  "mfaRequired": false
}
```

**⚠️ IMPORTANT:** Copy this token - you'll need it for all other endpoints!

---

### **Phase 2: User Profile Management**

#### **2.1 Get Your Profile**

**Endpoint:** `GET /api/v1/users/me`

1. Click endpoint
2. Click **"Try it out"**
3. **Authorize:** Click lock icon 🔒 at top right
   - Select **"Bearer token"**
   - Paste your JWT token from login
   - Click **"Authorize"**
4. Click **"Execute"**
5. Expected (200): Your user profile

#### **2.2 Update Your Profile**

**Endpoint:** `PUT /api/v1/users/me`

```json
{
  "yearsExperience": 10,
  "educationSummary": "PhD in Computer Science from University of Rwanda",
  "expertiseKeywords": ["Machine Learning", "Data Science", "AI"],
  "publicationsList": ["Paper 1: ML Applications", "Paper 2: Data Analysis"]
}
```

---

### **Phase 3: Testing AI Endpoints (26 Total)**

These endpoints call your 10 AI services running on ports 8001-8010.

#### **Group A: Expertise Mapping (Service 8001)**

**3.1 Get Expertise Profile**
- **Endpoint:** `GET /api/v1/ai/expertise/profile/{researcherId}`
- **Parameter:** Use any researcher ID (try: "RWR001")
- **Response:** Keywords, expertise scores, research areas
- **Example Response:**
```json
{
  "researcher_id": "RWR001",
  "name": "Dr. Example",
  "top_keywords": [
    {"keyword": "agriculture", "score": 0.45},
    {"keyword": "food security", "score": 0.42}
  ]
}
```

**3.2 Search by Keyword**
- **Endpoint:** `GET /api/v1/ai/expertise/search`
- **Parameter:** `keyword=agriculture`
- **Response:** List of researchers expert in that area

---

#### **Group B: Collaboration (Service 8002)**

**3.3 Get Collaboration Recommendations**
- **Endpoint:** `GET /api/v1/ai/collaboration/recommend/{researcherId}`
- **Parameter:** researcherId (e.g., "RWR001")
- **Response:** List of recommended collaborators with similarity scores

**3.4 Check Collaboration Compatibility**
- **Endpoint:** `POST /api/v1/ai/collaboration/compatibility`
- **Body:**
```json
{
  "researcher1_id": "RWR001",
  "researcher2_id": "RWR002"
}
```
- **Response:** Compatibility score (0-1)

---

#### **Group C: Research Trends (Service 8003)**

**3.5 Get Full Trends**
- **Endpoint:** `GET /api/v1/ai/trends/full`
- **Response:** Publication trends by research area, forecasts, emerging areas
```json
{
  "trends_by_area": {
    "Agriculture": {"2023": 12, "2024": 15, "2025_forecast": 18},
    "Health": {"2023": 8, "2024": 10, "2025_forecast": 12}
  }
}
```

**3.6 Export Trends as CSV**
- **Endpoint:** `GET /api/v1/ai/trends/export`
- **Response:** CSV file download

---

#### **Group D: Funding (Service 8004)**

**3.7 Get Funding Match**
- **Endpoint:** `GET /api/v1/ai/funding/match/{researcherId}`
- **Parameter:** researcherId
- **Response:** Ranked list of matching funding opportunities
```json
{
  "matches": [
    {"opportunity": "Gates Foundation", "score": 0.89},
    {"opportunity": "NCST", "score": 0.67}
  ]
}
```

---

#### **Group E: Knowledge Processing (Service 8005)**

**3.8 Classify Text**
- **Endpoint:** `POST /api/v1/ai/knowledge/classify`
- **Body:**
```json
{
  "text": "This study examines the impact of climate change on agricultural productivity in Sub-Saharan Africa"
}
```
- **Response:** Extracted keywords, research area classification

**3.9 Process Knowledge**
- **Endpoint:** `POST /api/v1/ai/knowledge/process`
- **Body:** Raw text
- **Response:** NLP processing results

---

#### **Group F: Network Analysis (Service 8006)**

**3.10 Analyze Network**
- **Endpoint:** `GET /api/v1/ai/network/analysis/{researcherId}`
- **Response:** Network metrics (degree, betweenness, clustering)

**3.11 Get Top Collaborators**
- **Endpoint:** `GET /api/v1/ai/network/collaborators/{researcherId}`
- **Response:** Ranked co-authors by collaboration strength

**3.12 Get Network Graph**
- **Endpoint:** `GET /api/v1/ai/network/graph/{researcherId}`
- **Response:** Full collaboration network for visualization

**3.13 Export Network as CSV**
- **Endpoint:** `GET /api/v1/ai/network/export/graph/{researcherId}`
- **Response:** CSV download

---

#### **Group G: Department Analytics (Service 8007)**

**3.14 Get Department Analytics**
- **Endpoint:** `GET /api/v1/ai/analytics/departments`
- **Response:** Department statistics, averages, comparisons

---

#### **Group H: Research Portfolio (Service 8008)**

**3.15 Analyze Portfolio**
- **Endpoint:** `GET /api/v1/ai/portfolio/analyze`
- **Response:** Portfolio diversity, gap analysis, recommendations

---

#### **Group I: Faculty Intelligence (Service 8009)**

**3.16 Get Faculty Profiles**
- **Endpoint:** `GET /api/v1/ai/faculty/profiles`
- **Response:** Faculty aggregated data, profiles, insights

---

#### **Group J: Knowledge Pipeline (Service 8010)**

**3.17 Run Pipeline**
- **Endpoint:** `POST /api/v1/ai/pipeline/run`
- **Body:**
```json
{
  "batch_id": "batch_001",
  "publications": ["pub1", "pub2", "pub3"]
}
```
- **Response:** Processing results

---

### **Phase 4: Collaboration Features**

#### **4.1 Request Collaboration**
- **Endpoint:** `POST /api/v1/collaborations/request`
- **Body:**
```json
{
  "toUserId": "target-researcher-id",
  "collaborationType": "joint-paper",
  "timelineMonths": 6,
  "message": "I'd like to collaborate on AI research"
}
```

#### **4.2 View Incoming Requests**
- **Endpoint:** `GET /api/v1/collaborations/incoming`
- **Response:** List of collaboration requests sent to you

#### **4.3 View Sent Requests**
- **Endpoint:** `GET /api/v1/collaborations/sent`
- **Response:** Requests you've sent to others

#### **4.4 Accept/Reject**
- **Endpoint:** `PUT /api/v1/collaborations/{requestId}/accept`
- Or: `PUT /api/v1/collaborations/{requestId}/reject`

---

### **Phase 5: Research & Publications**

#### **5.1 Submit Publication**
- **Endpoint:** `POST /api/v1/research/submit`
- **Body:**
```json
{
  "title": "Climate Change Impact on Agriculture",
  "abstractText": "This study examines...",
  "authors": ["Dr. John Smith", "Dr. Jane Doe"],
  "field": "Agriculture",
  "fundingStatus": "SEEKING"
}
```

#### **5.2 Get Publication Feed**
- **Endpoint:** `GET /api/v1/research/feed`
- **Response:** Recent publications

#### **5.3 Get Analytics**
- **Endpoint:** `GET /api/v1/research/analytics`
- **Response:** Your publication stats, h-index, citations

---

### **Phase 6: Messaging & Notifications**

#### **6.1 Send Message**
- **Endpoint:** `POST /api/v1/chat/send`
- **Body:**
```json
{
  "toUserId": "recipient-id",
  "content": "Hello, would you like to collaborate?"
}
```

#### **6.2 Get Notifications**
- **Endpoint:** `GET /api/v1/notifications`
- **Response:** All your notifications

---

### **Phase 7: New Features Testing**

#### **7.1 Create Dashboard**
- **Endpoint:** `POST /api/v1/dashboards`
- **Body:**
```json
{
  "name": "My Research Dashboard",
  "role": "RESEARCHER",
  "layout": "GRID"
}
```
- **Response:** Dashboard created with default widgets

#### **7.2 Create Report**
- **Endpoint:** `POST /api/v1/reports`
- **Body:**
```json
{
  "name": "Monthly Research Report",
  "type": "PERFORMANCE",
  "format": "PDF",
  "schedule": "MONTHLY"
}
```

#### **7.3 Upload Publications (CSV)**
- **Endpoint:** `POST /api/v1/publications/import/upload`
- **Body:** multipart/form-data with CSV file
- **CSV Format:**
```
title,authors,abstract,field,doi
"Paper 1","Author 1; Author 2","Abstract text","Agriculture","10.xxxx/xxxx"
```

---

## 📊 Testing Checklist

### **Quick Test (5 minutes)**
- [ ] Register user
- [ ] Login
- [ ] Get profile
- [ ] Test 1 AI endpoint (expertise mapping)

### **Complete Test (30 minutes)**
- [ ] All authentication endpoints
- [ ] User profile management
- [ ] All 26 AI endpoints (at least one from each group)
- [ ] Collaboration features
- [ ] Chat & notifications
- [ ] New features (dashboards, reports)

### **Full Integration Test (1 hour)**
- [ ] Complete all above
- [ ] Create multiple user types (RESEARCHER, FUNDER, MANAGER, ADMIN)
- [ ] Test role-based access (ADMIN endpoints)
- [ ] Submit publications
- [ ] Create collaboration requests
- [ ] Upload CSV files
- [ ] Verify all error handling

---

## 🔐 Authorization Note

**All endpoints (except /auth/register and /auth/login) require JWT token:**

1. Get token from `/auth/login`
2. In Swagger: Click 🔒 lock icon
3. Select "Bearer token"
4. Paste token
5. Click "Authorize"

---

## ✅ When Backend is Ready

1. **Open browser:** http://localhost:8080/swagger-ui.html
2. **Follow Phase 1:** Register & login
3. **Copy JWT token** from login response
4. **Authorize in Swagger** with that token
5. **Test each phase** in order

---

## 📞 Common Issues

**Issue:** Token expires or becomes invalid
**Solution:** Re-login to get new token

**Issue:** 401 Unauthorized response
**Solution:** Make sure you authorized with a valid token in Swagger

**Issue:** AI endpoint returns empty response
**Solution:** Make sure AI services are running on 8001-8010

**Issue:** Database error
**Solution:** Check PostgreSQL is running and database exists

---

**Ready to test once backend finishes starting!**

Built by Claude Code  
June 18, 2026
