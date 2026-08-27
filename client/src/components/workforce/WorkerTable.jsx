import WorkerCard from './WorkerCard.jsx';
export default function WorkerTable({ workers = [] }) { return <div className="worker-grid">{workers.map(worker => <WorkerCard key={worker._id} worker={worker} />)}</div>; }
