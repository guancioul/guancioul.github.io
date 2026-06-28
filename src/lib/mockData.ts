// Fixture data used in place of real network calls during local development
// (`import.meta.env.DEV`), so iterating on the UI doesn't burn through the
// rate limits of the GitHub Search API, the LeetCode/CNCF stats endpoints,
// or inflate the live view counter.

export interface MockGithubItem {
  number: number;
  title: string;
  html_url: string;
  state: 'open' | 'closed';
  draft?: boolean;
  created_at: string;
  author_association: string;
  repository_url: string;
  user: { login: string };
  pull_request?: { merged_at: string | null };
}

export function mockGithubItems(type: 'pr' | 'issue'): MockGithubItem[] {
  const now = Date.now();
  const dayAgo = (days: number) => new Date(now - days * 86400_000).toISOString();

  if (type === 'pr') {
    return [
      {
        number: 4821,
        title: '[Mock] Fix race condition in connector reconciliation',
        html_url: 'https://github.com/strimzi/strimzi-kafka-operator/pull/4821',
        state: 'closed',
        created_at: dayAgo(3),
        author_association: 'CONTRIBUTOR',
        repository_url: 'https://api.github.com/repos/strimzi/strimzi-kafka-operator',
        user: { login: 'guancioul' },
        pull_request: { merged_at: dayAgo(2) },
      },
      {
        number: 4795,
        title: '[Mock] Add retry backoff to exporter pipeline',
        html_url: 'https://github.com/open-telemetry/opentelemetry-collector/pull/4795',
        state: 'open',
        draft: true,
        created_at: dayAgo(10),
        author_association: 'CONTRIBUTOR',
        repository_url: 'https://api.github.com/repos/open-telemetry/opentelemetry-collector',
        user: { login: 'guancioul' },
      },
      {
        number: 228,
        title: '[Mock] Add proposal for cross-namespace credential push in KafkaAccess',
        html_url: 'https://github.com/strimzi/proposals/pull/228',
        state: 'closed',
        created_at: dayAgo(16),
        author_association: 'CONTRIBUTOR',
        repository_url: 'https://api.github.com/repos/strimzi/proposals',
        user: { login: 'guancioul' },
        pull_request: { merged_at: null },
      },
    ];
  }

  return [
    {
      number: 311,
      title: '[Mock] Operator panics on malformed CR during upgrade',
      html_url: 'https://github.com/strimzi/strimzi-kafka-operator/issues/311',
      state: 'open',
      created_at: dayAgo(5),
      author_association: 'NONE',
      repository_url: 'https://api.github.com/repos/strimzi/strimzi-kafka-operator',
      user: { login: 'guancioul' },
    },
  ];
}

export interface MockLeetCodeData {
  solvedProblem: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  contestRating: number;
  contestAttend: number;
  contestTopPercentage: number;
}

export const mockLeetCodeData: MockLeetCodeData = {
  solvedProblem: 312,
  easySolved: 140,
  mediumSolved: 145,
  hardSolved: 27,
  contestRating: 1842,
  contestAttend: 18,
  contestTopPercentage: 12.4,
};

export const mockDevStatContributions = 482;

export const mockSiteViewCount = 1234;
