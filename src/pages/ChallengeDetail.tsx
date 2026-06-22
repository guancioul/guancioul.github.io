import { Link, useParams } from 'react-router-dom';
import { getChallengeBySlug } from '../lib/challenges';
import './ChallengeDetail.css';

export function ChallengeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const challenge = slug ? getChallengeBySlug(slug) : undefined;

  if (!challenge) {
    return (
      <div className="challenge-detail">
        <Link to="/challenges" className="challenge-detail__back">
          ← Back to Challenges
        </Link>
        <p>Challenge not found.</p>
      </div>
    );
  }

  const entryCount = challenge.entries.length;
  const progress = challenge.targetDays
    ? Math.min(100, Math.round((entryCount / challenge.targetDays) * 100))
    : null;

  return (
    <div className="challenge-detail">
      <Link to="/challenges" className="challenge-detail__back">
        ← Back to Challenges
      </Link>

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

      <div className="challenge-detail__progress-row">
        {progress !== null ? (
          <>
            <div className="challenge-detail__progress-track">
              <div className="challenge-detail__progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="challenge-detail__progress-label mono">
              {entryCount}/{challenge.targetDays} days
            </span>
          </>
        ) : (
          <span className="challenge-detail__progress-label mono">{entryCount} entries</span>
        )}
      </div>

      <h2 className="challenge-detail__entries-heading">Daily Log</h2>
      {entryCount === 0 ? (
        <p className="challenge-detail__empty">No entries yet.</p>
      ) : (
        <div className="challenge-detail__entries">
          {challenge.entries.map((entry) => (
            <Link
              to={`/challenges/${challenge.slug}/${entry.date}`}
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
