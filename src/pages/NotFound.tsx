import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useTranslation } from '../hooks/useTranslation';
import './NotFound.css';

export function NotFound() {
  const { t } = useTranslation();
  useDocumentTitle('404', t.common.name);

  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="not-found__link">
        ← Back home
      </Link>
    </div>
  );
}
