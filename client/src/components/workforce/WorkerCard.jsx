import WorkerAvailabilityBadge from './WorkerAvailabilityBadge.jsx';
export default function WorkerCard({ worker }) { return <article className="worker-card"><h4>{worker.name}</h4><WorkerAvailabilityBadge availability={worker.availability} /><p>{worker.skills?.join(', ')}</p></article>; }
