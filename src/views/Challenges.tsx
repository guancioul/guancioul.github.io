import { getAllChallenges, isChallengeComplete, type Challenge } from '../lib/challenges';
import { useTranslation } from '../hooks/useTranslation';
import { useLocalizedPath } from '../hooks/useLocalizedPath';
import type { Translations } from '../i18n/types';
import './Challenges.css';

function ChallengeCard({
  challenge,
  t,
  lp,
}: {
  challenge: Challenge;
  t: Translations;
  lp: (path: string) => string;
}) {
  const entryCount = challenge.entries.length;
  const progress = challenge.targetDays
    ? Math.min(100, Math.round((entryCount / challenge.targetDays) * 100))
    : null;

  return (
    <a href={lp(`/challenges/${challenge.slug}`)} className="challenge-card">
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
    </a>
  );
}

function ChallengeSection({
  title,
  challenges,
  t,
  lp,
}: {
  title: string;
  challenges: Challenge[];
  t: Translations;
  lp: (path: string) => string;
}) {
  if (challenges.length === 0) return null;

  return (
    <section className="challenges__section">
      {title ? <h2 className="challenges__section-title">{title}</h2> : null}
      <div className="challenges__grid">
        {challenges.map((challenge) => (
          <ChallengeCard challenge={challenge} t={t} lp={lp} key={challenge.slug} />
        ))}
      </div>
    </section>
  );
}

export function Challenges() {
  const { t, locale } = useTranslation();
  const lp = useLocalizedPath();
  const challenges = getAllChallenges(locale);
  const active = challenges.filter((c) => !isChallengeComplete(c));
  const completed = challenges.filter((c) => isChallengeComplete(c));

  return (
    <div className="challenges">
      <h1>{t.nav.challenges}</h1>

      {challenges.length === 0 ? (
        <p className="challenges__empty">{t.challenges.empty}</p>
      ) : (
        <>
          <ChallengeSection
            title={completed.length > 0 ? t.challenges.inProgress : ''}
            challenges={active}
            t={t}
            lp={lp}
          />
          <ChallengeSection title={t.challenges.completed} challenges={completed} t={t} lp={lp} />
        </>
      )}
    </div>
  );
}
