import kcnaBadge from '../assets/logos/kcna-badge.png';
import { logoUrl } from '../lib/logoUrl';

export const githubUsername = 'guancioul';
export const leetcodeUsername = 'guancioul';
export const name = 'Kuan-Hao Lai';
export const role = 'Software Engineer';
export const email = 'guancioul@gmail.com';
export const githubUrl = 'https://github.com/guancioul';

export type SocialIconKey = 'github' | 'email' | 'linkedin' | 'leetcode';

export const socialLinks: { label: string; href: string; icon: SocialIconKey }[] = [
  { label: 'GitHub', href: githubUrl, icon: 'github' },
  { label: 'Email', href: `mailto:${email}`, icon: 'email' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kuan-hao-lai-1869b12ab', icon: 'linkedin' },
  { label: 'LeetCode', href: 'https://leetcode.com/u/guancioul', icon: 'leetcode' },
];

export const introText =
  'Software Engineer with 3+ years at Trend Micro across platform, cloud security, and network security domains. Strong background in Go, Python, and cloud-native infrastructure. Active open source contributor to Strimzi and OpenTelemetry.';

export const credlySkillsUrl = 'https://www.credly.com/users/kuanhao-lai/skills';
export const credlyBadgesUrl = 'https://www.credly.com/users/kuanhao-lai/badges/credly';

export interface Certification {
  name: string;
  issuer: string;
  issued: string;
  url: string;
  image: string;
}

export const certifications: Certification[] = [
  {
    name: 'KCNA: Kubernetes and Cloud Native Associate',
    issuer: 'The Linux Foundation',
    issued: '2026-07',
    url: 'https://www.credly.com/badges/32234e3c-bd0e-4846-b48c-2359a49f4995',
    image: logoUrl(kcnaBadge),
  },
  {
    name: 'CKAD: Certified Kubernetes Application Developer',
    issuer: 'The Linux Foundation',
    issued: '2026-06',
    url: 'https://www.credly.com/badges/1d9ed657-b280-416d-ac86-2e3b901ff90c',
    image: 'https://images.credly.com/images/cc8adc83-1dc6-4d57-8e20-22171247e052/blob',
  },
  {
    name: 'CKA: Certified Kubernetes Administrator',
    issuer: 'The Linux Foundation',
    issued: '2026-05',
    url: 'https://www.credly.com/badges/cce95b77-8cb7-42e9-a598-7ddbeb805e64',
    image: 'https://images.credly.com/images/8b8ed108-e77d-4396-ac59-2504583b9d54/cka_from_cncfsite__281_29.png',
  },
];
