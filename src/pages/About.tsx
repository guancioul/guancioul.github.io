import { certification, githubUsername, introText } from '../data/profile';
import { SocialBadges } from '../components/SocialBadges';
import { TechStack } from '../components/TechStack';
import { Highlights } from '../components/Highlights';
import { DevStat } from '../components/DevStat';
import { SectionHeading } from '../components/SectionHeading';
import './About.css';

export function About() {
  return (
    <section id="about" className="page">
      <div className="page__heading">
        <SectionHeading number="01" title="About" />
      </div>

      <div className="page__body">
        <SocialBadges />

        <p>{introText}</p>

        <h3>🛠 Tech Stack</h3>
        <TechStack />

        <h3>🏅 Certifications</h3>
        <a href={certification.url} target="_blank" rel="noopener" className="certification-link">
          <img src={certification.image} alt={certification.name} width={100} />
        </a>

        <h3>⭐ Notable Contributions</h3>
        <Highlights />

        <h3>📊 CNCF Stats</h3>
        <DevStat username={githubUsername} />
      </div>
    </section>
  );
}
