// Purpose: Master incident management route.
import PageShell from '../PageShell.jsx';
export default function Incidents() { return <PageShell title="Master incidents" description="Group related complaints around shared operational causes." endpoint="/incidents" columns={[{ key: 'incidentId', label: 'Incident' }, { key: 'title', label: 'Title' }, { key: 'priority', label: 'Priority' }, { key: 'status', label: 'Status' }, { key: 'linkedComplaints', label: 'Linked', render: row => row.linkedComplaints?.length || 0 }]} />; }
