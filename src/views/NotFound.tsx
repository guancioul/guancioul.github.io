import { useTranslation } from '../hooks/useTranslation';
import { useLocalizedPath } from '../hooks/useLocalizedPath';

export function NotFoundView() {
  const { t } = useTranslation();
  const lp = useLocalizedPath();

  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Page not found.</p>
      <a href={lp('/')} className="not-found__link">
        ← {t.common.backTo('Home')}
      </a>
    </div>
  );
}
