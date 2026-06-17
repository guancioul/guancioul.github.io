import { socialLinks, type SocialIconKey } from '../data/profile';
import { CodeIcon, GithubIcon, LinkedinIcon, MailIcon } from './SocialIcons';
import './SocialBadges.css';

const icons: Record<SocialIconKey, typeof GithubIcon> = {
  github: GithubIcon,
  email: MailIcon,
  linkedin: LinkedinIcon,
  leetcode: CodeIcon,
};

export function SocialBadges() {
  return (
    <div className="social-badges">
      {socialLinks.map((link) => {
        const Icon = icons[link.icon];
        return (
          <a
            className={`social-badge social-badge--${link.icon}`}
            href={link.href}
            key={link.label}
            target={link.href.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener"
          >
            <Icon className="social-badge__icon" />
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
