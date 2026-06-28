import { introText } from '../data/profile';
import { SocialBadges } from '../components/SocialBadges';
import { SectionHeading } from '../components/SectionHeading';

export function About() {
  return (
    <section id="about" className="page">
      <div className="page__heading">
        <SectionHeading number="01" title="About" />
      </div>

      <div className="page__body">
        <SocialBadges />

        <p>{introText}</p>
      </div>
    </section>
  );
}
