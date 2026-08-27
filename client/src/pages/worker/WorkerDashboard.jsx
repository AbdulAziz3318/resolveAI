// Purpose: Worker queue route.
import PageShell from '../PageShell.jsx';
import { complaintColumns } from '../pageConfig.js';
export default function WorkerDashboard() { return <PageShell title="My work queue" description="Accept, start and resolve assignments within their SLA." endpoint="/complaints" columns={complaintColumns} />; }
