// Purpose: Admin manager directory route.
import PageShell from '../PageShell.jsx';
export default function Managers() { return <PageShell title="Managers" description="Department owners who receive escalations and can override automation." endpoint="/admin/workers" columns={[{ key: 'name', label: 'Directory' }, { key: 'email', label: 'Contact' }]} />; }
