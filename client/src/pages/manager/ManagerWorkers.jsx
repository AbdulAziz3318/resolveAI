// Purpose: Manager workforce capacity route.
import PageShell from '../PageShell.jsx';
import { workerColumns } from '../pageConfig.js';
export default function ManagerWorkers() { return <PageShell title="Department workforce" description="Monitor skills, availability and workload before intervening." endpoint="/admin/workers" columns={workerColumns} />; }
