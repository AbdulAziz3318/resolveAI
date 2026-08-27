// Purpose: Admin location coverage route.
import PageShell from '../PageShell.jsx';
export default function Locations() { return <PageShell title="Locations" description="Manage buildings and service coverage areas." endpoint="/admin/locations" columns={[{ key: 'name', label: 'Location' }, { key: 'type', label: 'Type' }, { key: 'description', label: 'Description' }]} />; }
