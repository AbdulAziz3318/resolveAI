// Purpose: Admin issue register route.
import PageShell from '../PageShell.jsx';
import { complaintColumns } from '../pageConfig.js';
export default function Complaints() { return <PageShell title="All complaints" description="Review the complete complaint-to-resolution pipeline." endpoint="/complaints" columns={complaintColumns} />; }
