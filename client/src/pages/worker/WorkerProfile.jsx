// Purpose: Worker profile and availability route.
import PageShell from '../PageShell.jsx';
export default function WorkerProfile() { return <PageShell title="Worker profile" description="Your current account and operational availability." endpoint="/worker/dashboard" columns={[{ key: 'worker', label: 'Profile', render: row => row.worker?.name || 'Current worker' }, { key: 'availability', label: 'Availability', render: row => row.worker?.availability || '—' }, { key: 'averageRating', label: 'Rating', render: row => row.worker?.averageRating || 'New' }]} />; }
