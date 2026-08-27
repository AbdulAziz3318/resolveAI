import ComplaintCard from './ComplaintCard.jsx';
export default function ComplaintTable({ complaints = [] }) { return <div className="table-list">{complaints.map(complaint => <ComplaintCard key={complaint._id} complaint={complaint} />)}</div>; }
