import { DevStat } from '../components/DevStat';
import { githubUsername } from '../data/profile';
import { GithubContributions } from '../components/GithubContributions';
import { SectionHeading } from '../components/SectionHeading';
import { useLocalizedPath } from '../hooks/useLocalizedPath';
import '../components/Panel.css';
import './OpenSource.css';

export function OpenSource() {
  const lp = useLocalizedPath();

  return (
    <section id="open-source" className="page">
      <div className="page__heading">
        <SectionHeading number="04" title="Open Source" />
      </div>

      <div className="page__body">
        <p>My open source pull request contributions across various projects.</p>
        <a href={lp('/notable-contributions')} className="open-source__notable-link">
          Notable Contributions →
        </a>
        <GithubContributions username={githubUsername} />

        <div className="panel open-source__cncf-panel">
          <div className="panel__header">CNCF Stats</div>
          <div className="panel__row open-source__cncf-row">
            <DevStat username={githubUsername} />
          </div>
        </div>
      </div>
    </section>
  );
}
