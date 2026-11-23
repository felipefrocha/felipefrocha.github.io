import type { SemanticNodeClass } from './projectAArchitectureData';

export interface BoxRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SubgraphContainerBox extends BoxRect {
  id: string;
  title: string;
  subtitle?: string;
  tone: SemanticNodeClass | 'neutral';
  dashedPerimeter?: boolean;
  perimeterBadge?: string;
}

export interface EdgeRoute {
  d: string;
  labelX: number;
  labelY: number;
  protocolNote?: string;
}

export interface TopologyCanvasLayout {
  width: number;
  height: number;
  containers: SubgraphContainerBox[];
  nodes: Record<string, BoxRect>;
  edgeRoutes: Record<string, EdgeRoute>;
}

export const CONTROL_PLANE_LAYOUT: TopologyCanvasLayout = {
  width: 1160,
  height: 640,
  containers: [
    {
      id: 'Intake',
      title: '1. Project Intake and AI Framing',
      subtitle: 'Contract evaluation & signed OCI selection',
      tone: 'control',
      x: 230,
      y: 20,
      w: 325,
      h: 600,
    },
    {
      id: 'GitOps',
      title: '2. Signed GitOps Provisioning',
      subtitle: 'Terraform Day-0/1 + ArgoCD Day-2',
      tone: 'control',
      x: 595,
      y: 50,
      w: 255,
      h: 530,
    },
    {
      id: 'Tiers',
      title: '3. Provisioned Runtime (ProjectA)',
      subtitle: 'Complementary deployment overlays',
      tone: 'neutral',
      x: 890,
      y: 110,
      w: 250,
      h: 410,
    },
  ],
  nodes: {
    User: { x: 20, y: 206, w: 170, h: 78 },
    Legal: { x: 265, y: 74, w: 265, h: 80 },
    Market: { x: 265, y: 204, w: 265, h: 84 },
    MAI: { x: 265, y: 344, w: 265, h: 84 },
    Reg: { x: 265, y: 492, w: 265, h: 80 },
    GH: { x: 615, y: 120, w: 215, h: 86 },
    Argo: { x: 615, y: 292, w: 215, h: 84 },
    TF: { x: 615, y: 458, w: 215, h: 84 },
    TierA: { x: 910, y: 184, w: 210, h: 112 },
    TierB: { x: 910, y: 348, w: 210, h: 112 },
  },
  edgeRoutes: {
    'cp-1': {
      d: 'M 190 245 L 265 245.5',
      labelX: 227,
      labelY: 228,
      protocolNote: 'HTTPS Workbench Request & URL Provisioning',
    },
    'cp-2': {
      d: 'M 397 154 L 397.5 204',
      labelX: 405,
      labelY: 180,
      protocolNote: 'Project Contracts, Residency Flags & Entitlements',
    },
    'cp-3': {
      d: 'M 265 532 C 242 532, 242 266, 265 266',
      labelX: 244,
      labelY: 404,
      protocolNote: 'Signed OCI Skill Bundles & Typed MCP Specs',
    },
    'cp-4': {
      d: 'M 397 288 L 397.5 344',
      labelX: 405,
      labelY: 318,
      protocolNote: 'Solvere maps Project Contracts -> Pinned Resources',
    },
    'cp-5': {
      d: 'M 530 386 C 572 386, 565 184, 615 184',
      labelX: 572,
      labelY: 286,
      protocolNote: 'Commits Selected Tier Overlay (sovereign | standard)',
    },
    'cp-6': {
      d: 'M 530 236 C 570 236, 575 150, 615 150',
      labelX: 572,
      labelY: 170,
      protocolNote: 'Triggers GitHub Workbench Pipeline',
    },
    'cp-7': {
      d: 'M 722 458 L 722.5 376',
      labelX: 730,
      labelY: 420,
      protocolNote: 'Day-0/1 EKS, KMS & EFS Platform Metadata',
    },
    'cp-8': {
      d: 'M 722 206 L 722.5 292',
      labelX: 730,
      labelY: 252,
      protocolNote: 'ArgoCD Reconciles Signed Git Overlays',
    },
    'cp-9': {
      d: 'M 830 322 C 870 322, 868 240, 910 240',
      labelX: 870,
      labelY: 255,
      protocolNote: 'Project Contract tag: tier: sovereign -> Dedicated Cell',
    },
    'cp-10': {
      d: 'M 830 346 C 870 346, 868 404, 910 404',
      labelX: 870,
      labelY: 392,
      protocolNote: 'Project Contract tag: tier: standard -> Agile Namespace',
    },
  },
};

export const OPTION_A_LAYOUT: TopologyCanvasLayout = {
  width: 1200,
  height: 820,
  containers: [
    {
      id: 'ClusterAuth',
      title: 'Cluster Identity and CRD Operator',
      tone: 'shared',
      x: 455,
      y: 16,
      w: 470,
      h: 136,
    },
    {
      id: 'SovereignNS',
      title: 'ProjectA Namespace (Sovereign Clean-Room Cell)',
      subtitle: 'Physical single-tenant isolation for data, UI, traces & compute',
      tone: 'dedicated',
      x: 20,
      y: 184,
      w: 1160,
      h: 472,
    },
    {
      id: 'AGW',
      title: 'Dedicated AgentGateway Proxy',
      subtitle: 'CEL RBAC + PromptGuard',
      tone: 'gateway',
      x: 252,
      y: 236,
      w: 238,
      h: 396,
    },
    {
      id: 'SubstrateNet',
      title: 'Kagent Agent Substrate',
      subtitle: 'NetworkPolicy: Deny Direct Egress',
      tone: 'substrate',
      dashedPerimeter: true,
      perimeterBadge: 'Zero-Trust Perimeter',
      x: 526,
      y: 236,
      w: 334,
      h: 248,
    },
    {
      id: 'ClusterObs',
      title: 'Cluster Telemetry Pipeline',
      tone: 'shared',
      x: 20,
      y: 684,
      w: 1160,
      h: 118,
    },
  ],
  nodes: {
    User: { x: 20, y: 54, w: 192, h: 72 },
    Okta: { x: 240, y: 54, w: 185, h: 72 },
    KC: { x: 475, y: 58, w: 210, h: 78 },
    KCtrl: { x: 705, y: 58, w: 200, h: 78 },
    LLM: { x: 965, y: 54, w: 215, h: 72 },

    UI: { x: 42, y: 274, w: 176, h: 86 },
    A2A_GW: { x: 270, y: 288, w: 202, h: 78 },
    LLM_GW: { x: 270, y: 396, w: 202, h: 78 },
    MCP_GW: { x: 270, y: 506, w: 202, h: 84 },

    Actors: { x: 546, y: 288, w: 294, h: 82 },
    Skills: { x: 546, y: 390, w: 294, h: 74 },
    Tools: { x: 526, y: 516, w: 334, h: 84 },

    EFS: { x: 904, y: 248, w: 254, h: 84 },
    CNPG: { x: 904, y: 374, w: 254, h: 88 },
    Phoenix: { x: 904, y: 514, w: 254, h: 88 },

    OTel: { x: 310, y: 724, w: 260, h: 64 },
    DD: { x: 670, y: 724, w: 270, h: 64 },
  },
  edgeRoutes: {
    'oa-1': {
      d: 'M 116 126 L 116.5 274',
      labelX: 124,
      labelY: 168,
      protocolNote: 'HTTPS session to Dedicated ProjectA Space UI',
    },
    'oa-2': {
      d: 'M 218 286 C 235 286, 235 162, 535 136',
      labelX: 345,
      labelY: 166,
      protocolNote: 'OIDC Authorization Code + PKCE Login',
    },
    'oa-3': {
      d: 'M 475 94 L 425 94.5',
      labelX: 450,
      labelY: 82,
      protocolNote: 'Keycloak federates identity with Okta Enterprise IdP',
    },
    'oa-4': {
      d: 'M 218 324 L 270 324.5',
      labelX: 244,
      labelY: 312,
      protocolNote: 'Bearer JWT (subject_token) -> A2A_GW',
    },
    'oa-5': {
      d: 'M 565 136 C 565 170, 232 170, 232 548 L 270 548',
      labelX: 240,
      labelY: 468,
      protocolNote: 'RFC 8693 OBO Token Exchange (subject_token + actor_token CID AI X -> aud CID MCP Y)',
    },
    'oa-6': {
      d: 'M 805 136 C 805 190, 720 190, 720 288',
      labelX: 760,
      labelY: 168,
      protocolNote: 'Reconciles AgentTemplate, Harness & ModelConfig CRDs',
    },
    'oa-7': {
      d: 'M 472 322 L 546 322.5',
      labelX: 509,
      labelY: 308,
      protocolNote: 'Validated Turn Dispatch & A2A Handoff',
    },
    'oa-8': {
      d: 'M 693 390 L 693.5 370',
      labelX: 702,
      labelY: 382,
      protocolNote: 'Immutable OCI Skill bundles mounted read-only in sandbox',
    },
    'oa-9': {
      d: 'M 472 424 C 508 424, 508 342, 546 342',
      labelX: 509,
      labelY: 386,
      protocolNote: 'Code Mode LLM synthesis call + SA OIDC JWT (CID AI X)',
    },
    'oa-10': {
      d: 'M 472 448 C 510 448, 505 212, 1072 126',
      labelX: 880,
      labelY: 168,
      protocolNote: 'PromptGuard check + gateway credential injection to Enterprise LLM',
    },
    'oa-11': {
      d: 'M 472 530 C 514 530, 514 358, 546 358',
      labelX: 508,
      labelY: 465,
      protocolNote: 'Code Mode MCP call + SA JWT (actor_token CID AI X)',
    },
    'oa-12': {
      d: 'M 472 560 L 526 560.5',
      labelX: 499,
      labelY: 548,
      protocolNote: 'Stateless Streamable HTTP + Scoped Delegated JWT (aud: CID MCP Y)',
    },
    'oa-13': {
      d: 'M 840 310 L 904 290',
      labelX: 874,
      labelY: 288,
      protocolNote: 'Workspace code files & suspend/resume snapshots',
    },
    'oa-14': {
      d: 'M 840 350 L 904 410',
      labelX: 874,
      labelY: 384,
      protocolNote: 'Actor checkpoints, sessions & pgvector memory',
    },
    'oa-15': {
      d: 'M 370 366 C 370 672, 390 672, 390 724',
      labelX: 332,
      labelY: 668,
      protocolNote: 'Async OpenInference OTLP AI Spans',
    },
    'oa-16': {
      d: 'M 546 364 C 512 364, 512 672, 460 724',
      labelX: 490,
      labelY: 668,
      protocolNote: 'Actor OTLP spans & execution logs',
    },
    'oa-17': {
      d: 'M 570 756 C 855 756, 875 640, 1030 602',
      labelX: 840,
      labelY: 668,
      protocolNote: 'OpenInference traces routed to Dedicated Arize Phoenix',
    },
    'oa-18': {
      d: 'M 1031 514 L 1031.5 462',
      labelX: 1040,
      labelY: 490,
      protocolNote: 'Dedicated Trace DB backing store (CNPG Postgres)',
    },
    'oa-19': {
      d: 'M 570 756 L 670 756.5',
      labelX: 620,
      labelY: 742,
      protocolNote: 'Node metrics & logs tagged kube_namespace: project-a',
    },
  },
};

export const OPTION_B_LAYOUT: TopologyCanvasLayout = {
  width: 1200,
  height: 870,
  containers: [
    {
      id: 'Edge',
      title: 'Shared Platform: Entry and Identity (Okta-Federated)',
      subtitle: 'Shared multi-tenant UI, Keycloak HA & Kagent 1.0 Operator',
      tone: 'shared',
      x: 20,
      y: 110,
      w: 1160,
      h: 132,
    },
    {
      id: 'AgileNS',
      title: 'ProjectA Namespace (Lightweight Compute and Policy Cell)',
      subtitle: 'Sub-30s compute cell (~300–500 MiB RAM) with full zero-trust posture',
      tone: 'substrate',
      x: 20,
      y: 268,
      w: 1160,
      h: 344,
    },
    {
      id: 'AGW',
      title: 'Per-Project AgentGateway Proxy',
      subtitle: 'CEL RBAC + PromptGuard',
      tone: 'gateway',
      x: 42,
      y: 316,
      w: 274,
      h: 278,
    },
    {
      id: 'SubstrateNet',
      title: 'Kagent Agent Substrate',
      subtitle: 'NetworkPolicy: Deny Direct Egress',
      tone: 'substrate',
      dashedPerimeter: true,
      perimeterBadge: 'Zero-Trust Perimeter',
      x: 356,
      y: 316,
      w: 444,
      h: 208,
    },
    {
      id: 'SharedBackends',
      title: 'Shared Platform: State, MCP Pool and Observability',
      subtitle: 'Logically isolated multi-tenant backends (db_project_a, proj_project_a, Dynamic EFS APs)',
      tone: 'shared',
      x: 20,
      y: 636,
      w: 1160,
      h: 218,
    },
  ],
  nodes: {
    User: { x: 20, y: 20, w: 220, h: 68 },
    Okta: { x: 480, y: 20, w: 220, h: 68 },
    LLM: { x: 960, y: 20, w: 220, h: 68 },

    UI: { x: 42, y: 158, w: 274, h: 68 },
    KC: { x: 425, y: 158, w: 330, h: 68 },
    KCtrl: { x: 865, y: 158, w: 295, h: 68 },

    A2A_GW: { x: 58, y: 360, w: 242, h: 64 },
    LLM_GW: { x: 58, y: 436, w: 242, h: 64 },
    MCP_GW: { x: 58, y: 512, w: 242, h: 68 },

    Actors: { x: 376, y: 360, w: 404, h: 72 },
    Skills: { x: 376, y: 444, w: 404, h: 66 },
    CaseTools: { x: 356, y: 536, w: 444, h: 62 },
    EFS_PVC: { x: 842, y: 364, w: 316, h: 90 },

    SharedTools: { x: 42, y: 694, w: 274, h: 68 },
    SharedCNPG: { x: 356, y: 694, w: 274, h: 68 },
    OTel: { x: 660, y: 694, w: 230, h: 68 },
    SharedEFS: { x: 920, y: 694, w: 238, h: 68 },
    SharedPhoenix: { x: 356, y: 778, w: 274, h: 62 },
    DD: { x: 660, y: 778, w: 230, h: 62 },
  },
  edgeRoutes: {
    'ob-1': {
      d: 'M 130 88 L 130.5 158',
      labelX: 138,
      labelY: 102,
      protocolNote: 'HTTPS session to Shared Space UI (/projects/ProjectA)',
    },
    'ob-2': {
      d: 'M 316 192 L 425 192.5',
      labelX: 370,
      labelY: 180,
      protocolNote: 'OIDC Authorization Code + PKCE Login',
    },
    'ob-3': {
      d: 'M 590 158 L 590.5 88',
      labelX: 598,
      labelY: 102,
      protocolNote: 'Keycloak HA federates with Okta Enterprise IdP',
    },
    'ob-4': {
      d: 'M 179 226 L 179.5 360',
      labelX: 186,
      labelY: 256,
      protocolNote: 'Bearer JWT (project: ProjectA) -> Per-Project A2A_GW',
    },
    'ob-5': {
      d: 'M 475 226 C 475 262, 34 262, 34 546 L 58 546',
      labelX: 340,
      labelY: 256,
      protocolNote: 'RFC 8693 Token Exchange with Shared Keycloak HA',
    },
    'ob-6': {
      d: 'M 1012 226 C 1012 292, 680 292, 680 360',
      labelX: 835,
      labelY: 256,
      protocolNote: 'Sub-30s CRD reconciliation (AgentTemplate / Harness)',
    },
    'ob-7': {
      d: 'M 300 392 L 376 392.5',
      labelX: 338,
      labelY: 380,
      protocolNote: 'CEL RBAC validated Turn Dispatch & A2A',
    },
    'ob-8': {
      d: 'M 578 444 L 578.5 432',
      labelX: 586,
      labelY: 438,
      protocolNote: 'Immutable OCI Skills A..N mounted in Actor sandbox',
    },
    'ob-9': {
      d: 'M 300 464 C 338 464, 338 408, 376 408',
      labelX: 338,
      labelY: 434,
      protocolNote: 'Code Mode LLM synthesis + SA OIDC JWT (CID AI X)',
    },
    'ob-10': {
      d: 'M 300 478 C 336 478, 336 254, 1070 88',
      labelX: 790,
      labelY: 256,
      protocolNote: 'PromptGuard + guarded inference to Enterprise LLMs',
    },
    'ob-11': {
      d: 'M 300 532 C 344 532, 344 420, 376 420',
      labelX: 338,
      labelY: 486,
      protocolNote: 'Code Mode MCP call + SA JWT (actor_token CID AI X)',
    },
    'ob-12': {
      d: 'M 300 562 L 356 562.5',
      labelX: 328,
      labelY: 550,
      protocolNote: 'Project-specific Stateless MCP via scoped CID MCP Y JWT',
    },
    'ob-13': {
      d: 'M 179 580 L 179.5 694',
      labelX: 186,
      labelY: 626,
      protocolNote: 'Cross-project Shared Stateless MCP Pool (scoped CID MCP Y JWT)',
    },
    'ob-14': {
      d: 'M 780 396 L 842 406',
      labelX: 811,
      labelY: 388,
      protocolNote: 'Workspace snapshots & code files to Per-Project EFS PVC',
    },
    'ob-15': {
      d: 'M 1039 454 L 1039.5 694',
      labelX: 1046,
      labelY: 626,
      protocolNote: 'Dynamic Access Point backed by Shared EFS (up to 10k APs/FS)',
    },
    'ob-16': {
      d: 'M 520 432 C 520 618, 493 618, 493 694',
      labelX: 500,
      labelY: 626,
      protocolNote: 'TLS + Isolated Postgres role (db_project_a)',
    },
    'ob-17': {
      d: 'M 250 424 C 250 622, 710 622, 710 694',
      labelX: 608,
      labelY: 626,
      protocolNote: 'Gateway OTLP spans -> Shared OTel Collector',
    },
    'ob-18': {
      d: 'M 720 432 C 720 600, 775 600, 775 694',
      labelX: 765,
      labelY: 626,
      protocolNote: 'Actor OTLP spans & logs -> Shared OTel Collector',
    },
    'ob-19': {
      d: 'M 695 762 L 630 805',
      labelX: 646,
      labelY: 794,
      protocolNote: 'Project-tagged traces -> Shared Arize Phoenix (proj_project_a)',
    },
    'ob-20': {
      d: 'M 493 778 L 493.5 762',
      labelX: 502,
      labelY: 771,
      protocolNote: 'Shared Trace DB role inside Shared CNPG HA',
    },
    'ob-21': {
      d: 'M 775 762 L 775.5 778',
      labelX: 784,
      labelY: 771,
      protocolNote: 'Metrics & logs tagged kube_namespace: project-a',
    },
  },
};
