export default function CategoryChart({ data = [] }) { return <div aria-label="Complaints by category">{data.map(item => <p key={item.category}>{item.category}: {item.count}</p>)}</div>; }
