import { highlights } from '../data/highlights';
import './Highlights.css';

export function Highlights() {
  return (
    <div className="highlights">
      {highlights.map((h) => (
        <div className="highlight-item" key={h.issueUrl}>
          <div className="highlight-repo mono">{h.repo}</div>
          <a className="highlight-title" href={h.issueUrl} target="_blank" rel="noopener">
            {h.title}
          </a>
          <div className="highlight-desc">{h.description}</div>
          <div className="highlight-prs">
            {h.prs.map((pr) => (
              <a className="highlight-pr-badge mono" href={pr.url} target="_blank" rel="noopener" key={pr.url}>
                {pr.repo}#{pr.number}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
