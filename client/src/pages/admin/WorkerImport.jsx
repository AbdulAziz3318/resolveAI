// Purpose: Admin bulk workforce import route.
import WorkerImportControl from '../../components/workforce/WorkerImport.jsx';
export default function WorkerImport() { return <section className="panel role-page"><div className="eyebrow">WORKFORCE ONBOARDING</div><h3>Import workers</h3><p>Upload a CSV with name, employeeId, email, department, skills and locations.</p><WorkerImportControl /></section>; }
