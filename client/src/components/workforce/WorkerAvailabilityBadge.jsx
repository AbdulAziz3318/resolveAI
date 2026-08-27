export default function WorkerAvailabilityBadge({ availability }) { return <span className={`availability ${availability?.toLowerCase()}`}><i />{availability}</span>; }
