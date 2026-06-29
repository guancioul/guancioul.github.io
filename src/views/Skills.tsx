import { CredlyBadge, SkillTagPill } from '../components/SkillTagPill';
import { certifications, credlyBadgesUrl, credlySkillsUrl, leetcodeUsername } from '../data/profile';
import { type SkillGroup, skillGroups } from '../data/skills';
import { SectionHeading } from '../components/SectionHeading';
import { LeetCodeStats } from '../components/LeetCodeStats';
import './Skills.css';

function SkillGroupRow({ group }: { group: SkillGroup }) {
  if (group.collapsible) {
    return (
      <details className="skill-panel__row skill-panel__row--collapsible">
        <summary className="skill-panel__row-summary">
          <span>{group.label}</span>
          <span className="skill-panel__row-summary-meta mono">{group.tags.length}</span>
        </summary>
        <div className="skill-panel__tags skill-panel__tags--collapsible">
          {group.tags.map((skillTag) => (
            <SkillTagPill key={skillTag.name} tag={skillTag} />
          ))}
        </div>
      </details>
    );
  }

  return (
    <div className="skill-panel__row">
      <span className="skill-panel__row-label">{group.label}</span>
      <div className="skill-panel__tags">
        {group.tags.map((skillTag) => (
          <SkillTagPill key={skillTag.name} tag={skillTag} />
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="page">
      <div className="page__heading">
        <SectionHeading number="03" title="Skills" />
      </div>

      <div className="page__body">
        <div className="skill-panel">
          <div className="skill-panel__header">🛠 Skills</div>
          {skillGroups.map((group) => (
            <SkillGroupRow key={group.label} group={group} />
          ))}
          <p className="skill-panel__footnote">
            <CredlyBadge inline /> Skills with this mark are verified via Credly certifications.
          </p>
          <a className="skill-panel__row skill-panel__row--link" href={credlySkillsUrl} target="_blank" rel="noopener">
            View on Credly →
          </a>
        </div>

        <div className="skill-panel">
          <div className="skill-panel__header">🏅 Certifications</div>
          {certifications.map((cert) => (
            <a
              key={cert.url}
              className="skill-panel__row skill-panel__row--cert"
              href={cert.url}
              target="_blank"
              rel="noopener"
            >
              <img src={cert.image} alt={cert.name} width={80} />
              <div>
                <div className="skill-panel__cert-name">{cert.name}</div>
                <span className="skill-panel__cert-meta mono">
                  {cert.issuer} · {cert.issued}
                </span>
              </div>
            </a>
          ))}
          <a className="skill-panel__row skill-panel__row--link" href={credlyBadgesUrl} target="_blank" rel="noopener">
            View on Credly →
          </a>
        </div>

        <div className="skill-panel">
          <div className="skill-panel__header">🧩 LeetCode</div>
          <div className="skill-panel__row">
            <LeetCodeStats username={leetcodeUsername} />
          </div>
        </div>
      </div>
    </section>
  );
}
