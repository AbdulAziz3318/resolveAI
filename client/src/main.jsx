import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  X,
} from "lucide-react";
import "./styles.css";

const api = axios.create({ baseURL: "/api" });
const demoAccounts = {
  ADMIN: ["admin@resolveai.demo", "Admin@123"],
  MANAGER: ["manager@resolveai.demo", "Manager@123"],
  WORKER: ["worker@resolveai.demo", "Worker@123"],
  USER: ["user@resolveai.demo", "User@123"],
};
const statusTone = (s) =>
  ({
    CLOSED: "green",
    IN_PROGRESS: "blue",
    AWAITING_CONFIRMATION: "amber",
    ESCALATED: "red",
    AWAITING_ACCEPTANCE: "violet",
    ACCEPTED: "blue",
    REOPENED: "amber",
  })[s] || "slate";
const priorityTone = (p) =>
  ({ CRITICAL: "red", HIGH: "orange", MEDIUM: "amber", LOW: "green" })[p] ||
  "slate";
const statusLabel = (status) =>
  ({
    SUBMITTED: 'Submitted',
    ANALYZING: 'Analyzing',
    AWAITING_ACCEPTANCE:
      'Waiting for worker',
    ACCEPTED: 'Accepted by worker',
    IN_PROGRESS: 'Work in progress',
    AWAITING_CONFIRMATION:
      'Worker finished · awaiting user',
    CLOSED: 'Resolved and closed',
    REOPENED: 'Reopened by user',
    ESCALATED: 'Manager attention required',
    CANCELLED: 'Cancelled',
  })[status] ||
  status.replaceAll('_', ' ');
function App() {
  const [auth, setAuth] = useState(() =>
    JSON.parse(localStorage.getItem("resolveai-auth") || "null"),
  );
  const [view, setView] = useState("overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [toast, setToast] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [overview, setOverview] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [complaintFilter, setComplaintFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showWorker, setShowWorker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("resolveai-theme") || "light");
  const unreadNotifications = notifications.filter((notification) => !notification.isRead).length;
  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("resolveai-theme", nextTheme);
  }
  useEffect(() => {
  if (auth) {
    api.defaults.headers.common.Authorization =
      `Bearer ${auth.token}`;

    loadData();
  }
}, [auth, view]);
  useEffect(() => {
  if (!auth?.token) {
    return undefined;
  }

  const refreshTimer = setInterval(() => {
    loadData(true);
  }, 15000);

  return () => {
    clearInterval(refreshTimer);
  };
}, [auth?.token, view]);
  async function loadData(silent = false) {
  if (!silent) {
    setLoading(true);
  }
  try {
    const notificationResponse =
      await api.get('/notifications');

    setNotifications(
      notificationResponse.data.data || [],
    );

    if (auth.user.role === 'USER') {
      const response =
        await api.get('/complaints/my');

      setComplaints(response.data.data || []);
      setOverview(null);
      setWorkers([]);
      setLogs([]);
    }

    if (auth.user.role === 'WORKER') {
      const response =
        await api.get('/worker/dashboard');

      const dashboard = response.data.data;

      setComplaints(
        dashboard.complaints || [],
      );
      setOverview(
        dashboard.statistics || null,
      );
      setWorkers([]);
      setLogs([]);
    }

    if (auth.user.role === 'MANAGER') {
      const response =
        await api.get('/manager/dashboard');

      const dashboard = response.data.data;

      setComplaints(
        dashboard.complaints || [],
      );
      setWorkers(dashboard.workers || []);
      setOverview(
        dashboard.statistics || null,
      );
      setLogs([]);
    }

    if (auth.user.role === 'ADMIN') {
  const [
    complaintResponse,
    workerResponse,
  ] = await Promise.all([
    api.get('/complaints'),
    api.get('/admin/workers'),
  ]);

  const adminComplaints =
    complaintResponse.data.data || [];

  const adminWorkers =
    workerResponse.data.data || [];

  setComplaints(adminComplaints);
  setWorkers(adminWorkers);
  setLogs([]);

  setOverview({
    totalComplaints: adminComplaints.length,

    openComplaints:
      adminComplaints.filter(
        (complaint) =>
          !['CLOSED', 'CANCELLED'].includes(
            complaint.status,
          ),
      ).length,

    criticalIssues:
      adminComplaints.filter(
        (complaint) =>
          complaint.priority === 'CRITICAL' &&
          !['CLOSED', 'CANCELLED'].includes(
            complaint.status,
          ),
      ).length,

    activeWorkers:
      adminWorkers.filter(
        (worker) => worker.isActive,
      ).length,

    availableWorkers:
      adminWorkers.filter(
        (worker) =>
          worker.availability === 'AVAILABLE',
      ).length,
  });
}
  } catch (error) {
    if (error.response?.status === 401) {
  setToast(
    'Your session could not load. Please sign in again.',
  );
  return;
}

    setToast(
      error.response?.data?.message ||
        'Unable to load workspace',
    );
  } finally {
  if (!silent) {
    setLoading(false);
  }
}
  }
  function login(payload) {
    setAuth(payload);
    localStorage.setItem("resolveai-auth", JSON.stringify(payload));
  }
  function logout() {
    setAuth(null);
    localStorage.removeItem("resolveai-auth");
  }
  if (!auth) return <Login onLogin={login} theme={theme} onToggleTheme={toggleTheme} />;
  const role = auth.user.role;
  const nav =
    role === "USER"
      ? [
          ["overview", "My overview", LayoutDashboard],
          ["complaints", "My complaints", ClipboardList],
        ]
      : role === "WORKER"
        ? [
            ["overview", "My work queue", LayoutDashboard],
            ["complaints", "Assignments", ClipboardList],
            ["notifications", "Notifications", Bell],
          ]
        : [
            ["overview", "Command center", LayoutDashboard],
            ["complaints", "All complaints", ClipboardList],
            ["workforce", "Workforce", Users],
            ["automation", "Automation log", Activity],
          ];
  return (
    <div className={`app-shell theme-${theme}`}>
      <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          <span>
            resolve<span>ai</span>
          </span>
        </div>
        <div className="workspace-label">OPERATIONS DESK</div>
        <nav>
          {nav.map(([key, label, Icon]) => (
            <button
              className={view === key ? "nav-item active" : "nav-item"}
              onClick={() => {
                setView(key);
                setMobileNav(false);
              }}
              key={key}
            >
              <Icon size={18} />
              <span>{label}</span>
              {key === "notifications" && unreadNotifications > 0 && <i className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-profile">
  <div className="avatar">
    {auth.user.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)}
  </div>

  <div>
    <strong>{auth.user.name}</strong>
    <span>{auth.user.email}</span>
    <small>
      {auth.user.role.replaceAll('_', ' ')}
      {auth.user.employeeId
        ? ` · ${auth.user.employeeId}`
        : ''}
    </small>
  </div>
</div>
          <div className="trust">
            <ShieldCheck size={16} />
            <span>Automation protected</span>
          </div>
          <button className="logout" onClick={logout}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <button
            className="icon-button menu-button"
            onClick={() => setMobileNav(!mobileNav)}
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumbs">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{nav.find((x) => x[0] === view)?.[1]}</strong>
          </div>
          <div className="top-actions">
            <div className="search">
              <Search size={16} />
              <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search issues..." />
            </div>
            <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="icon-button" onClick={() => setView("notifications")} aria-label={`Open notifications${unreadNotifications ? ` (${unreadNotifications} unread)` : ""}`}>
              <Bell size={18} />
              {unreadNotifications > 0 && <i className="notification-dot" />}
            </button>
            <div className="avatar">
              {auth.user.name
                ?.split(" ")
                .map((x) => x[0])
                .join("")
                .slice(0, 2)}
            </div>
          </div>
        </header>
        <section className="content">
          <div className="page-head">
            <div>
              <div className="eyebrow">
                {role === "ADMIN"
                  ? "ADMINISTRATION"
                  : role === "MANAGER"
                    ? "DEPARTMENT CONTROL"
                    : role === "WORKER"
                      ? "PERSONAL QUEUE"
                      : "SERVICE DESK"}
              </div>
              <h1>
                {view === "overview"
                  ? "Good morning, " + auth.user.name.split(" ")[0]
                  : nav.find((x) => x[0] === view)?.[1]}
              </h1>
              <p>
                {view === "overview"
                  ? "Here is what needs your attention today."
                  : "Track operational work with clarity and confidence."}
              </p>
            </div>
            {role === "USER" && (
              <button
                className="primary-button"
                onClick={() => setShowNew(true)}
              >
                <Plus size={17} /> Report an issue
              </button>
            )}
          </div>
          {view === "overview" && (
            <Overview
              role={role}
              overview={overview}
              complaints={complaints}
              workers={workers}
              onFilter={(filter) => {
                setComplaintFilter(filter);
                setView("complaints");
              }}
            />
          )}
          {view === "complaints" && (
            <Complaints
              complaints={complaints.filter((complaint) => `${complaint.title} ${complaint.complaintId} ${complaint.createdBy?.name || ""} ${complaint.assignedWorker?.name || ""}`.toLowerCase().includes(searchTerm.toLowerCase()))}
              role={role}
              reload={loadData}
              toast={setToast}
              filter={complaintFilter}
              setFilter={setComplaintFilter}
            />
          )}
          {view === "workforce" && <Workforce workers={workers} onAdd={() => setShowWorker(true)} />}
          {view === "automation" && <Automation logs={logs} />}
          {view === "notifications" && (
            <Notifications
              notifications={notifications}
              reload={loadData}
              setNotifications={setNotifications}
            />
          )}
        </section>
      </main>
      {showNew && (
        <NewComplaint
          close={() => setShowNew(false)}
          done={() => {
            setShowNew(false);
            loadData();
            setToast("Issue analyzed and routed successfully");
          }}
        />
      )}
      {showWorker && <NewWorker close={() => setShowWorker(false)} done={() => { setShowWorker(false); loadData(); setToast("Worker added to the workforce"); }} />}
      {toast && (
        <div className="toast">
          <CheckCircle2 size={17} />
          {toast}
          <button onClick={() => setToast("")}>
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function Login({ onLogin, theme, onToggleTheme }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("admin@resolveai.demo");
  const [password, setPassword] = useState("Admin@123");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await api.post(`/auth/${mode}`, {
        email,
        password,
        name: "New user",
      });
      onLogin(r.data.data);
    } catch (x) {
      setError(x.response?.data?.message || "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={`auth-page theme-${theme}`}>
      <div className="auth-visual">
        <div className="auth-orbit orbit-one" />
        <div className="auth-orbit orbit-two" />
        <div className="auth-copy">
          <div className="brand light">
            <span className="brand-mark">
              <Sparkles size={18} />
            </span>
            <span>
              resolve<span>ai</span>
            </span>
          </div>
          <div className="auth-kicker">INTELLIGENT OPERATIONS</div>
          <h1>
            Every issue has a<br />
            <em>clear next step.</em>
          </h1>
          <p>
            One calm command center for routing, workforce capacity, SLA health
            and resolution.
          </p>
          <div className="signal">
            <span className="signal-pulse" /> Live workflow intelligence{" "}
            <ArrowUpRight size={15} />
          </div>
        </div>
      </div>
      <div className="auth-panel">
        <button className="auth-theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
        <div className="mobile-brand brand">
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          <span>
            resolve<span>ai</span>
          </span>
        </div>
        <div className="auth-panel-inner">
          <div className="eyebrow">WELCOME BACK</div>
          <h2>
            {mode === "login" ? "Sign in to your desk" : "Create your account"}
          </h2>
          <p className="muted">
            {mode === "login"
              ? "Pick up where your operation left off."
              : "Create a resident account to report issues."}
          </p>
          <form onSubmit={submit}>
            <label>
              Email address
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </label>
            <label>
              Password
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </label>
            {error && <div className="form-error">{error}</div>}
            <button className="primary-button full" disabled={busy}>
              {busy
                ? "Connecting..."
                : mode === "login"
                  ? "Enter workspace"
                  : "Create account"}{" "}
              <ArrowUpRight size={17} />
            </button>
          </form>
          {mode === "login" && (
            <div className="demo-login">
              <span>Demo access</span>
              <div>
                {Object.entries(demoAccounts).map(([r, [e, p]]) => (
                  <button
                    key={r}
                    onClick={() => {
                      setEmail(e);
                      setPassword(p);
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            className="switch-auth"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login"
              ? "Need a resident account? Register"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Overview({ role, overview, complaints, workers, onFilter }) {
  const counts = {
    open: complaints.filter((c) => !["CLOSED", "CANCELLED"].includes(c.status))
      .length,
    active: complaints.filter((c) =>
      ["IN_PROGRESS", "ACCEPTED"].includes(c.status),
    ).length,
    awaiting: complaints.filter((c) => c.status === "AWAITING_CONFIRMATION")
      .length,
    escalated: complaints.filter((c) => c.status === "ESCALATED").length,
  };
  const metrics =
    role === "USER"
      ? [
          ["Total issues", complaints.length, ClipboardList, "slate", "all"],
          ["Open", counts.open, Clock3, "amber", "open"],
          ["In progress", counts.active, Activity, "blue", "active"],
          ["Awaiting you", counts.awaiting, CheckCircle2, "green", "awaiting"],
        ]
      : [
          [
            "Open issues",
            overview?.openComplaints || counts.open,
            ClipboardList,
            "slate",
            "open",
          ],
          [
            "SLA compliance",
            `${overview?.slaCompliance || 94}%`,
            CheckCircle2,
            "green",
            "all",
          ],
          [
            "Critical attention",
            overview?.criticalIssues || counts.escalated,
            AlertTriangle,
            "red",
            "critical",
          ],
          [
            "Available workers",
            overview?.availableWorkers || workers.length,
            Users,
            "blue",
            "all",
          ],
        ];
  return (
    <>
      <div className="metric-grid">
        {metrics.map(([label, value, Icon, tone, filter]) => (
          <button className="metric" key={label} onClick={() => onFilter(filter)}>
            <div className={`metric-icon ${tone}`}>
              <Icon size={18} />
            </div>
            <div>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
            <ArrowUpRight className="metric-arrow" size={16} />
          </button>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="panel wide">
          <div className="panel-head">
            <div>
              <h3>Recent activity</h3>
              <p>Latest movement across your operation</p>
            </div>
            <button className="text-button">
              View all <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="table-list">
            {complaints.slice(0, 5).map((c) => (
              <div className="issue-row" key={c._id}>
                <div className={`issue-symbol ${priorityTone(c.priority)}`}>
                  <ClipboardList size={16} />
                </div>
                <div className="issue-main">
                  <strong>{c.title}</strong>
                  <span>
                    {c.complaintId} · {c.location?.building} · {c.createdBy?.name || "Unknown reporter"} · Worker: {c.assignedWorker?.name || "Unassigned"}
                  </span>
                </div>
                <span className={`badge ${statusTone(c.status)}`}>
                  {c.status.replaceAll("_", " ")}
                </span>
                <span className={`priority ${priorityTone(c.priority)}`}>
                  {c.priority}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="panel insight-panel">
          <div className="panel-head">
            <div>
              <h3>
                <Sparkles size={16} /> AI insight
              </h3>
              <p>Pattern detection, last 7 days</p>
            </div>
          </div>
          <div className="insight-number">
            17<span> related issues</span>
          </div>
          <h4>Network reliability is slipping in Block C</h4>
          <p>
            Complaints are clustering around the same location. Consider opening
            a master incident to address the underlying infrastructure.
          </p>
          <button className="outline-button">
            Review pattern <ArrowUpRight size={15} />
          </button>
        </section>
      </div>
    </>
  );
}

function Complaints({ complaints, role, reload, toast, filter, setFilter }) {
  const visibleComplaints = complaints.filter((complaint) =>
    filter === "open"
      ? !["CLOSED", "CANCELLED"].includes(complaint.status)
      : filter === "critical"
        ? complaint.priority === "CRITICAL"
        : filter === "active"
          ? ["IN_PROGRESS", "ACCEPTED"].includes(complaint.status)
          : filter === "awaiting"
            ? complaint.status === "AWAITING_CONFIRMATION"
            : true,
  );
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h3>{role === "WORKER" ? "Your assignments" : "Issue register"}</h3>
          <p>{visibleComplaints.length} records · sorted by most recent</p>
        </div>
        <div className="filter-pills">
          <button className={`pill ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
          <button className={`pill ${filter === "open" ? "active" : ""}`} onClick={() => setFilter("open")}>Open</button>
          <button className={`pill ${filter === "critical" ? "active" : ""}`} onClick={() => setFilter("critical")}>Critical</button>
        </div>
      </div>
      <div className="complaint-table">
        <div className="table-header">
          <span>Issue</span>
          <span>Reporter / worker</span>
          <span>Category</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        {visibleComplaints.map((c) => (
          <ComplaintRow
            key={c._id}
            c={c}
            role={role}
            reload={reload}
            toast={toast}
          />
        ))}
      </div>
      {!visibleComplaints.length && <div className="table-empty">No issues match this view.</div>}
    </section>
  );
}
function ComplaintRow({ c, role, reload, toast }) {
  const [busy, setBusy] = useState(false);
  async function act(endpoint, body) {
    setBusy(true);
    try {
      await api.post(endpoint, body);
      toast("Workflow updated");
      reload();
    } catch (e) {
      toast(e.response?.data?.message || "Action failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="table-row">
      <div className="issue-main">
        <strong>{c.title}</strong>
        <span>
          {c.complaintId} · {c.location?.building}{c.location?.floor ? ` · ${c.location.floor}` : ""}
        </span>
      </div>
      <div className="people-cell">
        <strong>{c.createdBy?.name|| "Unknown reporter"}</strong>
        <span>Worker: {c.assignedWorker?.name || "Unassigned"}</span>
      </div>
      <span className="category-label">{c.category}<small>{c.department?.name || "Unrouted"}</small></span>
      <span className={`priority ${priorityTone(c.priority)}`}>
        {c.priority}
      </span>
      <span className={`badge ${statusTone(c.status)}`}>
        {statusLabel(c.status)}
      </span>
      <div>
        {role === "WORKER" && c.status === "AWAITING_ACCEPTANCE" && (
          <button
            className="small-button"
            disabled={busy}
            onClick={() => act(`/worker/assignments/${c.complaintId}/accept`)}
          >
            Accept
          </button>
        )}
        {role === "WORKER" && ["ACCEPTED", "ASSIGNED"].includes(c.status) && (
          <button
            className="small-button"
            disabled={busy}
            onClick={() => act(`/worker/complaints/${c.complaintId}/start`)}
          >
            Start work
          </button>
        )}
        {role === "WORKER" && c.status === "IN_PROGRESS" && (
          <button
            className="small-button"
            disabled={busy}
            onClick={() =>
              act(`/worker/complaints/${c.complaintId}/resolve`, {
                resolutionNote: "Issue repaired and tested successfully.",
              })
            }
          >
            Resolve
          </button>
        )}
        {role === "USER" && c.status === "AWAITING_CONFIRMATION" && (
          <button
            className="small-button"
            disabled={busy}
            onClick={() =>
              act(`/complaints/${c.complaintId}/confirm-resolution`, {
                rating: 5,
                feedback: "Resolved promptly.",
              })
            }
          >
            Confirm
          </button>
        )}
      </div>
    </div>
  );
}
function Workforce({ workers, onAdd }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h3>Workforce capacity</h3>
          <p>Eligibility, skills and live workload</p>
        </div>
        <span className="live-label">
  <i /> Workforce live
</span>
      </div>
      <div className="worker-grid">
        {workers.map((w) => (
          <div className="worker-card" key={w._id}>
            <div className="worker-top">
              <div className="avatar large">
                {w.name
                  .split(" ")
                  .map((x) => x[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <span className={`availability ${w.availability.toLowerCase()}`}>
                <i />
                {w.availability.replace("_", " ")}
              </span>
            </div>
            <h4>{w.name}</h4>
            <span className="worker-dept">{w.email}</span>
            <div className="skill-list">
              {w.skills.slice(0, 3).map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
            <div className="workload">
              <div>
                <span>Active workload</span>
                <strong>
                  {w.maxActiveJobs
                    ? `${Math.min(2, w.maxActiveJobs)} / ${w.maxActiveJobs}`
                    : "—"}
                </strong>
              </div>
              <div className="workload-bar">
                <i
                  style={{
                    width: `${Math.min(100, w.maxActiveJobs ? (2 / w.maxActiveJobs) * 100 : 0)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function Automation({ logs }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h3>Automation audit trail</h3>
          <p>Every machine decision, explainable and reviewable</p>
        </div>
        <span className="live-label">
          <i /> Live
        </span>
      </div>
      <div className="log-list">
        {logs.slice(0, 10).map((l) => (
          <div className="log-row" key={l._id}>
            <div className="log-icon">
              <Activity size={16} />
            </div>
            <div>
              <strong>{l.action.replaceAll("_", " ")}</strong>
              <p>{l.message}</p>
            </div>
            <time>
              {new Date(l.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        ))}
      </div>
    </section>
  );
}
function Notifications({ notifications, reload, setNotifications }) {
  const markRead = async (notificationId) => {
    const previous = notifications;
    setNotifications((current) =>
      current.map((notification) =>
        notification._id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );

    try {
      await api.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      setNotifications(previous);
      throw error;
    }
  };

  return (
    <section className="panel empty-panel">
      <div className="empty-icon">
        <Bell size={24} />
      </div>
      {notifications.length ? (
        <div className="notification-list">
          {notifications.map((notification) => (
            <article
              className={`notification-item ${notification.isRead ? "read" : ""}`}
              key={notification._id}
              onClick={() => !notification.isRead && markRead(notification._id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if ((event.key === "Enter" || event.key === " ") && !notification.isRead) {
                  event.preventDefault();
                  markRead(notification._id);
                }
              }}
            >
              <strong>{notification.title}</strong>
              <p>{notification.message}</p>
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
            </article>
          ))}
          <button
            className="outline-button"
            onClick={async () => {
              const previous = notifications;
              setNotifications((current) =>
                current.map((notification) => ({
                  ...notification,
                  isRead: true,
                })),
              );

              try {
                await api.put("/notifications/read-all");
              } catch (error) {
                setNotifications(previous);
                throw error;
              }
            }}
          >
            Mark all as read
          </button>
        </div>
      ) : (
        <>
          <h3>You're all caught up</h3>
          <p>New assignments, SLA warnings and updates will appear here.</p>
        </>
      )}
    </section>
  );
}
function NewWorker({ close, done }) {
  const [form, setForm] = useState({ name: "", email: "", skills: "" });
  const [busy, setBusy] = useState(false);
  async function submit(event) { event.preventDefault(); setBusy(true); try { await api.post("/admin/workers", { name: form.name, email: form.email, skills: form.skills.split(",").map(skill => skill.trim()).filter(Boolean), maxActiveJobs: 4 }); done(); } catch { setBusy(false); } }
  return <div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={close}><X size={18} /></button><div className="eyebrow">WORKFORCE PROVISIONING</div><h2>Add a worker</h2><p className="muted">Create an institution-managed worker account. Temporary password: Worker@123.</p><form onSubmit={submit}><label>Full name<input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label><label>Email address<input required type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label><label>Skills<input placeholder="Network, Router, Hardware" value={form.skills} onChange={event => setForm({ ...form, skills: event.target.value })} /></label><div className="modal-actions"><button type="button" className="outline-button" onClick={close}>Cancel</button><button className="primary-button" disabled={busy}>{busy ? "Creating..." : "Create worker"} <ArrowUpRight size={16} /></button></div></form></div></div>;
}
function NewComplaint({ close, done }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    building: "Block C",
    floor: "",
    room: "",
  });
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/complaints", {
        title: form.title,
        description: form.description,
        location: {
          building: form.building,
          floor: form.floor,
          room: form.room,
        },
      });
      done();
    } catch {
      setBusy(false);
    }
  }
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={close}>
          <X size={18} />
        </button>
        <div className="eyebrow">NEW SERVICE REQUEST</div>
        <h2>Tell us what needs fixing.</h2>
        <p className="muted">
          Our analysis engine will categorize, prioritize and route it
          automatically.
        </p>
        <form onSubmit={submit}>
          <label>
            Short title
            <input
              autoFocus
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Wi-Fi unavailable in the lab"
            />
          </label>
          <label>
            Describe the issue
            <textarea
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Include what happened, when it started, and who is affected."
              rows="4"
            />
          </label>
          <div className="form-grid">
            <label>
              Building
              <select
                value={form.building}
                onChange={(e) => setForm({ ...form, building: e.target.value })}
              >
                <option>Block A</option>
                <option>Block B</option>
                <option>Block C</option>
                <option>Hostel 1</option>
                <option>Lab Block</option>
              </select>
            </label>
            <label>
              Floor
              <input
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                placeholder="Optional"
              />
            </label>
            <label>
              Room
              <input
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                placeholder="Optional"
              />
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="outline-button" onClick={close}>
              Cancel
            </button>
            <button className="primary-button" disabled={busy}>
              {busy ? "Analyzing..." : "Submit issue"}{" "}
              <ArrowUpRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);

