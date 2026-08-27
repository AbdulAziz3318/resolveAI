// Purpose: Explainable automation audit route.
import PageShell from '../PageShell.jsx';
import { logColumns } from '../pageConfig.js';
export default function Automation() { return <PageShell title="Automation log" description="Review every automated decision and its reason." endpoint="/admin/automation" columns={logColumns} />; }
