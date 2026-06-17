import { githubUsername } from '../data/profile';
import { GithubContributions } from '../components/GithubContributions';
import { SectionHeading } from '../components/SectionHeading';

export function OpenSource() {
  return (
    <section id="open-source" className="page">
      <div className="page__heading">
        <SectionHeading number="02" title="Open Source" />
      </div>

      <div className="page__body">
        <p>My open source pull request contributions across various projects.</p>
        <GithubContributions username={githubUsername} />
      </div>
    </section>
  );
}
