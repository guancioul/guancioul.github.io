import type { IconType } from 'react-icons';
import {
  SiDocker,
  SiGithubactions,
  SiGnubash,
  SiGo,
  SiGooglecloud,
  SiGrafana,
  SiHelm,
  SiJenkins,
  SiKubernetes,
  SiNodedotjs,
  SiOpentelemetry,
  SiPostgresql,
  SiPrometheus,
  SiPython,
  SiReact,
  SiRust,
  SiNextdotjs,
  SiTerraform,
  SiTypescript,
} from 'react-icons/si';
import aws from '../assets/tech-icons/aws.svg';
import azure from '../assets/tech-icons/azure.svg';
import cosmosdb from '../assets/tech-icons/cosmosdb.svg';
import dynamodb from '../assets/tech-icons/dynamodb.svg';
import java from '../assets/tech-icons/java.svg';

type AssetImport = string | { src: string };

function assetUrl(asset: AssetImport): string {
  return typeof asset === 'string' ? asset : asset.src;
}

export type TechIcon =
  | { type: 'si'; Icon: IconType; color: string; invertInDark?: boolean }
  | { type: 'img'; src: string; invertInDark?: boolean };

/** Brand hex colors from Simple Icons (https://simpleicons.org) */
const simpleIcons: Record<string, { Icon: IconType; color: string; invertInDark?: boolean }> = {
  Go: { Icon: SiGo, color: '#00ADD8' },
  Python: { Icon: SiPython, color: '#3776AB' },
  Rust: { Icon: SiRust, color: '#000000', invertInDark: true },
  TypeScript: { Icon: SiTypescript, color: '#3178C6' },
  Shell: { Icon: SiGnubash, color: '#4EAA25' },
  'Node.js': { Icon: SiNodedotjs, color: '#339933' },
  Kubernetes: { Icon: SiKubernetes, color: '#326CE5' },
  Helm: { Icon: SiHelm, color: '#0F1689' },
  Terraform: { Icon: SiTerraform, color: '#844FBA' },
  Docker: { Icon: SiDocker, color: '#2496ED' },
  GCP: { Icon: SiGooglecloud, color: '#4285F4' },
  PostgreSQL: { Icon: SiPostgresql, color: '#4169E1' },
  'GitHub Actions': { Icon: SiGithubactions, color: '#2088FF' },
  Jenkins: { Icon: SiJenkins, color: '#D24939' },
  Grafana: { Icon: SiGrafana, color: '#F46800' },
  Prometheus: { Icon: SiPrometheus, color: '#E6522C' },
  'Next.js': { Icon: SiNextdotjs, color: '#000000', invertInDark: true },
  React: { Icon: SiReact, color: '#61DAFB' },
  OTLP: { Icon: SiOpentelemetry, color: '#F5A800' },
};

const fallbackIcons: Record<string, { src: string; invertInDark?: boolean }> = {
  Java: { src: assetUrl(java) },
  AWS: { src: assetUrl(aws) },
  Azure: { src: assetUrl(azure) },
  DynamoDB: { src: assetUrl(dynamodb) },
  CosmosDB: { src: assetUrl(cosmosdb) },
};

export function getTechIcon(tag: string): TechIcon | undefined {
  const si = simpleIcons[tag];
  if (si) {
    return { type: 'si', Icon: si.Icon, color: si.color, invertInDark: si.invertInDark };
  }

  const img = fallbackIcons[tag];
  if (img) {
    return { type: 'img', src: img.src, invertInDark: img.invertInDark };
  }

  return undefined;
}
