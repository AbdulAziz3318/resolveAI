export default function ComplaintTimeline({ updates = [] }) { return <ol>{updates.map(update => <li key={update._id}>{update.message}</li>)}</ol>; }
