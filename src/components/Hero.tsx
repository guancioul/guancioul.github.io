import { Link } from 'react-router-dom';
import { email, githubUrl, role } from '../data/profile';
import personalPhoto from '../assets/avatar.png';
import { useTranslation } from '../hooks/useTranslation';
import './Hero.css';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section id="hero" className="hero">
      <div className="hero__content">
        <img className="hero__avatar" src={personalPhoto} alt={t.common.name} />

        <div className="hero__intro">
          <p className="hero__eyebrow mono">{t.hero.eyebrow}</p>
          <h1 className="hero__name">{t.common.name}</h1>
          <p className="hero__role">{role}</p>
          <div className="hero__actions">
            <a className="hero__button hero__button--primary" href={githubUrl} target="_blank" rel="noopener">
              {t.hero.githubButton}
            </a>
            <Link className="hero__button" to="/blog">
              {t.hero.blogButton}
            </Link>
          </div>
        </div>
        <div className="hero__card">
          <p className="hero__card-name">{t.common.name}</p>
          <p className="hero__card-role mono">{role.toUpperCase()}</p>
          <div className="hero__card-row">
            <span className="hero__card-label mono">{t.hero.emailLabel}</span>
            <a className="hero__card-value mono" href={`mailto:${email}`}>
              {email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
