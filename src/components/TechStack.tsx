import { techStack } from '../data/profile';
import './TechStack.css';

export function TechStack() {
  return (
    <div className="tech-stack">
      {techStack.map((group) => (
        <div className="tech-group" key={group.label}>
          <span className="tech-label">{group.label}</span>
          <div className="tech-tags">
            {group.tags.map((tag) => (
              <span className="tech-tag mono" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
