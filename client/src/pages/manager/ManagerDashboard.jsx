// Purpose: Manager department command route.
import PageShell from '../PageShell.jsx';
import { complaintColumns } from '../pageConfig.js';
export default function ManagerDashboard() { return <PageShell title="Department command" description="See the complaints requiring your department's attention." endpoint="/complaints" columns={complaintColumns} />; }
