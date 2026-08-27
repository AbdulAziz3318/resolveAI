// Purpose: Admin worker management route.
import PageShell from '../PageShell.jsx';
import { workerColumns } from '../pageConfig.js';
export default function Workers() { return <PageShell title="Workers" description="Manage institutional staff, availability, skills and capacity." endpoint="/admin/workers" columns={workerColumns} action={() => window.dispatchEvent(new CustomEvent('resolveai:add-worker'))} actionLabel="Add worker" />; }
