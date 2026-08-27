import StatusBadge from '../common/StatusBadge.jsx';
export default function ComplaintCard({ complaint }) { return <article className="worker-card"><strong>{complaint.title}</strong><p>{complaint.complaintId}</p><StatusBadge status={complaint.status} /></article>; }
