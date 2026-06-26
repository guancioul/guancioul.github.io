import type { Translations } from './types';

export const zhTW = {
  common: {
    name: '賴冠豪',
    backTo: (target) => `← 回到${target}`,
  },
  nav: {
    about: '關於',
    experience: '經歷',
    skills: '技能',
    openSource: '開源貢獻',
    blog: '部落格',
    challenges: '挑戰',
    travel: '旅遊',
    toggleMenu: '切換導覽選單',
    switchToLight: '切換成淺色模式',
    switchToDark: '切換成深色模式',
    switchLanguage: '切換語言',
  },
  hero: {
    eyebrow: '作品集',
    githubButton: 'GitHub',
    blogButton: '部落格',
    emailLabel: '電子郵件',
  },
  footer: {
    views: (count) => `${count} 次瀏覽`,
  },
  blog: {
    heading: '部落格',
    empty: '目前還沒有文章。',
    notFound: '找不到這篇文章。',
    prev: '上一頁',
    next: '下一頁',
    pageOf: (page, totalPages) => `第 ${page} 頁，共 ${totalPages} 頁`,
  },
  challenges: {
    empty: '目前還沒有挑戰。',
    daysProgress: (entryCount, targetDays) => `${entryCount}/${targetDays} 天`,
    entriesCount: (entryCount) => `${entryCount} 篇紀錄`,
    notFound: '找不到這個挑戰。',
    dailyLog: '每日紀錄',
    noEntries: '目前還沒有紀錄。',
    singular: '挑戰',
    entryNotFound: '找不到這篇紀錄。',
  },
} satisfies Translations;
