export interface SkillGroup {
  label: string;
  tags: string[];
}

export const additionalSkills: SkillGroup[] = [
  { label: 'Frontend', tags: ['Next.js', 'React'] },
  { label: 'Protocols', tags: ['gRPC', 'Protobuf', 'OTLP'] },
  { label: 'Architecture', tags: ['DDD', 'Microservices', 'Multi-cloud', 'RBAC'] },
];
