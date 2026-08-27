export default function EmptyState({ title = 'Nothing here yet', message = 'New activity will appear here.' }) { return <div className="empty-panel"><h3>{title}</h3><p>{message}</p></div>; }
