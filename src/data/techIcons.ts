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

const icons: Record<string, string> = {
  Go: go,
  Python: python,
  Java: java,
  Rust: rust,
  TypeScript: typescript,
  Shell: shell,
  Kubernetes: kubernetes,
  Helm: helm,
  Terraform: terraform,
  Docker: docker,
  AWS: aws,
  Azure: azure,
  GCP: googlecloud,
  PostgreSQL: postgresql,
  DynamoDB: dynamodb,
  CosmosDB: cosmosdb,
  'GitHub Actions': githubactions,
  Jenkins: jenkins,
  Grafana: grafana,
  Prometheus: prometheus,
  'Next.js': nextdotjs,
  React: react,
};

export function techIconUrl(tag: string): string | undefined {
  return icons[tag];
}
