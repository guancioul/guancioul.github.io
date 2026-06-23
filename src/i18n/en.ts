import type { Translations } from './types';

export const en = {
  common: {
    name: 'Kuan-Hao Lai',
    backTo: (target) => `← Back to ${target}`,
  },
  nav: {
    about: 'About',
    experience: 'Experience',
    skills: 'Skills',
    openSource: 'Open Source',
    blog: 'Blog',
    challenges: 'Challenges',
    travel: 'Travel',
    toggleMenu: 'Toggle navigation menu',
    switchToLight: 'Switch to light mode',
    switchToDark: 'Switch to dark mode',
    switchLanguage: 'Switch language',
  },
  hero: {
    eyebrow: 'PORTFOLIO',
    githubButton: 'GitHub',
    blogButton: 'Blog',
    emailLabel: 'EMAIL',
  },
  footer: {
    views: (count) => `${count} views`,
  },
  challenges: {
    empty: 'No challenges yet.',
    daysProgress: (entryCount, targetDays) => `${entryCount}/${targetDays} days`,
    entriesCount: (entryCount) => `${entryCount} entries`,
    notFound: 'Challenge not found.',
    dailyLog: 'Daily Log',
    noEntries: 'No entries yet.',
    singular: 'Challenge',
    entryNotFound: 'Entry not found.',
  },
} satisfies Translations;
