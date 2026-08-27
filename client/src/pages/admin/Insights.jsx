// Purpose: Recurring issue intelligence route.
import PageShell from '../PageShell.jsx';
export default function Insights() { return <PageShell title="Recurring issue insights" description="Identify patterns before they become larger incidents." endpoint="/admin/insights" columns={[{ key: 'title', label: 'Pattern' }, { key: 'location', label: 'Location' }, { key: 'category', label: 'Category' }, { key: 'complaintCount', label: 'Complaints' }, { key: 'recommendation', label: 'Recommendation' }]} />; }
