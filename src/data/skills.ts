export interface SkillTag {
  name: string;
  credlyVerified?: boolean;
  credlySlug?: string;
}

export interface SkillGroup {
  label: string;
  tags: SkillTag[];
  collapsible?: boolean;
}

export const CREDLY_VERIFIED_GROUP_LABEL = 'Credly Verified Skills';

/** Credly skills wallet (18 items) — names and slugs from credly.com/users/kuanhao-lai/skills */
const CREDLY_WALLET_SKILLS: Record<string, string> = {
  'Application Programming Interface (API)': 'application-programming-interface-api',
  'Business Service Management': 'business-service-management',
  'Cloud Applications': 'cloud-applications',
  'Cloud Computing': 'cloud-computing',
  'Configuration Management': 'configuration-management',
  'Container Shipping': 'container-shipping',
  Docker: 'docker',
  'Event Logging': 'event-logging',
  Helm: 'helm',
  Java: 'java',
  Kubernetes: 'kubernetes',
  'Node.js': 'node-js',
  Python: 'python',
  Scheduling: 'scheduling',
  'Security Policies': 'security-policies',
  'Site Reliability Engineering': 'site-reliability-engineering',
  'Software Development': 'software-development',
  'System Administration': 'system-administration',
};

function skillTag(name: string): SkillTag {
  const slug = CREDLY_WALLET_SKILLS[name];
  return slug ? { name, credlyVerified: true, credlySlug: slug } : { name };
}

function group(label: string, tags: string[], collapsible = false): SkillGroup {
  return { label, tags: tags.map(skillTag), collapsible };
}

export const skillGroups: SkillGroup[] = [
  group('Languages', ['Go', 'Python', 'Java', 'Rust', 'TypeScript', 'Shell', 'Node.js']),
  group('Infrastructure', ['Kubernetes', 'Helm', 'Terraform', 'Docker']),
  group('Cloud', ['AWS', 'Azure', 'GCP']),
  group('Databases', ['PostgreSQL', 'AuroraDB', 'DynamoDB', 'CosmosDB']),
  group('CI/CD', ['GitHub Actions', 'Jenkins', 'Grafana', 'Prometheus']),
  group('Frontend', ['Next.js', 'React']),
  group('Protocols', ['gRPC', 'Protobuf', 'OTLP', 'Application Programming Interface (API)']),
  group('Architecture', ['DDD', 'Microservices', 'Multi-cloud', 'RBAC']),
  group(
    CREDLY_VERIFIED_GROUP_LABEL,
    [
      'Business Service Management',
      'Cloud Applications',
      'Cloud Computing',
      'Configuration Management',
      'Container Shipping',
      'Event Logging',
      'Scheduling',
      'Security Policies',
      'Site Reliability Engineering',
      'Software Development',
      'System Administration',
    ],
    true,
  ),
];
