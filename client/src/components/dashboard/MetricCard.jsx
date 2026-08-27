export default function MetricCard({ label, value, onClick }) { return <button className="metric" onClick={onClick}><span>{label}</span><strong>{value}</strong></button>; }
