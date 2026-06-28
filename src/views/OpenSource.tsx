import { DevStat } from '../components/DevStat';
import { githubUsername } from '../data/profile';
import { GithubContributions } from '../components/GithubContributions';
import { SectionHeading } from '../components/SectionHeading';
import './Skills.css';
import './OpenSource.css';

export function OpenSource() {
  return (
    <section id="open-source" className="page">
      <div className="page__heading">
        <SectionHeading number="04" title="Open Source" />
      </div>

      <div className="page__body">
        <p>My open source pull request contributions across various projects.</p>
        <a href="/notable-contributions" className="open-source__notable-link">
          Notable Contributions →
        </a>
        <GithubContributions username={githubUsername} />

        <div className="skill-panel open-source__cncf-panel">
          <div className="skill-panel__header">CNCF Stats</div>
          <div className="skill-panel__row open-source__cncf-row">
            <DevStat username={githubUsername} />
          </div>
        </div>
      </div>
    </section>
  );
}
