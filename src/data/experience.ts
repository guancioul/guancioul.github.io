import cncfLogo from '../assets/logos/cncf.png';
import trendMicroLogo from '../assets/logos/trend-micro.png';
import cacLogo from '../assets/logos/cac.png';

export interface ExperienceTeam {
  name: string;
  period: string;
  description: string;
  linkTo?: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  type: string;
  logo: string;
  description?: string;
  teams?: ExperienceTeam[];
}

export const experience: ExperienceEntry[] = [
  {
    company: 'CNCF (Cloud Native Computing Foundation)',
    role: 'Open Source Contributor',
    period: 'Mar 2026 – Present',
    location: 'Remote',
    type: 'Volunteer',
    logo: cncfLogo,
    teams: [
      {
        name: 'Strimzi',
        period: 'Mar 2026 – Present',
        description: 'Kafka-on-Kubernetes operator — feature gates, cert rotation, reconciliation fixes.',
        linkTo: '/notable-contributions#strimzi',
      },
      {
        name: 'OpenTelemetry',
        period: 'May 2026 – Present',
        description: 'CI tooling and query-engine contributions across Ecosystem Explorer and otel-arrow.',
        linkTo: '/notable-contributions#open-telemetry',
      },
    ],
  },
  {
    company: 'Trend Micro',
    role: 'Software Engineer',
    period: 'Sep 2022 – Jan 2026',
    location: 'Taipei, Taiwan',
    type: 'Full-time',
    logo: trendMicroLogo,
    teams: [
      {
        name: 'POSEIDON',
        period: 'home team',
        description: 'Platform engineering — CI/CD migration and service templating.',
      },
      {
        name: 'V1CS',
        period: 'Sep 2023 – Oct 2024, secondment',
        description: 'Cloud security — Kubernetes admission control and multi-cloud expansion.',
      },
      {
        name: 'DVAS',
        period: 'Feb 2025 – Jan 2026, secondment',
        description: 'Network security — performance testing infrastructure and device detection.',
      },
    ],
  },
  {
    company: 'College Admission Committee (CAC)',
    role: 'Scrum Master',
    period: '2020 – 2022',
    location: 'Chiayi, Taiwan',
    type: 'Part-time',
    logo: cacLogo,
  },
];
