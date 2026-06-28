import go from '../assets/tech-icons/go.svg';
import python from '../assets/tech-icons/python.svg';
import java from '../assets/tech-icons/java.svg';
import rust from '../assets/tech-icons/rust.svg';
import typescript from '../assets/tech-icons/typescript.svg';
import shell from '../assets/tech-icons/shell.svg';
import kubernetes from '../assets/tech-icons/kubernetes.svg';
import helm from '../assets/tech-icons/helm.svg';
import terraform from '../assets/tech-icons/terraform.svg';
import docker from '../assets/tech-icons/docker.svg';
import aws from '../assets/tech-icons/aws.svg';
import azure from '../assets/tech-icons/azure.svg';
import googlecloud from '../assets/tech-icons/googlecloud.svg';
import postgresql from '../assets/tech-icons/postgresql.svg';
import dynamodb from '../assets/tech-icons/dynamodb.svg';
import cosmosdb from '../assets/tech-icons/cosmosdb.svg';
import githubactions from '../assets/tech-icons/githubactions.svg';
import jenkins from '../assets/tech-icons/jenkins.svg';
import grafana from '../assets/tech-icons/grafana.svg';
import prometheus from '../assets/tech-icons/prometheus.svg';
import nextdotjs from '../assets/tech-icons/nextdotjs.svg';
import react from '../assets/tech-icons/react.svg';

type AssetImport = string | { src: string };

function assetUrl(asset: AssetImport): string {
  return typeof asset === 'string' ? asset : asset.src;
}

const icons: Record<string, string> = {
  Go: assetUrl(go),
  Python: assetUrl(python),
  Java: assetUrl(java),
  Rust: assetUrl(rust),
  TypeScript: assetUrl(typescript),
  Shell: assetUrl(shell),
  Kubernetes: assetUrl(kubernetes),
  Helm: assetUrl(helm),
  Terraform: assetUrl(terraform),
  Docker: assetUrl(docker),
  AWS: assetUrl(aws),
  Azure: assetUrl(azure),
  GCP: assetUrl(googlecloud),
  PostgreSQL: assetUrl(postgresql),
  DynamoDB: assetUrl(dynamodb),
  CosmosDB: assetUrl(cosmosdb),
  'GitHub Actions': assetUrl(githubactions),
  Jenkins: assetUrl(jenkins),
  Grafana: assetUrl(grafana),
  Prometheus: assetUrl(prometheus),
  'Next.js': assetUrl(nextdotjs),
  React: assetUrl(react),
};

export function techIconUrl(tag: string): string | undefined {
  return icons[tag];
}
