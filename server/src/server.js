import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import cron from 'node-cron';
import { randomUUID } from 'node:crypto';
import { store } from './runtime/store.js';
import { generateId } from './utils/generateId.js';
import { calculateSla } from './utils/calculateSla.js';
import { connectDatabase, hydrateStore, persistStore } from './config/db.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { listNotifications, markAllNotificationsRead, markNotificationRead, notificationPayload } from './services/notificationService.js';
import authRoutes from './routes/authRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import shiftRoutes from './routes/shiftRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import workforceRoutes from './routes/workforceRoutes.js';
import managerProvisioningRoutes from './routes/managerProvisioningRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import { startAssignmentAcceptanceJob } from './jobs/assignmentAcceptanceJob.js';
import workerComplaintRoutes from './routes/workerComplaintRoutes.js';
import workerRoutes from './routes/workerRoutes.js';
import managerRoutes from './routes/managerRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in server/.env');
}
let database = { connected: false, mode: 'demo-store' };
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('tiny'));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 80 }));
app.use('/api/auth', authRoutes);
app.use('/api/admin/departments', departmentRoutes);
app.use('/api/admin/shifts', shiftRoutes);
app.use('/api/admin/locations', locationRoutes);
app.use('/api/admin/workers', workforceRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/worker/assignments', assignmentRoutes);

app.use(
  '/api/worker/complaints',
  workerComplaintRoutes,
);

app.use('/api/worker', workerRoutes);
app.use(
  '/api/admin/managers',
  managerProvisioningRoutes,
);
app.use(
  '/api/notifications',
  notificationRoutes,
);
app.use('/api/manager', managerRoutes);
app.use((request, response, next) => { response.on('finish', () => { if (database.connected && request.method !== 'GET' && response.statusCode < 400) persistStore(data).catch(error => console.error('Persistence failed:', error.message)); }); next(); });

const now = () => new Date();
const id = generateId;
const categories = ['ELECTRICAL', 'PLUMBING', 'WATER', 'NETWORK', 'CLEANING', 'SECURITY', 'INFRASTRUCTURE', 'IT_SUPPORT', 'EQUIPMENT', 'OTHER'];
const statuses = ['SUBMITTED', 'ANALYZING', 'ASSIGNED', 'AWAITING_ACCEPTANCE', 'ACCEPTED', 'IN_PROGRESS', 'RESOLVED', 'AWAITING_CONFIRMATION', 'CLOSED', 'REOPENED', 'ESCALATED', 'REJECTED', 'CANCELLED'];
const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const data = store;

const department = (name, supportedCategories) => ({ _id: randomUUID(), name, supportedCategories, isActive: true, defaultSlaHours: { LOW: 72, MEDIUM: 24, HIGH: 8, CRITICAL: 2 } });
const it = department('IT Department', ['NETWORK', 'IT_SUPPORT', 'EQUIPMENT']);
const maintenance = department('Maintenance Department', ['ELECTRICAL', 'PLUMBING', 'WATER', 'INFRASTRUCTURE']);
const security = department('Security Department', ['SECURITY']);
data.departments.push(it, maintenance, security);
data.shifts.push({ _id: randomUUID(), name: 'Morning', startTime: '08:00', endTime: '17:00', workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] }, { _id: randomUUID(), name: 'General', startTime: '09:00', endTime: '18:00', workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'] }, { _id: randomUUID(), name: 'Evening', startTime: '13:00', endTime: '22:00', workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] });
data.locations.push(...['Main Campus', 'Block A', 'Block B', 'Block C', 'Hostel 1', 'Lab Block'].map(name => ({ _id: randomUUID(), name, type: name === 'Main Campus' ? 'CAMPUS' : 'BUILDING', isActive: true })));

const password = await bcrypt.hash('Admin@123', 10);
const addUser = (name, email, role, dept, skills = [], availability = 'AVAILABLE', maxActiveJobs = 4, rating = 5) => { const user = { _id: randomUUID(), name, email, role, department: dept?._id, skills, assignedLocations: data.locations.slice(1, 3).map(x => x._id), shift: data.shifts[0]._id, availability, maxActiveJobs, averageRating: rating, completedComplaints: 12, isActive: true, mustChangePassword: false, password }; data.users.push(user); return user; };
const admin = addUser('Aarav Mehta', 'admin@resolveai.demo', 'ADMIN', null);
const managerIT = addUser('Priya Shah', 'manager@resolveai.demo', 'MANAGER', it);
const managerMaint = addUser('Vikram Rao', 'maintenance@resolveai.demo', 'MANAGER', maintenance);
const managerSec = addUser('Neha Kapoor', 'security@resolveai.demo', 'MANAGER', security);
const workers = [
  addUser('Rahul Kumar', 'worker@resolveai.demo', 'WORKER', it, ['Network', 'Computer', 'Router'], 'AVAILABLE', 5, 4.8),
  addUser('Arun Nair', 'arun@resolveai.demo', 'WORKER', it, ['Network', 'Hardware'], 'BUSY', 5, 4.4),
  addUser('Kiran Joshi', 'kiran@resolveai.demo', 'WORKER', it, ['Computer', 'Printer'], 'AVAILABLE', 3, 4.1),
  addUser('Ramesh Kumar', 'ramesh@resolveai.demo', 'WORKER', maintenance, ['Fan', 'Light', 'Wiring'], 'AVAILABLE', 4, 4.7),
  addUser('Suresh Das', 'suresh@resolveai.demo', 'WORKER', maintenance, ['Plumbing', 'Pipe Leakage'], 'OFF_DUTY', 4, 4.5),
  addUser('Meena Iyer', 'meena@resolveai.demo', 'WORKER', maintenance, ['Water Purifier', 'Motor Repair'], 'AVAILABLE', 4, 4.9),
  addUser('Dev Singh', 'dev@resolveai.demo', 'WORKER', security, ['Access Control', 'CCTV'], 'AVAILABLE', 4, 4.6),
  addUser('Farah Ali', 'farah@resolveai.demo', 'WORKER', security, ['Security', 'Patrol'], 'AVAILABLE', 4, 4.3)
];
for (const manager of [managerIT, managerMaint, managerSec]) manager.password = await bcrypt.hash('Manager@123', 10);
for (const worker of workers) worker.password = await bcrypt.hash('Worker@123', 10);
const demoUsers = ['user@resolveai.demo', 'student@resolveai.demo'].map((email, i) => addUser(i ? 'Nisha Verma' : 'Riya Sen', email, 'USER'));
const makeComplaint = (title, description, category, priority, dept, status, worker, location = 'Block C') => { const createdAt = new Date(Date.now() - Math.floor(Math.random() * 6) * 86400000); const complaint = { _id: randomUUID(), complaintId: id('CMP', data.complaints.length + 1), createdBy: demoUsers[0]._id, title, description, category, subCategory: category === 'NETWORK' ? 'NETWORK_OUTAGE' : category, priority, priorityScore: priority === 'CRITICAL' ? 85 : priority === 'HIGH' ? 58 : priority === 'MEDIUM' ? 31 : 12, priorityReason: priority === 'HIGH' ? 'Essential service impact and urgency terms detected' : 'Standard operational issue', location: { building: location, floor: 'Third Floor', room: '304' }, department: dept._id, assignedWorker: worker?._id, status, aiAnalysis: { source: 'fallback', summary: title, sentiment: priority === 'HIGH' ? 'FRUSTRATED' : 'NEUTRAL', keywords: title.toLowerCase().split(' ').slice(0, 4), confidence: 0.88 }, slaDeadline: new Date(createdAt.getTime() + (priority === 'HIGH' ? 8 : 24) * 3600000), slaBreached: false, slaWarningSent: false, createdAt, updatedAt: now() }; data.complaints.push(complaint); return complaint; };
makeComplaint('Network outage in Block C lab', 'Internet has not been working since morning and the lab cannot access the network.', 'NETWORK', 'HIGH', it, 'IN_PROGRESS', workers[0]);
makeComplaint('Ceiling fan not working', 'The fan in room 304 is making noise and has stopped spinning.', 'ELECTRICAL', 'MEDIUM', maintenance, 'AWAITING_ACCEPTANCE', workers[3], 'Block B');
makeComplaint('Water purifier needs service', 'The water purifier on the third floor is not dispensing water.', 'WATER', 'HIGH', maintenance, 'ASSIGNED', workers[5], 'Hostel 1');
makeComplaint('CCTV camera offline', 'The camera near the east gate has been offline since last night.', 'SECURITY', 'CRITICAL', security, 'ESCALATED', workers[6], 'Main Campus');
for (let i = 0; i < 16; i++) makeComplaint(`Recurring network issue ${i + 1}`, 'Wi-Fi connection drops repeatedly in Block C.', 'NETWORK', i % 4 === 0 ? 'HIGH' : 'MEDIUM', it, i % 3 === 0 ? 'CLOSED' : 'IN_PROGRESS', workers[i % 3]);
data.insights.push({ _id: randomUUID(), type: 'RECURRING_ISSUE', title: 'Network reliability is slipping in Block C', location: 'Block C', category: 'NETWORK', complaintCount: 17, recommendation: 'Investigate network infrastructure.', createdAt: now() });

function seedDemoNotifications() {
  for (const complaint of data.complaints.filter(c => c.assignedWorker)) {
    const worker = data.users.find(u => u._id === complaint.assignedWorker);
    if (!worker) continue;
    const assignment = data.assignments.find(item => item.complaint === complaint._id && item.worker === complaint.assignedWorker) || {
      _id: randomUUID(),
      complaint: complaint._id,
      worker: complaint.assignedWorker,
      assignmentScore: 80,
      scoreBreakdown: { skill: 40, availability: 25, workload: 10, performance: 5, location: 0 },
      assignedAt: complaint.createdAt || now(),
      acceptanceDeadline: new Date(Date.now() + 15 * 60000),
      reassignmentAttempt: 0,
      status: complaint.status === 'AWAITING_ACCEPTANCE' ? 'PENDING_ACCEPTANCE' : 'ACCEPTED',
    };
    if (!data.assignments.some(item => item.complaint === complaint._id && item.worker === complaint.assignedWorker)) {
      data.assignments.unshift(assignment);
    }
    if (!data.notifications.some(item => item.user === worker._id && item.complaint === complaint._id && item.type === 'ASSIGNMENT')) {
      notify(worker, 'ASSIGNMENT', 'New assignment', `${complaint.complaintId} · ${complaint.title}`, complaint, assignment);
    }
  }
}

function publicUser(user) { const { password: _, ...safe } = user; return safe; }
function complaintView(complaint) {
  return {
    ...complaint,
    reporter: publicUser(data.users.find(user => user._id === complaint.createdBy) || { name: 'Unknown reporter', role: 'USER' }),
    assignedWorkerDetails: complaint.assignedWorker ? publicUser(data.users.find(user => user._id === complaint.assignedWorker) || { name: 'Unassigned', role: 'WORKER' }) : null,
    departmentDetails: data.departments.find(department => department._id === complaint.department) || null
  };
}
function tokenFor(user) { return jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '2d' }); }
function auth(req, res, next) { const raw = req.headers.authorization?.replace('Bearer ', ''); if (!raw) return res.status(401).json({ success: false, message: 'Authentication required' }); try { req.auth = jwt.verify(raw, JWT_SECRET); req.user = data.users.find(u => u._id === req.auth.userId); if (!req.user) throw new Error('missing'); next(); } catch { res.status(401).json({ success: false, message: 'Invalid or expired token' }); } }
const roles = (...allowed) => (req, res, next) => allowed.includes(req.user.role) ? next() : res.status(403).json({ success: false, message: 'Insufficient permissions' });
const ok = (res, dataValue, message = 'Success') => res.json({ success: true, message, data: dataValue });
const log = (action, message, complaint, metadata = {}) => data.logs.unshift({ _id: randomUUID(), action, message, complaint: complaint?._id, metadata, createdAt: now() });
seedDemoNotifications();
function notify(user, type, title, message, complaint, assignment) {
  if (!user) return;
  const payload = notificationPayload(user, type, title, message, complaint?._id, assignment?._id);
  data.notifications.unshift({ _id: randomUUID(), ...payload, createdAt: now() });
}
function analyze(input) { const text = `${input.title} ${input.description}`.toLowerCase(); let category = 'OTHER'; if (/wifi|internet|network|router|connect/.test(text)) category = 'NETWORK'; else if (/water|purifier|pipe|leak/.test(text)) category = 'WATER'; else if (/fan|light|switch|wire|power/.test(text)) category = 'ELECTRICAL'; else if (/camera|security|gate|guard/.test(text)) category = 'SECURITY'; else if (/computer|printer|software/.test(text)) category = 'IT_SUPPORT'; const priority = /danger|fire|unsafe|outage|cannot|emergency/.test(text) ? 'HIGH' : /not working|broken|leak/.test(text) ? 'MEDIUM' : 'LOW'; const dept = data.departments.find(d => d.supportedCategories.includes(category)) || maintenance; return { summary: input.title, category, subCategory: category === 'NETWORK' ? 'NETWORK_OUTAGE' : category, priority, department: dept, keywords: text.split(/\s+/).filter(x => x.length > 4).slice(0, 6), sentiment: /frustrated|urgent|cannot/.test(text) ? 'FRUSTRATED' : 'NEUTRAL', confidence: 0.86, source: 'fallback' }; }
function scoreWorker(worker, complaint) { const active = data.complaints.filter(c => c.assignedWorker === worker._id && ['ASSIGNED', 'AWAITING_ACCEPTANCE', 'ACCEPTED', 'IN_PROGRESS'].includes(c.status)).length; if (!worker.isActive || ['OFF_DUTY', 'LEAVE', 'INACTIVE', 'ON_BREAK'].includes(worker.availability) || active >= worker.maxActiveJobs || worker.department !== complaint.department) return null; const skill = worker.skills.some(s => `${s} ${complaint.category} ${complaint.subCategory}`.toLowerCase().includes(complaint.category.toLowerCase())) ? 40 : 20; const availability = worker.availability === 'AVAILABLE' ? 25 : worker.availability === 'ASSIGNED' ? 18 : 8; const workload = active === 0 ? 20 : active <= 2 ? 15 : 10; const performance = worker.averageRating ? worker.averageRating / 5 * 10 : 5; const location = worker.assignedLocations.includes(data.locations.find(l => l.name === complaint.location.building)?._id) ? 5 : 0; return { worker, score: Math.round(skill + availability + workload + performance + location), breakdown: { skill, availability, workload, performance: Math.round(performance), location } }; }
function assign(complaint, excluded = []) { const ranked = data.users.map(u => scoreWorker(u, complaint)).filter(x => x && !excluded.includes(x.worker._id)).sort((a, b) => b.score - a.score); const best = ranked[0]; if (!best) { complaint.status = 'ESCALATED'; data.escalations.unshift({ _id: randomUUID(), complaint: complaint._id, level: 'LEVEL_1', reason: 'No eligible worker available', status: 'OPEN', createdAt: now() }); log('ESCALATION', 'Complaint escalated because no eligible worker was available', complaint); return null; } const assignment = { _id: randomUUID(), complaint: complaint._id, worker: best.worker._id, assignmentScore: best.score, scoreBreakdown: best.breakdown, assignedAt: now(), acceptanceDeadline: new Date(Date.now() + 15 * 60000), reassignmentAttempt: 0, status: 'PENDING_ACCEPTANCE' }; data.assignments.unshift(assignment); complaint.assignedWorker = best.worker._id; complaint.status = 'AWAITING_ACCEPTANCE'; const department = data.departments.find(item => item._id === complaint.department); complaint.slaDeadline = calculateSla(complaint.priority, now(), department?.defaultSlaHours); notify(best.worker, 'ASSIGNMENT', 'New assignment', `${complaint.complaintId} · ${complaint.title}`, complaint, assignment); log('SMART_ASSIGNMENT', `Complaint automatically assigned to ${best.worker.name}`, complaint, { assignmentScore: best.score, scoreBreakdown: best.breakdown }); return assignment; }

app.get('/api/health', (_, res) => ok(res, { status: 'healthy', service: 'ResolveAI API', mode: database.mode }));
app.post('/api/complaints/:id/confirm-resolution', auth, roles('USER'), (req, res) => { const c = data.complaints.find(x => x._id === req.params.id && x.createdBy === req.user._id); if (!c) return res.status(404).json({ success: false, message: 'Complaint not found' }); c.status = 'CLOSED'; c.closedAt = now(); c.userRating = req.body.rating; c.userFeedback = req.body.feedback; ok(res, c, 'Complaint closed'); });
app.post('/api/complaints/:id/reopen', auth, roles('USER'), (req, res) => { const c = data.complaints.find(x => x._id === req.params.id && x.createdBy === req.user._id); if (!c) return res.status(404).json({ success: false, message: 'Complaint not found' }); c.status = 'REOPENED'; c.reopenReason = req.body.reason; log('ESCALATION', 'User rejected resolution and reopened complaint', c); ok(res, c, 'Complaint reopened'); });
app.post('/api/complaints/:id/feedback', auth, roles('USER'), (req, res) => { const c = data.complaints.find(x => x._id === req.params.id && x.createdBy === req.user._id); if (!c) return res.status(404).json({ success: false, message: 'Complaint not found' }); c.userRating = Math.min(5, Math.max(1, Number(req.body.rating))); c.userFeedback = req.body.feedback || ''; ok(res, complaintView(c), 'Feedback saved'); });
app.get('/api/admin/automation', auth, roles('ADMIN', 'MANAGER'), (_, res) => ok(res, data.logs));
app.get('/api/admin/insights', auth, roles('ADMIN', 'MANAGER'), (_, res) => ok(res, data.insights));
app.get('/api/admin/escalations', auth, roles('ADMIN', 'MANAGER'), (_, res) => ok(res, data.escalations));
app.get('/api/manager/escalations', auth, roles('MANAGER'), (req, res) => ok(res, data.escalations.filter(e => data.complaints.find(c => c._id === e.complaint)?.department === req.user.department)));
app.post('/api/manager/escalations/:id/acknowledge', auth, roles('MANAGER'), (req, res) => { const escalation = data.escalations.find(e => e._id === req.params.id); if (!escalation) return res.status(404).json({ success: false, message: 'Escalation not found' }); escalation.status = 'ACKNOWLEDGED'; escalation.acknowledgedAt = now(); ok(res, escalation, 'Escalation acknowledged'); });
app.post('/api/manager/complaints/:id/change-priority', auth, roles('MANAGER', 'ADMIN'), (req, res) => { const c = data.complaints.find(x => x._id === req.params.id); if (!c || (req.user.role === 'MANAGER' && c.department !== req.user.department)) return res.status(404).json({ success: false, message: 'Complaint not found' }); c.priority = req.body.priority; log('MANUAL_PRIORITY_CHANGE', `Priority changed to ${c.priority}`, c); ok(res, complaintView(c), 'Priority changed'); });
app.post('/api/manager/complaints/:id/reassign', auth, roles('MANAGER', 'ADMIN'), (req, res) => { const c = data.complaints.find(x => x._id === req.params.id); const worker = data.users.find(x => x._id === req.body.workerId && x.role === 'WORKER'); if (!c || !worker) return res.status(404).json({ success: false, message: 'Complaint or worker not found' }); c.assignedWorker = worker._id; c.status = 'ASSIGNED'; log('MANUAL_REASSIGNMENT', `Complaint manually assigned to ${worker.name}`, c); ok(res, complaintView(c), 'Complaint reassigned'); });
app.get('/api/analytics/overview', auth, roles('ADMIN', 'MANAGER'), (_, res) => { const total = data.complaints.length; const closed = data.complaints.filter(c => c.status === 'CLOSED').length; ok(res, { totalComplaints: total, openComplaints: data.complaints.filter(c => !['CLOSED', 'CANCELLED'].includes(c.status)).length, resolutionRate: Math.round(closed / total * 100), slaCompliance: 94, criticalIssues: data.complaints.filter(c => c.priority === 'CRITICAL' && c.status !== 'CLOSED').length, activeWorkers: workers.length, availableWorkers: workers.filter(w => w.availability === 'AVAILABLE').length, reassignmentCount: data.assignments.filter(a => a.reassignmentAttempt > 0).length }); });
app.get('/api/analytics/categories', auth, roles('ADMIN', 'MANAGER'), (_, res) => ok(res, categories.map(category => ({ category, count: data.complaints.filter(c => c.category === category).length }))));
app.get('/api/analytics/departments', auth, roles('ADMIN', 'MANAGER'), (_, res) => ok(res, data.departments.map(d => ({ department: d.name, count: data.complaints.filter(c => c.department === d._id).length }))));
app.get('/api/analytics/sla', auth, roles('ADMIN', 'MANAGER'), (_, res) => ok(res, { compliance: 94, breached: data.complaints.filter(c => c.slaBreached).length, warning: data.complaints.filter(c => c.slaWarningSent).length }));
app.get('/api/analytics/trends', auth, roles('ADMIN', 'MANAGER'), (_, res) => ok(res, Array.from({ length: 7 }, (_, i) => ({ day: `Day ${i + 1}`, complaints: data.complaints.filter(c => c.createdAt > new Date(Date.now() - (i + 1) * 86400000)).length }))));
app.get('/api/analytics/workforce', auth, roles('ADMIN', 'MANAGER'), (_, res) => ok(res, workers.map(w => ({ worker: w.name, availability: w.availability, maxActiveJobs: w.maxActiveJobs, rating: w.averageRating }))));
app.get('/api/incidents', auth, roles('ADMIN', 'MANAGER'), (_, res) => ok(res, data.incidents || []));
app.post('/api/incidents', auth, roles('ADMIN', 'MANAGER'), (req, res) => { data.incidents ||= []; const incident = { _id: randomUUID(), incidentId: id('INC', data.incidents.length + 1), title: req.body.title, description: req.body.description || '', category: req.body.category || 'OTHER', location: req.body.location || '', priority: req.body.priority || 'MEDIUM', linkedComplaints: [], status: 'OPEN', createdBy: req.user._id, createdAt: now() }; data.incidents.push(incident); log('MASTER_INCIDENT_CREATED', `Created ${incident.incidentId}`); ok(res, incident, 'Incident created'); });
app.get('/api/incidents/:id', auth, roles('ADMIN', 'MANAGER'), (req, res) => { const incident = (data.incidents || []).find(i => i._id === req.params.id || i.incidentId === req.params.id); if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' }); ok(res, incident); });
app.post('/api/incidents/:id/link', auth, roles('ADMIN', 'MANAGER'), (req, res) => { const incident = (data.incidents || []).find(i => i._id === req.params.id); const c = data.complaints.find(x => x._id === req.body.complaintId); if (!incident || !c) return res.status(404).json({ success: false, message: 'Incident or complaint not found' }); if (!incident.linkedComplaints.includes(c._id)) incident.linkedComplaints.push(c._id); c.masterIncident = incident._id; ok(res, incident, 'Complaint linked'); });
app.post('/api/incidents/:id/resolve', auth, roles('ADMIN', 'MANAGER'), (req, res) => { const incident = (data.incidents || []).find(i => i._id === req.params.id); if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' }); incident.status = 'RESOLVED'; incident.resolvedAt = now(); ok(res, incident, 'Incident resolved'); });
app.post('/api/incidents/:id/close', auth, roles('ADMIN', 'MANAGER'), (req, res) => { const incident = (data.incidents || []).find(i => i._id === req.params.id); if (!incident) return res.status(404).json({ success: false, message: 'Incident not found' }); incident.status = 'CLOSED'; ok(res, incident, 'Incident closed'); });
app.get('/api/manager/dashboard', auth, roles('MANAGER'), (req, res) => ok(res, { complaints: data.complaints.filter(c => c.department === req.user.department), workers: data.users.filter(u => u.department === req.user.department && u.role === 'WORKER'), escalations: data.escalations }));
app.use((_, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use(errorMiddleware);
cron.schedule('*/5 * * * *', () => { data.complaints.filter(c => !['CLOSED', 'CANCELLED'].includes(c.status) && c.slaDeadline < now() && !c.slaBreached).forEach(c => { c.slaBreached = true; c.status = 'ESCALATED'; log('SLA_BREACH', 'SLA deadline exceeded; manager intervention required', c); }); });
database = await connectDatabase();
if (database.connected) {
  const hydrated = await hydrateStore(data);
  if (!hydrated) await persistStore(data);
  startAssignmentAcceptanceJob();
  console.log(`ResolveAI persistence enabled (${hydrated ? 'loaded existing state' : 'created initial state'})`);
}
app.listen(PORT, () => console.log(`ResolveAI API running on http://localhost:${PORT} (${database.mode})`));
