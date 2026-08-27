// Purpose: Manager escalation handling route.
import PageShell from '../PageShell.jsx';
export default function ManagerEscalations() { return <PageShell title="Department escalations" description="Acknowledge and intervene on overdue operational work." endpoint="/manager/escalations" columns={[{ key: 'level', label: 'Level' }, { key: 'reason', label: 'Reason' }, { key: 'status', label: 'Status' }, { key: 'createdAt', label: 'Created', render: row => new Date(row.createdAt).toLocaleString() }]} />; }
