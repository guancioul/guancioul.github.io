import { Link } from 'react-router-dom';
import { getAllChallenges } from '../lib/challenges';
import { useTranslation } from '../hooks/useTranslation';
import './Challenges.css';

export function Challenges() {
  const { t, locale } = useTranslation();
  const challenges = getAllChallenges(locale);

  return (
    <div className="challenges">
      <h1>{t.nav.challenges}</h1>

      {challenges.length === 0 ? (
        <p className="challenges__empty">{t.challenges.empty}</p>
      ) : (
        <div className="challenges__grid">
          {challenges.map((challenge) => {
            const entryCount = challenge.entries.length;
            const progress = challenge.targetDays
              ? Math.min(100, Math.round((entryCount / challenge.targetDays) * 100))
              : null;

            return (
              <Link to={`/challenges/${challenge.slug}`} className="challenge-card" key={challenge.slug}>
                {challenge.image && (
                  <div className="challenge-card__image" style={{ backgroundImage: `url(${challenge.image})` }} />
                )}
                <div className="challenge-card__body">
                  <h2 className="challenge-card__title">{challenge.title}</h2>
                  <span className="challenge-card__dates mono">
                    {challenge.startDate}
                    {challenge.endDate ? ` – ${challenge.endDate}` : ''}
                  </span>
                  {challenge.tags.length > 0 && (
                    <div className="challenge-card__tags">
                      {challenge.tags.map((tag) => (
                        <span className="challenge-card__tag mono" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="challenge-card__summary">{challenge.summary}</p>
                  <div className="challenge-card__progress-row">
                    {progress !== null ? (
                      <>
                        <div className="challenge-card__progress-track">
                          <div className="challenge-card__progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="challenge-card__progress-label mono">
                          {t.challenges.daysProgress(entryCount, challenge.targetDays!)}
                        </span>
                      </>
                    ) : (
                      <span className="challenge-card__progress-label mono">{t.challenges.entriesCount(entryCount)}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
