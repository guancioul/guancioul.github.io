import type { PRStats } from '../data/highlights';
import { githubUsername } from '../data/profile';
import './PRCard.css';

interface PRCardProps {
  repo: string;
  number: number;
  url: string;
  title: string;
  description: string;
  stats: PRStats;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function PRCard({ repo, number, url, title, description, stats }: PRCardProps) {
  const total = stats.additions + stats.deletions;
  const addPct = total ? Math.round((stats.additions / total) * 100) : 0;

  return (
    <a className="pr-card" href={url} target="_blank" rel="noopener">
      <div className="pr-card__top">
        <span className="pr-card__link-label mono">🔗 Link</span>
        <img className="pr-card__org-avatar" src={stats.orgAvatar} alt="" width={28} height={28} />
      </div>

      <div className="pr-card__repo mono">{repo}</div>
      <div className="pr-card__title">
        <span className="pr-card__number mono">#{number}</span> {title}
      </div>

      <div className="pr-card__stats mono">
        <span>💬 {stats.comments} comments</span>
        <span>👀 {stats.reviews} reviews</span>
        <span>📄 {stats.files} files</span>
      </div>
      <div className="pr-card__diff mono">
        <span className="pr-card__additions">+{stats.additions}</span>{' '}
        <span className="pr-card__deletions">-{stats.deletions}</span>
      </div>
      <div className="pr-card__diffbar">
        <span className="pr-card__diffbar-add" style={{ width: `${addPct}%` }} />
        <span className="pr-card__diffbar-del" style={{ width: `${100 - addPct}%` }} />
      </div>
      <div className="pr-card__author">
        <img src={stats.authorAvatar} alt="" width={16} height={16} />
        <span className="mono">
          {githubUsername} · {formatDate(stats.mergedAt)} · {stats.commits} commits
        </span>
      </div>

      <div className="pr-card__footer">
        <div className="pr-card__footer-title">{title}</div>
        <div className="pr-card__footer-source mono">GitHub</div>
        <p className="pr-card__footer-desc">{description}</p>
      </div>
    </a>
  );
}
