import { useEffect, useState } from 'react';
import { name, socialLinks, type SocialIconKey } from '../data/profile';
import { trackSiteView } from '../lib/viewCounter';
import { CodeIcon, GithubIcon, LinkedinIcon, MailIcon } from './SocialIcons';
import './Footer.css';

const icons: Record<SocialIconKey, typeof GithubIcon> = {
  github: GithubIcon,
  email: MailIcon,
  linkedin: LinkedinIcon,
  leetcode: CodeIcon,
};

export function Footer() {
  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    trackSiteView()
      .then(setViewCount)
      .catch(() => {});
  }, []);

  return (
    <footer className="site-footer">
      <span className="site-footer__text mono">
        © {new Date().getFullYear()} {name}
        {viewCount !== null && <span className="site-footer__views"> · {viewCount.toLocaleString()} views</span>}
      </span>
      <div className="site-footer__links">
        {socialLinks.map((link) => {
          const Icon = icons[link.icon];
          return (
            <a
              className="site-footer__link"
              href={link.href}
              key={link.label}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener"
              aria-label={link.label}
            >
              <Icon className="site-footer__icon" />
            </a>
          );
        })}
      </div>
    </footer>
  );
}
