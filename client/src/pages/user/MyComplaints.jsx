// Purpose: User complaint register route.
import PageShell from '../PageShell.jsx';
import { complaintColumns } from '../pageConfig.js';
export default function MyComplaints() { return <PageShell title="My complaints" description="Review status, priority, reporter and assigned worker details." endpoint="/complaints/my" columns={complaintColumns} />; }
