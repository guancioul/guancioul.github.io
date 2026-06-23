export interface Translations {
  common: {
    name: string;
    backTo: (target: string) => string;
  };
  nav: {
    about: string;
    experience: string;
    skills: string;
    openSource: string;
    blog: string;
    challenges: string;
    travel: string;
    toggleMenu: string;
    switchToLight: string;
    switchToDark: string;
    switchLanguage: string;
  };
  hero: {
    eyebrow: string;
    githubButton: string;
    blogButton: string;
    emailLabel: string;
  };
  footer: {
    views: (count: string) => string;
  };
  challenges: {
    empty: string;
    daysProgress: (entryCount: number, targetDays: number) => string;
    entriesCount: (entryCount: number) => string;
    notFound: string;
    dailyLog: string;
    noEntries: string;
    singular: string;
    entryNotFound: string;
  };
}
