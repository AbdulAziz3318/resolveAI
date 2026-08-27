export default function AutomationLogCard({ log }) { return <article className="log-row"><strong>{log.action}</strong><span>{log.message}</span></article>; }
