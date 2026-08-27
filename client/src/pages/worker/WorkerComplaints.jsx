// Purpose: Worker assignment register route.
import PageShell from '../PageShell.jsx';
import { complaintColumns } from '../pageConfig.js';
export default function WorkerComplaints() { return <PageShell title="Assignments" description="Review assigned complaints and their reporters." endpoint="/complaints" columns={complaintColumns} />; }
