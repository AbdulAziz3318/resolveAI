// Purpose: User complaint overview route.
import PageShell from '../PageShell.jsx';
import { complaintColumns } from '../pageConfig.js';
export default function UserDashboard() { return <PageShell title="My complaint dashboard" description="Track every issue you have raised and its current owner." endpoint="/complaints/my" columns={complaintColumns} />; }
