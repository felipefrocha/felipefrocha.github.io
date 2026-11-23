// Auto-generated & typed from /tmp/kubecon2026/index.html
export type EvidenceBadgeKey =
  | "verified"
  | "updated"
  | "vendor"
  | "partial"
  | "talk"
  | "illustrative"
  | "signal";

export type VerdictKey = "C" | "U" | "S" | "P" | "N";

export type ShiftSlug =
  | "scheduling"
  | "trust"
  | "cost"
  | "recovery"
  | "standards"
  | "context";

export type KubeConVizConfig =
  | { type: "waffle"; n: number }
  | { type: "range"; lo: number; hi: number }
  | { type: "version"; top: string; chips: string[] }
  | { type: "switch"; on: string; off: string }
  | { type: "stream" }
  | { type: "ticks"; n: number; of: number }
  | { type: "bars"; a: number; b: number; la: string; lb: string };

export interface KubeConChipRef {
  t: string;
  s: number[];
}

export interface KubeConReading {
  value: string;
  label: string;
  badge: EvidenceBadgeKey;
  bq?: string;
  chip: KubeConChipRef;
  stage?: boolean;
  viz?: KubeConVizConfig;
}

export interface KubeConArgument {
  lead: string;
  text: string;
  notes: string[];
}

export interface KubeConTrend {
  slug: "scheduling" | "trust" | "cost" | "recovery" | "standards";
  short: string;
  q: string;
  bridge?: boolean;
  intro?: string;
  title: string;
  strip: EvidenceBadgeKey[];
  from: string;
  to: string;
  gloss?: string;
  args: KubeConArgument[];
  readings: KubeConReading[];
  soWhatStage: string;
  soWhat: string;
  watch: string;
  next?: string;
}

export interface KubeConWhyBlock {
  label: string;
  text: string;
  stat?: {
    value: string;
    text: string;
    badge: EvidenceBadgeKey;
    chip: KubeConChipRef;
    viz?: KubeConVizConfig;
  };
  lines?: [string, EvidenceBadgeKey][];
  gloss?: string;
  support?: string;
  teaser?: string;
}

export interface KubeConMondayMove {
  title: string;
  owner: string;
  step: string;
  trend: "scheduling" | "trust" | "cost" | "recovery" | "standards";
}

export interface KubeConFolder {
  slug: string;
  name: string;
  trend: ShiftSlug;
  also: ShiftSlug[];
  mixed: boolean;
  adds: string;
  v: [number, number, number, number, number];
}

export interface KubeConSource {
  n: number;
  title: string;
  publisher: string;
  date: string;
  urls: string[];
  nourl: string;
  type: string;
  d: number;
}

export interface KubeConPresenterNote {
  step: number;
  slide: string;
  say: string;
  cue: string;
  time: string;
  clock: string;
}

export interface KubeConContent {
  meta: {
    title: string;
    ogTitle: string;
    ogDesc: string;
    ogAlt: string;
    shortTitle: string;
    shortTitleSub: string;
    nav: [string, string][];
    footer: string;
  };
  hero: {
    eyebrow: string;
    kicker: string;
    h1: string;
    subtitle: string;
    byline: string;
    checked: string;
    tickCaption: string;
  };
  guess: {
    q: string;
    options: string[];
    footer: string;
    big: string;
    lines: string[];
    line3: string;
    badge: EvidenceBadgeKey;
    bq: string;
    chip: string;
  };
  answer: {
    rail: string;
    governing: string;
    split: string;
    stageLine: string;
    contrarian: string;
  };
  why: {
    title: string;
    blocks: KubeConWhyBlock[];
  };
  trends: KubeConTrend[];
  bridge: KubeConTrend;
  contrarian: {
    live1: string;
    live2: string;
    title: string;
    toggles: string[];
    soWhat: string;
    evidence: [string, EvidenceBadgeKey, string, KubeConChipRef][];
    counterTitle: string;
    counter: string[];
    watchTitle: string;
    watch: string[];
  };
  monday: {
    title: string;
    startStage: string[];
    horizons: [string, KubeConMondayMove[]][];
    stopHeading: string;
    stop: string[];
    cto: string;
    ctoLabel: string;
    ctoDetail: [string, string][];
    whereToStart: string[];
  };
  confidence: {
    title: string;
    families: [string, VerdictKey[], string][];
    verdicts: Record<VerdictKey, number>;
    aria: string;
    note: string;
    solid: string[];
    open: string[];
    notSaying: string[];
    method: string[];
    methodNote: string;
    legendTitle: string;
    legend: Record<EvidenceBadgeKey, string>;
  };
  map: {
    title: string;
    caption: string;
    filterCaption: string;
    contextLabel: string;
    mixedNote: string;
    verdictWords: [string, string, string, string];
    folders: KubeConFolder[];
    verdictTotals: Record<VerdictKey, number>;
  };
  share: {
    stage1: string;
    stage2: string;
    h2: string;
    pitch: string;
    post: string;
  };
  sources: KubeConSource[];
  notes: KubeConPresenterNote[];
  og: {
    headline: string;
    hook: string;
    byline: string;
  };
  shareCfg: {
    url: string;
    display: string;
    qr: string;
  };
}

export const BADGE_LABELS: Record<EvidenceBadgeKey, string> = {
  verified: "Verified",
  updated: "Updated",
  vendor: "Vendor-stated",
  partial: "Partial",
  talk: "Talk-only",
  illustrative: "Illustrative",
  signal: "Signal",
};

export const BADGE_ORDER: EvidenceBadgeKey[] = [
  "verified",
  "updated",
  "vendor",
  "partial",
  "talk",
  "illustrative",
  "signal",
];

export const VERDICT_KEYS: VerdictKey[] = ["C", "U", "S", "P", "N"];

export const ROW_SLUGS: ShiftSlug[] = [
  "scheduling",
  "trust",
  "cost",
  "recovery",
  "standards",
  "context",
];

export type ProseToken =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "code"; value: string }
  | { type: "badge"; badge: EvidenceBadgeKey; qualifier?: string }
  | { type: "chip"; sources: number[]; text?: string };

export function parseFormattedProse(input: string): ProseToken[] {
  if (!input) return [];
  const tokens: ProseToken[] = [];
  const pattern =
    /\{\{b:([a-z]+)(?:\|([^}]*))?\}\}|\{\{c:([0-9,]+)(?:\|([^}]*))?\}\}|\*\*(.+?)\*\*|`([^`]+)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: input.slice(lastIndex, match.index) });
    }
    if (match[1]) {
      tokens.push({
        type: "badge",
        badge: match[1] as EvidenceBadgeKey,
        qualifier: match[2] || undefined,
      });
    } else if (match[3]) {
      tokens.push({
        type: "chip",
        sources: match[3]
          .split(",")
          .map((n) => Number(n.trim()))
          .filter((n) => !Number.isNaN(n)),
        text: match[4] || undefined,
      });
    } else if (match[5]) {
      tokens.push({ type: "bold", value: match[5] });
    } else if (match[6]) {
      tokens.push({ type: "code", value: match[6] });
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < input.length) {
    tokens.push({ type: "text", value: input.slice(lastIndex) });
  }
  return tokens;
}

export function stripProseFormatting(input: string): string {
  return String(input || "")
    .replace(/\{\{[^}]*\}\}/g, "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/\s+([.,;])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export const kubecon2026Data: KubeConContent = {
  "meta": {
    "title": "AI moved onto Kubernetes. Then it outgrew the pod. | KubeCon NA 2026 trends",
    "ogTitle": "AI moved onto Kubernetes. Then it outgrew the pod.",
    "ogDesc": "Four shifts from 30 session folders at KubeCon NA 2026: scheduling, trust, cost, recovery. 458 claims checked against public sources, every number labelled.",
    "ogAlt": "AI moved onto Kubernetes. Then it outgrew the pod. Four shifts from KubeCon NA 2026.",
    "shortTitle": "KubeCon 26",
    "shortTitleSub": "What changed",
    "nav": [
      [
        "answer",
        "Answer"
      ],
      [
        "why-now",
        "Why now"
      ],
      [
        "trend-scheduling",
        "Scheduling"
      ],
      [
        "trend-trust",
        "Trust"
      ],
      [
        "trend-cost",
        "Cost"
      ],
      [
        "trend-recovery",
        "Recovery"
      ],
      [
        "standards",
        "Standards"
      ],
      [
        "monday",
        "Monday"
      ],
      [
        "confidence",
        "Confidence"
      ]
    ],
    "footer": "Views my own. Built from 30 session folders and public sources checked on 17 Nov 2026."
  },
  "hero": {
    "eyebrow": "KubeCon + CloudNativeCon North America 2026 · Salt Lake City · 9–12 Nov",
    "kicker": "The trends shaping the cloud-native ecosystem",
    "h1": "AI moved onto Kubernetes. Then it outgrew the pod.",
    "subtitle": "Most teams hosting AI models use Kubernetes. But idle agents and frontier-scale jobs no longer fit the pod. Value moves above it, or platform teams become GPU landlords.",
    "byline": "Felipe · Technology leader building AI platforms · Views my own",
    "checked": "Claims checked against public sources on 17 Nov 2026.",
    "tickCaption": "30 session folders from KubeCon week, sorted into four shifts and one bridge."
  },
  "guess": {
    "q": "A week after KubeCon, what share of its claims checked out exactly as presented?",
    "options": [
      "About 75%",
      "About 50%",
      "About 25%",
      "Under 10%"
    ],
    "footer": "Hands up for your guess.",
    "big": "24%",
    "lines": [
      "108 of 458 claims checked out exactly as presented a week later.",
      "99 were corrected or overtaken. 251 could not be fully confirmed."
    ],
    "line3": "Not confirmed is not the same as false.",
    "badge": "verified",
    "bq": "our count",
    "chip": "[internal] checks of 30 folders · 17 Nov 2026"
  },
  "answer": {
    "rail": "The answer",
    "governing": "Most teams that host AI models use Kubernetes. But AI's two extremes, swarms of idle agents and frontier-scale jobs, no longer fit the pod. Value moves to four promises above it: scheduling, trust, cost and recovery. Two foundations now write the rules for all four. Miss this shift, and the platform team becomes a GPU landlord: it rents GPUs to other teams' agents and has no say in how they run.",
    "split": "How we split it: a platform makes four promises to every AI workload (what runs, what it may touch, what it costs, how it recovers). A fifth question sits above them: who writes the rules.",
    "stageLine": "Value moves above the pod. Four promises, one set of rules.",
    "contrarian": "Plus one uncomfortable finding: the human approval gate is becoming a setting."
  },
  "why": {
    "title": "Why now: in 2026 the workloads and the agent protocol both changed under Kubernetes.",
    "blocks": [
      {
        "label": "Situation",
        "text": "Two in three organisations that host AI models already run inference on Kubernetes.",
        "stat": {
          "value": "66%",
          "text": "of organisations hosting generative AI models use Kubernetes for some or all inference.",
          "badge": "verified",
          "chip": {
            "t": "[web] cncf.io · 20 Jan 2026 (2025 survey)",
            "s": [
              1
            ]
          },
          "viz": {
            "type": "waffle",
            "n": 66
          }
        },
        "support": "It is CNCF's survey of its own community, and it counts only organisations that host models. Certified AI-conformant platforms grew from 18 at launch to 40 by November 2026. That figure counts vendor certifications, not adoption (talk said 42). {{b:updated}} {{c:2,3|[web] cncf.io · 10 Nov 2026}}"
      },
      {
        "label": "Complication",
        "text": "New workloads break the pod's assumptions, and the agent protocol changed mid-year.",
        "lines": [
          [
            "Google: agents sit idle most of a session.",
            "vendor"
          ],
          [
            "Google: one control plane for up to a million chips.",
            "vendor"
          ],
          [
            "MCP, the agent tool protocol, went stateless in July.",
            "verified"
          ]
        ],
        "gloss": "MCP (Model Context Protocol) is the protocol agents use to call tools.",
        "support": "The million-chip figure is Google's stated ceiling for a gated product in private GA. It is not a job size. The MCP rewrite landed on 28 July 2026, months before the talks. {{c:6|[web] opensource.googleblog.com · 5 Nov 2026}} {{c:5|[web] cloud.google.com · 22 Apr 2026}} {{c:24|[web] modelcontextprotocol.io · 28 Jul 2026}}"
      },
      {
        "label": "Question",
        "text": "What must platform teams build above the pod, and what can they stop building, to avoid becoming GPU landlords?",
        "gloss": "GPU landlord: a platform team that rents GPUs to other teams' agents and has no say in how they run.",
        "teaser": "The answer in four shifts"
      }
    ]
  },
  "trends": [
    {
      "slug": "scheduling",
      "short": "Scheduling",
      "q": "What runs, and at what size?",
      "title": "AI outgrows the pod at both ends: platforms now pause idle agents and schedule giant jobs as groups.",
      "strip": [
        "verified",
        "vendor",
        "vendor",
        "vendor"
      ],
      "from": "One pod per workload, one Node per machine",
      "to": "Paused agents, pod groups, Kubernetes off the hot path",
      "gloss": "The hot path is the per-request critical path.",
      "args": [
        {
          "lead": "Idle agents are the small end, and pausing them creates the density.",
          "text": "Google says agents sit idle most of a session. {{c:6}} Agent Substrate snapshots idle agents to storage and resumes them on request. {{c:6}} Published resume figures range from 284 ms (a demo) to under a second. {{c:6}} {{c:19}} kagent 1.0 replaced one Deployment per agent with actors on shared warm pods. {{c:9}} Upstream adds its own counterpart: HPA scale-to-zero reached beta in Kubernetes 1.37. {{c:13}}",
          "notes": [
            "Concentration note: kagent 1.0 runs on Agent Substrate, so those two items are one project family, not two independent signals. Other suppliers ship the same idea: Google announced GKE Agent Sandbox on 20 May 2026, reported as GA. {{b:partial}} {{c:7}}"
          ]
        },
        {
          "lead": "At the large end, Kubernetes scales by subtraction.",
          "text": "In Google's GKE Hypercluster, the machines that run the work are not Node objects. They run no kubelet (the agent on every node) and send no API-server traffic. {{c:4}} Google states a ceiling of one million chips under one control plane, in private GA. {{c:5}} Its own docs say Hypercluster is not meant for most production AI/ML workloads. {{c:4}}",
          "notes": [
            "Provenance note: the Hypercluster folder matches a Google Cloud Next '26 session, not a confirmed KubeCon talk. At KubeCon, I picked a session on a kubelet-less control plane for frontier AI {{b:signal}} {{c:53}}."
          ]
        },
        {
          "lead": "Upstream is moving the scheduling unit from the pod to the group.",
          "text": "The Workload and PodGroup APIs schedule a job's pods together (gang scheduling). They reached beta in Kubernetes 1.37. {{c:11}} Many Dynamic Resource Allocation APIs, which make GPUs API objects, reached GA in 1.34. {{c:12}}",
          "notes": [
            "{{b:signal}} \"The Scheduling Stack\" panel (Anthropic, Anyscale, Google, CERN) framed workload-aware scheduling as moving beyond the pod. {{c:53}}"
          ]
        }
      ],
      "readings": [
        {
          "value": "1.37",
          "label": "Workload and PodGroup APIs reach beta: a job's pods schedule together",
          "badge": "verified",
          "chip": {
            "t": "[web] kubernetes.io · 8 Sep 2026",
            "s": [
              11
            ]
          },
          "stage": true,
          "viz": {
            "type": "version",
            "top": "Kubernetes",
            "chips": [
              "Workload API",
              "PodGroup API"
            ]
          }
        },
        {
          "value": "1,000,000 chips",
          "label": "One Hypercluster control plane: Google's stated ceiling, private GA, not for most production",
          "badge": "vendor",
          "chip": {
            "t": "[web] cloud.google.com · 22 Apr 2026",
            "s": [
              5,
              4
            ]
          }
        },
        {
          "value": "< 500 ms",
          "label": "Resume time for a paused agent, per Google; other sources say 284 ms to 1 s",
          "badge": "vendor",
          "chip": {
            "t": "[web] opensource.googleblog.com · 5 Nov 2026",
            "s": [
              6,
              19
            ]
          }
        },
        {
          "value": "GA",
          "label": "Solo.io's enterprise kagent and Agent Substrate, 10 Nov 2026, with two named production customers",
          "badge": "vendor",
          "chip": {
            "t": "[web] solo.io · 10 Nov 2026",
            "s": [
              10
            ]
          }
        }
      ],
      "soWhatStage": "Stop pricing agents by the pod. Plan in active versus paused agents, and in pod groups.",
      "soWhat": "Capacity plans, quotas and chargeback keyed to pods or Nodes will misprice both agents and frontier jobs. Plan in active versus paused agents and in pod groups. Try the Workload API or Kueue-style queueing before you write a custom scheduler. Keep high-churn agent lifecycles off the Kubernetes API's hot path.",
      "watch": "Does the Workload API reach GA, and does Google drop the \"not for most production\" caveat on Hypercluster? If both happen, the post-pod model goes mainstream.",
      "next": "Trust"
    },
    {
      "slug": "trust",
      "short": "Trust",
      "q": "What may it touch?",
      "title": "Agent sandboxes are now a product category; the risk has moved to defaults that log instead of block.",
      "strip": [
        "verified",
        "verified",
        "updated",
        "verified"
      ],
      "from": "Trust the model; give each app its secrets",
      "to": "Default-deny sandbox, no secrets, identity-scoped gateway",
      "gloss": "Default-deny means no outbound traffic unless a policy allows it.",
      "args": [
        {
          "lead": "The model is not the boundary.",
          "text": "In a 2025 benchmark of 20 agents on 45 real MCP servers, tool poisoning succeeded up to 72.8% of the time (61.8–72.8% for the models one later paper lists). Tool poisoning hides malicious instructions in tool descriptions. No agent refused poisoned tool text more than 3% of the time. It is one benchmark on that year's models, so read it as direction, not size. {{b:partial}} {{c:21|[web] arxiv.org · 2025, v2 Sep 2026}}",
          "notes": []
        },
        {
          "lead": "Several vendors now ship or preview agent sandboxes.",
          "text": "Google announced GKE Agent Sandbox on 20 May 2026, reported as GA. {{b:partial}} {{c:7}} Red Hat shipped OpenShift 5 as GA on 9 Nov, with its agent sandbox in tech preview. {{c:17}} Akamai previewed a WebAssembly agent sandbox, deny-by-default outbound, on 10 Nov. {{c:18}} (WebAssembly is a lightweight sandbox.) Solo.io's enterprise Agent Substrate and kagent reached GA the same day. {{c:10}} The target pattern, as Agent Substrate documents it: default-deny egress, an agent that holds no secrets, and a gateway that injects keys on approved calls. {{c:19}} Akamai's preview also denies outbound traffic by default. NVIDIA OpenShell does not, as the next point shows.",
          "notes": [
            "Honesty note: some of these may share the kubernetes-sigs Agent Sandbox lineage. We have not checked, so count them as products, not as independent inventions."
          ]
        },
        {
          "lead": "The exposure now sits in defaults and identity seams.",
          "text": "NVIDIA OpenShell's network enforcement defaults to \"audit\", which logs a request and then allows it. {{c:15}} MCP's current spec (July 2026) requires servers to accept only tokens issued for them, and bans passing a client's token through (see Standards). {{c:23}} Envoy 1.40's MCP router stops forwarding the client's authorization header by default {{b:partial}} {{c:26}}.",
          "notes": [
            "{{b:signal}} \"The Seams Are the Trap\" builds agent identity, egress control, signed events and audit from CNCF parts teams already run. {{c:53}}"
          ]
        },
        {
          "lead": "Supply chain is part of the boundary.",
          "text": "Models invent package names that attackers can then register. CSA relays an earlier USENIX study: 21.7% of packages from open models were invented, against 5.2% from commercial models. CSA reports no mass exploitation yet. {{c:22}}",
          "notes": []
        }
      ],
      "readings": [
        {
          "value": "audit",
          "label": "NVIDIA OpenShell's default network mode: it logs a request, then allows it",
          "badge": "verified",
          "chip": {
            "t": "[web] docs.nvidia.com · undated",
            "s": [
              15
            ]
          },
          "stage": true,
          "viz": {
            "type": "switch",
            "on": "audit",
            "off": "enforce"
          }
        },
        {
          "value": "74% → 9%",
          "label": "Tool-poisoning success without vs with an MCP proxy; one author's tests, not reproduced",
          "badge": "verified",
          "bq": "as published",
          "chip": {
            "t": "[web] aclanthology.org · Jul 2026",
            "s": [
              20
            ]
          }
        },
        {
          "value": "1.7 pts",
          "label": "Task completion that proxy costs: 98.5% → 96.8%. Talk said 95%",
          "badge": "updated",
          "chip": {
            "t": "[web] aclanthology.org · Jul 2026",
            "s": [
              20
            ]
          }
        },
        {
          "value": "21.7% vs 5.2%",
          "label": "Packages invented by open vs commercial models, from an earlier USENIX study",
          "badge": "verified",
          "chip": {
            "t": "[web] labs.cloudsecurityalliance.org · 3 May 2026",
            "s": [
              22
            ]
          }
        }
      ],
      "soWhatStage": "Don't build a sandbox. Buy one with neutral governance, then own the policy: enforce mode, no secrets, scoped identity.",
      "soWhat": "Do not build a sandbox. Choose one with neutral governance, and spend your engineering on the policy plane. Switch to enforce mode after a week of audit data. Allow-list egress and the packages agents may install. Give each agent its own identity, with tokens valid for one server only. The one published proxy result puts the cost of control at about 2 points of task completion. That is the author's own figure.",
      "watch": "Do sandbox projects switch their default from audit to enforce? Does an independent team reproduce MCP-proxy results? A yes to either means the trust market has matured.",
      "next": "Cost"
    },
    {
      "slug": "cost",
      "short": "Cost",
      "q": "What does it consume?",
      "title": "Agent cost is architecture: what agents resend and cache sets the bill, not just the price per token.",
      "strip": [
        "vendor",
        "updated",
        "illustrative",
        "verified"
      ],
      "from": "Price per token times requests",
      "to": "Tokens times architecture: cache, defer, run code",
      "args": [
        {
          "lead": "Code beats tool lists, and three major vendors are moving their harnesses that way.",
          "text": "OpenAI's Codex turned Code Mode on by default on 13 Nov 2026, after making deferred tools the default in v0.167.0. {{c:31}} Cloudflare shipped its own codemode in July. {{c:32}} Anthropic reports the size of the effect: programmatic tool calling cut tokens 37% in one test {{c:30|[web] anthropic.com · 24 Nov 2025 (modified 18 Oct 2026)}}, and code execution with MCP cut one example from 150,000 tokens to 2,000 {{c:29|[web] anthropic.com · 4 Nov 2025}}.",
          "notes": [
            "In plain words: load tools only when needed, and let the agent write code instead of calling tools one by one."
          ]
        },
        {
          "lead": "Re-sent context dominates the bill.",
          "text": "Input grows with every turn. In one talk's 20-turn scenario at today's Opus 5.5 prices, prompt caching cuts input cost from $4.20 to $0.69, about 6x less. The default cache lives 5 minutes and refreshes on use. So agent think-time becomes a cost variable. {{b:illustrative|input tokens only, warm cache}} {{c:27,28}}",
          "notes": [
            "For scale: base input prices span 80x across one vendor's current model tiers ($0.10 to $8 per million tokens). Those tiers differ in capability, so this is context, not a like-for-like comparison. {{b:updated}} {{c:27}}"
          ]
        },
        {
          "lead": "Caching that knows the workload beats generic caching.",
          "text": "A June 2026 paper's workload-aware cache cut end-to-end latency 20% to 51% against LRU, a standard cache, across three benchmarks. {{c:33}} That is latency in a multi-agent benchmark, not a GPU result. The talk's Kubernetes result, 27.3% fewer GPU pod launches, has no public source yet {{b:talk}}.",
          "notes": []
        },
        {
          "lead": "One gateway, two jobs.",
          "text": "The identity-scoped gateway from Trust is also the natural meter. MCP's July 2026 spec made each call stateless, so meter and cache per call (see Standards).",
          "notes": []
        }
      ],
      "readings": [
        {
          "value": "37–99%",
          "label": "Fewer tokens when agents call tools through code: 37% in one Anthropic test, 99% in one Anthropic example",
          "badge": "vendor",
          "chip": {
            "t": "[web] anthropic.com · Nov 2025",
            "s": [
              29,
              30
            ]
          },
          "stage": true,
          "viz": {
            "type": "range",
            "lo": 37,
            "hi": 99
          }
        },
        {
          "value": "Default on",
          "label": "OpenAI Codex Code Mode, v0.169.0, 13 Nov 2026",
          "badge": "updated",
          "chip": {
            "t": "[web] learn.chatgpt.com · 13 Nov 2026",
            "s": [
              31
            ]
          }
        },
        {
          "value": "$4.20 → $0.69",
          "label": "One 20-turn agent session, uncached vs cached, at Opus 5.5 input prices",
          "badge": "illustrative",
          "chip": {
            "t": "[web] claude.com/pricing · fetched 17 Nov 2026",
            "s": [
              27,
              28
            ]
          },
          "viz": {
            "type": "bars",
            "a": 4.2,
            "b": 0.69,
            "la": "uncached",
            "lb": "cached"
          }
        },
        {
          "value": "20–51%",
          "label": "Lower latency than LRU caching across three benchmarks, computed from one paper's Table I",
          "badge": "verified",
          "chip": {
            "t": "[web] arxiv.org · 14 Jun 2026",
            "s": [
              33
            ]
          },
          "viz": {
            "type": "range",
            "lo": 20,
            "hi": 51
          }
        }
      ],
      "soWhatStage": "Make cost a platform default: meter each agent at one gateway, cache by default, report cost per correct outcome.",
      "soWhat": "Make cost a platform primitive, not a finance report. Put one gateway in the path that meters each agent and each task. Make tool deferral, code mode and prompt caching the defaults in your agent harness. Report cost per correct outcome, not cost per token.",
      "watch": "Do AI gateways ship per-team budget enforcement as a standard feature? Do MCP extensions such as tasks settle? If both, metering moves from the harness into the platform.",
      "next": "Recovery"
    },
    {
      "slug": "recovery",
      "short": "Recovery",
      "q": "How does it fail and recover?",
      "title": "At scale, systems fail by recovering: bound every restart and make every agent action safe to repeat.",
      "strip": [
        "updated",
        "verified",
        "updated",
        "verified"
      ],
      "from": "Restart on failure; retry until it works",
      "to": "Staggered restarts, bounded retries, actions safe to repeat",
      "args": [
        {
          "lead": "Control planes break while they recover.",
          "text": "This is the speakers' account {{b:talk}} {{c:0|[slides] how-anthropic-almost-melted-gke}}. Speakers from Google and Anthropic walked through six incidents on very large Kubernetes clusters. In each, a recovery loop spread across a shared control plane: every client re-listing at once, restarts in lockstep, a repair job that restarted every master together. Their line: on GKE's Spanner-based store, \"etcd fails first\" is a myth; the pressure moved up into the recovery loops. Each fix added a boundary.",
          "notes": [
            "What we could check: six of the eleven upstream Kubernetes PRs they cite are public, with titles that match the talk. The pages do not show merge state, and we did not check the other five {{b:verified}} {{c:34,35}}. One PR moved a DaemonSet loop out of the per-node path. Its benchmark shows −97% for that one code path at 10,000 nodes. The speakers say the benchmark overstates the real effect. They estimate 40–60% less controller-manager CPU {{b:talk}}.",
            "Not a second source: My Wednesday pick on failures at 50,000-node scale is probably this same session {{b:signal}} {{c:53}}."
          ]
        },
        {
          "lead": "Upstream is building the boundaries in.",
          "text": "Kubernetes 1.37 moved etcd RangeStream to beta, which cuts memory for large reads into the watch cache {{b:verified}} {{c:38}}. Kubernetes 1.36 added server-side sharded list and watch {{b:partial}}. Reports say 1.37 also answers startup overload with HTTP 429 and Retry-After: the server tells clients to back off {{b:partial}} {{c:37}}. Two gates the speakers rely on are still alpha and off by default.",
          "notes": []
        },
        {
          "lead": "Agent protocols push failure handling into your tools.",
          "text": "Under MCP's July 2026 spec, a broken stream loses the in-flight request. The client re-sends it under a new ID, and nothing replays it. So a tool with side effects and no idempotency key can run twice. An idempotency key stops a retried call from running twice. The IETF header for it is still a draft {{b:partial}} {{c:42}}.",
          "notes": [
            "{{b:signal}} Uber's \"Agents Fail. Workflows Recover\" casts durable execution (workflows that resume after crashes, here Cadence) as the agent reliability layer. {{c:53}}"
          ]
        },
        {
          "lead": "You can only bound what you can see.",
          "text": "MCP's July 2026 spec documents OpenTelemetry trace context in request metadata {{b:verified}} {{c:25}}. OpenTelemetry graduated in the CNCF on 21 May 2026 {{b:verified}} {{c:39}}. Solo.io's enterprise kagent ships agent tracing and evaluations from traces {{b:vendor}} {{c:10}}.",
          "notes": []
        },
        {
          "lead": "Delivery is shifting from preventing change to reversing it.",
          "text": "EKS now rolls a version upgrade back within seven days, one minor version at a time. {{c:40}} GKE also publishes minor-version rollback {{c:41|[web] cloud.google.com · undated page}}.",
          "notes": []
        }
      ],
      "readings": [
        {
          "value": "0",
          "label": "Replays after a broken MCP stream: the client re-sends under a new ID",
          "badge": "updated",
          "bq": "talk listed it as one option; the spec now requires it",
          "chip": {
            "t": "[web] modelcontextprotocol.io · rev. 28 Jul 2026",
            "s": [
              25
            ]
          },
          "stage": true,
          "viz": {
            "type": "stream"
          }
        },
        {
          "value": "6 of 11",
          "label": "Upstream PRs the speakers cite that we checked: public, titles match, merge state not shown",
          "badge": "verified",
          "chip": {
            "t": "[web] github.com/kubernetes · fetched 17 Nov 2026",
            "s": [
              34,
              35
            ]
          }
        },
        {
          "value": "7 days",
          "label": "Window to roll back an EKS version upgrade, one minor version at a time",
          "badge": "updated",
          "chip": {
            "t": "[web] aws.amazon.com · 1 Jul 2026",
            "s": [
              40
            ]
          }
        },
        {
          "value": "−97%",
          "label": "One DaemonSet code path at 10,000 nodes; speakers say it overstates the real effect",
          "badge": "verified",
          "bq": "benchmark on PR page",
          "chip": {
            "t": "[web] github.com/kubernetes · fetched 17 Nov 2026",
            "s": [
              34
            ]
          }
        }
      ],
      "soWhatStage": "Set a time-to-stable SLO. Restart in waves. Give every side-effecting agent tool an idempotency key.",
      "soWhat": "Make recovery a designed property. Set an SLO for time-to-stable after a fault. Graph every API-server replica, not the average. Rehearse control-plane restarts in waves on a production-scale staging cluster. Require an idempotency key or a status lookup on every side-effecting agent tool. Run long agent tasks on a durable workflow engine. Test your rollback path, because the human gate may be switched off.",
      "watch": "Do `WatchCacheStallResume` and `ConsistentListFromCacheSkipTimeoutFallback` move beyond alpha? Does the IETF Idempotency-Key draft become an RFC that MCP references? Either step makes \"safe to retry\" a default.",
      "next": "Standards"
    }
  ],
  "bridge": {
    "slug": "standards",
    "short": "Standards",
    "q": "Who writes the rules?",
    "bridge": true,
    "intro": "The four promises above all depend on rules that are still being written. This is where they are written.",
    "title": "Two foundations now write the rules: CNCF hosts agent runtimes; the Agentic AI Foundation hosts protocols and gateways.",
    "strip": [
      "verified",
      "partial",
      "updated",
      "vendor"
    ],
    "from": "One foundation, years from Sandbox to graduation",
    "to": "Two foundations, months from first tag to donation",
    "args": [
      {
        "lead": "Projects reach a neutral foundation within months.",
        "text": "Agent Substrate got its first tag, v0.0.0, on 19 May 2026. {{c:14|[web] github.com · 19 May (year per Solo.io)}} Google announced its donation to the CNCF Sandbox on 5 Nov, about six months later. {{c:6}} The donation is announced, not confirmed as accepted. The repository still calls itself pre-1.0, while Google refers to a 1.0 release. llm-d joined the CNCF Sandbox on 24 March 2026. {{c:47}}",
        "notes": []
      },
      {
        "lead": "Agent infrastructure has two homes.",
        "text": "The CNCF hosts runtimes and scheduling: Agent Substrate and gVisor (donation announced), llm-d, kagent, per its project site {{c:55|[web] kagent.dev · no date shown}}, and OpenRL, per press reports with conflicting dates {{c:56|[web] itbrief.co.uk · 10 Nov 2026}}. The Agentic AI Foundation (AAIF), a Linux Foundation project, hosts A2A, the agent-to-agent protocol, since 17 Aug. {{c:49}} Since 9 Sep it also hosts Agent Router, the former Envoy AI Gateway. {{c:50}} MCP itself is hosted by the AAIF too {{b:partial|search-result titles and one AAIF post}} {{c:51}}. A secondary source reports that the Agent Skills standard moved there in October {{b:partial}} {{c:54}}. Your agent stack will span both foundations.",
        "notes": []
      },
      {
        "lead": "The protocol moved under the talks.",
        "text": "MCP's July 2026 revision removed sessions and the initialize handshake, so every call stands alone. {{c:24,25}} It deprecated dynamic client registration in favour of client ID metadata documents, a new way for clients to identify themselves. Deprecated features keep working for at least twelve months. In our 30 folders, the rewrite superseded MCP claims in 4; in 3 more, the claim held but its reference spec changed.",
        "notes": []
      },
      {
        "lead": "Conformance is moving up the stack.",
        "text": "Certified AI-conformant Kubernetes platforms grew from 18 at launch to 31 in March and 40 in November 2026. {{c:3,2}} A Workload Conformance working group formed on 27 Oct because cluster conformance does not test workloads. It has published no test suite yet. {{c:48}}",
        "notes": []
      }
    ],
    "readings": [
      {
        "value": "4 of 30",
        "label": "Session folders whose MCP claims the July 2026 rewrite superseded",
        "badge": "verified",
        "bq": "our count of dated checks",
        "chip": {
          "t": "[internal] our count · 17 Nov 2026",
          "s": []
        },
        "stage": true,
        "viz": {
          "type": "ticks",
          "n": 4,
          "of": 30
        }
      },
      {
        "value": "≈ 6 months",
        "label": "From Agent Substrate's first tag to Google's announced CNCF donation; acceptance not confirmed",
        "badge": "partial",
        "chip": {
          "t": "[web] opensource.googleblog.com · 5 Nov 2026",
          "s": [
            14,
            6
          ]
        }
      },
      {
        "value": "18 → 40",
        "label": "Kubernetes platforms certified AI-conformant, launch to Nov 2026. Talk said 42",
        "badge": "updated",
        "chip": {
          "t": "[web] cncf.io · 10 Nov 2026",
          "s": [
            2,
            3
          ]
        }
      },
      {
        "value": "132 / 21",
        "label": "Contributors and organisations behind Agent Router when it joined the Agentic AI Foundation",
        "badge": "vendor",
        "chip": {
          "t": "[web] aaif.io · 9 Sep 2026",
          "s": [
            50
          ]
        }
      }
    ],
    "soWhatStage": "Buy for the split: gate purchases on neutral foundation and conformance. Name one owner for protocol changes.",
    "soWhat": "Add \"neutral foundation and conformance status\" as a gate on every agent-infrastructure purchase. Track the Agentic AI Foundation as closely as the CNCF. Name one owner for protocol changes, starting with MCP's July 2026 spec. If portability matters to you, join the Workload Conformance working group while the standard is still being written.",
    "watch": "Do CNCF pages list Agent Substrate as accepted, not just donated? Does the Workload Conformance working group publish its first test suite? Those mark the point where switching costs fall."
  },
  "contrarian": {
    "live1": "Hands up if a human must approve every production change an AI agent makes.",
    "live2": "Keep it up only if nobody can switch that off.",
    "title": "The human approval gate is becoming a setting: in mainstream tools, an admin can switch it off.",
    "toggles": [
      "1 Sep: Copilot can approve pull requests.",
      "28 Oct: Agent Merge merges them.",
      "Claude Code: a classifier-run auto mode."
    ],
    "soWhat": "Design trust and rollback as if nobody reviews the action. Treat the human as one control, not the last.",
    "evidence": [
      [
        "Copilot code review can approve pull requests (1 Sep 2026)",
        "updated",
        "read in an earlier pass, not re-fetched",
        {
          "t": "[web] github.blog · 1 Sep 2026",
          "s": [
            44
          ]
        }
      ],
      [
        "GitHub Agent Merge watches and merges pull requests (28 Oct 2026)",
        "updated",
        "read in an earlier pass, not re-fetched",
        {
          "t": "[web] github.blog · 28 Oct 2026",
          "s": [
            43
          ]
        }
      ],
      [
        "Claude Code offers per-command saved approvals and a classifier-run auto mode",
        "updated",
        "",
        {
          "t": "[web] code.claude.com · undated",
          "s": [
            46
          ]
        }
      ],
      [
        "NVIDIA OpenShell's policy advisor implies an automatic mode; flagged proposals still need review",
        "partial",
        "inferred from the docs' wording",
        {
          "t": "[web] docs.nvidia.com · undated",
          "s": [
            16
          ]
        }
      ]
    ],
    "counterTitle": "The counter-evidence, stated plainly",
    "counter": [
      "Claude Code still asks for approval by default.",
      "OpenShell still sends flagged proposals to a human.",
      "Microsoft's Azure SRE Agent demo keeps a human review before merge.",
      "So the gate is not gone. It has become a choice that an admin makes, often once, for everyone."
    ],
    "watchTitle": "AI as the operator: watch list",
    "watch": [
      "One speaker says an LLM drives 30 EKS clusters in production. {{b:talk}} from that session's slides {{c:0|[slides] no-rag-no-regrets}}. My Wednesday pick is the same session, so it is not a second source.",
      "Azure SRE Agent turns an alert into a draft fix PR in about 4–8 minutes in Microsoft's demo, with human review before merge {{b:vendor}} {{c:45}}.",
      "A Thursday session on AI-discovered algorithms for LLM serving claims a large latency cut in its abstract. We could not check it {{b:signal}} {{c:53}}."
    ]
  },
  "monday": {
    "title": "Fix defaults and retries this month; stop funding what vendors and upstream now ship.",
    "startStage": [
      "Read a week of audit denials, then enforce.",
      "Meter every agent at one gateway.",
      "Make every side-effecting tool safe to retry.",
      "Re-plan capacity in paused agents and pod groups.",
      "Gate purchases on foundation and conformance."
    ],
    "horizons": [
      [
        "Monday",
        [
          {
            "title": "Read a week of audit denials, then enforce.",
            "owner": "platform security lead",
            "step": "export one week of audit-mode denials for each agent sandbox, then switch the clean policies to enforce. Make \"the agent holds no secrets\" a deploy gate. Allow-list the packages agents may install.",
            "trend": "trust"
          },
          {
            "title": "Make every side-effecting tool safe to retry.",
            "owner": "agent platform lead",
            "step": "list every agent tool that writes, and add an idempotency key or a status lookup to each one. This quarter, rehearse control-plane restarts in waves on a production-scale staging cluster.",
            "trend": "recovery"
          },
          {
            "title": "If you run Kyverno, plan the CEL migration now.",
            "owner": "platform team",
            "step": "Kyverno announced the removal of ClusterPolicy and Policy for v1.20. Its release table lists v1.20 as released in November 2026, so check before you upgrade. {{b:updated}} {{c:52|[web] kyverno.io · 20 Aug 2026}}",
            "trend": "trust"
          }
        ]
      ],
      [
        "This quarter",
        [
          {
            "title": "Meter every agent at one gateway.",
            "owner": "platform lead, with FinOps",
            "step": "route agent traffic through one gateway that meters tokens per agent and per task. Turn on prompt caching and tool deferral by default. Report cost per correct outcome.",
            "trend": "cost"
          },
          {
            "title": "Re-plan capacity in paused agents and pod groups.",
            "owner": "ML platform or capacity lead",
            "step": "re-base quotas and chargeback on active versus paused agents and on pod groups, before the 2027 budget locks. Pilot the Workload API or Kueue gang scheduling before you build anything custom.",
            "trend": "scheduling"
          }
        ]
      ],
      [
        "Before KubeCon Europe 2027",
        [
          {
            "title": "Gate purchases on foundation and conformance.",
            "owner": "CTO office, with procurement",
            "step": "add neutral-foundation and conformance status to every agent-infrastructure RFP. Name one owner who tracks the CNCF and the Agentic AI Foundation, starting with MCP's July 2026 spec.",
            "trend": "standards"
          }
        ]
      ]
    ],
    "stopHeading": "Stop funding these",
    "stop": [
      "Building your own agent sandbox.",
      "Writing a custom scheduler before trying the Workload API or Kueue.",
      "Running one Deployment per agent.",
      "Charging back agents by pod or Node.",
      "Treating human approval as the last line of defence."
    ],
    "cto": "Name one accountable platform owner for all four promises. Security co-owns Trust; FinOps co-owns Cost. Hire for policy-as-code, token FinOps and recovery design.",
    "ctoLabel": "My recommendation, not a finding from the talks.",
    "ctoDetail": [
      [
        "Owner.",
        "One platform team is accountable for the four promises. Security co-owns Trust. FinOps co-owns Cost."
      ],
      [
        "Skills.",
        "Policy-as-code and workload identity (Trust). Token FinOps (Cost). Distributed-systems recovery design (Recovery). Standards tracking across two foundations (Standards)."
      ],
      [
        "Where to start.",
        ""
      ],
      [
        "Buying instead of building.",
        "If a managed agent runtime meets your trust and cost needs, the four questions still apply. You are just buying the answers."
      ]
    ],
    "whereToStart": [
      "No agents in production yet: start with Trust defaults and the Cost gateway.",
      "Agents in production: start with Recovery (safe retries) and Cost metering.",
      "Running GPU fleets: start with Scheduling (pod groups, DRA)."
    ]
  },
  "confidence": {
    "title": "Only 108 of 458 claims checked out exactly as presented a week later, so every number here wears a label.",
    "families": [
      [
        "Checked out as presented",
        [
          "C"
        ],
        "Checked out as presented: 108 (24%). Verdict: current."
      ],
      [
        "Corrected or overtaken",
        [
          "U",
          "S"
        ],
        "Corrected or overtaken: 99 (22%). 84 updated, 15 superseded. This mixes slide corrections, renames and version bumps with real change in the world."
      ],
      [
        "Not fully confirmed",
        [
          "P",
          "N"
        ],
        "Not fully confirmed: 251 (55%). 149 partial, 102 not found. Many are internal results that no public page covers yet."
      ]
    ],
    "verdicts": {
      "C": 108,
      "U": 84,
      "S": 15,
      "P": 149,
      "N": 102
    },
    "aria": "Of 458 claims: 108 checked out as presented, 99 were corrected or overtaken, 251 could not be fully confirmed.",
    "note": "Not confirmed is not false.",
    "solid": [
      "Workload and PodGroup APIs reached beta in Kubernetes 1.37.",
      "OpenShell's default network mode is audit: it logs, then allows.",
      "MCP's July 2026 spec is stateless and re-sends a broken request under a new ID, with no replay.",
      "MCP's rewrite superseded claims in 4 of our 30 folders.",
      "66% of organisations hosting generative AI models use Kubernetes for some or all inference (CNCF, 2025 survey)."
    ],
    "open": [
      "The six control-plane incidents are the speakers' account. Only the PR pages are public.",
      "The talk's 27.3% fewer GPU pod launches, its 64:1 node reduction and its 100,000+ accelerators have no public source.",
      "Agent Substrate: announced as donated to the CNCF, not confirmed as accepted. 1.0 versus pre-1.0 is unresolved.",
      "MCP's home in the Agentic AI Foundation rests on search titles and one AAIF post.",
      "The tool-poisoning defence results are one author's own tests."
    ],
    "notSaying": [
      "We do not claim Kubernetes is the only AI substrate. The 66% counts \"some or all\" inference, among organisations that host models, in CNCF's survey of its own community.",
      "We do not treat talk benchmarks as proof. They show direction, not size.",
      "Inference serving was not the focus of these folders. llm-d 1.0 shows up only in a session abstract (Signal). Only its CNCF Sandbox entry is verified.",
      "The post-pod story leans on one project family: Agent Substrate, which kagent 1.0 runs on. We added GKE, Red Hat, Akamai and upstream Kubernetes evidence to balance it.",
      "Every stage reading rests on a Verified, Updated or Vendor-stated source. Supporting points that rest on partial, talk-only or abstract evidence carry that label where they appear."
    ],
    "method": [
      "Read the slides in 30 session folders from KubeCon week.",
      "Wrote one summary per folder, claim by claim.",
      "Checked every claim against public sources on 16–17 Nov 2026, and recorded each source's date; rows carried from the 16 Nov pass are marked.",
      "Built four shifts and a bridge from what held. A separate AI review step challenged every number; I made the final calls."
    ],
    "methodNote": "An AI-assisted research pipeline did the reading and the checking. I reviewed the synthesis and the numbers. The 30 folders are not 30 clean talks. Some come from co-located days such as Agentics Day. Six hold more than one session or vendor, and one holds nine sessions. One folder matches a Google Cloud Next '26 session. My seven session picks come from schedule abstracts, and at least two are the same sessions as folders here, so they never count as a second source.",
    "legendTitle": "How to read the labels",
    "legend": {
      "verified": "a dated public source matches the claim as shown.",
      "updated": "a public source shows a newer or corrected figure. We show the current one. \"Talk said X\" marks a slide correction. \"Was X\" marks a change in the world.",
      "vendor": "the vendor's own public claim. The source exists; nobody has tested it independently.",
      "partial": "part is confirmed, or the only source is secondary.",
      "talk": "from the slides; no public source yet. This does not mean false.",
      "illustrative": "our arithmetic on a scenario from a talk.",
      "signal": "from a session abstract on the schedule page. Not checked."
    }
  },
  "map": {
    "title": "Thirty session folders, four shifts: most talks feed one promise, and the gateway shows up in three.",
    "caption": "Each chip is one session folder. Outlined chips show a second shift the folder also feeds.",
    "filterCaption": "\"Mostly resolved\" means at least half of a folder's claims checked out or were corrected with a source. \"Mostly open\" means at least half could not be fully confirmed.",
    "contextLabel": "Context (ecosystem and keynotes)",
    "mixedNote": "Six hold more than one session or vendor, and one holds nine sessions.",
    "verdictWords": [
      "Checked out",
      "Corrected or overtaken",
      "Partly confirmed",
      "No public source found"
    ],
    "folders": [
      {
        "slug": "adyen-joins-cncf",
        "name": "Adyen joins CNCF",
        "trend": "context",
        "also": [
          "recovery"
        ],
        "mixed": false,
        "adds": "an end user joins the CNCF to stay independent through open source.",
        "v": [
          0,
          5,
          0,
          1,
          1
        ]
      },
      {
        "slug": "agent-identity-mcp-kuadrant",
        "name": "Agent identity for MCP (Kuadrant)",
        "trend": "trust",
        "also": [
          "standards"
        ],
        "mixed": false,
        "adds": "",
        "v": [
          1,
          2,
          1,
          3,
          0
        ]
      },
      {
        "slug": "agent-long-term-memory",
        "name": "Agent long-term memory",
        "trend": "cost",
        "also": [
          "standards"
        ],
        "mixed": false,
        "adds": "agent memory and skills files; a secondary source reports the Agent Skills standard moved to the AAIF.",
        "v": [
          1,
          3,
          0,
          3,
          2
        ]
      },
      {
        "slug": "agentecosystem-solo",
        "name": "Agent ecosystem (Solo.io)",
        "trend": "standards",
        "also": [
          "scheduling",
          "trust"
        ],
        "mixed": true,
        "adds": "",
        "v": [
          2,
          3,
          0,
          3,
          1
        ]
      },
      {
        "slug": "agentic-data-plane-scaling-mcp",
        "name": "Scaling MCP's data plane",
        "trend": "recovery",
        "also": [
          "standards"
        ],
        "mixed": false,
        "adds": "",
        "v": [
          1,
          2,
          1,
          4,
          0
        ]
      },
      {
        "slug": "agents-need-a-repl",
        "name": "Agents need a REPL",
        "trend": "cost",
        "also": [],
        "mixed": false,
        "adds": "",
        "v": [
          0,
          6,
          0,
          2,
          2
        ]
      },
      {
        "slug": "ai-gateway",
        "name": "AI gateway",
        "trend": "cost",
        "also": [
          "trust",
          "standards"
        ],
        "mixed": true,
        "adds": "",
        "v": [
          1,
          3,
          2,
          2,
          1
        ]
      },
      {
        "slug": "ai-open-source-infra-updates",
        "name": "AI open-source infra updates",
        "trend": "scheduling",
        "also": [],
        "mixed": true,
        "adds": "",
        "v": [
          0,
          1,
          0,
          4,
          3
        ]
      },
      {
        "slug": "automate-vulnerability-resolution",
        "name": "Automating vulnerability fixes",
        "trend": "recovery",
        "also": [],
        "mixed": false,
        "adds": "",
        "v": [
          1,
          5,
          0,
          1,
          1
        ]
      },
      {
        "slug": "autoscaling-reality-check",
        "name": "Autoscaling reality check",
        "trend": "scheduling",
        "also": [],
        "mixed": false,
        "adds": "",
        "v": [
          0,
          3,
          0,
          4,
          0
        ]
      },
      {
        "slug": "canary-deploy-clusters",
        "name": "Canary deploys across clusters",
        "trend": "recovery",
        "also": [],
        "mixed": false,
        "adds": "canary releases across clusters; supports \"reverse change, don't just prevent it\".",
        "v": [
          2,
          2,
          1,
          1,
          1
        ]
      },
      {
        "slug": "day-2-keynotes-2",
        "name": "Day 2 keynotes",
        "trend": "context",
        "also": [
          "recovery"
        ],
        "mixed": false,
        "adds": "",
        "v": [
          2,
          2,
          0,
          2,
          1
        ]
      },
      {
        "slug": "emperors-new-code",
        "name": "The emperor's new code",
        "trend": "trust",
        "also": [],
        "mixed": false,
        "adds": "",
        "v": [
          1,
          2,
          0,
          3,
          1
        ]
      },
      {
        "slug": "from-traceroute-to-otel-traces",
        "name": "From traceroute to OTel traces",
        "trend": "recovery",
        "also": [],
        "mixed": false,
        "adds": "models network paths as OpenTelemetry traces; supports \"bound what you can see\".",
        "v": [
          1,
          1,
          0,
          3,
          3
        ]
      },
      {
        "slug": "how-anthropic-almost-melted-gke",
        "name": "How Anthropic almost melted GKE",
        "trend": "recovery",
        "also": [
          "scheduling"
        ],
        "mixed": false,
        "adds": "",
        "v": [
          2,
          1,
          0,
          9,
          8
        ]
      },
      {
        "slug": "hypercluster-at-anthropic",
        "name": "Hypercluster",
        "trend": "scheduling",
        "also": [],
        "mixed": false,
        "adds": "",
        "v": [
          5,
          2,
          0,
          8,
          7
        ]
      },
      {
        "slug": "inovation-cycle-coreweave",
        "name": "Innovation cycle (CoreWeave, Vultr)",
        "trend": "standards",
        "also": [],
        "mixed": true,
        "adds": "",
        "v": [
          9,
          2,
          0,
          5,
          7
        ]
      },
      {
        "slug": "intro-agent-substrate",
        "name": "Intro to Agent Substrate",
        "trend": "scheduling",
        "also": [
          "trust",
          "standards"
        ],
        "mixed": false,
        "adds": "",
        "v": [
          4,
          1,
          0,
          7,
          4
        ]
      },
      {
        "slug": "intro-cncf",
        "name": "CNCF opening",
        "trend": "standards",
        "also": [
          "trust"
        ],
        "mixed": false,
        "adds": "",
        "v": [
          9,
          4,
          0,
          8,
          5
        ]
      },
      {
        "slug": "istio-agw-identity",
        "name": "Istio agent gateway identity",
        "trend": "trust",
        "also": [
          "scheduling"
        ],
        "mixed": false,
        "adds": "",
        "v": [
          2,
          4,
          2,
          5,
          5
        ]
      },
      {
        "slug": "no-rag-no-regrets",
        "name": "No RAG, no regrets",
        "trend": "cost",
        "also": [],
        "mixed": false,
        "adds": "",
        "v": [
          2,
          1,
          2,
          7,
          7
        ]
      },
      {
        "slug": "openinference-openrl",
        "name": "OpenInference and OpenRL",
        "trend": "scheduling",
        "also": [
          "standards"
        ],
        "mixed": false,
        "adds": "",
        "v": [
          6,
          4,
          1,
          4,
          5
        ]
      },
      {
        "slug": "papers-research-kubecon",
        "name": "Research papers (9 sessions)",
        "trend": "context",
        "also": [],
        "mixed": true,
        "adds": "nine sessions in one folder, from GPU dashboards to GitOps for AI; mapped by title only.",
        "v": [
          5,
          9,
          1,
          10,
          5
        ]
      },
      {
        "slug": "portability-one-kubernetes",
        "name": "Portability: one Kubernetes",
        "trend": "standards",
        "also": [],
        "mixed": false,
        "adds": "",
        "v": [
          6,
          4,
          0,
          5,
          4
        ]
      },
      {
        "slug": "sandbox-your-agents",
        "name": "Sandbox your agents",
        "trend": "trust",
        "also": [],
        "mixed": false,
        "adds": "",
        "v": [
          6,
          2,
          0,
          7,
          4
        ]
      },
      {
        "slug": "secure-computing-systems",
        "name": "Secure computing (ShieldMCP)",
        "trend": "trust",
        "also": [
          "standards"
        ],
        "mixed": true,
        "adds": "",
        "v": [
          5,
          1,
          1,
          12,
          1
        ]
      },
      {
        "slug": "spin-agent-sandbox",
        "name": "Spin agent sandbox",
        "trend": "trust",
        "also": [],
        "mixed": false,
        "adds": "",
        "v": [
          12,
          3,
          1,
          6,
          5
        ]
      },
      {
        "slug": "stop-wasting-gpus",
        "name": "Stop wasting GPUs",
        "trend": "cost",
        "also": [],
        "mixed": false,
        "adds": "",
        "v": [
          10,
          1,
          0,
          5,
          3
        ]
      },
      {
        "slug": "tokenconomics-cents-and-sensibility",
        "name": "Tokenconomics",
        "trend": "cost",
        "also": [],
        "mixed": false,
        "adds": "",
        "v": [
          8,
          2,
          1,
          9,
          7
        ]
      },
      {
        "slug": "wasm-sandbox-akamai",
        "name": "Wasm sandbox (Akamai)",
        "trend": "trust",
        "also": [],
        "mixed": false,
        "adds": "",
        "v": [
          4,
          3,
          1,
          6,
          8
        ]
      }
    ],
    "verdictTotals": {
      "C": 108,
      "U": 84,
      "S": 15,
      "P": 149,
      "N": 102
    }
  },
  "share": {
    "stage1": "Which of the four would you fund first?",
    "stage2": "Tell me on LinkedIn. Every number here links to a dated source.",
    "h2": "Share the four shifts, labels included.",
    "pitch": "Four shifts from KubeCon NA 2026, with every number labelled and every source dated.",
    "post": "AI moved onto Kubernetes. Then it outgrew the pod.\nFour shifts from KubeCon NA 2026: scheduling, trust, cost, recovery. 458 claims checked, every number labelled.\nWhich one is your team funding for 2027?"
  },
  "sources": [
    {
      "n": 1,
      "title": "Kubernetes established as the de facto operating system for AI",
      "publisher": "CNCF",
      "date": "20 Jan 2026 (2025 survey data)",
      "urls": [
        "https://www.cncf.io/announcements/2026/01/20/kubernetes-established-as-the-de-facto-operating-system-for-ai"
      ],
      "nourl": "",
      "type": "web",
      "d": 1
    },
    {
      "n": 2,
      "title": "CNCF hits major milestones… projects to build AI systems in production",
      "publisher": "CNCF",
      "date": "10 Nov 2026",
      "urls": [
        "https://www.cncf.io/announcements/2026/11/10/cncf-hits-major-milestones-with-global-community-growth-record-industry-investment-and-a-new-generation-of-projects-to-build-ai-systems-in-production/"
      ],
      "nourl": "",
      "type": "web",
      "d": 2
    },
    {
      "n": 3,
      "title": "CNCF nearly doubles certified Kubernetes AI platforms",
      "publisher": "CNCF",
      "date": "24 Mar 2026",
      "urls": [
        "https://www.cncf.io/announcements/2026/03/24/cncf-nearly-doubles-certified-kubernetes-ai-platforms/"
      ],
      "nourl": "",
      "type": "web",
      "d": 3
    },
    {
      "n": 4,
      "title": "Hypercluster overview",
      "publisher": "Google Cloud docs",
      "date": "updated 7 Nov 2026",
      "urls": [
        "https://docs.cloud.google.com/kubernetes-engine/docs/concepts/hypercluster-overview"
      ],
      "nourl": "",
      "type": "web",
      "d": 4
    },
    {
      "n": 5,
      "title": "What's new in GKE at Next '26",
      "publisher": "Google Cloud blog",
      "date": "22 Apr 2026",
      "urls": [
        "https://cloud.google.com/blog/products/containers-kubernetes/whats-new-in-gke-at-next26"
      ],
      "nourl": "",
      "type": "web",
      "d": 5
    },
    {
      "n": 6,
      "title": "Sandboxing untrusted AI agents at scale",
      "publisher": "Google Open Source blog",
      "date": "5 Nov 2026",
      "urls": [
        "https://opensource.googleblog.com/2026/11/sandboxing-untrusted-ai-agents-at-scale.html"
      ],
      "nourl": "",
      "type": "web",
      "d": 6
    },
    {
      "n": 7,
      "title": "Bringing you Agent Sandbox on GKE and Agent Substrate",
      "publisher": "Google Cloud blog",
      "date": "20 May 2026",
      "urls": [
        "https://cloud.google.com/blog/products/containers-kubernetes/bringing-you-agent-sandbox-on-gke-and-agent-substrate"
      ],
      "nourl": "",
      "type": "web",
      "d": 7
    },
    {
      "n": 9,
      "title": "Announcing kagent 1.0 GA (blog)",
      "publisher": "Solo.io",
      "date": "10 Nov 2026",
      "urls": [
        "https://www.solo.io/blog/announcing-kagent-1-0-ga"
      ],
      "nourl": "",
      "type": "web",
      "d": 8
    },
    {
      "n": 10,
      "title": "Announcing kagent 1.0 GA (press release)",
      "publisher": "Solo.io",
      "date": "10 Nov 2026",
      "urls": [
        "https://www.solo.io/press-releases/announcing-kagent-1-0-ga"
      ],
      "nourl": "",
      "type": "web",
      "d": 9
    },
    {
      "n": 11,
      "title": "Kubernetes v1.37: advancing workload-aware scheduling",
      "publisher": "Kubernetes blog",
      "date": "8 Sep 2026",
      "urls": [
        "https://kubernetes.io/blog/2026/09/08/kubernetes-v1-37-advancing-workload-aware-scheduling/"
      ],
      "nourl": "",
      "type": "web",
      "d": 10
    },
    {
      "n": 12,
      "title": "Kubernetes v1.34: DRA updates",
      "publisher": "Kubernetes blog",
      "date": "1 Sep 2025",
      "urls": [
        "https://kubernetes.io/blog/2025/09/01/kubernetes-v1-34-dra-updates/"
      ],
      "nourl": "",
      "type": "web",
      "d": 11
    },
    {
      "n": 13,
      "title": "Kubernetes v1.37: HPA scale to zero beta",
      "publisher": "Kubernetes blog",
      "date": "2 Sep 2026",
      "urls": [
        "https://kubernetes.io/blog/2026/09/02/kubernetes-v1-37-hpa-scale-to-zero-beta/"
      ],
      "nourl": "",
      "type": "web",
      "d": 12
    },
    {
      "n": 14,
      "title": "agent-substrate/substrate releases (v0.0.0, 19 May)",
      "publisher": "GitHub",
      "date": "19 May 2026",
      "urls": [
        "https://github.com/agent-substrate/substrate/releases"
      ],
      "nourl": "",
      "type": "web",
      "d": 13
    },
    {
      "n": 15,
      "title": "OpenShell policy schema",
      "publisher": "NVIDIA docs",
      "date": "undated",
      "urls": [
        "https://docs.nvidia.com/openshell/latest/how-it-works/policies/schema.md"
      ],
      "nourl": "",
      "type": "web",
      "d": 14
    },
    {
      "n": 16,
      "title": "OpenShell policy advisor",
      "publisher": "NVIDIA docs",
      "date": "undated",
      "urls": [
        "https://docs.nvidia.com/openshell/latest/how-it-works/policies/advisor.md"
      ],
      "nourl": "",
      "type": "web",
      "d": 15
    },
    {
      "n": 17,
      "title": "Announcing Red Hat OpenShift 5",
      "publisher": "Red Hat",
      "date": "9 Nov 2026",
      "urls": [
        "https://redhat.com/en/blog/announcing-red-hat-openshift-5"
      ],
      "nourl": "",
      "type": "web",
      "d": 16
    },
    {
      "n": 18,
      "title": "WebAssembly didn't miss the moment; AI was just late / Akamai Agent Sandbox",
      "publisher": "Akamai",
      "date": "10 Nov 2026",
      "urls": [
        "https://www.akamai.com/blog/edge/webassembly-didnt-miss-the-moment-ai-was-just-late",
        "https://www.akamai.com/products/akamai-agent-sandbox"
      ],
      "nourl": "",
      "type": "web",
      "d": 17
    },
    {
      "n": 19,
      "title": "Agent Substrate project site",
      "publisher": "ate.dev",
      "date": "undated",
      "urls": [
        "https://ate.dev"
      ],
      "nourl": "",
      "type": "web",
      "d": 18
    },
    {
      "n": 20,
      "title": "ShieldMCP (ACL 2026 Industry Track)",
      "publisher": "ACL Anthology",
      "date": "Jul 2026",
      "urls": [
        "https://aclanthology.org/2026.acl-industry.58/"
      ],
      "nourl": "",
      "type": "web",
      "d": 19
    },
    {
      "n": 21,
      "title": "MCPTox benchmark",
      "publisher": "arXiv",
      "date": "19 Aug 2025 (v2 29 Sep 2026)",
      "urls": [
        "https://arxiv.org/abs/2508.14925"
      ],
      "nourl": "",
      "type": "web",
      "d": 20
    },
    {
      "n": 22,
      "title": "CSA research note: slopsquatting",
      "publisher": "Cloud Security Alliance",
      "date": "3 May 2026",
      "urls": [
        "https://labs.cloudsecurityalliance.org/research-rb/csa-research-note-slopsquatting-ai-coding-assistant-supply-c/"
      ],
      "nourl": "",
      "type": "web",
      "d": 21
    },
    {
      "n": 23,
      "title": "MCP specification 2026-07-28: authorization",
      "publisher": "Model Context Protocol",
      "date": "28 Jul 2026",
      "urls": [
        "https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization"
      ],
      "nourl": "",
      "type": "web",
      "d": 22
    },
    {
      "n": 24,
      "title": "MCP 2026-07-28 release post",
      "publisher": "MCP blog",
      "date": "28 Jul 2026",
      "urls": [
        "https://blog.modelcontextprotocol.io/posts/2026-07-28/"
      ],
      "nourl": "",
      "type": "web",
      "d": 23
    },
    {
      "n": 25,
      "title": "MCP specification 2026-07-28: changelog",
      "publisher": "Model Context Protocol",
      "date": "revision 28 Jul 2026",
      "urls": [
        "https://modelcontextprotocol.io/specification/2026-07-28/changelog"
      ],
      "nourl": "",
      "type": "web",
      "d": 24
    },
    {
      "n": 26,
      "title": "Envoy v1.40.0 release notes",
      "publisher": "Envoy",
      "date": "13 Oct 2026",
      "urls": [
        "https://www.envoyproxy.io/docs/envoy/latest/version_history/v1.40/v1.40.0"
      ],
      "nourl": "",
      "type": "web",
      "d": 25
    },
    {
      "n": 27,
      "title": "Claude pricing",
      "publisher": "Anthropic",
      "date": "fetched 17 Nov 2026",
      "urls": [
        "https://claude.com/pricing"
      ],
      "nourl": "",
      "type": "web",
      "d": 26
    },
    {
      "n": 28,
      "title": "Prompt caching",
      "publisher": "Anthropic docs",
      "date": "fetched 17 Nov 2026",
      "urls": [
        "https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
      ],
      "nourl": "",
      "type": "web",
      "d": 27
    },
    {
      "n": 29,
      "title": "Code execution with MCP",
      "publisher": "Anthropic Engineering",
      "date": "4 Nov 2025",
      "urls": [
        "https://www.anthropic.com/engineering/code-execution-with-mcp"
      ],
      "nourl": "",
      "type": "web",
      "d": 28
    },
    {
      "n": 30,
      "title": "Advanced tool use",
      "publisher": "Anthropic Engineering",
      "date": "24 Nov 2025 (modified 18 Oct 2026)",
      "urls": [
        "https://www.anthropic.com/engineering/advanced-tool-use"
      ],
      "nourl": "",
      "type": "web",
      "d": 29
    },
    {
      "n": 31,
      "title": "Codex changelog",
      "publisher": "OpenAI",
      "date": "13 Nov 2026",
      "urls": [
        "https://learn.chatgpt.com/docs/changelog?d=20261019"
      ],
      "nourl": "",
      "type": "web",
      "d": 30
    },
    {
      "n": 32,
      "title": "MCP codemode updates",
      "publisher": "Cloudflare changelog",
      "date": "22 Jul 2026",
      "urls": [
        "https://developers.cloudflare.com/changelog/post/2026-07-22-mcp-codemode-updates/"
      ],
      "nourl": "",
      "type": "web",
      "d": 31
    },
    {
      "n": 33,
      "title": "Workload-aware caching for multi-agent systems",
      "publisher": "arXiv",
      "date": "14 Jun 2026",
      "urls": [
        "https://arxiv.org/abs/2607.20495"
      ],
      "nourl": "",
      "type": "web",
      "d": 32
    },
    {
      "n": 34,
      "title": "kubernetes/kubernetes PR #140167 (DaemonSet loop)",
      "publisher": "GitHub",
      "date": "fetched 17 Nov 2026",
      "urls": [
        "https://github.com/kubernetes/kubernetes/pull/140167"
      ],
      "nourl": "",
      "type": "web",
      "d": 33
    },
    {
      "n": 35,
      "title": "kubernetes/kubernetes PRs #129205, #136812, #138701, #140896, #141450",
      "publisher": "GitHub",
      "date": "fetched 17 Nov 2026",
      "urls": [
        "https://github.com/kubernetes/kubernetes/pull/129205",
        "https://github.com/kubernetes/kubernetes/pull/136812",
        "https://github.com/kubernetes/kubernetes/pull/138701",
        "https://github.com/kubernetes/kubernetes/pull/140896",
        "https://github.com/kubernetes/kubernetes/pull/141450"
      ],
      "nourl": "",
      "type": "web",
      "d": 34
    },
    {
      "n": 37,
      "title": "Kubernetes v1.37: back to zero pods and a stronger kube-apiserver",
      "publisher": "Techzine",
      "date": "26 Aug 2026",
      "urls": [
        "https://www.techzine.eu/news/devops/143829/kubernetes-v1-37-back-to-zero-pods-and-a-stronger-kube-apiserver/"
      ],
      "nourl": "",
      "type": "web",
      "d": 35
    },
    {
      "n": 38,
      "title": "Kubernetes v1.37: etcd RangeStream",
      "publisher": "Kubernetes blog",
      "date": "1 Sep 2026",
      "urls": [
        "https://kubernetes.io/blog/2026/09/01/kubernetes-v1-37-etcd-range-stream/"
      ],
      "nourl": "",
      "type": "web",
      "d": 36
    },
    {
      "n": 39,
      "title": "OpenTelemetry graduates",
      "publisher": "CNCF",
      "date": "21 May 2026",
      "urls": [
        "https://www.cncf.io/announcements/2026/05/21/cloud-native-computing-foundation-announces-opentelemetrys-graduation-solidifying-status-as-the-de-facto-observability-standard/"
      ],
      "nourl": "",
      "type": "web",
      "d": 37
    },
    {
      "n": 40,
      "title": "Upgrade Amazon EKS clusters with confidence using Kubernetes version rollbacks",
      "publisher": "AWS blog",
      "date": "1 Jul 2026",
      "urls": [
        "https://aws.amazon.com/blogs/aws/upgrade-amazon-eks-clusters-with-confidence-using-kubernetes-version-rollbacks/"
      ],
      "nourl": "",
      "type": "web",
      "d": 38
    },
    {
      "n": 41,
      "title": "Kubernetes gets minor version rollback",
      "publisher": "Google Cloud blog",
      "date": "date not shown",
      "urls": [
        "https://cloud.google.com/blog/products/containers-kubernetes/kubernetes-gets-minor-version-rollback"
      ],
      "nourl": "",
      "type": "web",
      "d": 39
    },
    {
      "n": 42,
      "title": "Idempotency-Key HTTP header (Internet-Draft)",
      "publisher": "IETF",
      "date": "draft-08, 22 Oct 2026 (earlier pass)",
      "urls": [
        "https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/"
      ],
      "nourl": "",
      "type": "web",
      "d": 40
    },
    {
      "n": 43,
      "title": "Agent Merge watches and fixes pull requests in the cloud",
      "publisher": "GitHub changelog",
      "date": "28 Oct 2026",
      "urls": [
        "https://github.blog/changelog/2026-10-28-agent-merge-watches-and-fixes-pull-requests-in-the-cloud"
      ],
      "nourl": "",
      "type": "web",
      "d": 41
    },
    {
      "n": 44,
      "title": "Copilot code review can now approve pull requests",
      "publisher": "GitHub changelog",
      "date": "1 Sep 2026",
      "urls": [
        "https://github.blog/changelog/2026-09-01-copilot-code-review-can-now-approve-pull-requests"
      ],
      "nourl": "",
      "type": "web",
      "d": 42
    },
    {
      "n": 45,
      "title": "Autonomous AKS incident response with Azure SRE Agent",
      "publisher": "Microsoft Tech Community",
      "date": "17 Apr 2026",
      "urls": [
        "https://techcommunity.microsoft.com/t5/apps-on-azure-blog/autonomous-aks-incident-response-with-azure-sre-agent-from-alert/ba-p/4511343"
      ],
      "nourl": "",
      "type": "web",
      "d": 43
    },
    {
      "n": 46,
      "title": "Claude Code permissions",
      "publisher": "Anthropic docs",
      "date": "undated",
      "urls": [
        "https://code.claude.com/docs/en/permissions"
      ],
      "nourl": "",
      "type": "web",
      "d": 44
    },
    {
      "n": 47,
      "title": "Welcome llm-d to the CNCF",
      "publisher": "CNCF blog",
      "date": "24 Mar 2026",
      "urls": [
        "https://www.cncf.io/blog/2026/03/24/welcome-llm-d-to-the-cncf-evolving-kubernetes-into-sota-ai-infrastructure/"
      ],
      "nourl": "",
      "type": "web",
      "d": 45
    },
    {
      "n": 48,
      "title": "Announcing the Workload Conformance WG",
      "publisher": "Kubernetes blog",
      "date": "27 Oct 2026",
      "urls": [
        "https://kubernetes.io/blog/2026/10/27/announcing-workload-conformance-wg/"
      ],
      "nourl": "",
      "type": "web",
      "d": 46
    },
    {
      "n": 49,
      "title": "A2A joins AAIF",
      "publisher": "AAIF blog",
      "date": "17 Aug 2026",
      "urls": [
        "https://aaif.io/blog/a2a-joins-aaif"
      ],
      "nourl": "",
      "type": "web",
      "d": 47
    },
    {
      "n": 50,
      "title": "Agent Router joins AAIF",
      "publisher": "AAIF blog",
      "date": "9 Sep 2026",
      "urls": [
        "https://aaif.io/blog/agent-router-joins-aaif"
      ],
      "nourl": "",
      "type": "web",
      "d": 48
    },
    {
      "n": 51,
      "title": "MCP 2026 changes the rules / AAIF launch coverage",
      "publisher": "AAIF blog; Campus Technology",
      "date": "3 Sep 2026; 15 Dec 2025",
      "urls": [
        "https://aaif.io/blog/mcp-2026-changes-the-rules",
        "https://campustechnology.com/articles/2025/12/15/newly-launched-agentic-ai-foundation-brings-together-tech-giants-for-open-source-ai-development.aspx"
      ],
      "nourl": "",
      "type": "web",
      "d": 49
    },
    {
      "n": 52,
      "title": "Announcing Kyverno 1.19 / Kyverno releases",
      "publisher": "Kyverno",
      "date": "20 Aug 2026; releases page undated",
      "urls": [
        "https://kyverno.io/blog/2026/08/20/announcing-kyverno-release-1.19",
        "https://kyverno.io/docs/releases/"
      ],
      "nourl": "",
      "type": "web",
      "d": 50
    },
    {
      "n": 53,
      "title": "Session abstracts picked by Felipe (Wed 11 and Thu 12 Nov)",
      "publisher": "KubeCon NA 2026 schedule",
      "date": "11–12 Nov 2026",
      "urls": [],
      "nourl": "not linked (schedule page)",
      "type": "abstract",
      "d": 51
    },
    {
      "n": 54,
      "title": "Agent Skills and the Agentic AI Foundation",
      "publisher": "i-SCOOP",
      "date": "24 Oct 2026",
      "urls": [
        "https://www.i-scoop.eu/agent-skills-agentic-ai-foundation/"
      ],
      "nourl": "",
      "type": "web (secondary)",
      "d": 52
    },
    {
      "n": 55,
      "title": "kagent project site",
      "publisher": "kagent.dev",
      "date": "no date shown",
      "urls": [
        "https://kagent.dev/"
      ],
      "nourl": "",
      "type": "web",
      "d": 53
    },
    {
      "n": 56,
      "title": "Google Cloud donates three AI projects to CNCF Sandbox",
      "publisher": "IT Brief",
      "date": "10 Nov 2026",
      "urls": [
        "https://itbrief.co.uk/story/google-cloud-donates-three-ai-projects-to-cncf-sandbox"
      ],
      "nourl": "",
      "type": "web",
      "d": 54
    }
  ],
  "notes": [
    {
      "step": 1,
      "slide": "Hero",
      "say": "\"AI moved onto Kubernetes. Then it outgrew the pod.\" Most teams hosting AI models already use Kubernetes, but the two ends of AI no longer fit the pod. That gap decides whether your platform team owns the value or becomes a GPU landlord.",
      "cue": "Trigger the tick sort: \"Thirty session folders from KubeCon week, sorted into four shifts and one bridge.\"",
      "time": "40 s",
      "clock": "0:40"
    },
    {
      "step": 2,
      "slide": "Guess (question)",
      "say": "**Live moment 1.** \"I took 458 claims from last week's sessions and checked each one against public sources. A week later, what share checked out exactly as presented?\" Read the four options and take hands for each.",
      "cue": "Wait for hands on every option. Most rooms guess high.",
      "time": "60 s",
      "clock": "1:40"
    },
    {
      "step": 3,
      "slide": "Guess (reveal)",
      "say": "\"24%. 108 of 458.\" Ninety-nine were corrected or overtaken, and 251 we could not fully confirm. Not confirmed is not false; often nobody has published the data yet.",
      "cue": "\"So every number tonight carries a label. Here is the answer first.\"",
      "time": "40 s",
      "clock": "2:20"
    },
    {
      "step": 4,
      "slide": "Answer",
      "say": "Value moves above the pod, into four promises a platform makes to every AI workload: what runs, what it may touch, what it costs, how it recovers. Above them sits one question: who writes the rules.",
      "cue": "**Pause 3 seconds.** No clicker.",
      "time": "50 s",
      "clock": "3:10"
    },
    {
      "step": 5,
      "slide": "Situation",
      "say": "Kubernetes already carries much of AI's inference. In CNCF's 2025 survey, 66% of organisations hosting generative AI models use it for some or all inference. That is CNCF surveying its own community, so treat it as a floor of interest, not a census.",
      "cue": "\"That is the good news. Now the problem.\"",
      "time": "25 s",
      "clock": "3:35"
    },
    {
      "step": 6,
      "slide": "Complication",
      "say": "The new workloads break the pod's assumptions. Google says agents sit idle most of a session; Google also sells one control plane for up to a million chips. And MCP, the protocol agents use to call tools, went stateless in July.",
      "cue": "Stress \"a million chips\" is Google's stated ceiling, not a job anyone ran.",
      "time": "35 s",
      "clock": "4:10"
    },
    {
      "step": 7,
      "slide": "Question",
      "say": "So the question for platform leaders: what do you build above the pod, and what do you stop building?",
      "cue": "\"Four shifts. First: what runs.\"",
      "time": "20 s",
      "clock": "4:30"
    },
    {
      "step": 8,
      "slide": "Scheduling: opener",
      "say": "\"Four shifts. First: what runs.\"",
      "cue": "Pause on the chapter frame, then click.",
      "time": "5 s",
      "clock": "4:30"
    },
    {
      "step": 9,
      "slide": "Scheduling: title + diff",
      "say": "AI outgrows the pod at both ends. The old contract: one pod per workload, one Node per machine. [click: the + line applies] The new one: paused agents, pod groups, and Kubernetes off the hot path. At frontier scale, Kubernetes scales by subtraction: Google's Hypercluster runs the work on machines that are not even Nodes.",
      "cue": "Click to apply the diff. Say the quote line slowly: \"Kubernetes scales by subtraction.\"",
      "time": "50 s",
      "clock": "5:20"
    },
    {
      "step": 10,
      "slide": "Scheduling: reading",
      "say": "This is upstream, not a vendor: in 1.37, the Workload and PodGroup APIs reached beta, so a job's pods schedule together.",
      "cue": "\"So what changes for you?\"",
      "time": "30 s",
      "clock": "5:50"
    },
    {
      "step": 11,
      "slide": "Scheduling: so what",
      "say": "Stop pricing agents by the pod. Plan capacity in active versus paused agents, and in pod groups; try the Workload API or Kueue before you write a scheduler.",
      "cue": "\"Second promise: what may it touch.\"",
      "time": "30 s",
      "clock": "6:20"
    },
    {
      "step": 12,
      "slide": "Trust: opener",
      "say": "\"Second promise: what may it touch.\"",
      "cue": "Pause on the chapter frame, then click.",
      "time": "5 s",
      "clock": "6:20"
    },
    {
      "step": 13,
      "slide": "Trust: title + diff",
      "say": "Agent sandboxes are now a product category. The old model: trust the model, give each app its secrets. [click: the + line applies] The new one: a default-deny sandbox, an agent that holds no secrets, and a gateway that scopes identity. Google, Red Hat, Akamai and Solo.io all ship or preview one.",
      "cue": "Click to apply. Do not say \"commodity\".",
      "time": "50 s",
      "clock": "7:10"
    },
    {
      "step": 14,
      "slide": "Trust: reading",
      "say": "Here is the catch. NVIDIA OpenShell's default network mode is \"audit\": it logs the request, then allows it. The sandbox is a product now. The default setting is the risk.",
      "cue": "Let the room read the word \"audit\" for a beat.",
      "time": "35 s",
      "clock": "7:45"
    },
    {
      "step": 15,
      "slide": "Trust: so what",
      "say": "Don't build a sandbox. Buy one with neutral governance, then own the policy: enforce mode, no secrets, scoped identity. One paper puts the cost of that control at under 2 points of task completion, by its author's own tests.",
      "cue": "\"Third promise: what it costs.\"",
      "time": "30 s",
      "clock": "8:15"
    },
    {
      "step": 16,
      "slide": "Cost: opener",
      "say": "\"Third promise: what it costs.\"",
      "cue": "Pause on the chapter frame, then click.",
      "time": "5 s",
      "clock": "8:15"
    },
    {
      "step": 17,
      "slide": "Cost: title + diff",
      "say": "Agent cost is architecture. The old model: price per token times requests. [click: the + line applies] The new one: tokens times architecture. Cache, defer tool loading, and let the agent write code instead of calling tools one by one. OpenAI's Codex turned Code Mode on by default on 13 November.",
      "cue": "Click to apply. ",
      "time": "50 s",
      "clock": "9:05"
    },
    {
      "step": 18,
      "slide": "Cost: reading",
      "say": "In Anthropic's own tests, calling tools through code cut tokens by 37% to 99%. That is a vendor's number, so read it as the range of the lever, not your saving.",
      "cue": "\"One more cost point, then the one SREs will like.\"",
      "time": "35 s",
      "clock": "9:40"
    },
    {
      "step": 19,
      "slide": "Cost: so what",
      "say": "Make cost a platform default: one gateway meters every agent, caching is on by default, and you report cost per correct outcome. It is the same gateway that scopes identity in Trust.",
      "cue": "\"Fourth promise: how it recovers.\"",
      "time": "30 s",
      "clock": "10:10"
    },
    {
      "step": 20,
      "slide": "Recovery: opener",
      "say": "\"Fourth promise: how it recovers.\"",
      "cue": "Pause on the chapter frame, then click.",
      "time": "5 s",
      "clock": "10:10"
    },
    {
      "step": 21,
      "slide": "Recovery: title + diff",
      "say": "**Tell the story first, then click.** Speakers from Google and Anthropic walked through six incidents on very large clusters. In every one, the store held; the recovery broke it: clients re-listing at once, restarts in lockstep, a repair job that restarted every master together. That is their account; the six PRs they cite are public. [click: the + line applies] Systems fail by recovering. So: staggered restarts, bounded retries, and agent actions that are safe to repeat.",
      "cue": "**Pause after \"the recovery broke it.\"** ",
      "time": "65 s",
      "clock": "11:15"
    },
    {
      "step": 22,
      "slide": "Recovery: reading",
      "say": "Agents now inherit the same problem. Under MCP's July spec, a broken stream loses the request; the client re-sends it under a new ID, and nothing replays it. A tool that charges a card without an idempotency key can charge it twice.",
      "cue": "\"So what do you do?\"",
      "time": "35 s",
      "clock": "11:50"
    },
    {
      "step": 23,
      "slide": "Recovery: so what",
      "say": "Set a time-to-stable SLO. Rehearse restarts in waves on a production-scale staging cluster, not on prod. And give every agent tool that writes an idempotency key.",
      "cue": "\"All four promises depend on rules that are still being written. Who writes them?\"",
      "time": "30 s",
      "clock": "12:20"
    },
    {
      "step": 24,
      "slide": "Standards: opener",
      "say": "\"All four promises depend on rules that are still being written. Who writes them?\"",
      "cue": "Pause on the chapter frame, then click.",
      "time": "5 s",
      "clock": "12:20"
    },
    {
      "step": 25,
      "slide": "Standards: title + from/to",
      "say": "Two foundations now write the rules. CNCF hosts agent runtimes. The Agentic AI Foundation hosts protocols and gateways: A2A, Agent Router and, per its own posts, MCP itself. Agent Substrate went from first tag to an announced CNCF donation in about six months.",
      "cue": "Say \"announced\", not \"accepted\".",
      "time": "35 s",
      "clock": "12:55"
    },
    {
      "step": 26,
      "slide": "Standards: reading",
      "say": "The rules moved under the talks. MCP's July rewrite superseded claims in 4 of our 30 folders, and 3 more cited a version that is no longer current.",
      "cue": "—",
      "time": "35 s",
      "clock": "13:30"
    },
    {
      "step": 27,
      "slide": "Standards: so what",
      "say": "Buy for the split. Gate every agent-infrastructure purchase on neutral foundation and conformance, and name one owner for protocol changes.",
      "cue": "\"Now the uncomfortable one. Hands ready.\"",
      "time": "30 s",
      "clock": "14:00"
    },
    {
      "step": 28,
      "slide": "Hands down",
      "say": "**Live moment 2.** \"Hands up if a human must approve every production change an AI agent makes in your org.\" Wait. \"Keep it up only if that approval is enforced by something nobody can switch off.\"",
      "cue": "Let hands drop. **Silence, 3 seconds.**",
      "time": "50 s",
      "clock": "14:50"
    },
    {
      "step": 29,
      "slide": "Contrarian: toggles",
      "say": "Here is why. Since 1 September, Copilot can approve pull requests. Since 28 October, Agent Merge can merge them. Claude Code has a classifier-run auto mode. Fairly: the defaults still ask a human. But removing the gate is now one admin setting.",
      "cue": "—",
      "time": "40 s",
      "clock": "15:30"
    },
    {
      "step": 30,
      "slide": "Contrarian: so what",
      "say": "Design trust and rollback as if nobody reviews the action. The human is one control, not the last line of defence.",
      "cue": "\"So what do you do on Monday?\"",
      "time": "20 s",
      "clock": "15:50"
    },
    {
      "step": 31,
      "slide": "Monday: start",
      "say": "Five moves. Read a week of audit denials, then enforce. Meter every agent at one gateway. Make every tool that writes safe to retry. Re-plan capacity in paused agents and pod groups. Gate purchases on foundation and conformance.",
      "cue": "Point to \"Copy as checklist\" on the site.",
      "time": "45 s",
      "clock": "16:35"
    },
    {
      "step": 32,
      "slide": "Monday: stop",
      "say": "And five things to stop funding: your own sandbox, a custom scheduler before the Workload API, one Deployment per agent, chargeback by pod, and human approval as your last defence.",
      "cue": "—",
      "time": "40 s",
      "clock": "17:15"
    },
    {
      "step": 33,
      "slide": "For the CTO",
      "say": "My recommendation, not a finding: one accountable platform owner for all four promises, with security co-owning Trust and FinOps co-owning Cost. Hire for policy-as-code, token FinOps and recovery design.",
      "cue": "\"How much of this should you believe?\"",
      "time": "40 s",
      "clock": "17:55"
    },
    {
      "step": 34,
      "slide": "Confidence",
      "say": "Remember the 24%. 108 claims checked out as presented, 99 were corrected or overtaken, 251 are not fully confirmed. That is why every number on the site wears a label and a date.",
      "cue": "—",
      "time": "45 s",
      "clock": "18:40"
    },
    {
      "step": 35,
      "slide": "Close",
      "say": "**Optional closer:** \"Which of the four would you fund first?\" Take hands per shift, then: \"Tell me on LinkedIn; the link with every source is there.\"",
      "cue": "Leave the slide up.",
      "time": "40 s",
      "clock": "19:20"
    }
  ],
  "og": {
    "headline": "AI moved onto Kubernetes. Then it outgrew the pod.",
    "hook": "Only 108 of 458 claims checked out exactly as presented a week later.",
    "byline": "Felipe · KubeCon NA 2026"
  },
  "shareCfg": {
    "url": "https://www.feliperocha.systems/kubecon-2026",
    "display": "feliperocha.systems/kubecon-2026",
    "qr": "<svg viewBox=\"0 0 37 37\" shape-rendering=\"crispEdges\"><rect width=\"37\" height=\"37\" class=\"qr-bg\"/><path d=\"M2 2h1v1h-1zM3 2h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM6 2h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM10 2h1v1h-1zM11 2h1v1h-1zM12 2h1v1h-1zM14 2h1v1h-1zM15 2h1v1h-1zM16 2h1v1h-1zM17 2h1v1h-1zM19 2h1v1h-1zM20 2h1v1h-1zM23 2h1v1h-1zM24 2h1v1h-1zM28 2h1v1h-1zM29 2h1v1h-1zM30 2h1v1h-1zM31 2h1v1h-1zM32 2h1v1h-1zM33 2h1v1h-1zM34 2h1v1h-1zM2 3h1v1h-1zM8 3h1v1h-1zM10 3h1v1h-1zM11 3h1v1h-1zM14 3h1v1h-1zM15 3h1v1h-1zM16 3h1v1h-1zM18 3h1v1h-1zM20 3h1v1h-1zM21 3h1v1h-1zM22 3h1v1h-1zM24 3h1v1h-1zM26 3h1v1h-1zM28 3h1v1h-1zM34 3h1v1h-1zM2 4h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM8 4h1v1h-1zM10 4h1v1h-1zM13 4h1v1h-1zM14 4h1v1h-1zM15 4h1v1h-1zM16 4h1v1h-1zM17 4h1v1h-1zM18 4h1v1h-1zM21 4h1v1h-1zM22 4h1v1h-1zM23 4h1v1h-1zM24 4h1v1h-1zM28 4h1v1h-1zM30 4h1v1h-1zM31 4h1v1h-1zM32 4h1v1h-1zM34 4h1v1h-1zM2 5h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM12 5h1v1h-1zM13 5h1v1h-1zM14 5h1v1h-1zM16 5h1v1h-1zM17 5h1v1h-1zM18 5h1v1h-1zM20 5h1v1h-1zM22 5h1v1h-1zM23 5h1v1h-1zM28 5h1v1h-1zM30 5h1v1h-1zM31 5h1v1h-1zM32 5h1v1h-1zM34 5h1v1h-1zM2 6h1v1h-1zM4 6h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM8 6h1v1h-1zM10 6h1v1h-1zM11 6h1v1h-1zM12 6h1v1h-1zM13 6h1v1h-1zM14 6h1v1h-1zM17 6h1v1h-1zM18 6h1v1h-1zM23 6h1v1h-1zM25 6h1v1h-1zM28 6h1v1h-1zM30 6h1v1h-1zM31 6h1v1h-1zM32 6h1v1h-1zM34 6h1v1h-1zM2 7h1v1h-1zM8 7h1v1h-1zM11 7h1v1h-1zM12 7h1v1h-1zM15 7h1v1h-1zM17 7h1v1h-1zM18 7h1v1h-1zM19 7h1v1h-1zM20 7h1v1h-1zM21 7h1v1h-1zM25 7h1v1h-1zM28 7h1v1h-1zM34 7h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM18 8h1v1h-1zM20 8h1v1h-1zM22 8h1v1h-1zM24 8h1v1h-1zM26 8h1v1h-1zM28 8h1v1h-1zM29 8h1v1h-1zM30 8h1v1h-1zM31 8h1v1h-1zM32 8h1v1h-1zM33 8h1v1h-1zM34 8h1v1h-1zM15 9h1v1h-1zM17 9h1v1h-1zM18 9h1v1h-1zM24 9h1v1h-1zM25 9h1v1h-1zM2 10h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM9 10h1v1h-1zM10 10h1v1h-1zM14 10h1v1h-1zM16 10h1v1h-1zM19 10h1v1h-1zM22 10h1v1h-1zM24 10h1v1h-1zM25 10h1v1h-1zM26 10h1v1h-1zM27 10h1v1h-1zM30 10h1v1h-1zM32 10h1v1h-1zM33 10h1v1h-1zM34 10h1v1h-1zM3 11h1v1h-1zM4 11h1v1h-1zM7 11h1v1h-1zM11 11h1v1h-1zM12 11h1v1h-1zM13 11h1v1h-1zM15 11h1v1h-1zM16 11h1v1h-1zM17 11h1v1h-1zM18 11h1v1h-1zM19 11h1v1h-1zM20 11h1v1h-1zM21 11h1v1h-1zM23 11h1v1h-1zM24 11h1v1h-1zM25 11h1v1h-1zM30 11h1v1h-1zM31 11h1v1h-1zM32 11h1v1h-1zM33 11h1v1h-1zM3 12h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM6 12h1v1h-1zM8 12h1v1h-1zM9 12h1v1h-1zM10 12h1v1h-1zM12 12h1v1h-1zM13 12h1v1h-1zM14 12h1v1h-1zM15 12h1v1h-1zM17 12h1v1h-1zM22 12h1v1h-1zM25 12h1v1h-1zM28 12h1v1h-1zM30 12h1v1h-1zM31 12h1v1h-1zM32 12h1v1h-1zM34 12h1v1h-1zM3 13h1v1h-1zM5 13h1v1h-1zM7 13h1v1h-1zM9 13h1v1h-1zM10 13h1v1h-1zM12 13h1v1h-1zM13 13h1v1h-1zM15 13h1v1h-1zM17 13h1v1h-1zM20 13h1v1h-1zM21 13h1v1h-1zM25 13h1v1h-1zM27 13h1v1h-1zM28 13h1v1h-1zM29 13h1v1h-1zM32 13h1v1h-1zM34 13h1v1h-1zM3 14h1v1h-1zM8 14h1v1h-1zM10 14h1v1h-1zM12 14h1v1h-1zM13 14h1v1h-1zM15 14h1v1h-1zM17 14h1v1h-1zM19 14h1v1h-1zM21 14h1v1h-1zM23 14h1v1h-1zM25 14h1v1h-1zM26 14h1v1h-1zM28 14h1v1h-1zM34 14h1v1h-1zM2 15h1v1h-1zM3 15h1v1h-1zM4 15h1v1h-1zM6 15h1v1h-1zM7 15h1v1h-1zM9 15h1v1h-1zM16 15h1v1h-1zM20 15h1v1h-1zM21 15h1v1h-1zM22 15h1v1h-1zM23 15h1v1h-1zM25 15h1v1h-1zM27 15h1v1h-1zM28 15h1v1h-1zM29 15h1v1h-1zM32 15h1v1h-1zM2 16h1v1h-1zM3 16h1v1h-1zM4 16h1v1h-1zM5 16h1v1h-1zM6 16h1v1h-1zM7 16h1v1h-1zM8 16h1v1h-1zM10 16h1v1h-1zM11 16h1v1h-1zM12 16h1v1h-1zM14 16h1v1h-1zM17 16h1v1h-1zM19 16h1v1h-1zM21 16h1v1h-1zM22 16h1v1h-1zM28 16h1v1h-1zM30 16h1v1h-1zM31 16h1v1h-1zM2 17h1v1h-1zM7 17h1v1h-1zM10 17h1v1h-1zM11 17h1v1h-1zM12 17h1v1h-1zM15 17h1v1h-1zM18 17h1v1h-1zM20 17h1v1h-1zM22 17h1v1h-1zM24 17h1v1h-1zM27 17h1v1h-1zM29 17h1v1h-1zM31 17h1v1h-1zM32 17h1v1h-1zM34 17h1v1h-1zM2 18h1v1h-1zM5 18h1v1h-1zM8 18h1v1h-1zM9 18h1v1h-1zM10 18h1v1h-1zM12 18h1v1h-1zM13 18h1v1h-1zM17 18h1v1h-1zM24 18h1v1h-1zM25 18h1v1h-1zM27 18h1v1h-1zM28 18h1v1h-1zM29 18h1v1h-1zM30 18h1v1h-1zM31 18h1v1h-1zM2 19h1v1h-1zM4 19h1v1h-1zM6 19h1v1h-1zM7 19h1v1h-1zM9 19h1v1h-1zM10 19h1v1h-1zM11 19h1v1h-1zM13 19h1v1h-1zM14 19h1v1h-1zM16 19h1v1h-1zM19 19h1v1h-1zM20 19h1v1h-1zM21 19h1v1h-1zM22 19h1v1h-1zM23 19h1v1h-1zM24 19h1v1h-1zM28 19h1v1h-1zM30 19h1v1h-1zM32 19h1v1h-1zM33 19h1v1h-1zM34 19h1v1h-1zM2 20h1v1h-1zM4 20h1v1h-1zM5 20h1v1h-1zM7 20h1v1h-1zM8 20h1v1h-1zM11 20h1v1h-1zM12 20h1v1h-1zM13 20h1v1h-1zM17 20h1v1h-1zM19 20h1v1h-1zM20 20h1v1h-1zM21 20h1v1h-1zM25 20h1v1h-1zM27 20h1v1h-1zM28 20h1v1h-1zM29 20h1v1h-1zM31 20h1v1h-1zM32 20h1v1h-1zM33 20h1v1h-1zM34 20h1v1h-1zM7 21h1v1h-1zM9 21h1v1h-1zM13 21h1v1h-1zM14 21h1v1h-1zM16 21h1v1h-1zM17 21h1v1h-1zM18 21h1v1h-1zM21 21h1v1h-1zM22 21h1v1h-1zM26 21h1v1h-1zM30 21h1v1h-1zM31 21h1v1h-1zM32 21h1v1h-1zM6 22h1v1h-1zM8 22h1v1h-1zM11 22h1v1h-1zM12 22h1v1h-1zM13 22h1v1h-1zM16 22h1v1h-1zM18 22h1v1h-1zM20 22h1v1h-1zM21 22h1v1h-1zM23 22h1v1h-1zM29 22h1v1h-1zM31 22h1v1h-1zM33 22h1v1h-1zM2 23h1v1h-1zM3 23h1v1h-1zM4 23h1v1h-1zM5 23h1v1h-1zM6 23h1v1h-1zM7 23h1v1h-1zM10 23h1v1h-1zM11 23h1v1h-1zM15 23h1v1h-1zM24 23h1v1h-1zM27 23h1v1h-1zM29 23h1v1h-1zM30 23h1v1h-1zM2 24h1v1h-1zM7 24h1v1h-1zM8 24h1v1h-1zM9 24h1v1h-1zM11 24h1v1h-1zM12 24h1v1h-1zM14 24h1v1h-1zM19 24h1v1h-1zM20 24h1v1h-1zM21 24h1v1h-1zM22 24h1v1h-1zM23 24h1v1h-1zM25 24h1v1h-1zM28 24h1v1h-1zM29 24h1v1h-1zM30 24h1v1h-1zM32 24h1v1h-1zM33 24h1v1h-1zM34 24h1v1h-1zM2 25h1v1h-1zM5 25h1v1h-1zM6 25h1v1h-1zM7 25h1v1h-1zM9 25h1v1h-1zM10 25h1v1h-1zM16 25h1v1h-1zM17 25h1v1h-1zM19 25h1v1h-1zM21 25h1v1h-1zM22 25h1v1h-1zM25 25h1v1h-1zM26 25h1v1h-1zM27 25h1v1h-1zM28 25h1v1h-1zM30 25h1v1h-1zM32 25h1v1h-1zM33 25h1v1h-1zM2 26h1v1h-1zM3 26h1v1h-1zM5 26h1v1h-1zM7 26h1v1h-1zM8 26h1v1h-1zM10 26h1v1h-1zM11 26h1v1h-1zM13 26h1v1h-1zM14 26h1v1h-1zM16 26h1v1h-1zM18 26h1v1h-1zM22 26h1v1h-1zM26 26h1v1h-1zM27 26h1v1h-1zM28 26h1v1h-1zM29 26h1v1h-1zM30 26h1v1h-1zM31 26h1v1h-1zM33 26h1v1h-1zM34 26h1v1h-1zM10 27h1v1h-1zM11 27h1v1h-1zM12 27h1v1h-1zM14 27h1v1h-1zM15 27h1v1h-1zM16 27h1v1h-1zM17 27h1v1h-1zM19 27h1v1h-1zM20 27h1v1h-1zM23 27h1v1h-1zM26 27h1v1h-1zM30 27h1v1h-1zM32 27h1v1h-1zM34 27h1v1h-1zM2 28h1v1h-1zM3 28h1v1h-1zM4 28h1v1h-1zM5 28h1v1h-1zM6 28h1v1h-1zM7 28h1v1h-1zM8 28h1v1h-1zM10 28h1v1h-1zM12 28h1v1h-1zM13 28h1v1h-1zM14 28h1v1h-1zM17 28h1v1h-1zM18 28h1v1h-1zM19 28h1v1h-1zM21 28h1v1h-1zM22 28h1v1h-1zM24 28h1v1h-1zM25 28h1v1h-1zM26 28h1v1h-1zM28 28h1v1h-1zM30 28h1v1h-1zM32 28h1v1h-1zM2 29h1v1h-1zM8 29h1v1h-1zM10 29h1v1h-1zM11 29h1v1h-1zM16 29h1v1h-1zM19 29h1v1h-1zM20 29h1v1h-1zM21 29h1v1h-1zM25 29h1v1h-1zM26 29h1v1h-1zM30 29h1v1h-1zM31 29h1v1h-1zM32 29h1v1h-1zM2 30h1v1h-1zM4 30h1v1h-1zM5 30h1v1h-1zM6 30h1v1h-1zM8 30h1v1h-1zM10 30h1v1h-1zM11 30h1v1h-1zM13 30h1v1h-1zM14 30h1v1h-1zM16 30h1v1h-1zM17 30h1v1h-1zM18 30h1v1h-1zM19 30h1v1h-1zM21 30h1v1h-1zM22 30h1v1h-1zM25 30h1v1h-1zM26 30h1v1h-1zM27 30h1v1h-1zM28 30h1v1h-1zM29 30h1v1h-1zM30 30h1v1h-1zM34 30h1v1h-1zM2 31h1v1h-1zM4 31h1v1h-1zM5 31h1v1h-1zM6 31h1v1h-1zM8 31h1v1h-1zM10 31h1v1h-1zM12 31h1v1h-1zM16 31h1v1h-1zM18 31h1v1h-1zM19 31h1v1h-1zM20 31h1v1h-1zM23 31h1v1h-1zM25 31h1v1h-1zM26 31h1v1h-1zM27 31h1v1h-1zM29 31h1v1h-1zM32 31h1v1h-1zM33 31h1v1h-1zM34 31h1v1h-1zM2 32h1v1h-1zM4 32h1v1h-1zM5 32h1v1h-1zM6 32h1v1h-1zM8 32h1v1h-1zM11 32h1v1h-1zM12 32h1v1h-1zM14 32h1v1h-1zM16 32h1v1h-1zM17 32h1v1h-1zM20 32h1v1h-1zM21 32h1v1h-1zM23 32h1v1h-1zM24 32h1v1h-1zM27 32h1v1h-1zM29 32h1v1h-1zM30 32h1v1h-1zM31 32h1v1h-1zM33 32h1v1h-1zM34 32h1v1h-1zM2 33h1v1h-1zM8 33h1v1h-1zM11 33h1v1h-1zM12 33h1v1h-1zM13 33h1v1h-1zM14 33h1v1h-1zM21 33h1v1h-1zM22 33h1v1h-1zM24 33h1v1h-1zM25 33h1v1h-1zM27 33h1v1h-1zM28 33h1v1h-1zM29 33h1v1h-1zM30 33h1v1h-1zM31 33h1v1h-1zM32 33h1v1h-1zM33 33h1v1h-1zM34 33h1v1h-1zM2 34h1v1h-1zM3 34h1v1h-1zM4 34h1v1h-1zM5 34h1v1h-1zM6 34h1v1h-1zM7 34h1v1h-1zM8 34h1v1h-1zM10 34h1v1h-1zM12 34h1v1h-1zM17 34h1v1h-1zM19 34h1v1h-1zM24 34h1v1h-1zM25 34h1v1h-1zM26 34h1v1h-1zM28 34h1v1h-1zM29 34h1v1h-1zM30 34h1v1h-1z\" class=\"qr-fg\"/></svg>"
  }
} as KubeConContent;
