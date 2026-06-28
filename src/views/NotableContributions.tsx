import { useEffect, useRef } from 'react';
import { highlights } from '../data/highlights';
import { PRCard } from '../components/PRCard';
import './NotableContributions.css';

const ORG_LABELS: Record<string, string> = {
  strimzi: 'Strimzi',
  'open-telemetry': 'OpenTelemetry',
};

function orgFromRepo(repo: string) {
  return repo.split('/')[0];
}

const allPrs = highlights.flatMap((h) => h.prs);
const orgGroups: { org: string; prs: typeof allPrs }[] = [];
for (const pr of allPrs) {
  const org = orgFromRepo(pr.repo);
  let group = orgGroups.find((g) => g.org === org);
  if (!group) {
    group = { org, prs: [] };
    orgGroups.push(group);
  }
  group.prs.push(pr);
}

export function NotableContributions() {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (window.location.hash) {
      if (isInitialMount.current) {
        window.scrollTo(0, 0);
      }
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    isInitialMount.current = false;
  }, []);

  return (
    <div className="notable-contributions">
      <h1>Notable Contributions</h1>

      {orgGroups.map(({ org, prs }) => (
        <div className="contributions-group" id={org} key={org}>
          <h3 className="contributions-group__title">{ORG_LABELS[org] ?? org}</h3>
          <div className="contributions-grid">
            {prs.map((pr) => (
              <PRCard
                key={pr.url}
                repo={pr.repo}
                number={pr.number}
                url={pr.url}
                title={pr.title}
                description={pr.description}
                stats={pr.stats}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
