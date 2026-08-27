// Purpose: Admin organization policy route.
import PageShell from '../PageShell.jsx';
export default function Settings() { return <PageShell title="Organization settings" description="Review runtime policies and service configuration." endpoint="/health" columns={[{ key: 'service', label: 'Service' }, { key: 'status', label: 'Status' }, { key: 'mode', label: 'Persistence' }]} />; }
