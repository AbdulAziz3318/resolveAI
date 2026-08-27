export default function StatusBadge({ status }) { return <span className={`badge ${status === 'CLOSED' ? 'green' : status === 'ESCALATED' ? 'red' : 'blue'}`}>{status.replaceAll('_', ' ')}</span>; }
