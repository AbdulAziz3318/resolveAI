# ResolveAI

ResolveAI is an intelligent complaint and workforce automation platform for institutions and workplaces. It classifies and prioritizes complaints, routes them to the appropriate department, assigns eligible workers, monitors progress, handles escalation, and lets users verify completed work.

ResolveAI coordinates an organization’s existing users, workers, managers, departments, shifts, and locations. The submitted version is a single-organization mini-project; multi-organization onboarding is planned as a future enhancement.

## Links

- Repository: https://github.com/AbdulAziz3318/resolveAI
- API health check: `/api/health`
- Live application: (https://resolveai-3w4p.onrender.com/)

## Core workflow

```text
User submits complaint
        ↓
ResolveAI analyzes category and priority
        ↓
Complaint is routed to a department
        ↓
Eligible workers are scored
        ↓
Worker receives assignment
        ↓
Worker accepts and starts work
        ↓
Worker submits resolution
        ↓
User confirms or reopens the complaint
        ↓
Complaint is closed, reassigned, or escalated
```

## Roles

### User

- Registers and signs in
- Reports complaints
- Tracks complaint status
- Receives notifications
- Confirms completed work
- Provides a rating and feedback
- Reopens unresolved complaints

### Worker

- Signs in using an administrator-created account
- Views assigned work
- Accepts or rejects assignments
- Starts work
- Submits resolution notes
- Updates availability
- Views notifications and assignment history

### Manager

- Monitors a department’s complaints and workers
- Reviews critical and escalated complaints
- Acknowledges escalations
- Monitors workforce availability and workload

### Administrator

- Views organization-wide complaints
- Creates departments, locations, and shifts
- Registers workers and managers
- Assigns worker skills, departments, locations, and shifts
- Activates or deactivates workforce accounts
- Resets temporary passwords
- Reviews workforce capacity and operational activity

## Main features

- JWT authentication and role-based authorization
- MongoDB persistence with Mongoose
- Public registration for ordinary users
- Administrator-managed worker and manager accounts
- Gemini-assisted complaint analysis
- Deterministic fallback when Gemini is unavailable
- Category, subcategory, priority, and department routing
- Worker eligibility filtering
- Explainable worker-assignment scoring
- Assignment acceptance deadlines
- Worker acceptance, rejection, and reassignment
- Automatic expiration and escalation
- Worker progress and resolution workflow
- User confirmation, rating, feedback, and reopening
- MongoDB-backed notifications
- Worker and manager dashboards
- Responsive light and dark user interface
- Production deployment through a combined Express and React service

## Assignment eligibility

A worker can receive a complaint when:

- The account is active
- The role is `WORKER`
- The worker belongs to the routed department
- The assigned shift is active
- Availability permits assignment
- Active workload is below `maxActiveJobs`
- Skills are relevant to the complaint
- The worker has not rejected or expired for that complaint

The assignment score considers skills, availability, workload, performance, and location.

## Complaint statuses

| Status | Meaning |
|---|---|
| `SUBMITTED` | Complaint was received |
| `ANALYZING` | Category, priority, department, and worker are being determined |
| `AWAITING_ACCEPTANCE` | A worker was selected but has not accepted |
| `ACCEPTED` | Worker accepted the assignment |
| `IN_PROGRESS` | Worker started the work |
| `AWAITING_CONFIRMATION` | Worker submitted completion and is waiting for the user |
| `CLOSED` | User confirmed the resolution |
| `REOPENED` | User reported that the issue remains |
| `ESCALATED` | Manager or administrator attention is required |
| `CANCELLED` | Complaint was cancelled |

## Technology stack

### Frontend

- React 19
- Vite
- Axios
- React Router
- Lucide React
- Recharts
- CSS responsive design

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Tokens
- bcrypt
- Google Gemini SDK
- node-cron
- Helmet
- CORS
- Express Rate Limit

## Project structure

```text
resolveAI/
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── main.jsx
│       └── styles.css
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── jobs/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── seed/
│       ├── services/
│       ├── utils/
│       └── server.js
├── package.json
├── README.md
└── SPEC.md
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas or another MongoDB instance

Gemini is optional. If no Gemini API key is configured, ResolveAI uses deterministic fallback classification.

## Local installation

Clone the repository:

```bash
git clone https://github.com/AbdulAziz3318/resolveAI.git
cd resolveAI
```

Install dependencies:

```bash
npm install
npm run install:all
```

Copy the example environment file:

```bash
cp server/.env.example server/.env
```

On Windows PowerShell:

```powershell
Copy-Item "server\.env.example" "server\.env"
```

Configure the private values inside `server/.env`.

Seed the demonstration accounts:

```bash
cd server
node src/seed/demoAccounts.js
cd ..
```

Start the frontend and backend:

```bash
npm run dev
```

Open:

- Frontend: http://localhost:5173
- Backend health check: http://localhost:5000/api/health

## Environment variables

```env
PORT=5000
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
CLIENT_URL=http://localhost:5173
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
ASSIGNMENT_ACCEPTANCE_MINUTES=30
MAX_AUTO_REASSIGNMENTS=2
```

Never commit `server/.env` or expose production secrets.

## Demonstration accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@resolveai.demo` | `Admin@123` |
| Manager | `manager@resolveai.demo` | `Manager@123` |
| Worker | `worker@resolveai.demo` | `Worker@123` |
| User | `user@resolveai.demo` | `User@123` |

These credentials are intended only for project evaluation. Remove or disable privileged demo accounts before using the application in a real organization.

## API highlights

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/change-password
```

### Complaints

```text
GET  /api/complaints
POST /api/complaints
GET  /api/complaints/my
GET  /api/complaints/:id
PUT  /api/complaints/:id
POST /api/complaints/:id/confirm-resolution
POST /api/complaints/:id/reopen
```

### Worker assignments

```text
GET  /api/worker/assignments
POST /api/worker/assignments/:complaintId/accept
POST /api/worker/assignments/:complaintId/reject
POST /api/worker/complaints/:complaintId/start
POST /api/worker/complaints/:complaintId/resolve
GET  /api/worker/dashboard
PUT  /api/worker/availability
```

### Notifications

```text
GET /api/notifications
PUT /api/notifications/read-all
PUT /api/notifications/:id/read
```

### Manager

```text
GET  /api/manager/dashboard
GET  /api/manager/escalations
POST /api/manager/escalations/:id/acknowledge
```

### Administration

```text
GET  /api/admin/departments
POST /api/admin/departments
GET  /api/admin/shifts
POST /api/admin/shifts
GET  /api/admin/locations
POST /api/admin/locations
GET  /api/admin/workers
POST /api/admin/workers
POST /api/admin/workers/:id/reset-password
POST /api/admin/managers
```

## Production build

Build the React application:

```bash
npm run build
```

Start the combined production service:

```bash
npm start
```

In production, Express serves the compiled React application and the `/api` routes from the same service.

## Deployment

The project can be deployed as one Render web service.

Recommended configuration:

```text
Build command:
npm install && npm run install:all && npm run build

Start command:
npm start

Health check:
 /api/health
```

Configure environment variables through the deployment provider. Do not upload `server/.env`.

## Current scope and future development

The submitted mini-project demonstrates one organization. Planned improvements include:

- Organization registration and onboarding
- Multi-organization data isolation
- Organization-code login
- Student and employee imports
- Invitation-based staff onboarding
- Custom organization types
- Manager priority changes and manual reassignment UI
- Expanded analytics and audit reporting
- Email and SMS notifications
- Institutional SSO and database integration

## Security notes

- Passwords are hashed with bcrypt
- Protected routes require JWT authentication
- Role middleware restricts privileged operations
- Secrets remain in environment variables
- Workers and managers are provisioned by administrators
- Users cannot publicly register privileged roles
- Real environment files and dependencies are excluded from Git

## License

This project was created as an educational mini-project.
