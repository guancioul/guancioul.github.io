import { Link } from 'react-router-dom';
import { email, githubUrl, name, role } from '../data/profile';
import './Hero.css';

function initialsOf(fullName: string) {
  const parts = fullName.split(' ').filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return (first + last).toUpperCase();
}

export function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero__content">
        <div className="hero__avatar">{initialsOf(name)}</div>
        <div className="hero__intro">
          <p className="hero__eyebrow mono">PORTFOLIO</p>
          <h1 className="hero__name">{name}</h1>
          <p className="hero__role">{role}</p>
          <div className="hero__actions">
            <a className="hero__button hero__button--primary" href={githubUrl} target="_blank" rel="noopener">
              GitHub
            </a>
            <Link className="hero__button" to="/blog">
              Blog
            </Link>
          </div>
        </div>
        <div className="hero__card">
          <p className="hero__card-name">{name}</p>
          <p className="hero__card-role mono">{role.toUpperCase()}</p>
          <div className="hero__card-row">
            <span className="hero__card-label mono">EMAIL</span>
            <a className="hero__card-value mono" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
