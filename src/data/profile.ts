export const githubUsername = 'guancioul';
export const name = 'Kuan-Hao Lai';
export const role = 'Software Engineer';
export const email = 'guancioul@gmail.com';
export const githubUrl = 'https://github.com/guancioul';

export type SocialIconKey = 'github' | 'email' | 'linkedin' | 'leetcode';

export const socialLinks: { label: string; href: string; icon: SocialIconKey }[] = [
  { label: 'Website', href: 'https://guancioul.github.io', icon: 'github' },
  { label: 'Email', href: 'mailto:guancioul@gmail.com', icon: 'email' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kuan-hao-lai-1869b12ab', icon: 'linkedin' },
  { label: 'LeetCode', href: 'https://leetcode.com/u/guancioul', icon: 'leetcode' },
];

export const introText =
  'Software Engineer with 3+ years at Trend Micro across platform, cloud security, and network security domains. Strong background in Go, Python, and cloud-native infrastructure. Active open source contributor to Strimzi and OpenTelemetry.';

export interface TechGroup {
  label: string;
  tags: string[];
}

export const techStack: TechGroup[] = [
  { label: 'Languages', tags: ['Go', 'Python', 'Java', 'Rust', 'TypeScript', 'Shell'] },
  { label: 'Infrastructure', tags: ['Kubernetes', 'Helm', 'Terraform', 'Docker'] },
  { label: 'Cloud', tags: ['AWS', 'Azure', 'GCP'] },
  { label: 'Databases', tags: ['PostgreSQL', 'AuroraDB', 'DynamoDB', 'CosmosDB'] },
  { label: 'CI/CD', tags: ['GitHub Actions', 'Jenkins', 'Grafana', 'Prometheus'] },
];

export const certification = {
  name: 'Certified Kubernetes Administrator (CKA)',
  url: 'https://www.credly.com/badges/cce95b77-8cb7-42e9-a598-7ddbeb805e64',
  image: 'https://images.credly.com/size/340x340/images/8b8ed108-e77d-4396-ac59-2504583b9d54/cka_from_cncfsite__281_29.png',
};
