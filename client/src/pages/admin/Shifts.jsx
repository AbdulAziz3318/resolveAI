// Purpose: Admin shift configuration route.
import PageShell from '../PageShell.jsx';
export default function Shifts() { return <PageShell title="Shifts" description="Define working hours used by assignment eligibility." endpoint="/admin/shifts" columns={[{ key: 'name', label: 'Shift' }, { key: 'startTime', label: 'Starts' }, { key: 'endTime', label: 'Ends' }, { key: 'workingDays', label: 'Days', render: row => row.workingDays?.join(', ') }]} />; }
