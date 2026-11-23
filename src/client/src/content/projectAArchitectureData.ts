export type SemanticNodeClass =
  | 'control'
  | 'dedicated'
  | 'shared'
  | 'gateway'
  | 'substrate'
  | 'external';

export interface LegendItem {
  id: SemanticNodeClass;
  label: string;
  shortLabel: string;
  description: string;
}

export interface ArchitecturalInvariant {
  number: number;
  title: string;
  specBadge: string;
  summary: string;
  highlights: string[];
}

export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  nodeClass: SemanticNodeClass;
  role: string;
  boundary: string;
  details: string;
  tags: string[];
}

export interface DiagramEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  style?: 'solid' | 'dashed' | 'bidirectional';
}

export interface DiagramGroup {
  id: string;
  title: string;
  subtitle?: string;
  tone: SemanticNodeClass | 'neutral';
  nodes: DiagramNode[];
  subgroups?: Array<{
    id: string;
    title: string;
    subtitle?: string;
    tone: SemanticNodeClass;
    nodes: DiagramNode[];
  }>;
}

export interface TopologyNarrative {
  eyebrow: string;
  title: string;
  summary: string;
  calloutTitle: string;
  triggers: Array<{
    title: string;
    description: string;
  }>;
  metrics: Array<{
    label: string;
    value: string;
  }>;
}

export interface SequenceParticipant {
  id: 'U' | 'UI' | 'KC' | 'AGW' | 'Act' | 'DB' | 'LLM' | 'MCP' | 'Phx';
  label: string;
  fullName: string;
  nodeClass: SemanticNodeClass;
}

export type SequencePhaseId =
  | 'oidc-dispatch'
  | 'state-hydration'
  | 'code-synthesis'
  | 'mcp-token-exchange'
  | 'a2a-handoff'
  | 'checkpoint-telemetry';

export interface SequencePhase {
  id: SequencePhaseId;
  title: string;
  badge: string;
  summary: string;
  stepRange: [number, number];
}

export interface SequenceStep {
  step: number;
  phaseId: SequencePhaseId;
  from: SequenceParticipant['id'];
  to: SequenceParticipant['id'];
  arrowType: 'sync' | 'async';
  title: string;
  detail: string;
  securityNote: string;
  payloadPreview?: string;
  groupKind?: 'loop' | 'opt';
}

export interface ComparisonRow {
  dimension: string;
  optionA: string;
  optionB: string;
  highlight?: 'sovereign' | 'agile' | 'shared';
}

export const SEMANTIC_LEGEND: LegendItem[] = [
  {
    id: 'control',
    label: 'Control Plane',
    shortLabel: 'Control Plane',
    description: 'Intake, contract framing, signed OCI registry, and GitOps reconciliation.',
  },
  {
    id: 'dedicated',
    label: 'Dedicated / Sovereign',
    shortLabel: 'Dedicated',
    description: 'Physical single-project isolation inside ProjectA Namespace (Option A & per-project PVC).',
  },
  {
    id: 'shared',
    label: 'Shared Multi-Tenant',
    shortLabel: 'Shared',
    description: 'Cluster-wide operators or logically isolated multi-tenant platform backends (Option B).',
  },
  {
    id: 'gateway',
    label: 'Zero-Trust AgentGateway',
    shortLabel: 'AgentGateway',
    description: 'Hub-and-spoke L7 proxy enforcing CEL RBAC, PromptGuard, and RFC 8693 Token Exchange.',
  },
  {
    id: 'substrate',
    label: 'Kagent 1.0 Agent Substrate',
    shortLabel: 'Agent Substrate',
    description: 'Stateful Code Mode Actors, mounted OCI Skills, and stateless MCP Tool specs.',
  },
  {
    id: 'external',
    label: 'External / Actor',
    shortLabel: 'External',
    description: 'Human operators, Enterprise IdP (Okta), and external/enterprise LLM endpoints.',
  },
];

export const EXECUTIVE_THESIS = {
  eyebrow: 'Architectural Discussions for AI',
  title: 'ProjectA: Dual-Tier Agentic AI Workbench Architecture',
  subtitle:
    'Complementary Sovereign Clean-Room (Option A) and Agile Multi-Tenant (Option B) Kubernetes deployment overlays unified by Kagent 1.0 Agent Substrate (Code Mode), 100% Stateless MCP Tool Servers, and Zero-Trust AgentGateway.',
  calloutHeading: 'Are Option A and Option B Mutually Exclusive or Complementary?',
  calloutBody:
    'They are complementary deployment tiers—not mutually exclusive. With Kagent 1.0 Agent Substrate owning 100% of agent state, filesystem snapshots, and Code Mode execution paired with 100% Stateless MCP Tool Servers, Solution Framing Agent (Solvere) reads compliance tags from Project Contracts via Legal API and AI Platform Capabilities and automatically selects whether GitHub and ArgoCD provision Option A (tier: sovereign) or Option B (tier: standard) for ProjectA.',
  tiers: [
    {
      id: 'option-a',
      badge: 'tier: sovereign',
      name: 'Option A — Sovereign Project Cell',
      footprint: '~4–6 GiB RAM · ~5–8 min provision',
      summary:
        'Physical data and trace isolation inside ProjectA Namespace: dedicated CNPG Postgres HA cluster, dedicated Arize Phoenix, dedicated Space UI, and dedicated EFS Access Point.',
    },
    {
      id: 'option-b',
      badge: 'tier: standard',
      name: 'Option B — Agile Multi-Tenant Namespace',
      footprint: '~300–500 MiB RAM · Sub-30s provision',
      summary:
        'Sub-30s compute and policy cell sharing HA platform backends via strict logical isolation: Shared CNPG Database CRD (db_project_a), Shared Arize Phoenix (proj_project_a), Shared Space UI, and optional Stateless MCP Pool.',
    },
  ],
};

export const ARCHITECTURAL_INVARIANTS: ArchitecturalInvariant[] = [
  {
    number: 1,
    title: 'Agent Substrate Owns All Execution & Memory State',
    specBadge: 'kagent 1.0 · api.kagent.dev/v1alpha3',
    summary:
      'Agents run inside Agent Substrate (AgentTemplate + Harness + ModelConfig) as stateful Actors, with Capabilities (Skill A..N) mounted directly into the sandbox as immutable OCI bundles from AgentRegistry.',
    highlights: [
      'Conversation history, checkpoints, and pgvector embeddings persist in CNPG Postgres.',
      'Sandbox filesystem workspaces suspend and resume cleanly via EFS Access Point snapshots.',
    ],
  },
  {
    number: 2,
    title: 'Code Mode Execution',
    specBadge: 'Actors Synthesize & Execute Code',
    summary:
      'Every Actor executes in Code Mode, generating and running sandboxed code against typed MCP tool specifications fetched from AgentGateway (list_tools) and AgentRegistry.',
    highlights: [
      'Chains multiple deterministic tool steps in a single turn instead of paying LLM round-trip overhead per tool call.',
      'Keeps intermediate tool payloads inside the sandbox while surfacing verified results.',
    ],
  },
  {
    number: 3,
    title: '100% Stateless MCP Tool Servers',
    specBadge: 'Toolings · MCP 1..Y',
    summary:
      'Because Agent Substrate holds all session, checkpoint, and file state, Toolings (MCPServer / RemoteMCPServer) sit outside the Agent Substrate boundary as 100% stateless Streamable HTTP endpoints behind AgentGateway.',
    highlights: [
      'Horizontally scalable and trivially poolable across projects in Option B.',
      'Zero local session affinity or sticky state inside MCP tool pods.',
    ],
  },
  {
    number: 4,
    title: 'Zero-Trust Hub-and-Spoke Routing + Workload Identity',
    specBadge: 'AgentGateway & NetworkPolicy',
    summary:
      'A deny-all egress NetworkPolicy surrounds Agent Substrate: Actors cannot reach Toolings, peer Actors (A2A), or external LLMs directly, and hold zero static API keys or long-lived secrets.',
    highlights: [
      'Every outbound call traverses AgentGateway (A2A Gateway, MCP Gateway, or LLM Gateway).',
      'Actors present Kubernetes Workload Identity (ServiceAccount OIDC JWT CID AI X / SPIFFE ID) + user subject_token; AgentGateway enforces CEL RBAC (project_id: ProjectA) and runs RFC 8693 Token Exchange with Keycloak for target audience CID MCP Y.',
    ],
  },
  {
    number: 5,
    title: 'Cluster-Scoped Reconcilers & Node Telemetry',
    specBadge: 'Cluster-Wide Foundation',
    summary:
      'Platform operators, identity federation, and node-level telemetry pipelines remain cluster-scoped in both Option A and Option B to guarantee consistent governance.',
    highlights: [
      'Kagent 1.0 Operator, Datadog DaemonSet (tagged by kube_namespace: project-a), and OpenTelemetry Collector.',
      'Terraform Day-0/1 infra + Keycloak HA Federation Broker (federated with Okta via OIDC).',
    ],
  },
];

// ============================================================================
// Diagram 1: Shared Control Plane, Contract Framing & GitOps Tier Selection
// ============================================================================

export const CONTROL_PLANE_NARRATIVE: TopologyNarrative = {
  eyebrow: 'Control Plane & GitOps',
  title: 'Shared Control Plane, Contract Framing & GitOps Tier Selection',
  summary:
    'Before either runtime is created, the enterprise intake and GitOps control plane maps Project Contracts from Legal API to signed AgentRegistry artifacts via AI Platform Capabilities and routes provisioning into Option A or Option B.',
  calloutTitle: 'Automated Tier Selection Flow',
  triggers: [
    {
      title: 'Contract-Driven Compliance Framing',
      description:
        'Legal API exposes Project Contracts and entitlements; Framing Agent (Solvere) maps compliance tags to signed OCI Skills, MCP Specs, and the target tier overlay.',
    },
    {
      title: 'Day-0/1 Terraform + Day-2 ArgoCD Split',
      description:
        'Terraform manages EKS, KMS keys, EFS, and shared platform infrastructure, while ArgoCD ApplicationSet reconciles pinned GitHub Project Overlays rapidly.',
    },
    {
      title: 'Single Intake, Dual Provisioning Target',
      description:
        'tier: sovereign provisions Option A (5–8m, dedicated DB/UI/Phoenix); tier: standard provisions Option B (Sub-30s, shared DB/UI/Phoenix).',
    },
  ],
  metrics: [
    { label: 'Intake Registry', value: 'AgentRegistry (Signed OCI)' },
    { label: 'Tier Selector', value: 'Solvere Framing Agent' },
    { label: 'Reconciler', value: 'ArgoCD ApplicationSet' },
  ],
};

export const CONTROL_PLANE_EXTERNAL: DiagramNode[] = [
  {
    id: 'User',
    label: 'Actor: Engineer or Stakeholder',
    sublabel: 'Workbench Requester',
    nodeClass: 'external',
    role: 'Human Initiator',
    boundary: 'External Enterprise Network',
    details:
      'Requests ProjectA provisioning and receives the provisioned Workbench URL from AI Platform Capabilities.',
    tags: ['ProjectA Request', 'Workbench URL'],
  },
];

export const CONTROL_PLANE_GROUPS: DiagramGroup[] = [
  {
    id: 'Intake',
    title: '1. Project Intake and AI Framing',
    subtitle: 'Contract evaluation & signed artifact selection',
    tone: 'control',
    nodes: [
      {
        id: 'Market',
        label: 'AI Platform Capabilities',
        sublabel: 'Enterprise Intake Portal',
        nodeClass: 'control',
        role: 'Intake & Provisioning Orchestrator',
        boundary: 'Shared Control Plane',
        details:
          'Receives workbench requests for ProjectA, queries Legal API for entitlements, resolves signed catalog specs from AgentRegistry, collaborates with Solvere, and triggers GitHub Project Overlays.',
        tags: ['Catalog Portal', 'Workbench Trigger'],
      },
      {
        id: 'Legal',
        label: 'Legal API',
        sublabel: 'Project Contracts and Entitlements',
        nodeClass: 'control',
        role: 'Compliance & Contract Authority',
        boundary: 'Enterprise Governance Plane',
        details:
          'Source of truth for Project Contracts, regulatory residency flags (clean-room, HIPAA, M&A, Fed/Defense), user entitlements, and contract closure legal holds.',
        tags: ['Project Contracts', 'Compliance Tags'],
      },
      {
        id: 'Reg',
        label: 'AgentRegistry',
        sublabel: 'MCP Specs, OCI Skills, Agents',
        nodeClass: 'control',
        role: 'Signed Artifact Registry',
        boundary: 'Supply Chain Trust Root',
        details:
          'Hosts cryptographically signed AgentTemplates, immutable OCI Skill bundles, and typed Stateless MCP tool specifications.',
        tags: ['OCI Bundles', 'Signed MCP Specs'],
      },
      {
        id: 'MAI',
        label: 'Framing Agent (Solvere)',
        sublabel: 'Framing + Combinator',
        nodeClass: 'control',
        role: 'Automated Architecture Selector',
        boundary: 'AI Control Plane',
        details:
          'Evaluates Project Contracts from Legal API against available capabilities and outputs the pinned resource set plus the selected GitOps tier overlay (tier: sovereign vs. tier: standard).',
        tags: ['Tier Selection', 'Resource Combinator'],
      },
    ],
  },
  {
    id: 'GitOps',
    title: '2. Signed GitOps Provisioning',
    subtitle: 'Day-0/1 foundation + Day-2 declarative overlays',
    tone: 'control',
    nodes: [
      {
        id: 'GH',
        label: 'GitHub Project Overlays',
        sublabel: 'Pipeline: Infra, Configs, Setup',
        nodeClass: 'control',
        role: 'Declarative Source of Truth',
        boundary: 'Signed Git Repository',
        details:
          'Stores pinned ProjectA Kustomize/Helm overlays selected by Solvere and triggered by AI Platform Capabilities.',
        tags: ['Pinned Overlays', 'GitOps'],
      },
      {
        id: 'TF',
        label: 'Terraform',
        sublabel: 'Day-0/1 EKS, KMS, EFS, Shared Ops',
        nodeClass: 'control',
        role: 'Infrastructure Foundation',
        boundary: 'Cloud IaC Plane',
        details:
          'Provisions EKS clusters, per-project KMS keys for crypto-shredding, EFS filesystems, and shared platform metadata consumed by ArgoCD.',
        tags: ['EKS', 'KMS', 'EFS'],
      },
      {
        id: 'Argo',
        label: 'ArgoCD ApplicationSet',
        sublabel: 'Continuous Reconciler',
        nodeClass: 'control',
        role: 'GitOps Delivery Engine',
        boundary: 'Cluster Control Plane',
        details:
          'Reconciles GitHub manifests and Terraform platform metadata into ProjectA Namespace using either the Sovereign or Agile overlay.',
        tags: ['ApplicationSet', 'Day-2 Sync'],
      },
    ],
  },
  {
    id: 'Tiers',
    title: '3. Provisioned Runtime (ProjectA Namespace)',
    subtitle: 'Complementary deployment overlays',
    tone: 'neutral',
    nodes: [
      {
        id: 'TierA',
        label: 'Option A: Sovereign Project Cell',
        sublabel: '5–8m · Dedicated DB / UI / Phoenix',
        nodeClass: 'dedicated',
        role: 'tier: sovereign',
        boundary: 'ProjectA Namespace (Physical Isolation)',
        details:
          'Dedicated CNPG Postgres + pgvector cluster, dedicated Arize Phoenix, dedicated Space UI, and dedicated EFS Access Point PVC inside ProjectA.',
        tags: ['tier: sovereign', 'Clean-Room', '5–8 min'],
      },
      {
        id: 'TierB',
        label: 'Option B: Agile Project Namespace',
        sublabel: 'Sub-30s · Shared DB / UI / Phoenix',
        nodeClass: 'shared',
        role: 'tier: standard',
        boundary: 'ProjectA Namespace + Shared Platform',
        details:
          'Lightweight namespace compute cell backed by Shared CNPG (db_project_a), Shared Arize Phoenix (proj_project_a), Shared Space UI, and Shared MCP Pool.',
        tags: ['tier: standard', 'Sub-30s', '~80% Lower Cost'],
      },
    ],
  },
];

export const CONTROL_PLANE_EDGES: DiagramEdge[] = [
  { id: 'cp-1', from: 'User', to: 'Market', label: 'Request ProjectA / Workbench URL', style: 'bidirectional' },
  { id: 'cp-2', from: 'Legal', to: 'Market', label: 'Project Contracts and User Info', style: 'bidirectional' },
  { id: 'cp-3', from: 'Reg', to: 'Market', label: 'Signed Catalog Specs', style: 'solid' },
  { id: 'cp-4', from: 'Market', to: 'MAI', label: 'Project Contracts to Pinned Resources', style: 'bidirectional' },
  { id: 'cp-5', from: 'MAI', to: 'GH', label: 'Selected Tier Overlay', style: 'solid' },
  { id: 'cp-6', from: 'Market', to: 'GH', label: 'Trigger Workbench Solution', style: 'solid' },
  { id: 'cp-7', from: 'TF', to: 'Argo', label: 'Day-0/1 Platform Metadata', style: 'dashed' },
  { id: 'cp-8', from: 'GH', to: 'Argo', label: 'Reconcile Manifests', style: 'solid' },
  { id: 'cp-9', from: 'Argo', to: 'TierA', label: 'tier: sovereign', style: 'solid' },
  { id: 'cp-10', from: 'Argo', to: 'TierB', label: 'tier: standard', style: 'solid' },
];

// ============================================================================
// Diagram 2: Option A — Sovereign Clean-Room Project Cell
// ============================================================================

export const OPTION_A_NARRATIVE: TopologyNarrative = {
  eyebrow: 'Option A · tier: sovereign',
  title: 'Sovereign Clean-Room Project Cell (ProjectA Namespace)',
  summary:
    'Option A delivers strict physical isolation inside ProjectA Namespace, hardened with Agent Substrate (Code Mode), Stateless MCP Tools, and zero-trust AgentGateway routing. Everything containing project data—Space UI, AgentGateway, stateful Actors, Toolings, Dedicated CNPG Postgres + pgvector, Dedicated Arize Phoenix, and Dedicated ProjectA EFS Access Point—lives strictly inside the ProjectA namespace.',
  calloutTitle: 'When & Why Legal API Selects Option A',
  triggers: [
    {
      title: 'Strict Regulatory or Clean-Room Isolation',
      description:
        'M&A due diligence, Financial Audit, Defense/Gov, HIPAA, or explicit contractual single-tenant database and trace residency.',
    },
    {
      title: 'Zero Shared Database or Trace Blast Radius',
      description:
        'Conversation histories, pgvector embeddings, Code Mode workspace files, and LLM inference traces (Arize Phoenix) never share a PostgreSQL cluster or trace store with another project.',
    },
    {
      title: 'Instant Cryptographic Erasure & Legal Hold',
      description:
        'When Legal API marks ProjectA closed, CNPG backups, Phoenix traces, and EFS snapshots archive to a project-KMS-encrypted S3 vault or crypto-shred cleanly without impacting any tenant.',
    },
  ],
  metrics: [
    { label: 'Provisioning Time', value: '~5–8 minutes' },
    { label: 'Baseline Footprint', value: '~4–6 GiB RAM' },
    { label: 'Data Isolation', value: 'Dedicated CNPG + Phoenix' },
  ],
};

export const OPTION_A_EXTERNAL: DiagramNode[] = [
  {
    id: 'User',
    label: 'Actor via Cloud and Firewall',
    sublabel: 'Authenticated Browser Session',
    nodeClass: 'external',
    role: 'End User',
    boundary: 'External Client',
    details: 'Connects over HTTPS to the Dedicated ProjectA Space UI after enterprise firewall traversal.',
    tags: ['HTTPS', 'User'],
  },
  {
    id: 'Okta',
    label: 'Okta Enterprise IdP',
    sublabel: 'Corporate Directory',
    nodeClass: 'external',
    role: 'Upstream Identity Provider',
    boundary: 'Enterprise IAM',
    details: 'Federates user identity and group/project claims into the Cluster Keycloak Broker via OIDC.',
    tags: ['OIDC Federation', 'Claims'],
  },
  {
    id: 'LLM',
    label: 'External / Enterprise LLMs',
    sublabel: 'Inference Endpoints',
    nodeClass: 'external',
    role: 'Foundation Model Providers',
    boundary: 'External / Private Model Endpoints',
    details:
      'Only reachable via LLM Gateway inside AgentGateway—never directly from Agent Substrate Actors.',
    tags: ['Guarded Inference', 'No Direct Actor Egress'],
  },
];

export const OPTION_A_GROUPS: DiagramGroup[] = [
  {
    id: 'ClusterAuth',
    title: 'Cluster Identity and CRD Operator',
    subtitle: 'Cluster-scoped control components',
    tone: 'shared',
    nodes: [
      {
        id: 'KCtrl',
        label: 'Cluster Kagent 1.0 Operator',
        sublabel: 'api.kagent.dev/v1alpha3',
        nodeClass: 'shared',
        role: 'Cluster CRD Controller',
        boundary: 'Cluster-Wide System',
        details:
          'Watches AgentTemplate, Harness, and ModelConfig CRDs and reconciles stateful Actor sandboxes inside ProjectA Namespace.',
        tags: ['CRD Reconciler', 'Cluster-Wide'],
      },
      {
        id: 'KC',
        label: 'Cluster Keycloak Broker',
        sublabel: 'ProjectA Realm, CID AI X / MCP Y',
        nodeClass: 'shared',
        role: 'OIDC Federation & RFC 8693 STS',
        boundary: 'Cluster Identity Plane',
        details:
          'Federates with Okta, issues user subject_token JWTs, and executes RFC 8693 Token Exchange with MCP Gateway using Actor Workload Identity (CID AI X -> CID MCP Y).',
        tags: ['RFC 8693', 'ProjectA Realm', 'Okta Broker'],
      },
    ],
  },
  {
    id: 'SovereignNS',
    title: 'ProjectA Namespace (Sovereign Clean-Room Cell)',
    subtitle: 'Amber nodes denote single-tenant physical data & UI isolation',
    tone: 'dedicated',
    nodes: [
      {
        id: 'UI',
        label: 'Dedicated ProjectA Space UI',
        sublabel: 'Single-Tenant Frontend',
        nodeClass: 'dedicated',
        role: 'Dedicated Workbench UI',
        boundary: 'ProjectA Namespace',
        details:
          'Dedicated web application serving only ProjectA. Completes OIDC login with Keycloak and dispatches Bearer subject_token requests to A2A Gateway.',
        tags: ['Dedicated UI', 'OIDC Login'],
      },
      {
        id: 'Tools',
        label: 'Toolings: Stateless MCP Specs 1..Y',
        sublabel: 'MCPServer / RemoteMCPServer',
        nodeClass: 'substrate',
        role: '100% Stateless Tool Endpoints',
        boundary: 'ProjectA Namespace (Outside Substrate)',
        details:
          'Stateless Streamable HTTP MCP servers isolated inside ProjectA. Accept only short-lived delegated JWTs (aud: CID MCP Y) from MCP Gateway.',
        tags: ['100% Stateless', 'Streamable HTTP'],
      },
      {
        id: 'EFS',
        label: 'Dedicated ProjectA EFS Access Point PVC',
        sublabel: 'KMS-Encrypted Workspace Storage',
        nodeClass: 'dedicated',
        role: 'Sandbox Filesystem Snapshots',
        boundary: 'ProjectA Namespace',
        details:
          'Dedicated EFS Access Point PVC storing Code Mode sandbox files and workspace suspend/resume snapshots.',
        tags: ['Dedicated PVC', 'Snapshots'],
      },
      {
        id: 'CNPG',
        label: 'Dedicated CNPG Postgres + pgvector',
        sublabel: 'Single-Tenant HA Cluster',
        nodeClass: 'dedicated',
        role: 'Dedicated State, Vector & Trace Store',
        boundary: 'ProjectA Namespace',
        details:
          'Dedicated CloudNativePG cluster storing Actor conversation checkpoints, pgvector embeddings, and Dedicated Arize Phoenix traces. Supports instant KMS crypto-shredding.',
        tags: ['Dedicated CNPG', 'pgvector', 'Crypto-Shredding'],
      },
      {
        id: 'Phoenix',
        label: 'Dedicated Arize Phoenix',
        sublabel: 'ProjectA Traces & Evals',
        nodeClass: 'dedicated',
        role: 'Dedicated AI Observability',
        boundary: 'ProjectA Namespace',
        details:
          'Single-tenant OpenInference trace and evaluation UI/backend backed exclusively by ProjectA Dedicated CNPG Postgres.',
        tags: ['OpenInference', 'Dedicated Traces'],
      },
    ],
    subgroups: [
      {
        id: 'AGW',
        title: 'Dedicated AgentGateway Proxy (CEL RBAC + PromptGuard)',
        subtitle: 'Zero-trust hub-and-spoke L7 boundary',
        tone: 'gateway',
        nodes: [
          {
            id: 'A2A_GW',
            label: 'A2A and Turn Gateway',
            sublabel: 'Ingress & Peer Routing',
            nodeClass: 'gateway',
            role: 'Turn Dispatch & A2A Proxy',
            boundary: 'AgentGateway Perimeter',
            details:
              'Validates user Bearer JWT and project_id: ProjectA CEL RBAC before dispatching turns or mediating Actor-to-Actor delegation. Emits OTLP AI spans.',
            tags: ['CEL RBAC', 'A2A', 'OTLP Spans'],
          },
          {
            id: 'LLM_GW',
            label: 'LLM Gateway (Guardrails)',
            sublabel: 'PromptGuard & Credential Injection',
            nodeClass: 'gateway',
            role: 'Guarded Inference Proxy',
            boundary: 'AgentGateway Perimeter',
            details:
              'Inspects Code Mode inference calls with PromptGuard and injects enterprise LLM credentials—Actors never hold model API keys.',
            tags: ['PromptGuard', 'Zero Keys in Sandbox'],
          },
          {
            id: 'MCP_GW',
            label: 'MCP Gateway (RFC 8693 OBO)',
            sublabel: 'Token Exchange & Tool RBAC',
            nodeClass: 'gateway',
            role: 'Delegated Tool Proxy',
            boundary: 'AgentGateway Perimeter',
            details:
              'Receives Actor SA JWT (CID AI X) + user subject_token, executes RFC 8693 exchange with Keycloak for aud: CID MCP Y, enforces CEL policy, and calls Stateless MCP Tools.',
            tags: ['RFC 8693 OBO', 'CID AI X -> MCP Y'],
          },
        ],
      },
      {
        id: 'SubstrateNet',
        title: 'Kagent Agent Substrate (Zero-Trust NetworkPolicy: Deny Direct Egress)',
        subtitle: 'All outbound network traffic forced through AgentGateway',
        tone: 'substrate',
        nodes: [
          {
            id: 'Skills',
            label: 'Capabilities: Mounted OCI Skills A..N',
            sublabel: 'Immutable AgentRegistry Bundles',
            nodeClass: 'substrate',
            role: 'Read-Only Skill Mounts',
            boundary: 'Actor Sandbox',
            details:
              'Signed OCI skill bundles from AgentRegistry mounted directly into the Actor Code Mode sandbox.',
            tags: ['OCI Bundles', 'Immutable'],
          },
          {
            id: 'Actors',
            label: 'Actors Pool: Agent 1..X',
            sublabel: 'Stateful Code Mode Sandbox',
            nodeClass: 'substrate',
            role: 'Stateful Execution & Memory Owner',
            boundary: 'Zero-Trust NetworkPolicy Perimeter',
            details:
              'Executes synthesized Code Mode scripts, persists checkpoints and pgvector memory to Dedicated CNPG, snapshots workspaces to Dedicated EFS, and holds zero long-lived secrets.',
            tags: ['Code Mode', 'Stateful', 'SA OIDC JWT'],
          },
        ],
      },
    ],
  },
  {
    id: 'ClusterObs',
    title: 'Cluster Telemetry Pipeline',
    subtitle: 'Node-wide metric, log, and OTLP routing',
    tone: 'shared',
    nodes: [
      {
        id: 'OTel',
        label: 'Cluster OTel Collector',
        sublabel: 'OTLP Router',
        nodeClass: 'shared',
        role: 'Telemetry Router',
        boundary: 'Cluster Telemetry Plane',
        details:
          'Receives OTLP spans and logs from A2A_GW and Actors; routes OpenInference traces to Dedicated Arize Phoenix and infrastructure metrics/logs to Datadog.',
        tags: ['OTLP', 'OpenInference'],
      },
      {
        id: 'DD',
        label: 'Cluster Datadog DaemonSet',
        sublabel: 'kube_namespace: project-a',
        nodeClass: 'shared',
        role: 'Node APM & Infrastructure Agent',
        boundary: 'Cluster DaemonSet',
        details:
          'Collects node-level container metrics, logs, and APM telemetry tagged strictly with kube_namespace: project-a.',
        tags: ['DaemonSet', 'kube_namespace: project-a'],
      },
    ],
  },
];

export const OPTION_A_EDGES: DiagramEdge[] = [
  { id: 'oa-1', from: 'User', to: 'UI', label: 'HTTPS' },
  { id: 'oa-2', from: 'UI', to: 'KC', label: 'OIDC Login', style: 'bidirectional' },
  { id: 'oa-3', from: 'KC', to: 'Okta', label: 'Federates' },
  { id: 'oa-4', from: 'UI', to: 'A2A_GW', label: 'Bearer JWT (subject_token)' },
  { id: 'oa-5', from: 'KC', to: 'MCP_GW', label: 'RFC 8693 Exchange', style: 'bidirectional' },
  { id: 'oa-6', from: 'KCtrl', to: 'Actors', label: 'Reconciles CRDs', style: 'dashed' },
  { id: 'oa-7', from: 'A2A_GW', to: 'Actors', label: 'Turn Dispatch and A2A', style: 'bidirectional' },
  { id: 'oa-8', from: 'Skills', to: 'Actors', label: 'Mounted in Sandbox', style: 'dashed' },
  { id: 'oa-9', from: 'LLM_GW', to: 'Actors', label: 'Code Mode LLM Calls', style: 'bidirectional' },
  { id: 'oa-10', from: 'LLM_GW', to: 'LLM', label: 'Guarded Inference', style: 'bidirectional' },
  { id: 'oa-11', from: 'MCP_GW', to: 'Actors', label: 'Code Mode MCP + SA JWT (CID AI X)', style: 'bidirectional' },
  { id: 'oa-12', from: 'MCP_GW', to: 'Tools', label: 'Scoped CID MCP Y JWT', style: 'bidirectional' },
  { id: 'oa-13', from: 'Actors', to: 'EFS', label: 'Snapshots and Code Files', style: 'bidirectional' },
  { id: 'oa-14', from: 'Actors', to: 'CNPG', label: 'Sessions and Memory', style: 'bidirectional' },
  { id: 'oa-15', from: 'A2A_GW', to: 'OTel', label: 'OTLP AI Spans' },
  { id: 'oa-16', from: 'Actors', to: 'OTel', label: 'OTLP Spans and Logs' },
  { id: 'oa-17', from: 'OTel', to: 'Phoenix', label: 'OpenInference Traces' },
  { id: 'oa-18', from: 'Phoenix', to: 'CNPG', label: 'Dedicated Trace DB', style: 'bidirectional' },
  { id: 'oa-19', from: 'OTel', to: 'DD', label: 'Metrics and Logs' },
];

// ============================================================================
// Diagram 3: Option B — Agile Multi-Tenant Project Namespace
// ============================================================================

export const OPTION_B_NARRATIVE: TopologyNarrative = {
  eyebrow: 'Option B · tier: standard',
  title: 'Agile Multi-Tenant Project Namespace (ProjectA Namespace)',
  summary:
    'Option B is engineered for high-velocity, high-density standard Project Contracts (80%+ of volume). Each project still gets an isolated ProjectA namespace enforcing a strict deny-all NetworkPolicy, its own AgentGateway policy/guardrail proxy, stateful Agent Substrate (Actors in Code Mode + OCI Skills), project-specific Stateless MCP Tools, and a Per-Project EFS Access Point PVC—while heavy UI, identity, PostgreSQL HA, Phoenix compute, and generic MCP pools shift to Shared Multi-Tenant Platform Services.',
  calloutTitle: 'When & Why Legal API Selects Option B',
  triggers: [
    {
      title: 'Sub-30-Second Provisioning',
      description:
        'ArgoCD ApplicationSet reconciles lightweight CRDs (AgentTemplate, Harness, ModelConfig, AgentgatewayPolicy, Database CRD) immediately without booting a multi-node Postgres HA cluster or Phoenix deployment.',
    },
    {
      title: '~80% Lower Baseline Cost per Project',
      description:
        'Eliminates O(N) idle DB/UI overhead (~300–500 MiB baseline compute vs. ~4–6 GiB in Option A) while keeping zero-trust token exchange and CEL RBAC (jwt.claims.projects.contains("ProjectA")).',
    },
    {
      title: 'Cross-Project Stateless MCP Reuse',
      description:
        'Generic 100% stateless MCP servers (internal policy search, document parsers, formatters) are pooled in SharedPlatform behind per-project AgentGateway authorization instead of duplicated per namespace.',
    },
  ],
  metrics: [
    { label: 'Provisioning Time', value: 'Sub-30 seconds' },
    { label: 'Baseline Footprint', value: '~300–500 MiB RAM' },
    { label: 'Data Isolation', value: 'DB Role db_project_a + proj_project_a' },
  ],
};

export const OPTION_B_EXTERNAL: DiagramNode[] = OPTION_A_EXTERNAL;

export const OPTION_B_GROUPS: DiagramGroup[] = [
  {
    id: 'Edge',
    title: 'Shared Platform: Entry and Identity (Okta-Federated)',
    subtitle: 'Blue nodes denote shared HA multi-tenant entry & identity services',
    tone: 'shared',
    nodes: [
      {
        id: 'UI',
        label: 'Shared Space UI (/projects/ProjectA)',
        sublabel: 'Multi-Tenant Workbench Frontend',
        nodeClass: 'shared',
        role: 'Shared Path-Scoped UI',
        boundary: 'Shared Platform Plane',
        details:
          'Single HA frontend routing projects by path (/projects/ProjectA) and forwarding project-scoped Bearer JWTs to the ProjectA AgentGateway.',
        tags: ['Shared UI', '/projects/ProjectA'],
      },
      {
        id: 'KC',
        label: 'Shared Keycloak HA',
        sublabel: 'ProjectA Org, CID AI X / MCP Y',
        nodeClass: 'shared',
        role: 'Multi-Tenant OIDC & RFC 8693 STS',
        boundary: 'Shared Identity Plane',
        details:
          'Keycloak HA cluster using Keycloak Organizations to scope ProjectA roles, user subject_tokens, and RFC 8693 Actor-to-MCP delegated tokens.',
        tags: ['Keycloak HA', 'ProjectA Org', 'RFC 8693'],
      },
      {
        id: 'KCtrl',
        label: 'Shared Kagent 1.0 Operator',
        sublabel: 'Cluster CRD Controller',
        nodeClass: 'shared',
        role: 'Cluster CRD Reconciler',
        boundary: 'Shared Platform Plane',
        details:
          'Reconciles AgentTemplate, Harness, and ModelConfig CRDs in ProjectA Namespace in seconds.',
        tags: ['CRD Controller', 'Sub-30s Sync'],
      },
    ],
  },
  {
    id: 'AgileNS',
    title: 'ProjectA Namespace (Lightweight Compute and Policy Cell)',
    subtitle: 'Per-project zero-trust policy & Code Mode compute boundary',
    tone: 'substrate',
    nodes: [
      {
        id: 'CaseTools',
        label: 'ProjectA Stateless MCP Specs 1..Y',
        sublabel: 'Project-Specific Toolings',
        nodeClass: 'substrate',
        role: 'Project-Scoped Stateless MCP',
        boundary: 'ProjectA Namespace',
        details:
          'Custom stateless Streamable HTTP MCP servers specific to ProjectA, accessed exclusively through the per-project MCP Gateway.',
        tags: ['Stateless MCP', 'Project-Specific'],
      },
      {
        id: 'EFS_PVC',
        label: 'Per-Project EFS Access Point PVC',
        sublabel: 'Dynamic Access Point Mount',
        nodeClass: 'dedicated',
        role: 'Isolated Project Filesystem',
        boundary: 'ProjectA Namespace -> Shared EFS',
        details:
          'Dedicated POSIX-isolated EFS Access Point PVC mounted only into ProjectA Actors, backed by the Shared EFS Filesystem.',
        tags: ['Per-Project AP', 'Dedicated PVC'],
      },
    ],
    subgroups: [
      {
        id: 'AGW',
        title: 'Per-Project AgentGateway Proxy (CEL RBAC + PromptGuard)',
        subtitle: 'Enforces jwt.claims.projects.contains("ProjectA")',
        tone: 'gateway',
        nodes: [
          {
            id: 'A2A_GW',
            label: 'A2A and Turn Gateway',
            sublabel: 'Per-Project Ingress & A2A',
            nodeClass: 'gateway',
            role: 'Turn Dispatch & CEL Policy',
            boundary: 'ProjectA AgentGateway',
            details:
              'Verifies ProjectA claim in subject_token via CEL RBAC before dispatching to Actors; emits project-tagged OTLP AI spans.',
            tags: ['CEL RBAC', 'ProjectA Claim'],
          },
          {
            id: 'LLM_GW',
            label: 'LLM Gateway (Guardrails)',
            sublabel: 'PromptGuard & Key Injection',
            nodeClass: 'gateway',
            role: 'Guarded Inference Proxy',
            boundary: 'ProjectA AgentGateway',
            details: 'Applies per-project PromptGuard rules and injects LLM credentials on behalf of Actors.',
            tags: ['PromptGuard', 'Keyless Actors'],
          },
          {
            id: 'MCP_GW',
            label: 'MCP Gateway (RFC 8693 OBO)',
            sublabel: 'Routes to Project & Shared MCPs',
            nodeClass: 'gateway',
            role: 'Token Exchange & Tool Router',
            boundary: 'ProjectA AgentGateway',
            details:
              'Runs RFC 8693 Token Exchange with Shared Keycloak HA and routes authorized calls to either ProjectA Stateless MCPs or the Shared Stateless MCP Pool.',
            tags: ['RFC 8693', 'Dual MCP Routing'],
          },
        ],
      },
      {
        id: 'SubstrateNet',
        title: 'Kagent Agent Substrate (Zero-Trust NetworkPolicy: Deny Direct Egress)',
        subtitle: 'Identical security posture to Option A',
        tone: 'substrate',
        nodes: [
          {
            id: 'Skills',
            label: 'Capabilities: Mounted OCI Skills A..N',
            sublabel: 'Immutable OCI Bundles',
            nodeClass: 'substrate',
            role: 'Mounted AgentRegistry Skills',
            boundary: 'Actor Sandbox',
            details: 'Immutable OCI skill bundles mounted into ProjectA Code Mode Actors.',
            tags: ['OCI Bundles', 'Immutable'],
          },
          {
            id: 'Actors',
            label: 'Actors Pool: Agent 1..X',
            sublabel: 'Stateful Code Mode Sandbox',
            nodeClass: 'substrate',
            role: 'Stateful Code Mode Runtime',
            boundary: 'Zero-Trust NetworkPolicy Perimeter',
            details:
              'Connects over TLS using per-project Postgres role db_project_a to Shared CNPG HA, stores workspace snapshots on Per-Project EFS AP PVC, and routes all tool/LLM calls via AgentGateway.',
            tags: ['Code Mode', 'TLS + db_project_a'],
          },
        ],
      },
    ],
  },
  {
    id: 'SharedBackends',
    title: 'Shared Platform: State, MCP Pool and Observability',
    subtitle: 'Logically isolated multi-tenant data, tool pool, and trace plane',
    tone: 'shared',
    nodes: [
      {
        id: 'SharedTools',
        label: 'Shared Stateless MCP Pool (Generic)',
        sublabel: 'Cross-Project Reusable Tools',
        nodeClass: 'shared',
        role: 'Pooled Stateless MCPs',
        boundary: 'Shared Platform Plane',
        details:
          'Generic stateless tools (internal policy search, document parsers, formatting) shared safely across projects behind per-project AgentGateway authorization.',
        tags: ['100% Stateless', 'Cross-Project Reuse'],
      },
      {
        id: 'SharedEFS',
        label: 'Shared EFS Filesystem',
        sublabel: 'Up to 10k Access Points / FS',
        nodeClass: 'shared',
        role: 'Backed Storage Pool',
        boundary: 'Shared Storage Plane',
        details:
          'Single AWS EFS filesystem hosting isolated dynamic Access Points per project (supporting up to 10,000 APs per filesystem).',
        tags: ['Up to 10k APs', 'Dynamic Provisioning'],
      },
      {
        id: 'SharedCNPG',
        label: 'Shared CNPG HA',
        sublabel: 'DB Role: db_project_a',
        nodeClass: 'shared',
        role: 'Multi-Tenant Postgres + pgvector',
        boundary: 'Shared Data Plane',
        details:
          'High-availability CloudNativePG cluster isolating ProjectA via a dedicated Database CRD, schema, and least-privilege role db_project_a.',
        tags: ['Database CRD', 'db_project_a'],
      },
      {
        id: 'OTel',
        label: 'Shared OTel Collector',
        sublabel: 'Project-Tagged Telemetry',
        nodeClass: 'shared',
        role: 'OTLP Span & Metric Router',
        boundary: 'Shared Observability Plane',
        details: 'Routes project-tagged OpenInference traces to Shared Arize Phoenix and logs/metrics to Datadog.',
        tags: ['OTLP', 'Project-Tagged'],
      },
      {
        id: 'SharedPhoenix',
        label: 'Shared Arize Phoenix',
        sublabel: 'Project: proj_project_a',
        nodeClass: 'shared',
        role: 'Multi-Tenant AI Trace Store',
        boundary: 'Shared Observability Plane',
        details:
          'Shared Arize Phoenix instance segregating ProjectA traces and evaluations inside project proj_project_a.',
        tags: ['proj_project_a', 'OpenInference'],
      },
      {
        id: 'DD',
        label: 'Datadog DaemonSet',
        sublabel: 'kube_namespace: project-a',
        nodeClass: 'shared',
        role: 'Node-Level Monitoring',
        boundary: 'Cluster DaemonSet',
        details: 'Collects node metrics and logs tagged by kube_namespace: project-a.',
        tags: ['kube_namespace: project-a'],
      },
    ],
  },
];

export const OPTION_B_EDGES: DiagramEdge[] = [
  { id: 'ob-1', from: 'User', to: 'UI', label: 'HTTPS' },
  { id: 'ob-2', from: 'UI', to: 'KC', label: 'OIDC Login', style: 'bidirectional' },
  { id: 'ob-3', from: 'KC', to: 'Okta', label: 'Federates' },
  { id: 'ob-4', from: 'UI', to: 'A2A_GW', label: 'Bearer JWT (project ProjectA)' },
  { id: 'ob-5', from: 'KC', to: 'MCP_GW', label: 'RFC 8693 Exchange', style: 'bidirectional' },
  { id: 'ob-6', from: 'KCtrl', to: 'Actors', label: 'Reconciles CRDs', style: 'dashed' },
  { id: 'ob-7', from: 'A2A_GW', to: 'Actors', label: 'Turn Dispatch and A2A', style: 'bidirectional' },
  { id: 'ob-8', from: 'Skills', to: 'Actors', label: 'Mounted in Sandbox', style: 'dashed' },
  { id: 'ob-9', from: 'LLM_GW', to: 'Actors', label: 'Code Mode LLM Calls', style: 'bidirectional' },
  { id: 'ob-10', from: 'LLM_GW', to: 'LLM', label: 'Guarded Inference', style: 'bidirectional' },
  { id: 'ob-11', from: 'MCP_GW', to: 'Actors', label: 'Code Mode MCP + SA JWT (CID AI X)', style: 'bidirectional' },
  { id: 'ob-12', from: 'MCP_GW', to: 'CaseTools', label: 'Scoped CID MCP Y JWT', style: 'bidirectional' },
  { id: 'ob-13', from: 'MCP_GW', to: 'SharedTools', label: 'Scoped CID MCP Y JWT', style: 'bidirectional' },
  { id: 'ob-14', from: 'Actors', to: 'EFS_PVC', label: 'Snapshots and Code Files', style: 'bidirectional' },
  { id: 'ob-15', from: 'EFS_PVC', to: 'SharedEFS', label: 'Dynamic Access Point', style: 'dashed' },
  { id: 'ob-16', from: 'Actors', to: 'SharedCNPG', label: 'TLS + Per-Project Role', style: 'bidirectional' },
  { id: 'ob-17', from: 'A2A_GW', to: 'OTel', label: 'OTLP Spans' },
  { id: 'ob-18', from: 'Actors', to: 'OTel', label: 'OTLP Spans and Logs' },
  { id: 'ob-19', from: 'OTel', to: 'SharedPhoenix', label: 'Project-Tagged Traces' },
  { id: 'ob-20', from: 'SharedPhoenix', to: 'SharedCNPG', label: 'Shared Trace DB Role', style: 'bidirectional' },
  { id: 'ob-21', from: 'OTel', to: 'DD', label: 'Metrics and Logs' },
];

// ============================================================================
// Diagram 4: 24-Step Runtime Execution Flow
// ============================================================================

export const SEQUENCE_PARTICIPANTS: SequenceParticipant[] = [
  { id: 'U', label: 'User', fullName: 'Engineer / Stakeholder', nodeClass: 'external' },
  { id: 'UI', label: 'Space UI', fullName: 'Space UI (Dedicated or Shared)', nodeClass: 'dedicated' },
  { id: 'KC', label: 'Keycloak', fullName: 'Keycloak (Okta Broker)', nodeClass: 'shared' },
  { id: 'AGW', label: 'Gateway', fullName: 'AgentGateway (A2A / LLM / MCP)', nodeClass: 'gateway' },
  { id: 'Act', label: 'Actor', fullName: 'Actor (Agent Substrate Code Mode)', nodeClass: 'substrate' },
  { id: 'DB', label: 'CNPG + EFS', fullName: 'CNPG Postgres and EFS', nodeClass: 'dedicated' },
  { id: 'LLM', label: 'LLM', fullName: 'LLM Provider', nodeClass: 'external' },
  { id: 'MCP', label: 'MCP Tool', fullName: 'Stateless MCP Spec Tool', nodeClass: 'substrate' },
  { id: 'Phx', label: 'Phoenix', fullName: 'Arize Phoenix', nodeClass: 'shared' },
];

export const SEQUENCE_PHASES: SequencePhase[] = [
  {
    id: 'oidc-dispatch',
    title: '1. OIDC Login & Turn Dispatch',
    badge: 'Steps 1–5',
    summary: 'User authenticates via Okta/Keycloak OIDC and dispatches a ProjectA prompt through A2A_GW.',
    stepRange: [1, 5],
  },
  {
    id: 'state-hydration',
    title: '2. Substrate State Hydration',
    badge: 'Steps 6–7',
    summary: 'Actor loads checkpoints, pgvector memory, and EFS filesystem snapshot alongside mounted OCI Skills.',
    stepRange: [6, 7],
  },
  {
    id: 'code-synthesis',
    title: '3. Code Mode Script Synthesis',
    badge: 'Steps 8–11',
    summary: 'Actor invokes LLM_GW with its ServiceAccount OIDC JWT; LLM_GW runs PromptGuard and injects provider keys.',
    stepRange: [8, 11],
  },
  {
    id: 'mcp-token-exchange',
    title: '4. Loop: Stateless MCP + RFC 8693 Token Exchange',
    badge: 'Steps 12–17',
    summary: 'Code Mode script chains stateless MCP calls; MCP_GW performs RFC 8693 Token Exchange (subject_token + actor_token).',
    stepRange: [12, 17],
  },
  {
    id: 'a2a-handoff',
    title: '5. Optional A2A Handoff',
    badge: 'Steps 18–19',
    summary: 'Actor optionally delegates a sub-task to a peer Actor through A2A_GW.',
    stepRange: [18, 19],
  },
  {
    id: 'checkpoint-telemetry',
    title: '6. Checkpoint & OpenInference Telemetry',
    badge: 'Steps 20–24',
    summary: 'Actor persists updated checkpoints/EFS snapshot; AgentGateway streams final response and async OTLP spans.',
    stepRange: [20, 24],
  },
];

export const SEQUENCE_STEPS: SequenceStep[] = [
  {
    step: 1,
    phaseId: 'oidc-dispatch',
    from: 'U',
    to: 'UI',
    arrowType: 'sync',
    title: 'Open ProjectA workbench and sign in (Okta OIDC via Keycloak)',
    detail: 'User navigates to the ProjectA workbench URL (dedicated UI in Option A or /projects/ProjectA in Option B).',
    securityNote: 'No static tokens are stored in browser localStorage; session uses standard OIDC Authorization Code + PKCE.',
  },
  {
    step: 2,
    phaseId: 'oidc-dispatch',
    from: 'UI',
    to: 'KC',
    arrowType: 'sync',
    title: 'Complete OIDC login flow',
    detail: 'Space UI completes OIDC handshake with Keycloak Broker federated to Okta Enterprise IdP.',
    securityNote: 'Okta group memberships and Legal API project entitlements are mapped into Keycloak claims.',
  },
  {
    step: 3,
    phaseId: 'oidc-dispatch',
    from: 'KC',
    to: 'UI',
    arrowType: 'async',
    title: 'Return User OIDC JWT (sub + projects)',
    detail: 'Keycloak issues a short-lived user access token containing subject identity and authorized project list.',
    securityNote: 'Claims include sub and projects: ["ProjectA", ...] for downstream CEL policy checks.',
    payloadPreview: '{ "sub": "user-4821", "projects": ["ProjectA"], "iss": "keycloak/broker" }',
  },
  {
    step: 4,
    phaseId: 'oidc-dispatch',
    from: 'UI',
    to: 'AGW',
    arrowType: 'sync',
    title: 'Dispatch prompt (Bearer subject_token + ProjectA)',
    detail: 'Space UI submits the user turn to AgentGateway A2A/Turn Gateway with the Bearer user JWT.',
    securityNote: 'All user traffic terminates at AgentGateway L7 proxy—never directly at Actor pods.',
  },
  {
    step: 5,
    phaseId: 'oidc-dispatch',
    from: 'AGW',
    to: 'Act',
    arrowType: 'sync',
    title: 'A2A_GW validates ProjectA RBAC and dispatches turn',
    detail: 'A2A_GW evaluates CEL expression verifying jwt.claims.projects.contains("ProjectA") and forwards the turn into the Actor sandbox.',
    securityNote: 'CEL RBAC prevents cross-project prompt injection or lateral turn dispatch.',
    payloadPreview: 'CEL: jwt.claims.projects.contains("ProjectA") && request.project_id == "ProjectA"',
  },
  {
    step: 6,
    phaseId: 'state-hydration',
    from: 'Act',
    to: 'DB',
    arrowType: 'sync',
    title: 'Load Actor checkpoints, pgvector memory, and EFS snapshot',
    detail: 'Actor queries CNPG Postgres (Dedicated in Option A, db_project_a in Option B) and attaches its EFS Access Point PVC.',
    securityNote: '100% of conversation state and filesystem workspaces live inside Agent Substrate + CNPG/EFS.',
  },
  {
    step: 7,
    phaseId: 'state-hydration',
    from: 'DB',
    to: 'Act',
    arrowType: 'async',
    title: 'Hydrate Code Mode sandbox + mounted OCI Skills',
    detail: 'Sandbox resumes with prior workspace files, conversation checkpoints, pgvector context, and immutable OCI Skills A..N.',
    securityNote: 'OCI Skills are read-only immutable mounts pulled from signed AgentRegistry.',
  },
  {
    step: 8,
    phaseId: 'code-synthesis',
    from: 'Act',
    to: 'AGW',
    arrowType: 'sync',
    title: 'Code Mode inference call + SA OIDC JWT (CID AI X)',
    detail: 'Actor requests model synthesis using typed MCP tool specifications and authenticates to LLM_GW with its Kubernetes Workload Identity JWT.',
    securityNote: 'Actor holds zero external LLM API keys; deny-all NetworkPolicy blocks direct egress.',
  },
  {
    step: 9,
    phaseId: 'code-synthesis',
    from: 'AGW',
    to: 'LLM',
    arrowType: 'sync',
    title: 'LLM_GW runs PromptGuard and injects provider credentials',
    detail: 'LLM_GW screens prompts for policy/PII violations via PromptGuard, injects the enterprise LLM credential, and forwards the request.',
    securityNote: 'Centralized guardrail enforcement and credential isolation at the gateway tier.',
  },
  {
    step: 10,
    phaseId: 'code-synthesis',
    from: 'LLM',
    to: 'AGW',
    arrowType: 'async',
    title: 'Return synthesized Code Mode script (against MCP specs)',
    detail: 'Model returns a sandboxed execution script orchestrating multiple typed MCP calls in one turn.',
    securityNote: 'Eliminates repeated LLM round-trips between deterministic tool calls.',
  },
  {
    step: 11,
    phaseId: 'code-synthesis',
    from: 'AGW',
    to: 'Act',
    arrowType: 'async',
    title: 'Deliver script to sandbox',
    detail: 'LLM_GW returns the synthesized Code Mode script to the Actor sandbox for isolated execution.',
    securityNote: 'Execution happens inside the hardened kagent 1.0 Harness sandbox.',
  },
  {
    step: 12,
    phaseId: 'mcp-token-exchange',
    groupKind: 'loop',
    from: 'Act',
    to: 'AGW',
    arrowType: 'sync',
    title: 'Invoke Stateless MCP tool + SA JWT (actor_token CID AI X)',
    detail: 'Running inside the Code Mode loop, the Actor calls MCP_GW presenting both user subject_token and its Workload Identity actor_token (CID AI X).',
    securityNote: 'Dual-identity propagation ensures tools know both who the human is and which AI agent is acting.',
  },
  {
    step: 13,
    phaseId: 'mcp-token-exchange',
    groupKind: 'loop',
    from: 'AGW',
    to: 'KC',
    arrowType: 'sync',
    title: 'RFC 8693 Token Exchange (subject_token + actor_token for aud CID MCP Y)',
    detail: 'MCP_GW exchanges the user subject_token and Actor actor_token with Keycloak for a narrowly scoped audience token targeting MCP Y.',
    securityNote: 'Standard IETF RFC 8693 OAuth 2.0 Token Exchange with explicit audience attenuation.',
    payloadPreview: 'grant_type=urn:ietf:params:oauth:grant-type:token-exchange&audience=CID_MCP_Y',
  },
  {
    step: 14,
    phaseId: 'mcp-token-exchange',
    groupKind: 'loop',
    from: 'KC',
    to: 'AGW',
    arrowType: 'async',
    title: 'Return short-lived delegated JWT (sub + act + aud CID MCP Y)',
    detail: 'Keycloak returns a short-lived delegated JWT encoding both the user (sub) and acting agent (act) scoped exclusively to CID MCP Y.',
    securityNote: 'Prevents confused-deputy privilege escalation if a downstream MCP server is compromised.',
    payloadPreview: '{ "sub": "user-4821", "act": { "sub": "CID_AI_X" }, "aud": "CID_MCP_Y" }',
  },
  {
    step: 15,
    phaseId: 'mcp-token-exchange',
    groupKind: 'loop',
    from: 'AGW',
    to: 'MCP',
    arrowType: 'sync',
    title: 'MCP_GW checks CEL RBAC and sends stateless Streamable HTTP request',
    detail: 'MCP_GW verifies CEL authorization rules and forwards the stateless Streamable HTTP tool request with the delegated JWT.',
    securityNote: 'MCP server can verify both sub and act claims without storing any session state.',
  },
  {
    step: 16,
    phaseId: 'mcp-token-exchange',
    groupKind: 'loop',
    from: 'MCP',
    to: 'AGW',
    arrowType: 'async',
    title: 'Return deterministic JSON tool output',
    detail: 'Stateless MCP server computes and returns deterministic JSON output immediately.',
    securityNote: 'Zero persistent session state left on the MCP pod.',
  },
  {
    step: 17,
    phaseId: 'mcp-token-exchange',
    groupKind: 'loop',
    from: 'AGW',
    to: 'Act',
    arrowType: 'async',
    title: 'Return result to Code Mode runtime',
    detail: 'Code Mode script ingests the JSON result and continues chaining subsequent MCP calls inside the same turn.',
    securityNote: 'Multi-step loops complete at programmatic speed without extra LLM inference turns.',
  },
  {
    step: 18,
    phaseId: 'a2a-handoff',
    groupKind: 'opt',
    from: 'Act',
    to: 'AGW',
    arrowType: 'sync',
    title: 'Delegate sub-task via A2A_GW',
    detail: 'Optional multi-agent collaboration: Actor routes an Agent-to-Agent (A2A) delegation request back through A2A_GW.',
    securityNote: 'Zero-trust NetworkPolicy prevents Actors from calling peer Actors directly over pod IPs.',
  },
  {
    step: 19,
    phaseId: 'a2a-handoff',
    groupKind: 'opt',
    from: 'AGW',
    to: 'Act',
    arrowType: 'async',
    title: 'Return peer Actor result',
    detail: 'A2A_GW verifies policy, dispatches to the peer Actor, and returns the verified sub-task output.',
    securityNote: 'All inter-agent hops are audited as linked OpenInference OTLP spans.',
  },
  {
    step: 20,
    phaseId: 'checkpoint-telemetry',
    from: 'Act',
    to: 'DB',
    arrowType: 'sync',
    title: 'Persist updated conversation checkpoints and EFS snapshot',
    detail: 'Actor writes updated session state and embeddings to CNPG Postgres and flushes workspace snapshot to EFS Access Point.',
    securityNote: 'Isolated to Dedicated CNPG/EFS in Option A or db_project_a/per-project AP in Option B.',
  },
  {
    step: 21,
    phaseId: 'checkpoint-telemetry',
    from: 'AGW',
    to: 'Phx',
    arrowType: 'async',
    title: 'Export async OpenInference OTLP spans via OTel Collector',
    detail: 'AgentGateway and Actors export async OTLP spans through Cluster OTel Collector to Arize Phoenix (Dedicated or proj_project_a).',
    securityNote: 'Async export keeps inference latency off the critical path while capturing full trace lineage.',
  },
  {
    step: 22,
    phaseId: 'checkpoint-telemetry',
    from: 'Act',
    to: 'AGW',
    arrowType: 'async',
    title: 'Return final verified response',
    detail: 'Actor finishes Code Mode execution and returns the synthesized final answer to A2A_GW.',
    securityNote: 'Output traverses gateway egress checks before reaching the UI.',
  },
  {
    step: 23,
    phaseId: 'checkpoint-telemetry',
    from: 'AGW',
    to: 'UI',
    arrowType: 'async',
    title: 'Stream response over session channel',
    detail: 'AgentGateway streams the verified response tokens/payload back to the authenticated Space UI session.',
    securityNote: 'End-to-end TLS termination and session binding.',
  },
  {
    step: 24,
    phaseId: 'checkpoint-telemetry',
    from: 'UI',
    to: 'U',
    arrowType: 'async',
    title: 'Render verified answer to User',
    detail: 'Space UI renders the verified response, citations, and execution summary to the Engineer or Stakeholder.',
    securityNote: 'Turn complete with full auditability in Arize Phoenix and Datadog.',
  },
];

// ============================================================================
// Section 6: Side-by-Side Comparison Matrix
// ============================================================================

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    dimension: 'Visual Highlight (Color Coding)',
    optionA: 'Amber (dedicated): UI, CNPG Postgres, Arize Phoenix, EFS PVC, AgentGateway, Agent Substrate, Toolings',
    optionB: 'Blue (shared): Shared Space UI, Shared CNPG Cluster, Shared Arize Phoenix, Shared EFS, Shared MCP Pool',
    highlight: 'shared',
  },
  {
    dimension: 'Target Project Contracts Profile',
    optionA: 'Regulated, Clean-Room, M&A, HIPAA, Fed/Defense, or contractual single-tenant residency',
    optionB: 'Standard product, engineering, research, and enterprise projects (80%+ of volume)',
  },
  {
    dimension: 'Intake & Governance Plane',
    optionA: 'AI Platform Capabilities + Legal API (Project Contracts) + AgentRegistry',
    optionB: 'AI Platform Capabilities + Legal API (Project Contracts) + AgentRegistry',
  },
  {
    dimension: 'Agent Substrate & Code Mode',
    optionA: 'Stateful Actors in Code Mode + mounted OCI Skills inside ProjectA Namespace',
    optionB: 'Stateful Actors in Code Mode + mounted OCI Skills inside ProjectA Namespace',
  },
  {
    dimension: 'MCP Tool Servers (Toolings)',
    optionA: '100% Stateless (MCPServer / RemoteMCPServer) isolated inside ProjectA Namespace',
    optionB: '100% Stateless; project-specific tools in ProjectA + generic pool in SharedPlatform',
    highlight: 'agile',
  },
  {
    dimension: 'Zero-Trust Identity & AgentGateway',
    optionA: 'Per-project AgentGateway + deny-all NetworkPolicy + Workload Identity CID AI X -> Keycloak RFC 8693 (CID MCP Y)',
    optionB: 'Per-project AgentGateway + deny-all NetworkPolicy + Workload Identity CID AI X -> Keycloak RFC 8693 (CID MCP Y)',
  },
  {
    dimension: 'Agent State & Memory (CNPG Postgres)',
    optionA: 'Dedicated CNPG Cluster pods & PVCs inside ProjectA (physical isolation + crypto-shredding)',
    optionB: 'Dedicated Database CRD + Postgres role (db_project_a) inside Shared CNPG Cluster',
    highlight: 'sovereign',
  },
  {
    dimension: 'AI Observability (Arize Phoenix + OTel)',
    optionA: 'Dedicated Arize Phoenix inside ProjectA backed by Dedicated CNPG Cluster',
    optionB: 'Dedicated Phoenix Project (proj_project_a) inside Shared Arize Phoenix backed by Shared CNPG',
    highlight: 'sovereign',
  },
  {
    dimension: 'Storage (EFS) & Decommissioning',
    optionA: 'Dedicated ProjectA EFS Access Point PVC + Dedicated Postgres/Phoenix KMS crypto-shredding on contract close',
    optionB: 'Per-Project EFS Access Point PVC (on Shared EFS up to 10k APs/FS) + DB/Project archival & PVC purge on close',
  },
  {
    dimension: 'Provisioning Time & Baseline Footprint',
    optionA: '~5–8 minutes (boots dedicated Postgres HA + Phoenix + UI); ~4–6 GiB baseline RAM per project',
    optionB: 'Sub-30 seconds (reconciles CRDs + stateless pods only); ~300–500 MiB baseline RAM per project',
    highlight: 'agile',
  },
  {
    dimension: 'How Framing Agent (Solvere) Selects It',
    optionA: 'Project Contracts compliance tag tier: sovereign selects the Sovereign Cell overlay in GitHub / ArgoCD',
    optionB: 'Project Contracts compliance tag tier: standard selects the Agile Multi-Tenant overlay in GitHub / ArgoCD',
  },
];
