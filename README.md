# ResolveAI

ResolveAI is an AI-powered issue resolution and workflow automation platform for institutions. It turns a complaint into an explainable operational workflow: analysis, priority, department routing, worker scoring, notification, acceptance, SLA monitoring and resolution confirmation.

> ResolveAI does not recruit workers. Institutions onboard their existing workforce, and ResolveAI coordinates assignment, notifications, deadlines, escalation and operational insight.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run install:all
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:5000`.

The current demo mode uses an in-memory store so the complete experience works without MongoDB. Set `MONGODB_URI` and replace the demo store with persistent models when moving to deployment.

## Demo access

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@resolveai.demo | Admin@123 |
| Manager | manager@resolveai.demo | Manager@123 |
| Worker | worker@resolveai.demo | Worker@123 |
| User | user@resolveai.demo | User@123 |

## Implemented workflow

- JWT authentication and role-aware access for users, workers, managers and admins
- Deterministic fallback complaint analysis when Gemini is unavailable
- Category, subcategory, priority and department routing
- Eligibility filtering for worker status, department and maximum workload
- Explainable assignment score with skill, availability, workload, performance and location breakdown
- In-app assignment notifications and persistent automation audit logs
- Worker accept, start and resolve actions
- User confirmation and reopen flow
- SLA deadline and escalation representation
- Admin command center, workforce capacity view and automation audit trail
- Responsive operational UI with loading, empty, error, mobile navigation and modal states

## API highlights

- `GET /api/health`
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/complaints`, `POST /api/complaints`, `GET /api/complaints/:id`
- `POST /api/worker/complaints/:id/accept`
- `POST /api/worker/complaints/:id/start`
- `POST /api/worker/complaints/:id/resolve`
- `POST /api/complaints/:id/confirm-resolution`
- `POST /api/complaints/:id/reopen`
- `GET /api/admin/workers`, `POST /api/admin/workers`
- `GET /api/analytics/overview`, `GET /api/admin/automation`, `GET /api/admin/insights`

## Environment

Copy `server/.env.example` to `server/.env`. Backend secrets must remain server-side. Gemini is optional; complaint submission remains available through deterministic fallback logic.

## Architecture direction

The intended production structure follows the specification: Express routes and thin controllers call services, services own analysis, priority, routing, assignment, notification, escalation and analytics, and Mongoose models persist the required collections. The demo store in this first implementation keeps the primary complaint-to-resolution loop immediately demonstrable while the frontend and API contracts remain stable for that persistence layer.
