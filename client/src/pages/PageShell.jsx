// Purpose: Shared live-data page surface used by role-specific operational pages.
import { useEffect, useState } from 'react';
import api from '../services/api.js';

export default function PageShell({ title, description, endpoint, columns = [], action, actionLabel = 'Create' }) {
  const [rows, setRows] = useState([]);
  const [state, setState] = useState('loading');
  const [error, setError] = useState('');
  async function load() { setState('loading'); try { const response = await api.get(endpoint); const value = response.data.data; setRows(Array.isArray(value) ? value : value ? [value] : []); setState('ready'); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load this workspace'); setState('error'); } }
  useEffect(() => { load(); }, [endpoint]);
  return <section className="panel role-page"><div className="panel-head"><div><div className="eyebrow">LIVE WORKSPACE</div><h3>{title}</h3><p>{description}</p></div>{action && <button className="primary-button compact" onClick={action}>{actionLabel}</button>}</div>{state === 'loading' && <div className="table-empty">Loading workspace...</div>}{state === 'error' && <div className="table-empty form-error">{error}<button className="outline-button" onClick={load}>Retry</button></div>}{state === 'ready' && !rows.length && <div className="table-empty">No records found yet.</div>}{state === 'ready' && rows.length > 0 && <div className="data-table"><div className="data-header">{columns.map(column => <span key={column.key}>{column.label}</span>)}</div>{rows.map((row, index) => <div className="data-row" key={row._id || row.id || index}>{columns.map(column => <span key={column.key}>{column.render ? column.render(row) : String(row[column.key] ?? '—')}</span>)}</div>)}</div>}</section>;
}
