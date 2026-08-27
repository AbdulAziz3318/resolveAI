// Purpose: Admin escalation oversight route.
import PageShell from '../PageShell.jsx';
export default function Escalations() { return <PageShell title="Escalations" description="Track SLA breaches and unresolved interventions." endpoint="/admin/escalations" columns={[{ key: 'level', label: 'Level' }, { key: 'reason', label: 'Reason' }, { key: 'status', label: 'Status' }, { key: 'createdAt', label: 'Created', render: row => new Date(row.createdAt).toLocaleString() }]} />; }
