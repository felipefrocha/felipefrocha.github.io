import { useState } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  GitBranch,
  Layers,
  Lock,
  Server,
  Shield,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEO } from '@/components/atoms/SEO';
import {
  InteractiveSequenceDiagram,
  InteractiveTopologyDiagram,
  SemanticLegendBar,
} from '@/components/organisms/architecture/ProjectADiagrams';
import {
  ARCHITECTURAL_INVARIANTS,
  COMPARISON_ROWS,
  CONTROL_PLANE_EDGES,
  CONTROL_PLANE_EXTERNAL,
  CONTROL_PLANE_GROUPS,
  CONTROL_PLANE_NARRATIVE,
  EXECUTIVE_THESIS,
  OPTION_A_EDGES,
  OPTION_A_EXTERNAL,
  OPTION_A_GROUPS,
  OPTION_A_NARRATIVE,
  OPTION_B_EDGES,
  OPTION_B_EXTERNAL,
  OPTION_B_GROUPS,
  OPTION_B_NARRATIVE,
} from '@/content/projectAArchitectureData';
import {
  CONTROL_PLANE_LAYOUT,
  OPTION_A_LAYOUT,
  OPTION_B_LAYOUT,
} from '@/content/projectADiagramLayouts';
import { cn } from '@/lib/utils';

type ExplorerTab = 'control-plane' | 'option-a' | 'option-b' | 'sequence';

const INVARIANT_ICONS = [Server, Cpu, Layers, Shield, GitBranch];

export default function ProjectAArchitecture() {
  const [activeTab, setActiveTab] = useState<ExplorerTab>('option-a');

  const siteUrl =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.feliperocha.systems';
  const canonicalUrl = `${siteUrl}/portfolio/project-a-architecture`;

  return (
    <article className="py-10 md:py-14">
      <SEO
        title="ProjectA: Dual-Tier Agentic AI Workbench Architecture"
        description="Architectural discussion comparing complementary Option A (Sovereign Clean-Room Project Cell) and Option B (Agile Multi-Tenant Project Namespace) built on Kagent 1.0 Agent Substrate, Code Mode, Stateless MCPs, and Zero-Trust AgentGateway."
        canonical={canonicalUrl}
        type="article"
        tags={[
          'Agentic AI',
          'Kagent 1.0',
          'AgentGateway',
          'MCP',
          'RFC 8693',
          'Kubernetes',
          'Zero Trust',
        ]}
      />

      <div className="container-default max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Back / Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Button variant="ghost" size="sm" className="-ml-2 h-8 px-2 text-muted-foreground hover:text-foreground" asChild>
            <Link href="/portfolio" data-testid="link-back-to-portfolio">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
              Back to Portfolio
            </Link>
          </Button>
          <span aria-hidden="true">/</span>
          <span className="font-mono text-foreground/80 truncate">
            Architectural Discussions for AI
          </span>
        </nav>

        {/* Header & Executive Thesis */}
        <header className="space-y-6">
          <div className="space-y-3 max-w-4xl">
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] bg-indigo-500/10 text-indigo-700 border-indigo-500/20 dark:bg-indigo-400/10 dark:text-indigo-300 dark:border-indigo-400/25"
              data-testid="badge-eyebrow-ai-arch"
            >
              <Layers className="h-3 w-3" aria-hidden="true" />
              {EXECUTIVE_THESIS.eyebrow}
            </Badge>

            <h1
              className="text-h1 text-3xl sm:text-4xl font-bold tracking-tight"
              data-testid="text-project-a-title"
            >
              {EXECUTIVE_THESIS.title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground text-pretty leading-relaxed">
              {EXECUTIVE_THESIS.subtitle}
            </p>
          </div>

          {/* Complementary Tiers Callout */}
          <div
            className="surface-subtle p-5 sm:p-6 space-y-5"
            data-testid="callout-complementary-tiers"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>{EXECUTIVE_THESIS.calloutHeading}</span>
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed text-pretty">
                {EXECUTIVE_THESIS.calloutBody}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {EXECUTIVE_THESIS.tiers.map((tier) => {
                const isSovereign = tier.id === 'option-a';
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(isSovereign ? 'option-a' : 'option-b');
                      document
                        .getElementById('architecture-explorer')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={cn(
                      'text-left rounded-xl border p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isSovereign
                        ? 'bg-amber-50/60 border-amber-300/80 hover:border-amber-500 dark:bg-amber-950/25 dark:border-amber-600/40 dark:hover:border-amber-400'
                        : 'bg-sky-50/60 border-sky-300/80 hover:border-sky-500 dark:bg-sky-950/25 dark:border-sky-600/40 dark:hover:border-sky-400'
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-foreground">{tier.name}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          'font-mono text-[11px]',
                          isSovereign
                            ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/60 dark:text-amber-200 dark:border-amber-600/50'
                            : 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-900/60 dark:text-sky-200 dark:border-sky-600/50'
                        )}
                      >
                        {tier.badge}
                      </Badge>
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground mb-2">
                      {tier.footprint}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tier.summary}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Section 1: 5 Core Architectural Invariants */}
        <section aria-labelledby="heading-invariants" className="space-y-5">
          <div className="space-y-1.5">
            <span className="font-mono text-xs text-primary font-medium">Section 01</span>
            <h2 id="heading-invariants" className="text-h2 text-2xl font-semibold tracking-tight">
              Core Architectural Invariants Across Both Tiers
            </h2>
            <p className="text-sm text-muted-foreground max-w-3xl">
              Regardless of whether Legal API routes ProjectA to Option A or Option B, five
              non-negotiable runtime, security, and state invariants stay identical.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {ARCHITECTURAL_INVARIANTS.map((inv, index) => {
              const Icon = INVARIANT_ICONS[index] ?? Shield;
              const isFullSpan = index === ARCHITECTURAL_INVARIANTS.length - 1;
              return (
                <Card
                  key={inv.number}
                  className={cn(
                    'border-border/70 bg-card/70',
                    isFullSpan && 'md:col-span-2'
                  )}
                  data-testid={`card-invariant-${inv.number}`}
                >
                  <CardHeader className="pb-2.5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-primary">
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        Invariant 0{inv.number}
                      </span>
                      <Badge variant="outline" className="font-mono text-[11px]">
                        {inv.specBadge}
                      </Badge>
                    </div>
                    <CardTitle className="text-base leading-snug">{inv.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5 text-sm text-muted-foreground">
                    <p className="leading-relaxed text-pretty">{inv.summary}</p>
                    <ul className="space-y-1.5 border-t border-border/50 pt-2.5 text-xs">
                      {inv.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Lock
                            className="h-3 w-3 shrink-0 mt-1 text-primary/80"
                            aria-hidden="true"
                          />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Section 2: Interactive Architecture Explorer & Diagrams */}
        <section
          id="architecture-explorer"
          aria-labelledby="heading-explorer"
          className="space-y-5 scroll-mt-16"
        >
          <div className="space-y-1.5">
            <span className="font-mono text-xs text-primary font-medium">Section 02</span>
            <h2 id="heading-explorer" className="text-h2 text-2xl font-semibold tracking-tight">
              Interactive Architecture Explorer & Diagrams
            </h2>
            <p className="text-sm text-muted-foreground max-w-3xl">
              Switch between the GitOps contract-framing control plane, Option A Sovereign Cell,
              Option B Agile Multi-Tenant Namespace, and the 24-step runtime execution sequence.
            </p>
          </div>

          <SemanticLegendBar />

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as ExplorerTab)}
            className="space-y-5"
          >
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-1 gap-1">
              <TabsTrigger
                value="control-plane"
                className="py-2 text-xs sm:text-sm whitespace-normal leading-tight"
                data-testid="tab-control-plane"
              >
                1. Control Plane & GitOps
              </TabsTrigger>
              <TabsTrigger
                value="option-a"
                className="py-2 text-xs sm:text-sm whitespace-normal leading-tight"
                data-testid="tab-option-a"
              >
                2. Option A: Sovereign Cell
              </TabsTrigger>
              <TabsTrigger
                value="option-b"
                className="py-2 text-xs sm:text-sm whitespace-normal leading-tight"
                data-testid="tab-option-b"
              >
                3. Option B: Agile Namespace
              </TabsTrigger>
              <TabsTrigger
                value="sequence"
                className="py-2 text-xs sm:text-sm whitespace-normal leading-tight"
                data-testid="tab-sequence"
              >
                4. Runtime Sequence (24 Steps)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="control-plane" className="mt-0">
              <InteractiveTopologyDiagram
                id="control-plane"
                narrative={CONTROL_PLANE_NARRATIVE}
                externalNodes={CONTROL_PLANE_EXTERNAL}
                groups={CONTROL_PLANE_GROUPS}
                edges={CONTROL_PLANE_EDGES}
                layout={CONTROL_PLANE_LAYOUT}
                defaultSelectedNodeId="MAI"
              />
            </TabsContent>

            <TabsContent value="option-a" className="mt-0">
              <InteractiveTopologyDiagram
                id="option-a"
                narrative={OPTION_A_NARRATIVE}
                externalNodes={OPTION_A_EXTERNAL}
                groups={OPTION_A_GROUPS}
                edges={OPTION_A_EDGES}
                layout={OPTION_A_LAYOUT}
                defaultSelectedNodeId="MCP_GW"
              />
            </TabsContent>

            <TabsContent value="option-b" className="mt-0">
              <InteractiveTopologyDiagram
                id="option-b"
                narrative={OPTION_B_NARRATIVE}
                externalNodes={OPTION_B_EXTERNAL}
                groups={OPTION_B_GROUPS}
                edges={OPTION_B_EDGES}
                layout={OPTION_B_LAYOUT}
                defaultSelectedNodeId="SharedCNPG"
              />
            </TabsContent>

            <TabsContent value="sequence" className="mt-0">
              <InteractiveSequenceDiagram />
            </TabsContent>
          </Tabs>
        </section>

        {/* Section 3: Side-by-Side Comparison Matrix */}
        <section aria-labelledby="heading-comparison" className="space-y-5">
          <div className="space-y-1.5">
            <span className="font-mono text-xs text-primary font-medium">Section 03</span>
            <h2 id="heading-comparison" className="text-h2 text-2xl font-semibold tracking-tight">
              Side-by-Side Comparison Matrix: Option A vs. Option B
            </h2>
            <p className="text-sm text-muted-foreground max-w-3xl">
              Complete 11-dimension comparison across isolation guarantees, state persistence,
              observability, provisioning velocity, and automated Solvere tier selection.
            </p>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-label="Option A vs Option B Comparison Matrix"
            data-testid="comparison-matrix-region"
            className="rounded-xl border border-border/80 bg-card/60 overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <table className="w-full min-w-[720px] border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th
                    scope="col"
                    className="py-3.5 px-4 font-semibold text-foreground w-[24%]"
                  >
                    Dimension
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-4 font-semibold text-amber-900 dark:text-amber-200 bg-amber-500/10 w-[38%]"
                  >
                    Option A: Sovereign Project Cell (ProjectA)
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 px-4 font-semibold text-sky-900 dark:text-sky-200 bg-sky-500/10 w-[38%]"
                  >
                    Option B: Agile Multi-Tenant Project Namespace (ProjectA)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {COMPARISON_ROWS.map((row) => (
                  <tr
                    key={row.dimension}
                    className="hover:bg-muted/30 transition-colors align-top"
                  >
                    <th
                      scope="row"
                      className="py-3.5 px-4 font-medium text-foreground text-xs sm:text-sm"
                    >
                      {row.dimension}
                    </th>
                    <td className="py-3.5 px-4 text-muted-foreground leading-relaxed bg-amber-500/[0.03]">
                      {row.optionA}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground leading-relaxed bg-sky-500/[0.03]">
                      {row.optionB}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </article>
  );
}
