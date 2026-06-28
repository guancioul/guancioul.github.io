import personalPhoto from '../assets/avatar.png';
import { email, githubUrl, role } from '../data/profile';
import { useTranslation } from '../hooks/useTranslation';
import { useLocalizedPath } from '../hooks/useLocalizedPath';
import './Hero.css';

export function Hero() {
  const { t } = useTranslation();
  const lp = useLocalizedPath();

  return (
    <section id="hero" className="hero">
      <div className="hero__content">
        <img className="hero__avatar" src={personalPhoto.src} alt={t.common.name} />

        <div className="hero__intro">
          <p className="hero__eyebrow mono">{t.hero.eyebrow}</p>
          <h1 className="hero__name">{t.common.name}</h1>
          <p className="hero__role">{role}</p>
          <div className="hero__actions">
            <a className="hero__button hero__button--primary" href={githubUrl} target="_blank" rel="noopener">
              {t.hero.githubButton}
            </a>
            <a className="hero__button" href={lp('/blog')}>
              {t.hero.blogButton}
            </a>
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
