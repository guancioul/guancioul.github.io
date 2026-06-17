export interface PRStats {
  comments: number;
  reviews: number;
  files: number;
  additions: number;
  deletions: number;
  commits: number;
  mergedAt: string;
  authorAvatar: string;
  orgAvatar: string;
}

export interface HighlightPR {
  repo: string;
  url: string;
  number: number;
  title: string;
  description: string;
  stats: PRStats;
}

export interface Highlight {
  repo: string;
  issueUrl: string;
  prs: HighlightPR[];
}

const AUTHOR_AVATAR = 'https://avatars.githubusercontent.com/u/42037371?v=4';
const STRIMZI_AVATAR = 'https://avatars.githubusercontent.com/u/34767428?v=4';
const OTEL_AVATAR = 'https://avatars.githubusercontent.com/u/49998002?v=4';

export const highlights: Highlight[] = [
  {
    repo: 'strimzi/strimzi-kafka-operator',
    issueUrl: 'https://github.com/strimzi/strimzi-kafka-operator/issues/12212',
    prs: [
      {
        repo: 'strimzi/proposals',
        url: 'https://github.com/strimzi/proposals/pull/215',
        number: 215,
        title: 'Add proposal for allow background deletion propagation with Strimzi is rolling pods',
        description:
          'This proposal suggests a solution for strimzi-kafka-operator#12212. Introduces a new feature gate to enable background deletion propagation for Pods, ensuring network connectivity is maintained during graceful shutdowns in environments using CNIs like Cilium.',
        stats: {
          comments: 2,
          reviews: 6,
          files: 2,
          additions: 80,
          deletions: 0,
          commits: 3,
          mergedAt: '2026-04-17T14:25:11Z',
          authorAvatar: AUTHOR_AVATAR,
          orgAvatar: STRIMZI_AVATAR,
        },
      },
      {
        repo: 'strimzi/strimzi-kafka-operator',
        url: 'https://github.com/strimzi/strimzi-kafka-operator/pull/12672',
        number: 12672,
        title: 'Add UseBackgroundPodDeletion feature gate and implement background deletion',
        description:
          'UseBackgroundPodDeletion feature gate (alpha, disabled by default) to control background deletion during rolling updates. Updated PodOperator to utilize background deletion when enabled, and enhanced deletion propagation logic in AbstractNamespacedResourceOperator.',
        stats: {
          comments: 13,
          reviews: 26,
          files: 15,
          additions: 190,
          deletions: 27,
          commits: 9,
          mergedAt: '2026-05-01T20:22:00Z',
          authorAvatar: AUTHOR_AVATAR,
          orgAvatar: STRIMZI_AVATAR,
        },
      },
    ],
  },
  {
    repo: 'strimzi/strimzi-kafka-operator',
    issueUrl: 'https://github.com/strimzi/strimzi-kafka-operator/issues/12337',
    prs: [
      {
        repo: 'strimzi/strimzi-kafka-operator',
        url: 'https://github.com/strimzi/strimzi-kafka-operator/pull/12631',
        number: 12631,
        title: 'Support force-renewal of KafkaUser certificates with annotation',
        description:
          'Implements proposal #137 by supporting the strimzi.io/force-renew annotation on the user secret. When set to true, the User Operator generates a new certificate at the next reconciliation; the previous certificate remains valid until it expires naturally, ensuring no service interruption.',
        stats: {
          comments: 5,
          reviews: 6,
          files: 5,
          additions: 43,
          deletions: 1,
          commits: 3,
          mergedAt: '2026-04-15T11:54:37Z',
          authorAvatar: AUTHOR_AVATAR,
          orgAvatar: STRIMZI_AVATAR,
        },
      },
    ],
  },
  {
    repo: 'strimzi/strimzi-kafka-operator',
    issueUrl: 'https://github.com/strimzi/strimzi-kafka-operator/pull/12750',
    prs: [
      {
        repo: 'strimzi/strimzi-kafka-operator',
        url: 'https://github.com/strimzi/strimzi-kafka-operator/pull/12750',
        number: 12750,
        title: 'Fix connector state transitions from FAILED to PAUSED or STOPPED',
        description:
          'The state-machine switch in AbstractConnectOperator only handled transitions from RUNNING and PAUSED, so requests to pause or stop a FAILED connector were silently ignored. This PR adds a FAILED case so FAILED connectors can transition to PAUSED or STOPPED via the Kafka Connect REST API.',
        stats: {
          comments: 18,
          reviews: 7,
          files: 3,
          additions: 136,
          deletions: 10,
          commits: 5,
          mergedAt: '2026-06-11T07:28:28Z',
          authorAvatar: AUTHOR_AVATAR,
          orgAvatar: STRIMZI_AVATAR,
        },
      },
    ],
  },
  {
    repo: 'open-telemetry/otel-arrow',
    issueUrl: 'https://github.com/open-telemetry/otel-arrow/issues/2838',
    prs: [
      {
        repo: 'open-telemetry/otel-arrow',
        url: 'https://github.com/open-telemetry/otel-arrow/pull/2964',
        number: 2964,
        title: 'implement struct column assignment and validation logic',
        description:
          'Implements execution and validation logic for assigning values to nested struct fields in the OTAP columnar query engine, enabling queries like "set resource.schema_url = ..." and "set instrumentation_scope.name = ...", with cardinality validation across the resource/scope/log hierarchy.',
        stats: {
          comments: 4,
          reviews: 15,
          files: 5,
          additions: 1132,
          deletions: 56,
          commits: 6,
          mergedAt: '2026-05-21T14:34:20Z',
          authorAvatar: AUTHOR_AVATAR,
          orgAvatar: OTEL_AVATAR,
        },
      },
    ],
  },
  {
    repo: 'strimzi/strimzi-kafka-operator',
    issueUrl: 'https://github.com/strimzi/strimzi-kafka-operator/pull/12759',
    prs: [
      {
        repo: 'strimzi/strimzi-kafka-operator',
        url: 'https://github.com/strimzi/strimzi-kafka-operator/pull/12759',
        number: 12759,
        title: 'Reconcile Cruise Control before Entity Operator',
        description:
          'Reconciles Cruise Control before Entity Operator so the Topic Operator CC API secret exists when Entity Operator reads it. Previously Entity Operator created this secret but reconciled after Cruise Control, so the secret might not exist yet when Cruise Control tried to read it.',
        stats: {
          comments: 12,
          reviews: 6,
          files: 10,
          additions: 119,
          deletions: 119,
          commits: 6,
          mergedAt: '2026-05-28T08:25:53Z',
          authorAvatar: AUTHOR_AVATAR,
          orgAvatar: STRIMZI_AVATAR,
        },
      },
    ],
  },
];
