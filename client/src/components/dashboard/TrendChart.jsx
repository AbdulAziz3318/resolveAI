export default function TrendChart({ data = [] }) { return <div>{data.map(item => <span key={item.day}>{item.day}: {item.complaints}</span>)}</div>; }
