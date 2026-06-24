# ResearchIQ Backend Spec (Non-AI Scope)

> Reconciled against the UI implementation (`src/app/context/AppContext.tsx` + pages) on 2026-05-30.
> See **API conventions** and **Implementation status** at the bottom.

## API conventions (apply to all endpoints)
- **IDs**: strings (UUID).
- **Timestamps**: ISO-8601 (`createdAt`, `submittedDate`, `joinedDate`, …).
- **List-like fields are JSON string arrays**, not comma-separated strings:
  `authors`, `keywords`, `collaborators`, `expertiseKeywords`, `publicationsList`, `areasOfInterest`, `suggestedKeywords`, `ipWhitelist`. (Stored CSV internally, serialized/accepted as arrays.)
- **Enums**: the backend serializes enum values in UPPERCASE (e.g. `PENDING`, `SEEKING`, `SUCCESS`); the UI lowercases for display. Allowed values are listed per field below.
- **Money/amounts**: backend uses numeric (`fundingAmountNeeded`, `proposedAmount` as decimals); the UI may render formatted strings.
- **Field naming**: a few backend names differ from the UI's loose prototype names (e.g. `organization` vs `organizationName`, `citationCount` vs `citations`, `cvUrl` vs `cv`, `timelineMonths` vs `timeline`). These are name-only differences; the UI adapts. Structural/array differences are aligned in the backend.

## 1) Authentication & Accounts
**Roles:** `RESEARCHER`, `FUNDER`, `MANAGER`, `DEPARTMENT_HEAD`, `ADMIN`

### Core flows
1. **Login** — email + password; returns JWT + user.
   - **Admin two-step MFA:** first call (valid email+password, no `mfaCode`) → **HTTP 200** with `{ mfaRequired: true, token: null, user: null }` and a 6-digit code is dispatched. Resubmit the **same** email+password **plus `mfaCode`** → 200 with token. A wrong password → **401** (so the client distinguishes "needs MFA" from "bad credentials"); an invalid/expired code → **400**. Non-admins get the token on the first call (`mfaRequired: false`).
   - The code is currently delivered to the **server log only** (no email integration yet); the prototype's hardcoded `123456` does not apply to the live backend.
2. **Researcher signup (multi-step)**
   - Step 1 (Basics): name, email, password (+confirm in UI), institution, department, ORCID
   - **Email verification**: send 6-digit code → verify before submit
   - Step 2 (Credentials): degree, educationSummary, yearsExperience, CV upload (PDF/DOC → `cvUrl`)
   - Step 3 (Publications): `publicationsList` (string array of titles/citations)
   - Optional: `expertiseKeywords` (string array)
   - Submit → user with status `PENDING`
3. **Funder signup** — organization, email, password, contact name/phone, `areasOfInterest` (string array), investmentRange → status `PENDING`
4. **Password reset** — request OTP by email → confirm with OTP + new password
5. **Staff provisioning** — admin creates `FUNDER`/`MANAGER`/`DEPARTMENT_HEAD`/`ADMIN` accounts (status `ACTIVE`)

### Account status
- Single status enum: **`PENDING` → `ACTIVE` → `DISABLED`**. (UI's `verified`/`accredited` flags are derived from approval; `disabled` ⇔ `DISABLED`.)
- Login blocks `PENDING` (non-admin) and `DISABLED` accounts. Admin can disable/enable/delete users.

### User profile (key fields)
`id, name, email, role, status, department, position, institution, orcid, degree, educationSummary, yearsExperience, cvUrl, profilePicture, expertiseKeywords[], publicationsList[], phone, organization, areasOfInterest[], investmentRange, joinedDate`

## 2) Collaboration & Messaging
### Features
1. **Collaborator discovery** — search by name/department, filter by department; match score + explanation from shared expertise keywords + department.
2. **Collaboration requests** — `collaborationType`, `timelineMonths`, `message`; status `PENDING|ACCEPTED|REJECTED`; incoming + sent tabs with filters.
   - `collaborationType` values (UI): `joint-paper | research-project | grant-proposal | data-sharing | supervision`
3. **Collaboration network** *(not yet implemented)* — co-authorship edges; metrics degree/centrality/keyword count; gap analysis; CSV export.
4. **Chat** — 1:1 messaging with attachments; unread counts + read receipts.
5. **Notifications** — types `COLLABORATION | FUNDING | PUBLICATION | CITATION | SYSTEM`.

### Collaboration data model (key fields)
| Entity | Key fields |
|---|---|
| CollaborationRequest | id, requestType(`COLLABORATION`/`FUNDING`), fromUserId, fromUserName, toUserId, toUserName, researchId?, researchTitle?, message, collaborationType?, timelineMonths?, proposedAmount?, status, createdAt, updatedAt |
| ChatMessage | id, senderId, senderName, receiverId, receiverName, content, createdAt, readStatus, attachmentUrl?, attachmentName? |
| Notification | id, type, title, message, readStatus, link?, createdAt |

## 3) Research & Publications
### Features
1. **Research submission** — title, abstractText, authors[], field, doi?, fundingStatus, fundingAmountNeeded?, coverImage?, attachmentUrl?, attachmentLabel?, suggestedKeywords[] → `PendingPublication` (status `PENDING`).
   - `fundingStatus` values: `SEEKING | FUNDED | COMPLETED`
2. **Admin approval** — approve → indexed `Research`; reject → status `REJECTED` with rejectionReason.
3. **Feed** — publication cards with like/share/comment counters.
4. **Discover** — filter by query/field; detail with author info, DOI, stats.
5. **Researcher profile** — metadata + recent publications.
6. **Analytics** — publicationCount, totalCitations, hIndex, keywordFrequency, fundingStatusDistribution.
7. **Research trends** — aggregates by field + funding status. *(CSV export not yet implemented.)*
8. **Expertise map** — keyword → expert density; expert search by keyword. *(Similarity analysis + CSV export not yet implemented.)*

### Research data model (key fields)
| Entity | Key fields |
|---|---|
| Research | id, title, abstractText, authors[], keywords[], collaborators[], field, publicationDate, citationCount, likeCount, shareCount, commentCount, doi?, researcherId, researcherName, researcherDepartment, researcherInstitution, fundingStatus?, fundingAmountNeeded?, coverImage?, attachmentUrl?, attachmentLabel?, createdAt |
| PendingPublication | id, researcherId, researcherName, researcherEmail, submittedDate, title, abstractText, authors[], field, doi?, fundingStatus?, fundingAmountNeeded?, coverImage?, attachmentUrl?, attachmentLabel?, suggestedKeywords[], rejectionReason?, status |

## 4) Funding (Researcher + Funder workflows)
> Two distinct concepts the UI surfaces:
> - **Funder RFP** (`FunderRfp`) — an opportunity *posted by a funder* on the platform.
> - **Curated external opportunities** — agency-style grants the UI lists (agency, amount, deadline, areas, successRate). Currently UI-side mock data; not modeled in the backend.

### Researcher side
- Browse funder RFPs (`GET /funding/opportunities`).
- **Apply to an opportunity** (`POST /funding/applications`) → creates a `CollaborationRequest` of type `FUNDING` with `researchId?`, `proposedAmount`, `timelineMonths`, `message`; appears in the researcher's **sent** requests.

### Funder side
- **Discover projects seeking funding** (`GET /funding/projects`) — filters: query, field.
- **Express interest** (`POST /funding/interests`) → `FunderInterest`.
- **Manage interests** — list own (`GET /funding/interests`), per-research (owner/admin only), update status.
- **Post RFP** (`POST /funding/rfp`); list own (`GET /funding/my-rfps`).
- Update funder profile: areasOfInterest, investmentRange.

### Funding data model (key fields)
| Entity | Key fields |
|---|---|
| FunderInterest | id, funderId, funderName, funderOrganization, researchId, researchTitle, status(`PENDING`/`DISCUSSION`/`FUNDED`/`DECLINED`), message?, createdAt, updatedAt |
| FunderRfp | id, funderId, funderName, funderOrganization, title, summary, amountRange, areas?, deadline, status(`OPEN`), createdAt |
| (Funding application) | modeled as a `CollaborationRequest` with `requestType=FUNDING` (see §2) |

## 5) Admin & Security Management
### Admin dashboard
- Approve/reject researchers & funders (pending users).
- Approve/reject pending publications.
- Create staff accounts.
- User directory: filter by role/status; disable/enable/delete.
- CSV import of publications *(not yet implemented)*.

### Security & users (admin tabbed UI) — implemented under `/api/v1/admin/security`
- Audit logs (filter by userId/action).
- User sessions (list, terminate). *(Stateless JWT: terminate marks the session inactive; the token stays valid until expiry.)*
- Permissions by role (list, upsert, delete).
- Security settings (global singleton).

### Security data model (key fields)
| Entity | Key fields |
|---|---|
| UserPermission | id, role, resource, actions[] — values `CREATE|READ|UPDATE|DELETE|APPROVE|ADMIN` |
| AuditLog | id, userId, userName, action, resource, resourceId?, changes?, timestamp, ipAddress?, status(`SUCCESS`/`FAILURE`), details? |
| UserSession | id, userId, userName, loginTime, lastActivity, expiryTime?, ipAddress?, deviceInfo?, active |
| SecuritySettings | mfaEnabled, mfaType?(`totp`/`email`/`sms`), passwordExpireDays?, sessionTimeoutMinutes?, ipWhitelist[]?, loginAttemptLimit?, dataEncryption, auditLoggingEnabled, updatedAt |

## 6) Reporting & Dashboards *(not yet implemented)*
### Report Builder (admin/manager)
- Create report: name, type, schedule, format, sections; generate on demand; history of outputs.
- `Report.type`: `performance | collaboration | funding | trend | custom`
- `Report.schedule`: `daily | weekly | monthly | quarterly | once`
- `Report.format`: `pdf | excel | html | json`
- `Report.status`: `draft | active | archived`

### Dashboard Customizer
- Personal role-aware dashboards; add/remove widgets; set default.
- `Dashboard.layout`: `grid | freeform`
- `DashboardWidget.type`: `chart | metric | table | list | network | map`

### Reporting data model
| Entity | Key fields |
|---|---|
| Report | id, name, type, description?, createdBy, createdAt, lastGenerated?, schedule?, nextRunDate?, filters, sections[], format, recipients?, status |
| ReportData | id, reportId, generatedAt, generatedBy, data, fileName, filePath |
| Dashboard | id, name, userId, role, isDefault, widgets[], layout, createdAt, lastModified |
| DashboardWidget | id, dashboardId, type, title, description?, dataSource, position, size, config, refreshInterval?, order |

## 7) Data Integration (Non-AI) *(not yet implemented)*
- Manage external data sources; per-source status; trigger sync; view recent activity.
- `DataSourceConfig.type`: `scopus | wos | pubmed | orcid | repository | scholar | custom`
- `DataSourceConfig.status`: `connected | disconnected | error | syncing`
- `DataSourceConfig.syncFrequency`: `hourly | daily | weekly | monthly`

| Entity | Key fields |
|---|---|
| DataSourceConfig | id, name, type, endpoint?, apiKey?, status, lastSync, recordsIndexed, syncFrequency, fieldMapping?, filters?, createdAt, lastModified |

> **Excluded (AI scope):** `ProcessingJob` and `DataQualityMetrics` (knowledge-processing / NLP extraction) exist in the UI but are out of the non-AI backend scope.

## Access & Permissions (high-level)
- **Researcher:** submit publications, view feed/discover, request collaboration, view analytics, apply to funding.
- **Funder:** browse seeking-funding projects, express interest, post RFPs.
- **Manager / Department Head:** dashboards, analytics, reports, data integration.
- **Admin:** approvals, user/security management, import publications.

## Implementation Notes
- **File uploads:** CVs, publication cover/PDF → object storage, reference by URL.
- **Derived keywords:** from approved publication metadata + optional hints (no AI).
- **Exports:** CSV endpoints for trends, network, expertise map, funding opportunities *(not yet implemented)*.
- **Requests:** a single `CollaborationRequest` model covers collaboration + funding applications.

## Implementation status (2026-05-30)
| Area | Status |
|---|---|
| Auth, signup, password reset, MFA, email verification | Implemented |
| User profile (`/users/me`, `/users/{id}`) | Implemented |
| Collaboration discovery + requests | Implemented |
| Chat + notifications | Implemented (notifications wired to events) |
| Research submit/feed/discover/analytics/trends/expertise-map | Implemented |
| Funding projects/interests/RFP/applications | Implemented |
| Admin approvals + user directory | Implemented |
| Security management (audit, sessions, permissions, settings) | Implemented |
| Collaboration network graph | ⛔ Pending |
| CSV exports (trends/network/expertise/funding) | ⛔ Pending |
| Reporting & Dashboards | ⛔ Pending |
| Data Integration (DataSourceConfig) | ⛔ Pending |
| CSV import of publications | ⛔ Pending |
| Knowledge processing / data quality | 🚫 AI scope (excluded) |
