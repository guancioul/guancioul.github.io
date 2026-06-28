import { getChallengeBySlug } from '../lib/challenges';
import { useTranslation } from '../hooks/useTranslation';
import './ChallengeDetail.css';

export function ChallengeDetail({ slug }: { slug: string }) {
  const { t, locale } = useTranslation();
  const challenge = getChallengeBySlug(slug, locale);

  if (!challenge) {
    return (
      <div className="challenge-detail">
        <a href="/challenges" className="challenge-detail__back">
          {t.common.backTo(t.nav.challenges)}
        </a>
        <p>{t.challenges.notFound}</p>
      </div>
    );
  }

  const entryCount = challenge.entries.length;
  const progress = challenge.targetDays
    ? Math.min(100, Math.round((entryCount / challenge.targetDays) * 100))
    : null;

  return (
    <div className="challenge-detail">
      <a href="/challenges" className="challenge-detail__back">
        {t.common.backTo(t.nav.challenges)}
      </a>

      {challenge.image && (
        <div className="challenge-detail__image" style={{ backgroundImage: `url(${challenge.image})` }} />
      )}

      <h1 className="challenge-detail__title">{challenge.title}</h1>
      <div className="challenge-detail__meta">
        <span className="challenge-detail__dates mono">
          {challenge.startDate}
          {challenge.endDate ? ` – ${challenge.endDate}` : ''}
        </span>
        {challenge.tags.length > 0 && (
          <div className="challenge-detail__tags">
            {challenge.tags.map((tag) => (
              <span className="challenge-detail__tag mono" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {challenge.summary && <p className="challenge-detail__summary">{challenge.summary}</p>}
      {challenge.rule && <p className="challenge-detail__rule">⚠️ {challenge.rule}</p>}

      <div className="challenge-detail__progress-row">
        {progress !== null ? (
          <>
            <div className="challenge-detail__progress-track">
              <div className="challenge-detail__progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="challenge-detail__progress-label mono">
              {t.challenges.daysProgress(entryCount, challenge.targetDays!)}
            </span>
          </>
        ) : (
          <span className="challenge-detail__progress-label mono">{t.challenges.entriesCount(entryCount)}</span>
        )}
      </div>

      <h2 className="challenge-detail__entries-heading">{t.challenges.dailyLog}</h2>
      {entryCount === 0 ? (
        <p className="challenge-detail__empty">{t.challenges.noEntries}</p>
      ) : (
        <div className="challenge-detail__entries">
          {challenge.entries.map((entry) => (
            <a
              href={`/challenges/${challenge.slug}/${entry.date}`}
              className="challenge-entry"
              key={entry.date}
            >
              <div className="challenge-entry__text">
                <div className="challenge-entry__heading">
                  <span className="challenge-entry__title">{entry.title}</span>
                  <span className="challenge-entry__date mono">{entry.date}</span>
                </div>
                {entry.preview && <p className="challenge-entry__preview">{entry.preview}</p>}
              </div>
              <span className="challenge-entry__arrow">→</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
