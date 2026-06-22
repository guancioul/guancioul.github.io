import { additionalSkills } from '../data/skills';
import { certification, leetcodeUsername, techStack } from '../data/profile';
import { techIconUrl } from '../data/techIcons';
import { SectionHeading } from '../components/SectionHeading';
import { LeetCodeStats } from '../components/LeetCodeStats';
import './Skills.css';

const techGroups = [...techStack, ...additionalSkills];

// These icons are solid black SVGs with no theme-aware coloring, so they need
// to be inverted in dark mode to stay visible against the dark background.
const BLACK_FILL_ICONS = new Set(['Rust', 'Next.js']);

export function Skills() {
  return (
    <section id="skills" className="page">
      <div className="page__heading">
        <SectionHeading number="03" title="Skills" />
      </div>

      <div className="page__body">
        <div className="skill-panel">
          <div className="skill-panel__header">🛠 Tech Stack</div>
          {techGroups.map((group) => (
            <div className="skill-panel__row" key={group.label}>
              <span className="skill-panel__row-label">{group.label}</span>
              <div className="skill-panel__tags">
                {group.tags.map((tag) => {
                  const iconUrl = techIconUrl(tag);
                  return (
                    <span className="skill-tag mono" key={tag}>
                      {iconUrl && (
                        <img
                          src={iconUrl}
                          alt=""
                          width={14}
                          height={14}
                          className={BLACK_FILL_ICONS.has(tag) ? 'skill-tag__icon--invert' : undefined}
                        />
                      )}
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="skill-panel">
          <div className="skill-panel__header">🏅 Certifications</div>
          <a
            className="skill-panel__row skill-panel__row--cert"
            href={certification.url}
            target="_blank"
            rel="noopener"
          >
            <img src={certification.image} alt={certification.name} width={80} />
            <div>
              <div className="skill-panel__cert-name">{certification.name}</div>
              <span className="skill-panel__cert-meta mono">
                {certification.issuer} · {certification.year}
              </span>
            </div>
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
