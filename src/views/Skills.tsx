import { CredlyBadge, SkillTagPill } from '../components/SkillTagPill';
import { certifications, credlyBadgesUrl, credlySkillsUrl, leetcodeUsername } from '../data/profile';
import { type SkillGroup, skillGroups } from '../data/skills';
import { SectionHeading } from '../components/SectionHeading';
import { LeetCodeStats } from '../components/LeetCodeStats';
import '../components/Panel.css';
import './Skills.css';

function SkillGroupRow({ group }: { group: SkillGroup }) {
  if (group.collapsible) {
    return (
      <details className="panel__row panel__row--collapsible">
        <summary className="panel__row-summary">
          <span>{group.label}</span>
          <span className="panel__row-summary-meta mono">{group.tags.length}</span>
        </summary>
        <div className="panel__tags panel__tags--collapsible">
          {group.tags.map((skillTag) => (
            <SkillTagPill key={skillTag.name} tag={skillTag} />
          ))}
        </div>
      </details>
    );
  }

  return (
    <div className="panel__row">
      <span className="panel__row-label">{group.label}</span>
      <div className="panel__tags">
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
        <div className="panel">
          <div className="panel__header">🛠 Skills</div>
          {skillGroups.map((group) => (
            <SkillGroupRow key={group.label} group={group} />
          ))}
          <p className="panel__footnote">
            <CredlyBadge inline /> Skills with this mark are verified via Credly certifications.
          </p>
          <a className="panel__row panel__row--link" href={credlySkillsUrl} target="_blank" rel="noopener">
            View on Credly →
          </a>
        </div>

        <div className="panel">
          <div className="panel__header">🏅 Certifications</div>
          {certifications.map((cert) => (
            <a
              key={cert.url}
              className="panel__row panel__row--cert"
              href={cert.url}
              target="_blank"
              rel="noopener"
            >
              <img src={cert.image} alt={cert.name} width={80} />
              <div>
                <div className="panel__cert-name">{cert.name}</div>
                <span className="panel__cert-meta mono">
                  {cert.issuer} · {cert.issued}
                </span>
              </div>
            </a>
          ))}
          <a className="panel__row panel__row--link" href={credlyBadgesUrl} target="_blank" rel="noopener">
            View on Credly →
          </a>
        </div>

        <div className="panel">
          <div className="panel__header">🧩 LeetCode</div>
          <div className="panel__row">
            <LeetCodeStats username={leetcodeUsername} />
          </div>
        </div>
      </div>
    </section>
  );
}
