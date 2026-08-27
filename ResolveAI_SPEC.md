# ResolveAI — Complete Spec-Driven Development Specification

> **Authoritative Source of Truth**
>
> This file is the single source of truth for the ResolveAI project. Any AI coding agent such as Codex, Antigravity, Cursor, Claude Code, Copilot, Replit, Bolt, or similar tools must read this specification before modifying the project. If implementation details conflict with this file, this specification wins unless the human developer explicitly changes it.

---

# 1. Project Overview

## 1.1 Project Name

**ResolveAI**

## 1.2 Full Name

**ResolveAI — Intelligent Issue Resolution & Workflow Automation Platform**

## 1.3 Tagline

**From Complaint to Resolution — Automatically.**

Alternative portfolio tagline:

**AI-Powered Issue Resolution, Smart Workforce Assignment and Operational Intelligence**

## 1.4 Project Category

**AI + Full-Stack + Workflow Automation + Operations Management**

## 1.5 Problem Statement

Colleges, hostels, apartments, hospitals, offices, factories, and other institutions receive many complaints and service requests.

Traditional complaint systems usually stop at:

1. User submits complaint.
2. Admin reads complaint.
3. Admin manually decides department.
4. Admin manually selects worker.
5. Worker resolves issue.
6. Admin changes status.

This creates real-world problems:

- Complaints are categorized manually.
- Critical issues may not receive correct priority.
- Administrators spend time assigning routine work.
- Workers may be assigned outside their skill set.
- Some workers become overloaded while others remain idle.
- Off-duty or unavailable workers may be contacted.
- Similar complaints create duplicate work.
- Complaints may remain unresolved beyond expected deadlines.
- Managers may not know when an SLA is breached.
- Workers may mark issues resolved without user confirmation.
- Colleges and hostel authorities cannot easily identify recurring infrastructure problems.
- Management has limited analytics about staff performance and repeated failures.
- Workers may miss assignments when notifications are weak.
- Large institutions need an efficient way to onboard existing staff.

ResolveAI must automate the complete complaint-to-resolution lifecycle while keeping institutional authorities in control.

The platform must:

**Understand → Categorize → Prioritize → Route → Assign → Notify → Monitor → Escalate → Verify → Analyze**

---

# 2. Main Product Objective

Build a full-stack AI-powered issue-resolution and workflow-automation platform where users report real-world problems and the system automatically:

1. Understands the complaint.
2. Summarizes the complaint.
3. Identifies category and subcategory.
4. Extracts location.
5. Calculates priority.
6. Detects possible duplicates.
7. Selects the responsible department.
8. Finds eligible workers.
9. Scores workers using skills, availability, workload, performance, and location.
10. Assigns the best eligible worker.
11. Notifies the worker.
12. Requires worker acceptance.
13. Reassigns or escalates ignored assignments.
14. Starts an SLA deadline.
15. Sends SLA warnings.
16. Escalates overdue complaints.
17. Allows workers to update progress.
18. Collects resolution evidence.
19. Requests user confirmation.
20. Reopens failed resolutions.
21. Detects recurring operational problems.
22. Creates or supports master incidents.
23. Generates management analytics.
24. Keeps an auditable log of automated decisions.

---

# 3. Core Product Principle

ResolveAI must **not** behave like a basic CRUD complaint-management app.

The central product flow must be:

```text
User Complaint
      ↓
AI Analysis
      ↓
Category + Priority + Location
      ↓
Duplicate Detection
      ↓
Department Selection
      ↓
Eligible Worker Search
      ↓
Smart Worker Scoring
      ↓
Automatic Assignment
      ↓
Worker Notification
      ↓
Worker Accepts
      ↓
SLA Monitoring
      ↓
Work Progress
      ↓
Resolution Evidence
      ↓
User Confirmation
      ↓
Closed
```

If worker does not accept:

```text
Worker Assigned
      ↓
Acceptance Timeout
      ↓
Accepted?
   /       \
 YES       NO
  ↓         ↓
Work      Reminder
            ↓
       Still No Response?
            ↓
       Auto-Reassign
            ↓
       Manager Alert
```

If complaint is overdue:

```text
SLA Deadline
      ↓
Deadline Exceeded
      ↓
Automatic Escalation
      ↓
Department Manager
      ↓
Reassignment / Intervention
      ↓
Admin Escalation if still unresolved
```

Recurring-issue flow:

```text
Recent Complaints
      ↓
Similarity Analysis
      ↓
Complaint Cluster
      ↓
Recurring Pattern Detected
      ↓
Admin Insight
      ↓
Optional Master Incident
```

---

# 4. Deployment Model

ResolveAI is designed for an organization.

Examples:

- College
- University
- Hostel
- Apartment community
- Hospital
- Office campus
- Factory
- Service organization

The organization provides the existing workforce.

**ResolveAI does not recruit workers.**

The institution administrator registers or imports employees into the platform.

The authority controls:

- Departments
- Managers
- Workers
- Worker skills
- Worker locations
- Worker shifts
- Worker maximum workload
- Worker availability
- Worker active/inactive state
- SLA rules
- Manual reassignment

ResolveAI controls routine operational automation.

Managers and admins always have manual override capability.

---

# 5. User Roles

The system must support four primary roles.

## 5.1 USER

Represents:

- Student
- Resident
- Employee
- Customer
- Citizen

Permissions:

- Register account
- Login
- Submit complaint
- Upload complaint image
- View own complaints
- Track complaint timeline
- View assigned department and worker when allowed
- Add comments
- Confirm resolution
- Reject resolution
- Reopen complaint
- Provide rating
- Provide feedback
- Receive notifications

---

## 5.2 WORKER

Represents existing organizational staff.

Workers must **not self-register as workers**.

Workers are created or imported by authorized administrators.

Permissions:

- Login
- View new assignments
- Accept assignments
- View active work
- Start work
- Update progress
- Add comments
- Upload resolution evidence
- Mark work resolved
- View SLA deadline
- View own workload
- Change current availability where allowed
- Receive assignment and SLA notifications

---

## 5.3 MANAGER

Represents a department manager.

Permissions:

- View department complaints
- View department workers
- View worker workloads
- View worker availability
- View SLA breaches
- View ignored assignments
- Reassign complaints
- Handle escalations
- Override automated worker assignment
- Change complaint priority where authorized
- View department performance analytics
- Update worker availability where authorized
- Mark escalation handled

---

## 5.4 ADMIN

Represents college/hostel/organization authority.

Permissions:

- Full platform access
- Manage departments
- Create managers
- Create workers
- Import workers by CSV
- Edit worker details
- Activate/deactivate workers
- Configure shifts
- Configure skills
- Configure location coverage
- Configure maximum active jobs
- Configure SLA rules
- View all complaints
- Override assignments
- View master incidents
- View recurring-problem insights
- View automation logs
- View organization analytics
- Manage demo or production configuration

---

# 6. Workforce Management

Workforce management is a mandatory first-class module.

The admin dashboard must contain:

```text
Workforce Management
├── Departments
├── Managers
├── Workers
├── Skills
├── Locations
├── Shifts
├── Availability
└── Import Workers
```

## 6.1 Worker Creation

Admin can create a worker manually.

Required fields:

- Full name
- Employee ID
- Email
- Phone
- Department
- Skills
- Assigned locations
- Shift
- Maximum active jobs
- Availability
- Active/inactive status

Optional fields:

- Profile photo
- Emergency contact
- Joining date
- Notes

Example:

```text
Name: Ramesh Kumar
Employee ID: ELEC-014
Email: ramesh@college.edu
Phone: 98765xxxxx
Department: Electrical
Skills: Electrical Wiring, Fans, Lights, Switchboards
Assigned Locations: Block A, Block B
Shift: 09:00-18:00
Maximum Active Jobs: 4
Availability: AVAILABLE
Status: ACTIVE
```

---

# 7. Worker Account Provisioning

When admin creates a worker, ResolveAI must create the worker account.

MVP flow:

```text
Admin Creates Worker
      ↓
Worker Account Created
      ↓
Temporary Password Generated or Entered by Admin
      ↓
Worker Logs In
      ↓
Worker Changes Password
```

Preferred advanced flow:

```text
Admin Creates Worker
      ↓
Invitation Token Generated
      ↓
Invitation Email Sent
      ↓
Worker Opens Link
      ↓
Worker Sets Password
      ↓
Account Activated
```

The project must support the MVP flow first.

Invitation-link onboarding can be added after the core workflow works.

---

# 8. Worker CSV Import

Large institutions may have many workers.

Admin must eventually be able to upload a CSV.

Example CSV columns:

```csv
name,employeeId,email,phone,department,skills,locations,shift,maxActiveJobs
Ramesh Kumar,ELEC-014,ramesh@college.edu,9876500000,Electrical,"Fan|Light|Wiring","Block A|Block B","09:00-18:00",4
Rahul Kumar,IT-008,rahul@college.edu,9876500001,IT,"Network|Computer","Lab Block|Block C","08:00-17:00",5
```

CSV import rules:

- Validate required fields.
- Reject duplicate employee IDs.
- Reject duplicate emails.
- Validate department exists.
- Parse skills by delimiter.
- Parse locations by delimiter.
- Return row-level validation errors.
- Do not partially create invalid worker rows without reporting them.
- Produce import summary:
  - total rows
  - successful
  - failed
  - skipped

CSV import is high-value but may be scheduled after the MVP.

---

# 9. Worker Availability

Supported availability states:

```text
AVAILABLE
ASSIGNED
BUSY
ON_BREAK
OFF_DUTY
LEAVE
INACTIVE
```

Rules:

- AVAILABLE → eligible for auto-assignment.
- ASSIGNED → eligible only if below maximum workload.
- BUSY → lower assignment preference.
- ON_BREAK → do not auto-assign unless admin overrides.
- OFF_DUTY → not eligible.
- LEAVE → not eligible.
- INACTIVE → not eligible.

Availability must be considered by the assignment engine.

---

# 10. Worker Shifts

Workers must have shift data.

Example:

```text
Shift Name: Morning
Start: 09:00
End: 18:00
Days: MON,TUE,WED,THU,FRI,SAT
```

The assignment engine must avoid assigning off-duty workers.

For MVP, shift validation may use organization-local time.

---

# 11. Worker Maximum Workload

Each worker must have:

```text
maxActiveJobs
```

Example:

```text
Ramesh
Maximum Active Jobs: 4
Current Active Jobs: 4
```

Result:

```text
Not eligible for automatic assignment.
```

Managers may still manually override when necessary.

---

# 12. Skills vs Department

Department and skills must be separate concepts.

Example:

```text
Department:
Maintenance
```

Skills:

```text
Plumbing
Water Purifier
Pipe Leakage
Motor Repair
```

A worker is considered a strong candidate only when their skills match the complaint category/subcategory.

---

# 13. Assigned Locations

Workers can have one or more preferred/covered locations.

Example:

```text
Block A
Block B
Hostel 1
Lab Block
```

Location coverage must affect assignment score.

A location mismatch does not always prohibit assignment, but it lowers the score unless institution rules say otherwise.

---

# 14. Recommended Tech Stack

## 14.1 Frontend

Use:

- React
- Vite
- JavaScript
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide React
- Recharts

Do not use Next.js for the initial project.

---

# 15. Backend Stack

Use:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- multer
- Cloudinary
- node-cron
- helmet
- cors
- express-rate-limit
- express-validator
- morgan
- nodemailer for email notifications if SMTP is configured
- csv-parser or equivalent for worker CSV import

---

# 16. AI Integration

Primary provider:

**Google Gemini API**

AI is used for:

- Complaint summarization
- Category recommendation
- Subcategory recommendation
- Priority recommendation
- Department recommendation
- Keyword extraction
- Sentiment signal
- Duplicate semantic comparison
- Recurring issue summaries
- Management summaries
- Optional image-evidence analysis

The project must not completely depend on Gemini.

When `GEMINI_API_KEY` is missing or Gemini fails, use deterministic fallback logic for:

- classification
- priority
- department routing

Complaint creation must never fail only because Gemini is unavailable.

---

# 17. Automation Layer

Use:

**node-cron**

for MVP automation.

Do not require Redis, BullMQ, Kafka, RabbitMQ, LangGraph, or microservices for the first production-ready version.

Automation jobs:

- SLA monitoring
- SLA warning generation
- Assignment acceptance timeout
- Worker reminder
- Auto-reassignment
- Escalation detection
- Recurring issue detection
- Optional daily analytics snapshot

Optional later integration:

- n8n

---

# 18. Authentication

Required endpoints:

```text
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
POST /api/auth/change-password
```

JWT must contain:

```javascript
{
  userId,
  role
}
```

Passwords must be hashed with bcryptjs.

Protected routes must use auth middleware.

Role routes must use role middleware.

Example:

```javascript
authorizeRoles("ADMIN", "MANAGER")
```

Users self-register only as:

```text
USER
```

WORKER, MANAGER and ADMIN accounts are provisioned by authorized administration.

---

# 19. Complaint Lifecycle

Supported statuses:

```text
SUBMITTED
ANALYZING
ASSIGNED
AWAITING_ACCEPTANCE
ACCEPTED
IN_PROGRESS
RESOLVED
AWAITING_CONFIRMATION
CLOSED
REOPENED
ESCALATED
REJECTED
CANCELLED
```

Main lifecycle:

```text
SUBMITTED
↓
ANALYZING
↓
ASSIGNED
↓
AWAITING_ACCEPTANCE
↓
ACCEPTED
↓
IN_PROGRESS
↓
RESOLVED
↓
AWAITING_CONFIRMATION
↓
CLOSED
```

---

# 20. Complaint Submission

Complaint form must include:

- Title
- Description
- Building/location
- Floor optional
- Room optional
- Image optional
- Category optional

Primary input should be natural language.

Example:

```text
The water purifier on the third floor of Block B has not been working since yesterday.
```

After submission:

1. Create complaint.
2. Set status `SUBMITTED`.
3. Run analysis.
4. Save AI/fallback result.
5. Calculate priority.
6. Detect possible duplicate.
7. Select department.
8. Run smart assignment.

---

# 21. AI Complaint Analyzer

Create:

```text
aiComplaintService.js
```

Input:

```javascript
{
  title,
  description,
  location
}
```

Expected structured output:

```json
{
  "summary": "Water purifier failure on Block B third floor",
  "category": "WATER",
  "subCategory": "WATER_PURIFIER",
  "priority": "HIGH",
  "department": "MAINTENANCE",
  "keywords": ["water", "purifier", "Block B"],
  "sentiment": "FRUSTRATED",
  "confidence": 0.94
}
```

Rules:

- AI output must be JSON.
- Validate before save.
- Never trust unknown enums.
- If invalid, use rule-based fallback.
- Log whether result came from AI or fallback.

---

# 22. Complaint Categories

Initial categories:

```text
ELECTRICAL
PLUMBING
WATER
NETWORK
CLEANING
SECURITY
INFRASTRUCTURE
IT_SUPPORT
EQUIPMENT
OTHER
```

---

# 23. Priority Levels

Supported priorities:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

---

# 24. Priority Calculation Engine

Create:

```text
priorityService.js
```

Example scoring:

```text
Safety risk               +40
Essential service failure +30
Many users affected       +25
Repeated complaint        +15
Negative urgency terms    +10
Normal issue               +5
```

Mapping:

```text
0-20  → LOW
21-40 → MEDIUM
41-70 → HIGH
71+   → CRITICAL
```

AI priority is an additional signal only.

Store:

- priority
- priorityScore
- priorityReason

---

# 25. Department Routing

Each department has supported categories.

Example:

```text
IT Department
- NETWORK
- IT_SUPPORT
- EQUIPMENT

Maintenance
- ELECTRICAL
- PLUMBING
- WATER
- INFRASTRUCTURE

Security
- SECURITY
```

Department selection must use:

1. Exact category mapping.
2. Subcategory mapping.
3. AI recommendation when valid.
4. Fallback default department if configured.
5. Escalate to admin if no department is eligible.

---

# 26. Smart Assignment Engine

Create:

```text
assignmentService.js
```

Do not assign randomly.

Candidate eligibility:

- Worker is active.
- Worker belongs to selected department.
- Worker is not OFF_DUTY.
- Worker is not LEAVE.
- Worker is not INACTIVE.
- Worker has not reached maxActiveJobs.
- Worker shift is currently active where shift checking is enabled.

Score:

```text
Assignment Score =
Skill Match × 40
+
Availability × 25
+
Workload Score × 20
+
Performance Score × 10
+
Location Match × 5
```

Maximum:

```text
100
```

---

# 27. Skill Match Scoring

Exact category/subcategory skill match:

```text
40
```

Related skill match:

```text
20-30
```

No meaningful skill match:

```text
0
```

---

# 28. Availability Scoring

Example:

```text
AVAILABLE → 25
ASSIGNED  → 18
BUSY      → 8
ON_BREAK  → ineligible
OFF_DUTY  → ineligible
LEAVE     → ineligible
INACTIVE  → ineligible
```

---

# 29. Workload Scoring

Based on active assignments:

```text
0 active → 20
1-2      → 15
3-4      → 10
5+       → 0
```

If active jobs >= maxActiveJobs:

```text
ineligible
```

---

# 30. Performance Scoring

Use:

```text
averageRating / 5 * 10
```

For workers without rating history, use a neutral default.

Do not punish new workers with zero.

Recommended default:

```text
5 points
```

---

# 31. Location Scoring

Exact covered location:

```text
5
```

Same zone/building group:

```text
3
```

Different location:

```text
0
```

---

# 32. Assignment Process

```text
Complaint
↓
Find Department
↓
Find Eligible Workers
↓
Filter Shift / Availability / Workload
↓
Calculate Scores
↓
Sort Descending
↓
Select Highest Score
↓
Create Assignment
↓
Set Complaint Assigned Worker
↓
Set Status AWAITING_ACCEPTANCE
↓
Create Notifications
↓
Create Automation Log
```

If no worker is eligible:

```text
status → ESCALATED
```

Notify:

- Department manager
- Admin if manager unavailable

---

# 33. Assignment Score Audit

Every assignment must persist score breakdown.

Example:

```json
{
  "worker": "Rahul",
  "assignmentScore": 89,
  "scoreBreakdown": {
    "skill": 40,
    "availability": 25,
    "workload": 15,
    "performance": 6,
    "location": 3
  }
}
```

Admin and manager UI must be able to show this breakdown.

This proves automated decision logic during project demonstration.

---

# 34. Worker Notification System

When assignment is created:

Mandatory:

1. In-app notification.

Optional when configured:

2. Email notification.

Future optional:

3. SMS.
4. WhatsApp Business notification.

MVP must always support in-app notifications.

Example notification:

```text
NEW ASSIGNMENT

CMP-00124
Ceiling fan not working
Block B — Room 304

Priority: MEDIUM
SLA Deadline: 5:30 PM

[Accept Job]
[View Details]
```

---

# 35. Email Notifications

Use Nodemailer if SMTP configuration exists.

Environment variables:

```text
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

If SMTP is not configured:

- Do not fail assignment.
- Save in-app notification.
- Log `EMAIL_NOTIFICATION_SKIPPED`.

Email sending must be optional infrastructure.

---

# 36. Assignment Acceptance Timeout

Each assignment must have:

```text
acceptanceDeadline
```

Default MVP acceptance window:

```text
15 minutes
```

Configurable by admin later.

Flow:

```text
Worker Assigned
↓
15 Minutes
↓
Accepted?
├── YES → continue
└── NO
     ↓
  Send Reminder
     ↓
  Grace Period
     ↓
  Still Not Accepted?
     ↓
  Reassign
     ↓
  Notify Manager
```

---

# 37. Auto-Reassignment

When worker does not accept:

1. Mark assignment `EXPIRED`.
2. Exclude previous worker temporarily.
3. Re-run assignment engine.
4. Create new assignment.
5. Notify new worker.
6. Notify manager.
7. Log decision.

Maximum automatic reassignment attempts:

```text
2
```

After that:

```text
ESCALATE TO MANAGER
```

---

# 38. Manager Manual Override

Managers and admins must be able to:

- Reassign complaint manually.
- Change priority.
- Escalate complaint.
- Change worker availability.
- Override worker workload when required.
- Cancel automatic reassignment.
- Assign a specific worker.

Every manual override must create an AutomationLog or AuditLog entry.

Example:

```text
MANUAL_REASSIGNMENT
Manager changed assignment from Rahul to Ramesh.
```

---

# 39. SLA Management

Default SLA:

| Priority | Resolution SLA |
|---|---:|
| LOW | 72 hours |
| MEDIUM | 24 hours |
| HIGH | 8 hours |
| CRITICAL | 2 hours |

When assignment becomes active:

```text
slaDeadline = current time + slaHours
```

Store:

- slaDeadline
- slaBreached
- slaWarningSent

Departments may override default SLA settings.

---

# 40. SLA Warning

At 75% SLA usage:

- Notify worker.
- Notify manager optionally for HIGH/CRITICAL.
- Create automation log.
- Only send once per complaint/SLA cycle.

---

# 41. SLA Breach

Cron job:

```text
slaMonitor.js
```

Recommended frequency:

```text
every 5 minutes
```

If unresolved and:

```text
now > slaDeadline
```

Then:

- `slaBreached = true`
- create escalation
- notify manager
- create automation log
- optionally notify admin for CRITICAL issue

---

# 42. Escalation Engine

Create:

```text
escalationService.js
```

Levels:

```text
LEVEL_1
LEVEL_2
LEVEL_3
```

Example:

```text
SLA Exceeded
↓
LEVEL_1 → Department Manager
↓
Still Unresolved
↓
LEVEL_2 → Admin
↓
Critical Prolonged Failure
↓
LEVEL_3 → Organization Authority
```

Persist:

- complaint
- level
- reason
- escalatedTo
- createdAt
- acknowledgedAt
- resolvedAt
- status

---

# 43. Duplicate Complaint Detection

Search recent complaints:

```text
last 30 days
```

Filter by:

- category
- location
- open or recently resolved complaints

Initial deterministic similarity:

- normalized keywords
- token overlap
- category match
- location match

Optional Gemini semantic comparison.

Output:

```json
{
  "duplicate": true,
  "similarity": 0.87,
  "relatedComplaintId": "CMP-001007"
}
```

Never delete duplicate complaint automatically.

Store:

- possibleDuplicateOf
- duplicateConfidence

---

# 44. Recurring Problem Detection

Create:

```text
patternDetectionService.js
patternDetectionJob.js
```

Run:

```text
once daily
```

Analyze:

```text
last 7 days
```

Group by:

- category
- location
- similar keywords

Default recurring issue threshold:

```text
5 related complaints
```

Example output:

```text
Recurring Issue Detected

Location: Block C
Category: NETWORK
Complaints: 17

Recommendation:
Investigate network infrastructure.
```

---

# 45. Master Incident System

Model underlying shared problems.

Example:

```text
INC-000007
Block C Network Outage
23 Linked Complaints
Priority: CRITICAL
Status: INVESTIGATING
```

Statuses:

```text
OPEN
INVESTIGATING
RESOLVED
CLOSED
```

Admin/manager can:

- Create incident.
- Link complaints.
- Unlink complaints.
- Resolve incident.
- Close incident.

When incident is resolved:

- linked complaints become eligible for user confirmation.
- do not auto-close user complaints without user confirmation.

---

# 46. Worker Resolution Workflow

Worker actions:

```text
Accept
Start Work
Add Update
Upload Evidence
Mark Resolved
```

Mark resolved requires:

- resolutionNote

Optional:

- resolutionImage

After worker marks resolved:

```text
status → AWAITING_CONFIRMATION
```

---

# 47. Resolution Evidence

Persist:

- complaintId
- workerId
- description
- imageUrl
- uploadedAt

Optional Gemini Vision output:

```json
{
  "validEvidence": true,
  "confidence": 0.78,
  "reason": "Image appears consistent with completed maintenance work"
}
```

AI evidence analysis is advisory only.

AI must never automatically close complaint.

---

# 48. User Confirmation

After worker resolution:

```text
Has your problem been resolved?
```

YES:

- status → CLOSED
- request rating 1-5
- store feedback
- update worker rating statistics

NO:

- status → REOPENED
- require reopenReason
- notify manager
- notify worker where appropriate
- create escalation/update
- SLA may be recalculated according to service policy

---

# 49. Notifications

Supported types:

```text
ASSIGNMENT
ASSIGNMENT_REMINDER
ASSIGNMENT_REASSIGNED
STATUS_UPDATE
SLA_WARNING
SLA_BREACH
ESCALATION
RESOLUTION
REOPENED
RECURRING_ISSUE
WORKFORCE
SYSTEM
```

Notification fields:

- user
- type
- title
- message
- complaint optional
- assignment optional
- isRead
- createdAt

---

# 50. Automation Logs

Every automated decision must be auditable.

Supported actions:

```text
AI_ANALYSIS
FALLBACK_ANALYSIS
PRIORITY_CALCULATION
DUPLICATE_CHECK
DEPARTMENT_ROUTING
SMART_ASSIGNMENT
WORKER_NOTIFICATION
ASSIGNMENT_REMINDER
AUTO_REASSIGNMENT
SLA_WARNING
SLA_BREACH
ESCALATION
PATTERN_DETECTION
MASTER_INCIDENT_CREATED
EMAIL_NOTIFICATION_SKIPPED
MANUAL_REASSIGNMENT
MANUAL_PRIORITY_CHANGE
```

Example:

```json
{
  "action": "SMART_ASSIGNMENT",
  "complaintId": "CMP-001024",
  "message": "Complaint automatically assigned to Rahul",
  "metadata": {
    "assignmentScore": 89
  }
}
```

---

# 51. Frontend Routes

Use React Router.

## Public

```text
/
 /login
 /register
```

## User

```text
/user/dashboard
/complaints/new
/complaints/my
/complaints/:id
```

## Worker

```text
/worker/dashboard
/worker/complaints
/worker/complaints/:id
/worker/profile
```

## Manager

```text
/manager/dashboard
/manager/complaints
/manager/workers
/manager/escalations
```

## Admin

```text
/admin/dashboard
/admin/complaints
/admin/workers
/admin/workers/import
/admin/departments
/admin/managers
/admin/shifts
/admin/locations
/admin/escalations
/admin/incidents
/admin/insights
/admin/automation
/admin/settings
```

---

# 52. Landing Page

Hero:

```text
Resolve Problems Before They Become Bigger Problems.
```

Subtitle:

```text
AI-powered issue routing, smart workforce assignment, automated escalation and recurring-problem intelligence for modern organizations.
```

Must include:

- product explanation
- workflow illustration
- real-world benefits
- role overview
- CTA buttons
- responsive layout

---

# 53. User Dashboard

Show:

- Total Complaints
- Open
- In Progress
- Awaiting Confirmation
- Resolved
- Recent Complaints

CTA:

```text
Report New Issue
```

---

# 54. Worker Dashboard

Show:

- New Assignments
- Awaiting Acceptance
- Active Work
- Approaching SLA
- Resolved Today
- Average Rating
- Current Availability
- Current Workload / Max Workload

Each assignment card shows:

- priority
- deadline
- location
- category
- assignment score optional
- accept button

---

# 55. Manager Dashboard

Show:

- Department Open Complaints
- SLA Breaches
- Pending Acceptances
- Workers Available
- Workers Off Duty
- Escalations
- Average Resolution Time
- Worker Workload Table

Actions:

- reassign
- override priority
- view worker
- acknowledge escalation

---

# 56. Admin Dashboard

Show:

- Total Complaints
- Open Complaints
- Resolution Rate
- SLA Compliance
- Critical Issues
- Recurring Problems
- Average Resolution Time
- Active Workers
- Available Workers
- Pending Worker Invitations
- Reassignment Count

Charts:

- Complaints by Category
- Complaints by Priority
- Complaints by Department
- Resolution Trend
- SLA Compliance
- Worker Load Distribution

---

# 57. Admin Workforce Pages

## Workers

Actions:

- Add Worker
- Edit Worker
- Deactivate Worker
- Reactivate Worker
- Reset Worker Password
- Change Department
- Change Skills
- Change Locations
- Change Shift
- Change Availability
- Change Maximum Workload

Display:

- Employee ID
- Department
- Skills
- Availability
- Shift
- Current Active Jobs
- Maximum Jobs
- Average Rating
- SLA Success Rate

## Import Workers

Must support:

- CSV upload
- preview
- validation
- import summary
- row-level errors

---

# 58. Database Collections

Required Mongoose models:

```text
User
Department
Shift
Location
Complaint
Assignment
ComplaintUpdate
ResolutionEvidence
Escalation
Notification
AutomationLog
MasterIncident
```

Optional:

```text
WorkerInvitation
ImportJob
```

---

# 59. User Model

```javascript
{
  name: String,
  employeeId: String,

  email: {
    type: String,
    unique: true
  },

  phone: String,

  password: {
    type: String,
    select: false
  },

  role: {
    type: String,
    enum: ["USER", "WORKER", "MANAGER", "ADMIN"]
  },

  department: ObjectId,

  skills: [String],

  assignedLocations: [ObjectId],

  shift: ObjectId,

  availability: {
    type: String,
    enum: [
      "AVAILABLE",
      "ASSIGNED",
      "BUSY",
      "ON_BREAK",
      "OFF_DUTY",
      "LEAVE",
      "INACTIVE"
    ]
  },

  maxActiveJobs: Number,

  averageRating: Number,

  completedComplaints: Number,

  mustChangePassword: Boolean,

  isActive: Boolean,

  createdAt: Date,
  updatedAt: Date
}
```

---

# 60. Department Model

```javascript
{
  name: String,
  description: String,
  supportedCategories: [String],
  manager: ObjectId,

  defaultSlaHours: {
    LOW: Number,
    MEDIUM: Number,
    HIGH: Number,
    CRITICAL: Number
  },

  isActive: Boolean
}
```

---

# 61. Shift Model

```javascript
{
  name: String,
  startTime: String,
  endTime: String,
  workingDays: [String],
  isActive: Boolean
}
```

---

# 62. Location Model

```javascript
{
  name: String,
  type: String,
  parentLocation: ObjectId,
  description: String,
  isActive: Boolean
}
```

Examples:

```text
Campus
Block A
Block B
Hostel 1
Third Floor
Room 304
Lab Block
```

---

# 63. Complaint Model

```javascript
{
  complaintId: String,
  createdBy: ObjectId,
  title: String,
  description: String,
  imageUrl: String,

  category: String,
  subCategory: String,

  priority: String,
  priorityScore: Number,
  priorityReason: String,

  location: {
    building: String,
    floor: String,
    room: String
  },

  department: ObjectId,
  assignedWorker: ObjectId,

  status: String,

  aiAnalysis: {
    source: String,
    summary: String,
    sentiment: String,
    keywords: [String],
    confidence: Number
  },

  possibleDuplicateOf: ObjectId,
  duplicateConfidence: Number,

  masterIncident: ObjectId,

  slaDeadline: Date,
  slaBreached: Boolean,
  slaWarningSent: Boolean,

  resolutionNote: String,
  resolvedAt: Date,
  closedAt: Date,

  userRating: Number,
  userFeedback: String,

  reopenReason: String,

  createdAt: Date,
  updatedAt: Date
}
```

---

# 64. Assignment Model

```javascript
{
  complaint: ObjectId,
  worker: ObjectId,

  assignmentScore: Number,

  scoreBreakdown: {
    skill: Number,
    availability: Number,
    workload: Number,
    performance: Number,
    location: Number
  },

  assignedAt: Date,
  acceptanceDeadline: Date,
  acceptedAt: Date,
  expiredAt: Date,
  completedAt: Date,

  reassignmentAttempt: Number,

  status: {
    type: String,
    enum: [
      "PENDING_ACCEPTANCE",
      "ACCEPTED",
      "EXPIRED",
      "REASSIGNED",
      "COMPLETED",
      "CANCELLED"
    ]
  }
}
```

---

# 65. ComplaintUpdate Model

```javascript
{
  complaint: ObjectId,
  createdBy: ObjectId,
  message: String,
  type: String,
  createdAt: Date
}
```

---

# 66. ResolutionEvidence Model

```javascript
{
  complaint: ObjectId,
  worker: ObjectId,
  description: String,
  imageUrl: String,

  aiVerification: {
    validEvidence: Boolean,
    confidence: Number,
    reason: String
  },

  createdAt: Date
}
```

---

# 67. Escalation Model

```javascript
{
  complaint: ObjectId,
  level: String,
  reason: String,
  escalatedTo: ObjectId,
  createdAt: Date,
  acknowledgedAt: Date,
  resolvedAt: Date,
  status: String
}
```

---

# 68. Notification Model

```javascript
{
  user: ObjectId,
  type: String,
  title: String,
  message: String,
  complaint: ObjectId,
  assignment: ObjectId,
  isRead: Boolean,
  createdAt: Date
}
```

---

# 69. AutomationLog Model

```javascript
{
  action: String,
  complaint: ObjectId,
  assignment: ObjectId,
  user: ObjectId,
  message: String,
  metadata: Object,
  createdAt: Date
}
```

---

# 70. MasterIncident Model

```javascript
{
  incidentId: String,
  title: String,
  description: String,
  category: String,
  location: String,
  priority: String,
  linkedComplaints: [ObjectId],
  status: String,
  aiSummary: String,
  createdBy: ObjectId,
  createdAt: Date,
  resolvedAt: Date
}
```

---

# 71. API Endpoints

All routes begin with:

```text
/api
```

## Auth

```text
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
POST /api/auth/change-password
```

## Complaints

```text
POST /api/complaints
GET /api/complaints/my
GET /api/complaints/:id
PUT /api/complaints/:id
POST /api/complaints/:id/reopen
POST /api/complaints/:id/confirm-resolution
POST /api/complaints/:id/feedback
```

## Worker

```text
GET /api/worker/dashboard
GET /api/worker/complaints
GET /api/worker/complaints/:id
PUT /api/worker/availability
POST /api/worker/complaints/:id/accept
POST /api/worker/complaints/:id/start
POST /api/worker/complaints/:id/update
POST /api/worker/complaints/:id/resolve
```

## Manager

```text
GET /api/manager/dashboard
GET /api/manager/complaints
GET /api/manager/workers
GET /api/manager/escalations
POST /api/manager/complaints/:id/reassign
POST /api/manager/complaints/:id/change-priority
POST /api/manager/escalations/:id/acknowledge
```

## Admin Workers

```text
GET /api/admin/workers
POST /api/admin/workers
GET /api/admin/workers/:id
PUT /api/admin/workers/:id
PATCH /api/admin/workers/:id/status
POST /api/admin/workers/:id/reset-password
POST /api/admin/workers/import
```

## Departments

```text
GET /api/admin/departments
POST /api/admin/departments
PUT /api/admin/departments/:id
```

## Shifts

```text
GET /api/admin/shifts
POST /api/admin/shifts
PUT /api/admin/shifts/:id
DELETE /api/admin/shifts/:id
```

## Locations

```text
GET /api/admin/locations
POST /api/admin/locations
PUT /api/admin/locations/:id
DELETE /api/admin/locations/:id
```

## Escalations

```text
GET /api/admin/escalations
GET /api/manager/escalations
```

## Incidents

```text
GET /api/incidents
POST /api/incidents
GET /api/incidents/:id
POST /api/incidents/:id/link
POST /api/incidents/:id/unlink
POST /api/incidents/:id/resolve
POST /api/incidents/:id/close
```

## Notifications

```text
GET /api/notifications
PUT /api/notifications/:id/read
PUT /api/notifications/read-all
```

## Analytics

```text
GET /api/analytics/overview
GET /api/analytics/categories
GET /api/analytics/departments
GET /api/analytics/sla
GET /api/analytics/trends
GET /api/analytics/workforce
```

## Automation

```text
GET /api/admin/automation
GET /api/admin/insights
```

---

# 72. Backend Architecture

Required layering:

```text
Routes
↓
Controllers
↓
Services
↓
Models
```

Controllers:

- parse request
- call services
- return response

Services own:

- auth logic
- workforce logic
- complaint logic
- AI logic
- priority logic
- department routing
- assignment logic
- notification logic
- escalation logic
- analytics
- import logic

---

# 73. Backend Folder Structure

```text
server/
└── src/
    ├── config/
    │   ├── env.js
    │   ├── db.js
    │   ├── cloudinary.js
    │   └── mail.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── complaintController.js
    │   ├── workerController.js
    │   ├── managerController.js
    │   ├── adminController.js
    │   ├── departmentController.js
    │   ├── workforceController.js
    │   ├── shiftController.js
    │   ├── locationController.js
    │   ├── incidentController.js
    │   ├── notificationController.js
    │   └── analyticsController.js
    │
    ├── services/
    │   ├── authService.js
    │   ├── workforceService.js
    │   ├── workerImportService.js
    │   ├── complaintService.js
    │   ├── aiComplaintService.js
    │   ├── ruleClassifierService.js
    │   ├── priorityService.js
    │   ├── departmentRoutingService.js
    │   ├── assignmentService.js
    │   ├── duplicateService.js
    │   ├── escalationService.js
    │   ├── notificationService.js
    │   ├── mailService.js
    │   ├── patternDetectionService.js
    │   ├── incidentService.js
    │   ├── analyticsService.js
    │   └── evidenceService.js
    │
    ├── models/
    │   ├── User.js
    │   ├── Department.js
    │   ├── Shift.js
    │   ├── Location.js
    │   ├── Complaint.js
    │   ├── Assignment.js
    │   ├── ComplaintUpdate.js
    │   ├── ResolutionEvidence.js
    │   ├── Escalation.js
    │   ├── Notification.js
    │   ├── AutomationLog.js
    │   └── MasterIncident.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── complaintRoutes.js
    │   ├── workerRoutes.js
    │   ├── managerRoutes.js
    │   ├── adminRoutes.js
    │   ├── departmentRoutes.js
    │   ├── workforceRoutes.js
    │   ├── shiftRoutes.js
    │   ├── locationRoutes.js
    │   ├── incidentRoutes.js
    │   ├── notificationRoutes.js
    │   └── analyticsRoutes.js
    │
    ├── middleware/
    │   ├── authMiddleware.js
    │   ├── roleMiddleware.js
    │   ├── errorMiddleware.js
    │   ├── validationMiddleware.js
    │   └── uploadMiddleware.js
    │
    ├── jobs/
    │   ├── assignmentAcceptanceJob.js
    │   ├── slaMonitor.js
    │   ├── reminderJob.js
    │   └── patternDetectionJob.js
    │
    ├── utils/
    │   ├── generateId.js
    │   ├── calculateSla.js
    │   ├── shiftUtils.js
    │   ├── logger.js
    │   └── apiResponse.js
    │
    ├── seed/
    │   └── seedData.js
    │
    ├── app.js
    └── server.js
```

---

# 74. Frontend Folder Structure

```text
client/
└── src/
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.jsx
    │   │   ├── Navbar.jsx
    │   │   └── DashboardLayout.jsx
    │   │
    │   ├── common/
    │   │   ├── Button.jsx
    │   │   ├── Modal.jsx
    │   │   ├── Loader.jsx
    │   │   ├── EmptyState.jsx
    │   │   ├── StatusBadge.jsx
    │   │   └── PriorityBadge.jsx
    │   │
    │   ├── complaints/
    │   │   ├── ComplaintCard.jsx
    │   │   ├── ComplaintTable.jsx
    │   │   ├── ComplaintTimeline.jsx
    │   │   └── ComplaintFilters.jsx
    │   │
    │   ├── workforce/
    │   │   ├── WorkerCard.jsx
    │   │   ├── WorkerTable.jsx
    │   │   ├── WorkerForm.jsx
    │   │   ├── WorkerAvailabilityBadge.jsx
    │   │   ├── WorkerImport.jsx
    │   │   └── AssignmentScoreBreakdown.jsx
    │   │
    │   ├── dashboard/
    │   │   ├── MetricCard.jsx
    │   │   ├── CategoryChart.jsx
    │   │   ├── SLAChart.jsx
    │   │   ├── WorkforceChart.jsx
    │   │   └── TrendChart.jsx
    │   │
    │   └── automation/
    │       └── AutomationLogCard.jsx
    │
    ├── pages/
    │   ├── Landing.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   │
    │   ├── user/
    │   │   ├── UserDashboard.jsx
    │   │   ├── NewComplaint.jsx
    │   │   ├── MyComplaints.jsx
    │   │   └── ComplaintDetails.jsx
    │   │
    │   ├── worker/
    │   │   ├── WorkerDashboard.jsx
    │   │   ├── WorkerComplaints.jsx
    │   │   ├── WorkerComplaintDetails.jsx
    │   │   └── WorkerProfile.jsx
    │   │
    │   ├── manager/
    │   │   ├── ManagerDashboard.jsx
    │   │   ├── ManagerWorkers.jsx
    │   │   └── ManagerEscalations.jsx
    │   │
    │   └── admin/
    │       ├── AdminDashboard.jsx
    │       ├── Complaints.jsx
    │       ├── Workers.jsx
    │       ├── WorkerImport.jsx
    │       ├── Departments.jsx
    │       ├── Managers.jsx
    │       ├── Shifts.jsx
    │       ├── Locations.jsx
    │       ├── Escalations.jsx
    │       ├── Incidents.jsx
    │       ├── Insights.jsx
    │       └── Automation.jsx
    │
    ├── context/
    │   └── AuthContext.jsx
    │
    ├── services/
    │   └── api.js
    │
    ├── hooks/
    │   └── useAuth.js
    │
    ├── utils/
    │   └── constants.js
    │
    ├── App.jsx
    └── main.jsx
```

---

# 75. Environment Variables

Backend `.env`:

```text
PORT=5000
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=http://localhost:5173

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
MAIL_FROM=

ASSIGNMENT_ACCEPTANCE_MINUTES=15
MAX_AUTO_REASSIGNMENTS=2
```

Never expose backend secrets to frontend.

---

# 76. Seed Data

Create seed data for demonstration.

Minimum:

```text
1 Admin
3 Departments
1 Manager per Department
3 Workers per Department
10 Users
20 Complaints
3 Shifts
5+ Locations
```

Departments:

```text
IT Department
Maintenance Department
Security Department
```

Workers must vary in:

- skills
- locations
- shift
- workload
- rating
- availability
- maxActiveJobs

---

# 77. Demo Credentials

Development only.

Example:

```text
Admin:
admin@resolveai.demo
Admin@123

Manager:
manager@resolveai.demo
Manager@123

Worker:
worker@resolveai.demo
Worker@123

User:
user@resolveai.demo
User@123
```

Never seed these credentials in real production mode.

---

# 78. UI/UX Requirements

Visual direction:

- modern SaaS
- operations dashboard
- professional
- minimal
- responsive
- not a colorful student-project UI

Use:

- clean spacing
- rounded cards
- subtle shadows
- strong typography
- clear hierarchy
- loading states
- skeletons
- empty states
- toasts
- responsive navigation

Desktop layout:

```text
Sidebar + Top Navbar + Main Content
```

Sidebar changes by role.

---

# 79. Status Visualization

Consistent colors:

```text
SUBMITTED             neutral
ANALYZING             blue
AWAITING_ACCEPTANCE   blue
ACCEPTED              indigo
IN_PROGRESS           purple
AWAITING_CONFIRMATION orange
RESOLVED              green
CLOSED                green
ESCALATED             red
REOPENED              yellow
```

Priority:

```text
LOW      green
MEDIUM   yellow
HIGH     orange
CRITICAL red
```

---

# 80. Error Response Format

Success:

```json
{
  "success": true,
  "message": "Complaint created successfully",
  "data": {}
}
```

Failure:

```json
{
  "success": false,
  "message": "Complaint not found"
}
```

Use centralized error middleware.

---

# 81. Security Requirements

Must:

- hash passwords
- sign JWTs securely
- protect routes
- enforce role authorization
- validate request bodies
- validate Mongo ObjectIds
- use Helmet
- configure CORS
- rate-limit auth
- enforce ownership
- restrict uploads
- never expose password hash
- never expose secrets
- never trust frontend-provided role
- validate CSV imports
- sanitize file names
- restrict worker creation to authorized roles
- log workforce changes where practical

---

# 82. Upload Security

Allowed:

```text
JPEG
JPG
PNG
WEBP
CSV for workforce import
```

Images max:

```text
5 MB
```

Reject executables and unsupported files.

---

# 83. Core Demo Scenario 1 — Smart Assignment

User submits:

```text
The internet in Block C third floor has not been working since morning and our lab cannot access the network.
```

Expected analysis:

```text
Category: NETWORK
Priority: HIGH
Department: IT
Location: Block C / 3rd Floor
```

Candidate workers:

```text
Rahul   Score: 89
Arun    Score: 71
Kiran   Score: 63
```

System assigns:

```text
Rahul
```

Worker receives:

- in-app notification
- optional email

Automation log:

```text
SMART_ASSIGNMENT

Assigned Rahul because he had the highest assignment score (89).
```

Worker accepts.

SLA starts.

Worker resolves.

User confirms.

Status:

```text
CLOSED
```

This scenario must work before advanced features.

---

# 84. Core Demo Scenario 2 — Ignored Assignment

1. Complaint assigned to Rahul.
2. Rahul does not accept before acceptanceDeadline.
3. Reminder is generated.
4. Grace period expires.
5. Assignment marked EXPIRED.
6. ResolveAI selects next best worker.
7. Complaint reassigned to Arun.
8. Manager receives notification.
9. Automation log records AUTO_REASSIGNMENT.

---

# 85. Core Demo Scenario 3 — Workload Protection

Worker:

```text
Ramesh
maxActiveJobs: 4
activeJobs: 4
```

Result:

```text
Ramesh is excluded from automatic assignment.
```

Another eligible worker is selected.

---

# 86. Core Demo Scenario 4 — Shift and Availability

Worker:

```text
Suresh
Availability: OFF_DUTY
```

Result:

```text
Suresh must not be auto-assigned.
```

Worker:

```text
Kiran
Availability: AVAILABLE
Current shift active
```

Result:

```text
Kiran remains eligible.
```

---

# 87. Core Demo Scenario 5 — Recurring Problem

Create five similar network complaints in Block C within seven days.

System creates insight:

```text
Recurring Problem Detected

Block C
NETWORK
5 complaints detected within 7 days.
```

Admin can convert cluster to:

```text
Master Incident
```

---

# 88. Development Phases

Coding agents must implement sequentially.

## PHASE 1 — Setup

Build:

- React frontend
- Express backend
- MongoDB connection
- base structure
- env config
- health endpoint

Verify:

```text
GET /api/health
```

---

## PHASE 2 — Authentication & RBAC

Build:

- User model
- register
- login
- JWT
- auth middleware
- role middleware
- protected routes
- role redirects
- change password

Verify all four roles.

---

## PHASE 3 — Organization Setup

Build:

- Department model
- Shift model
- Location model
- admin department management
- shift management
- location management

Do not implement assignment yet.

---

## PHASE 4 — Workforce Management

Build:

- worker creation
- manager creation
- worker edit
- skills
- assigned locations
- shifts
- max workload
- availability
- active/inactive
- temporary password flow

Verify admin can create a worker and worker can log in.

---

## PHASE 5 — Complaint Management

Build:

- Complaint model
- create complaint
- my complaints
- complaint details
- timeline
- basic status

Do not add AI yet.

---

## PHASE 6 — AI Complaint Analysis

Build:

- Gemini service
- fallback classifier
- category
- summary
- priority suggestion
- keywords
- sentiment
- department recommendation

Verify without Gemini too.

---

## PHASE 7 — Priority & Department Routing

Build:

- deterministic priority engine
- department routing
- priority reason
- route failures to escalation/admin

---

## PHASE 8 — Smart Workforce Assignment

Build:

- eligibility checks
- shift checks
- availability checks
- workload protection
- score engine
- score breakdown
- assignment record
- worker in-app notification
- automation log

This phase is a core project milestone.

---

## PHASE 9 — Worker Acceptance & Auto-Reassignment

Build:

- acceptanceDeadline
- worker accept
- reminder
- assignment expiry
- auto-reassign
- max reassignment attempts
- manager alert

---

## PHASE 10 — Worker Resolution Workflow

Build:

- start work
- add update
- evidence
- resolve
- user confirm
- user reject
- reopen

---

## PHASE 11 — SLA Automation

Build:

- SLA deadline
- 75% warning
- breach detection
- automatic escalation
- manager notifications

---

## PHASE 12 — Admin & Manager Analytics

Build:

- complaint metrics
- SLA metrics
- worker utilization
- workload distribution
- category trends
- department performance

---

## PHASE 13 — Duplicate Detection

Build:

- candidate search
- similarity score
- duplicate relationship
- admin display

---

## PHASE 14 — Recurring Problem Intelligence

Build:

- daily clustering
- threshold
- recurring issue alert
- insights page

---

## PHASE 15 — Master Incidents

Build:

- create incident
- link/unlink complaints
- resolve incident
- linked complaint handling

---

## PHASE 16 — CSV Worker Import

Build:

- CSV upload
- preview
- validation
- import
- summary
- row errors

---

## PHASE 17 — Email Notifications

Build only after in-app notifications work.

- SMTP config
- assignment email
- SLA email
- escalation email
- graceful fallback

---

## PHASE 18 — UI Polish, Testing & Deployment

Complete:

- responsive design
- loaders
- skeletons
- validation
- empty states
- error states
- final bug fixes
- production environment
- deployment documentation

---

# 89. Minimum Viable Submission

If time is limited, complete at least:

1. Authentication
2. RBAC
3. Departments
4. Worker management
5. Complaint submission
6. AI/fallback analysis
7. Priority engine
8. Department routing
9. Smart worker assignment
10. Worker in-app notification
11. Worker acceptance
12. Worker workflow
13. SLA deadline
14. Automatic escalation
15. Admin dashboard
16. Automation logs

These define the core ResolveAI product.

---

# 90. High-Value Resume Features

After MVP:

1. Auto-reassignment
2. Duplicate detection
3. Recurring problem detection
4. Master incidents
5. CSV worker import
6. Evidence verification
7. Workforce analytics
8. Email notification

---

# 91. Features Not Required Initially

Do not initially add:

- chatbot
- video calls
- social login
- payment gateway
- blockchain
- mobile app
- microservices
- Kafka
- Redis
- BullMQ
- LangGraph
- vector database
- WhatsApp Business integration
- SMS
- multi-cloud infrastructure

These can be future scope.

---

# 92. Testing Requirements

## Authentication

Test:

- register user
- duplicate email rejection
- login
- wrong password
- JWT protection
- role protection
- worker temporary password change

## Workforce

Test:

- admin creates worker
- duplicate employee ID rejected
- duplicate worker email rejected
- inactive worker cannot be assigned
- off-duty worker cannot be assigned
- leave worker cannot be assigned
- max workload enforced
- department matching works
- skill matching works
- location matching affects score

## Complaints

Test:

- user creates complaint
- user sees own complaint
- unauthorized user cannot modify complaint

## AI

Test:

- valid Gemini result
- invalid JSON result
- Gemini unavailable
- fallback classifier works

## Assignment

Test:

- eligible workers found
- highest score selected
- score breakdown stored
- ineligible workers excluded
- notification created
- assignment acceptance deadline created

## Reassignment

Test:

- assignment expires
- old worker excluded
- next worker selected
- manager notified
- max retry behavior works

## SLA

Test:

- deadline generated
- warning generated once
- breach generates escalation

## Resolution

Test:

- accept
- start
- update
- resolve
- confirmation
- reopen

## Imports

Test later:

- valid CSV
- duplicate rows
- invalid department
- missing required fields
- result summary

---

# 93. README Requirements

README must include:

- Project Overview
- Problem Statement
- Solution
- Why ResolveAI Is Different
- Architecture
- User Roles
- Workforce Management
- Smart Assignment Algorithm
- Worker Notification Flow
- Assignment Acceptance/Reassignment
- SLA Automation
- Features
- Tech Stack
- Installation
- Environment Variables
- API Overview
- Folder Structure
- Demo Credentials
- Screenshots
- Core Demo Scenarios
- Security
- Limitations
- Future Scope

README must clearly state:

> ResolveAI does not recruit workers. Institutions onboard their existing workforce, and ResolveAI intelligently coordinates assignment, notifications, deadlines, escalation, and operational insights.

---

# 94. Architecture Diagram

```text
                    React Frontend
                          │
                          ▼
                    Express REST API
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
     Business Logic    Gemini AI      Notification Layer
          │                                │
          ▼                                ▼
       MongoDB                     In-App / Email
          │
          ▼
   Automation Jobs
          │
  ┌───────┼───────────┐
  ▼       ▼           ▼
Assignment SLA     Pattern
Timeout    Monitor Detection
```

---

# 95. Workforce Flow Diagram

```text
Organization Admin
        ↓
Create Department
        ↓
Add Manager
        ↓
Add / Import Workers
        ↓
Set Skills
        ↓
Set Locations
        ↓
Set Shift
        ↓
Set Max Workload
        ↓
Set Availability
        ↓
Workers Become Eligible
        ↓
ResolveAI Assignment Engine
```

---

# 96. Complaint-to-Resolution Diagram

```text
Complaint Submission
        ↓
AI Complaint Analyzer
        ↓
Priority Engine
        ↓
Duplicate Detector
        ↓
Department Routing
        ↓
Eligible Worker Filter
        ↓
Smart Assignment Engine
        ↓
Worker Notification
        ↓
Acceptance Timeout
     ↙             ↘
 Accepted        Ignored
    ↓              ↓
 Work          Reassignment
    ↓
 SLA Monitor
  ↙        ↘
Resolved   Overdue
   ↓          ↓
Evidence   Escalation
   ↓
User Confirmation
   ↓
Closed
```

---

# 97. Resume-Friendly Metrics

Track real metrics:

- complaints processed
- automatic assignment percentage
- average assignment time
- worker acceptance rate
- automatic reassignment count
- average resolution time
- SLA compliance percentage
- escalations
- duplicate complaints detected
- recurring problems detected
- workforce utilization
- worker average rating

Never invent metrics.

---

# 98. Final Expected Outcome

A completed ResolveAI deployment must allow an institution to:

1. Configure departments.
2. Configure locations.
3. Configure shifts.
4. Add managers.
5. Add or import workers.
6. Define worker skills.
7. Define worker coverage areas.
8. Define worker availability.
9. Define worker workload limits.
10. Allow users to report complaints.
11. Analyze complaints using AI/fallback.
12. Calculate priority.
13. Route to department.
14. Select eligible worker.
15. Score workers.
16. Automatically assign highest-ranked worker.
17. Notify worker.
18. Require acceptance.
19. Reassign ignored assignments.
20. Track SLA.
21. Warn about approaching deadlines.
22. Escalate overdue issues.
23. Allow resolution updates.
24. Collect evidence.
25. Ask user to confirm.
26. Reopen unresolved complaints.
27. Detect duplicate complaints.
28. Detect recurring patterns.
29. Group issues into incidents.
30. Provide analytics.
31. Provide audit logs.
32. Allow manager/admin manual override.

The system should feel like an intelligent operations platform, not a student complaint portal.

---

# 99. Codex / Antigravity Mandatory Rules

1. Read this entire file before writing code.
2. Treat this file as authoritative.
3. Do not change stack without necessity.
4. Build phase by phase.
5. Do not continue from broken code.
6. Run builds/tests after every phase.
7. Keep controllers thin.
8. Put business logic in services.
9. Reuse existing services/components.
10. Use one central Axios instance.
11. Use central error middleware.
12. Use environment variables.
13. Never expose secrets.
14. AI failure must not break complaint submission.
15. Never fabricate an AI result; use deterministic fallback.
16. Never allow AI to close complaint automatically.
17. Never allow workers to self-register as workers.
18. Only authorized admins can create/import workers.
19. Never auto-assign OFF_DUTY, LEAVE or INACTIVE workers.
20. Enforce maxActiveJobs.
21. Enforce department eligibility.
22. Persist assignment score breakdown.
23. Persist automation logs.
24. Persist notifications.
25. Visible UI buttons must work.
26. Do not display fake production features.
27. Validate ObjectIds.
28. Never return password hash.
29. Validate upload types.
30. Validate CSV.
31. Generate complaint IDs:
   `CMP-000001`
32. Generate incident IDs:
   `INC-000001`
33. Keep enums consistent.
34. Add timestamps.
35. Seed realistic demo data.
36. Do not rewrite working code unnecessarily.
37. Do not add extra infrastructure unless required.
38. At the end of each phase report:
   - Files Created
   - Files Modified
   - Dependencies Installed
   - APIs Added
   - Tests Performed
   - Known Issues
39. Stop after the requested phase.
40. Do not automatically begin the next phase.

---

# 100. Initial Codex / Antigravity Prompt

```text
You are the lead full-stack engineer responsible for implementing ResolveAI.

Read SPEC.md completely before changing any code.

SPEC.md is the authoritative source of truth.

Do not build the whole project at once.

Start with Phase 1 only.

Requirements:

1. Follow the exact architecture and folder structure in SPEC.md.
2. Use React + Vite for the frontend.
3. Use Node.js + Express for the backend.
4. Use MongoDB + Mongoose.
5. Use JavaScript, not TypeScript.
6. Keep controllers thin.
7. Put business logic in services.
8. Use environment variables.
9. Do not add technologies not required by SPEC.md.
10. Do not create fake buttons or fake working features.
11. Run the frontend build after implementation.
12. Run/check the backend after implementation.
13. Test endpoints introduced in the phase.
14. Fix errors before declaring completion.
15. Do not start another phase automatically.

At the end report exactly:

PHASE COMPLETED

Files Created:
Files Modified:
Dependencies Installed:
APIs Added:
Tests Performed:
Known Issues:

Begin Phase 1 now.
```

---

# 101. Continuation Prompt

```text
Read SPEC.md again.

Review the existing repository before changing code.

The previous phase is complete.

Implement the next phase only.

Do not remove or rewrite working functionality unless required by SPEC.md.

Reuse existing components, services, middleware, models and utilities.

After implementation:

1. Run the frontend build.
2. Run/check the backend.
3. Test APIs introduced in this phase.
4. Fix all discovered errors.
5. Confirm previous functionality still works.
6. Do not begin another phase.

Report:

PHASE COMPLETED

Files Created:
Files Modified:
Dependencies Installed:
APIs Added:
Tests Performed:
Known Issues:
```

---

# 102. Definition of Done

ResolveAI is complete when all of the following work:

## Organization

- Admin can manage departments.
- Admin can manage locations.
- Admin can manage shifts.
- Admin can create managers.
- Admin can create workers.
- Worker can login.
- Worker details include skills, locations, shift, availability and workload limit.
- Ineligible workers are not auto-assigned.

## Complaint

- User can register/login.
- User can submit complaint.
- Complaint is persisted.
- AI analyzes complaint.
- Fallback works.
- Priority is calculated.
- Department is selected.

## Assignment

- Eligible workers are found.
- Assignment scores are calculated.
- Highest-ranked worker is selected.
- Assignment score breakdown is persisted.
- Worker is notified.
- Worker can accept.
- Acceptance deadline works.
- Ignored assignment can be reassigned.
- Manager receives escalation/notification.

## Work

- Worker starts work.
- Worker updates progress.
- Worker resolves.
- Worker uploads evidence.
- User confirms/rejects resolution.
- Rejected complaint reopens.

## Automation

- SLA deadline is generated.
- SLA warning is generated.
- SLA breach escalates.
- Automation log exists.
- Notifications are persisted.

## Intelligence

- Duplicate detection works.
- Recurring issue detection works.
- Master incidents work.

## Dashboard

- User dashboard works.
- Worker dashboard works.
- Manager dashboard works.
- Admin dashboard works.
- Analytics use real database values.

## Quality

- Responsive UI.
- No major broken buttons.
- No exposed secrets.
- README complete.
- App deployable.
- Demo seed works.
- Core scenarios can be demonstrated end-to-end.

---

# 103. Project Identity for Resume

**ResolveAI — AI-Powered Issue Resolution & Workflow Automation Platform**

Suggested resume description after the implementation is genuinely complete:

> Built an AI-powered operations platform that analyzes incoming complaints, calculates priority, routes issues to departments, scores and assigns eligible workers based on skills, availability, workload and location, monitors SLA deadlines, automatically reassigns ignored jobs, escalates overdue issues, and detects recurring operational problems using React, Node.js, MongoDB and Gemini.

Do not add performance numbers until they are measured with real test data.

---

# 104. Final Development Priority

```text
SETUP
  ↓
AUTH + RBAC
  ↓
ORGANIZATION SETUP
  ↓
WORKFORCE MANAGEMENT
  ↓
COMPLAINT MANAGEMENT
  ↓
AI ANALYSIS
  ↓
PRIORITY + DEPARTMENT ROUTING
  ↓
SMART ASSIGNMENT
  ↓
WORKER NOTIFICATION + ACCEPTANCE
  ↓
AUTO-REASSIGNMENT
  ↓
WORKER RESOLUTION
  ↓
SLA AUTOMATION
  ↓
ADMIN / MANAGER ANALYTICS
  ↓
DUPLICATE DETECTION
  ↓
RECURRING ISSUE DETECTION
  ↓
MASTER INCIDENTS
  ↓
CSV IMPORT
  ↓
EMAIL NOTIFICATIONS
  ↓
POLISH + TEST + DEPLOY
```

**Primary engineering goal:** complete one reliable complaint-to-resolution loop before adding advanced intelligence.

**Primary product goal:** let the institution define its workforce once, then let ResolveAI automate routine routing, assignment, notification, monitoring and escalation while keeping managers in control.
