import { useParams, Link } from 'react-router-dom';
export default function PlannedPage() { const { name } = useParams(); return <div className="w"><h2>{name}</h2><p className="m">This workspace is planned and not implemented yet. No placeholder functionality is shown.</p><Link to="/studio">Open Circuit Studio</Link></div>; }
