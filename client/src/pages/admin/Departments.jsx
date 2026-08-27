// Purpose: Admin department configuration route.
import PageShell from '../PageShell.jsx';
export default function Departments() { return <PageShell title="Departments" description="Control category ownership and department SLA policy." endpoint="/admin/departments" columns={[{ key: 'name', label: 'Department' }, { key: 'supportedCategories', label: 'Categories', render: row => row.supportedCategories?.join(', ') }, { key: 'isActive', label: 'Status', render: row => row.isActive ? 'Active' : 'Inactive' }]} />; }
