import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeftRight,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FastForward,
  Info,
  Network,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  SEMANTIC_LEGEND,
  SEQUENCE_PARTICIPANTS,
  SEQUENCE_PHASES,
  SEQUENCE_STEPS,
  type DiagramEdge,
  type DiagramGroup,
  type DiagramNode,
  type SemanticNodeClass,
  type SequencePhaseId,
  type TopologyNarrative,
} from '@/content/projectAArchitectureData';
import type { TopologyCanvasLayout } from '@/content/projectADiagramLayouts';

const NODE_STYLE_MAP: Record<
  SemanticNodeClass,
  {
    surface: string;
    selected: string;
    badge: string;
    dot: string;
    svgContainerFill: string;
    svgContainerStroke: string;
    svgHeaderText: string;
    packetHex: string;
  }
> = {
  control: {
    surface:
      'bg-indigo-50/95 border-indigo-300/90 text-indigo-950 hover:border-indigo-500 dark:bg-indigo-950/75 dark:border-indigo-500/55 dark:text-indigo-100 dark:hover:border-indigo-400',
    selected:
      'ring-2 ring-indigo-500 border-indigo-600 bg-indigo-100 dark:ring-indigo-400 dark:border-indigo-400 dark:bg-indigo-900/85',
    badge:
      'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/70 dark:text-indigo-200 dark:border-indigo-600/50',
    dot: 'bg-indigo-500 dark:bg-indigo-400',
    svgContainerFill: 'fill-indigo-500/[0.04] dark:fill-indigo-400/[0.05]',
    svgContainerStroke: 'stroke-indigo-400/55 dark:stroke-indigo-500/45',
    svgHeaderText: 'fill-indigo-900 dark:fill-indigo-200',
    packetHex: '#6366f1',
  },
  dedicated: {
    surface:
      'bg-amber-50/95 border-amber-400/90 text-amber-950 hover:border-amber-600 dark:bg-amber-950/70 dark:border-amber-500/55 dark:text-amber-100 dark:hover:border-amber-400',
    selected:
      'ring-2 ring-amber-500 border-amber-600 bg-amber-100 dark:ring-amber-400 dark:border-amber-400 dark:bg-amber-900/80',
    badge:
      'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/70 dark:text-amber-200 dark:border-amber-600/50',
    dot: 'bg-amber-500 dark:bg-amber-400',
    svgContainerFill: 'fill-amber-500/[0.04] dark:fill-amber-400/[0.04]',
    svgContainerStroke: 'stroke-amber-500/65 dark:stroke-amber-400/50',
    svgHeaderText: 'fill-amber-900 dark:fill-amber-200',
    packetHex: '#f59e0b',
  },
  shared: {
    surface:
      'bg-sky-50/95 border-sky-300/90 text-sky-950 hover:border-sky-500 dark:bg-sky-950/70 dark:border-sky-500/55 dark:text-sky-100 dark:hover:border-sky-400',
    selected:
      'ring-2 ring-sky-500 border-sky-600 bg-sky-100 dark:ring-sky-400 dark:border-sky-400 dark:bg-sky-900/80',
    badge:
      'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-900/70 dark:text-sky-200 dark:border-sky-600/50',
    dot: 'bg-sky-500 dark:bg-sky-400',
    svgContainerFill: 'fill-sky-500/[0.04] dark:fill-sky-400/[0.05]',
    svgContainerStroke: 'stroke-sky-400/60 dark:stroke-sky-500/45',
    svgHeaderText: 'fill-sky-900 dark:fill-sky-200',
    packetHex: '#0ea5e9',
  },
  gateway: {
    surface:
      'bg-rose-50/95 border-rose-300/90 text-rose-950 hover:border-rose-500 dark:bg-rose-950/70 dark:border-rose-500/55 dark:text-rose-100 dark:hover:border-rose-400',
    selected:
      'ring-2 ring-rose-500 border-rose-600 bg-rose-100 dark:ring-rose-400 dark:border-rose-400 dark:bg-rose-900/80',
    badge:
      'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-900/70 dark:text-rose-200 dark:border-rose-600/50',
    dot: 'bg-rose-500 dark:bg-rose-400',
    svgContainerFill: 'fill-rose-500/[0.05] dark:fill-rose-400/[0.06]',
    svgContainerStroke: 'stroke-rose-400/70 dark:stroke-rose-500/55',
    svgHeaderText: 'fill-rose-900 dark:fill-rose-200',
    packetHex: '#f43f5e',
  },
  substrate: {
    surface:
      'bg-emerald-50/95 border-emerald-300/90 text-emerald-950 hover:border-emerald-500 dark:bg-emerald-950/70 dark:border-emerald-500/55 dark:text-emerald-100 dark:hover:border-emerald-400',
    selected:
      'ring-2 ring-emerald-500 border-emerald-600 bg-emerald-100 dark:ring-emerald-400 dark:border-emerald-400 dark:bg-emerald-900/80',
    badge:
      'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/70 dark:text-emerald-200 dark:border-emerald-600/50',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
    svgContainerFill: 'fill-emerald-500/[0.04] dark:fill-emerald-400/[0.05]',
    svgContainerStroke: 'stroke-emerald-500/65 dark:stroke-emerald-400/55',
    svgHeaderText: 'fill-emerald-900 dark:fill-emerald-200',
    packetHex: '#10b981',
  },
  external: {
    surface:
      'bg-slate-100/95 border-slate-300 border-dashed text-slate-900 hover:border-slate-500 dark:bg-slate-900/80 dark:border-slate-600 dark:text-slate-100 dark:hover:border-slate-400',
    selected:
      'ring-2 ring-slate-500 border-slate-600 bg-slate-200/90 dark:ring-slate-400 dark:border-slate-400 dark:bg-slate-800/90',
    badge:
      'bg-slate-200/80 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600',
    dot: 'bg-slate-500 dark:bg-slate-400',
    svgContainerFill: 'fill-muted/30',
    svgContainerStroke: 'stroke-border',
    svgHeaderText: 'fill-foreground',
    packetHex: '#64748b',
  },
};

export function SemanticLegendBar() {
  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-3.5 py-2.5"
      role="region"
      aria-label="Architecture diagram color legend"
      data-testid="architecture-color-legend"
    >
      <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mr-1">
        Legend:
      </span>
      {SEMANTIC_LEGEND.map((item) => {
        const style = NODE_STYLE_MAP[item.id];
        return (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <span
                tabIndex={0}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium cursor-help focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  style.badge
                )}
              >
                <span className={cn('h-2 w-2 rounded-full shrink-0', style.dot)} aria-hidden="true" />
                {item.label}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs">
              {item.description}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

interface InteractiveTopologyDiagramProps {
  id: string;
  narrative: TopologyNarrative;
  externalNodes: DiagramNode[];
  groups: DiagramGroup[];
  edges: DiagramEdge[];
  layout: TopologyCanvasLayout;
  defaultSelectedNodeId: string;
}

export function InteractiveTopologyDiagram({
  id,
  narrative,
  externalNodes,
  groups,
  edges,
  layout,
  defaultSelectedNodeId,
}: InteractiveTopologyDiagramProps) {
  const prefersReducedMotion = useReducedMotion();
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [inspectedNodeId, setInspectedNodeId] = useState<string>(defaultSelectedNodeId);
  const [activeEdgeIndex, setActiveEdgeIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(() => !prefersReducedMotion);

  const allNodes = useMemo(() => {
    const list: DiagramNode[] = [...externalNodes];
    for (const group of groups) {
      list.push(...group.nodes);
      if (group.subgroups) {
        for (const sub of group.subgroups) {
          list.push(...sub.nodes);
        }
      }
    }
    return list;
  }, [externalNodes, groups]);

  const nodeMap = useMemo(() => new Map(allNodes.map((n) => [n.id, n])), [allNodes]);

  useEffect(() => {
    if (prefersReducedMotion || !isPlaying || edges.length === 0) return;
    const timer = window.setInterval(() => {
      setActiveEdgeIndex((prev) => (prev + 1) % edges.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, isPlaying, edges.length]);

  const activeEdge = edges[activeEdgeIndex] ?? edges[0];
  const inspectedNode = nodeMap.get(inspectedNodeId) ?? allNodes[0];

  const relatedEdges = useMemo(
    () => edges.filter((e) => e.from === inspectedNode?.id || e.to === inspectedNode?.id),
    [edges, inspectedNode]
  );

  const focusedEdges = useMemo(() => {
    if (!focusedNodeId) return new Set<string>();
    return new Set(
      edges
        .filter((e) => e.from === focusedNodeId || e.to === focusedNodeId)
        .map((e) => e.id)
    );
  }, [edges, focusedNodeId]);

  const focusedConnectedNodes = useMemo(() => {
    const set = new Set<string>();
    if (!focusedNodeId) return set;
    set.add(focusedNodeId);
    for (const e of edges) {
      if (e.from === focusedNodeId || e.to === focusedNodeId) {
        set.add(e.from);
        set.add(e.to);
      }
    }
    return set;
  }, [edges, focusedNodeId]);

  const handleSelectNode = (nodeId: string) => {
    setInspectedNodeId(nodeId);
    setFocusedNodeId((prev) => (prev === nodeId ? null : nodeId));
    const firstConnectedIdx = edges.findIndex((e) => e.from === nodeId || e.to === nodeId);
    if (firstConnectedIdx >= 0) {
      setActiveEdgeIndex(firstConnectedIdx);
    }
  };

  const handleSelectEdge = (edgeIdx: number) => {
    const edge = edges[edgeIdx];
    if (!edge) return;
    setActiveEdgeIndex(edgeIdx);
    setInspectedNodeId(edge.to);
    setFocusedNodeId(null);
  };

  const activeFromNode = activeEdge ? nodeMap.get(activeEdge.from) : undefined;
  const activeToNode = activeEdge ? nodeMap.get(activeEdge.to) : undefined;
  const activeRoute = activeEdge ? layout.edgeRoutes[activeEdge.id] : undefined;

  return (
    <div className="space-y-6" data-testid={`topology-panel-${id}`}>
      {/* Narrative & Triggers */}
      <div className="rounded-xl border border-border/70 bg-card/70 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <span className="inline-block font-mono text-xs font-medium text-primary">
              {narrative.eyebrow}
            </span>
            <h3 className="text-h3 text-xl sm:text-2xl font-semibold tracking-tight">
              {narrative.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
              {narrative.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2 shrink-0 lg:w-64">
            {narrative.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2"
              >
                <div className="text-[11px] font-mono text-muted-foreground">{m.label}</div>
                <div className="text-xs font-semibold text-foreground mt-0.5">{m.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border/50 pt-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
            {narrative.calloutTitle}
          </h4>
          <div className="grid gap-3 md:grid-cols-3">
            {narrative.triggers.map((trigger) => (
              <div
                key={trigger.title}
                className="rounded-lg border border-border/60 bg-background/60 p-3.5 space-y-1.5"
              >
                <div className="text-xs font-semibold text-foreground">{trigger.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {trigger.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2D SVG Block & Flow Diagram Canvas */}
      <div className="rounded-xl border border-border/80 bg-card/60 p-4 sm:p-5 space-y-4">
        {/* Interactive Flow Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Network className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
            <span>
              Interactive Block &amp; Flow Diagram — click any block or connector path to trace trust boundaries
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              variant={isPlaying ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsPlaying((prev) => !prev)}
              data-testid={`button-flow-play-${id}`}
              className="h-8 text-xs"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  Pause Flow
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  Animate Flow
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              aria-label="Previous flow step"
              data-testid={`button-flow-prev-${id}`}
              onClick={() => {
                setIsPlaying(false);
                setActiveEdgeIndex((prev) => (prev - 1 + edges.length) % edges.length);
              }}
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>

            <Badge
              variant="secondary"
              className="font-mono text-[11px] px-2 py-1"
              data-testid={`text-flow-step-${id}`}
            >
              Flow {activeEdgeIndex + 1} / {edges.length}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              aria-label="Next flow step"
              data-testid={`button-flow-next-${id}`}
              onClick={() => {
                setIsPlaying(false);
                setActiveEdgeIndex((prev) => (prev + 1) % edges.length);
              }}
            >
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>

            {focusedNodeId && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setFocusedNodeId(null)}
                data-testid={`button-flow-reset-${id}`}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* SVG Block & Flow Diagram */}
        <div
          tabIndex={0}
          role="region"
          aria-label={`${narrative.title} interactive block and flow diagram`}
          className="rounded-xl border border-border/70 bg-background/80 overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="min-w-[920px] p-2">
            <svg
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              className="w-full h-auto block select-none"
              data-testid={`svg-topology-${id}`}
            >
              <defs>
                <marker
                  id={`arrow-end-muted-${id}`}
                  viewBox="0 0 10 10"
                  refX="8.5"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 9 5 L 0 8.5 z" className="fill-slate-400 dark:fill-slate-500" />
                </marker>
                <marker
                  id={`arrow-end-active-${id}`}
                  viewBox="0 0 10 10"
                  refX="8.5"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.2 L 9.5 5 L 0 8.8 z" className="fill-primary" />
                </marker>
                <filter id={`packet-glow-${id}`} x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="2.8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Layer 1: Subgraph Container Boxes */}
              {layout.containers.map((box) => {
                const style =
                  box.tone === 'neutral'
                    ? {
                        svgContainerFill: 'fill-muted/30',
                        svgContainerStroke: 'stroke-border',
                        svgHeaderText: 'fill-foreground',
                      }
                    : NODE_STYLE_MAP[box.tone];
                return (
                  <g key={box.id}>
                    <rect
                      x={box.x}
                      y={box.y}
                      width={box.w}
                      height={box.h}
                      rx={14}
                      strokeWidth={box.dashedPerimeter ? 2 : 1.5}
                      strokeDasharray={box.dashedPerimeter ? '7 4' : undefined}
                      className={cn(
                        style.svgContainerFill,
                        box.dashedPerimeter
                          ? 'stroke-rose-500/75 dark:stroke-rose-400/75'
                          : style.svgContainerStroke
                      )}
                    />
                    <text
                      x={box.x + 14}
                      y={box.y + 21}
                      className={cn('text-[12px] font-semibold font-sans', style.svgHeaderText)}
                    >
                      {box.title}
                    </text>
                    {box.subtitle && (
                      <text
                        x={box.x + 14}
                        y={box.y + 36}
                        className="text-[10.5px] font-mono fill-muted-foreground"
                      >
                        {box.subtitle}
                      </text>
                    )}
                    {box.perimeterBadge && (
                      <g>
                        <rect
                          x={box.x + box.w - 144}
                          y={box.y + 8}
                          width={132}
                          height={20}
                          rx={6}
                          className="fill-rose-500/15 stroke-rose-500/50 dark:fill-rose-400/15 dark:stroke-rose-400/50"
                          strokeWidth={1}
                        />
                        <text
                          x={box.x + box.w - 78}
                          y={box.y + 21}
                          textAnchor="middle"
                          className="text-[10px] font-mono font-semibold fill-rose-700 dark:fill-rose-300"
                        >
                          {box.perimeterBadge}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Layer 2: Directional Connector Paths & Animated Flow Packets */}
              {edges.map((edge, idx) => {
                const route = layout.edgeRoutes[edge.id];
                if (!route) return null;
                const isActiveStep = idx === activeEdgeIndex;
                const isFocusedEdge = focusedEdges.has(edge.id);
                const isHighlighted = isActiveStep || isFocusedEdge;
                const isDimmed = Boolean(focusedNodeId) && !isFocusedEdge && !isActiveStep;
                const isDashed = edge.style === 'dashed';
                const isBidirectional = edge.style === 'bidirectional';

                return (
                  <g
                    key={edge.id}
                    data-testid={`svg-edge-${edge.id}`}
                    className={cn(
                      'transition-opacity duration-150',
                      isDimmed ? 'opacity-25' : 'opacity-100'
                    )}
                  >
                    {/* Wide transparent hit target */}
                    <path
                      d={route.d}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={14}
                      className="cursor-pointer"
                      onClick={() => handleSelectEdge(idx)}
                    />

                    {/* Base directional connector */}
                    <path
                      d={route.d}
                      fill="none"
                      strokeWidth={isHighlighted ? 2.4 : 1.5}
                      strokeDasharray={isDashed ? '5 4' : undefined}
                      markerEnd={
                        isHighlighted
                          ? `url(#arrow-end-active-${id})`
                          : `url(#arrow-end-muted-${id})`
                      }
                      markerStart={
                        isBidirectional
                          ? isHighlighted
                            ? `url(#arrow-end-active-${id})`
                            : `url(#arrow-end-muted-${id})`
                          : undefined
                      }
                      className={cn(
                        'pointer-events-none transition-colors duration-150',
                        isHighlighted
                          ? 'stroke-primary'
                          : 'stroke-slate-400/75 dark:stroke-slate-500/70'
                      )}
                    />

                    {/* Animated dash stream when playing or focused */}
                    {(isHighlighted || (isPlaying && !prefersReducedMotion)) && (
                      <path
                        d={route.d}
                        fill="none"
                        strokeWidth={isHighlighted ? 2.6 : 1.4}
                        strokeDasharray="6 8"
                        className={cn(
                          'pointer-events-none',
                          !prefersReducedMotion && isPlaying && 'animate-flow-dash',
                          isHighlighted ? 'stroke-primary/90' : 'stroke-primary/35'
                        )}
                      />
                    )}

                    {/* Animated glowing data packet traveling along the active path */}
                    {isActiveStep && !prefersReducedMotion && isPlaying && (
                      <circle
                        r={5}
                        className="fill-primary pointer-events-none"
                        filter={`url(#packet-glow-${id})`}
                      >
                        <animateMotion
                          dur="1.8s"
                          repeatCount="indefinite"
                          path={route.d}
                          keyPoints={isBidirectional ? '0;1;0' : '0;1'}
                          keyTimes={isBidirectional ? '0;0.5;1' : '0;1'}
                          calcMode="linear"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Layer 3: Interactive Component Blocks */}
              {allNodes.map((node) => {
                const rect = layout.nodes[node.id];
                if (!rect) return null;
                const style = NODE_STYLE_MAP[node.nodeClass];
                const isFocused = focusedNodeId === node.id;
                const isInspected = inspectedNodeId === node.id;
                const isConnected = focusedConnectedNodes.has(node.id);
                const isActiveEndpoint =
                  activeEdge && (activeEdge.from === node.id || activeEdge.to === node.id);
                const isDimmed = Boolean(focusedNodeId) && !isConnected;

                return (
                  <foreignObject
                    key={node.id}
                    x={rect.x}
                    y={rect.y}
                    width={rect.w}
                    height={rect.h}
                    className={cn(
                      'overflow-visible transition-opacity duration-150',
                      isDimmed ? 'opacity-40 hover:opacity-100' : 'opacity-100'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectNode(node.id)}
                      aria-pressed={isFocused}
                      data-testid={`diagram-node-${node.id}`}
                      className={cn(
                        'w-full h-full text-left rounded-lg border px-2.5 py-2 flex flex-col justify-center transition-all duration-150 shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        style.surface,
                        (isFocused || isInspected) && style.selected,
                        isActiveEndpoint && !isFocused && 'ring-2 ring-primary/60'
                      )}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <div className="flex items-start gap-1.5 min-w-0">
                          <span
                            className={cn('h-2 w-2 rounded-full shrink-0 mt-1', style.dot)}
                            aria-hidden="true"
                          />
                          <span className="text-[11.5px] font-semibold leading-tight break-words">
                            {node.label}
                          </span>
                        </div>
                        <Info className="h-3 w-3 shrink-0 opacity-60 mt-0.5" aria-hidden="true" />
                      </div>
                      {node.sublabel && (
                        <p className="mt-1 pl-3.5 text-[10px] font-mono opacity-80 leading-tight break-words">
                          {node.sublabel}
                        </p>
                      )}
                    </button>
                  </foreignObject>
                );
              })}

              {/* Layer 4: Numbered Flow Badges & Active/Focused Edge Callout Pills */}
              {edges.map((edge, idx) => {
                const route = layout.edgeRoutes[edge.id];
                if (!route) return null;
                const isActiveStep = idx === activeEdgeIndex;
                const isFocusedEdge = focusedEdges.has(edge.id);
                const isHighlighted = isActiveStep || isFocusedEdge;
                const isDimmed = Boolean(focusedNodeId) && !isFocusedEdge && !isActiveStep;

                if (isDimmed) return null;

                if (!isHighlighted) {
                  return (
                    <g
                      key={`badge-${edge.id}`}
                      className="cursor-pointer"
                      onClick={() => handleSelectEdge(idx)}
                    >
                      <circle
                        cx={route.labelX}
                        cy={route.labelY}
                        r={8.5}
                        className="fill-background/95 stroke-border/90 hover:stroke-primary transition-colors"
                        strokeWidth={1.1}
                      />
                      <text
                        x={route.labelX}
                        y={route.labelY + 3.2}
                        textAnchor="middle"
                        className="text-[9px] font-mono font-medium fill-muted-foreground pointer-events-none"
                      >
                        {idx + 1}
                      </text>
                    </g>
                  );
                }

                const labelText =
                  edge.label.length > 28 ? `${edge.label.slice(0, 26)}…` : edge.label;
                const pillWidth = Math.min(200, labelText.length * 6 + 22);

                return (
                  <g
                    key={`pill-${edge.id}`}
                    className="cursor-pointer"
                    onClick={() => handleSelectEdge(idx)}
                  >
                    <rect
                      x={route.labelX - pillWidth / 2}
                      y={route.labelY - 10}
                      width={pillWidth}
                      height={20}
                      rx={6}
                      className={cn(
                        'transition-colors shadow-sm',
                        isActiveStep
                          ? 'fill-primary stroke-primary'
                          : 'fill-background stroke-primary/70'
                      )}
                      strokeWidth={1.25}
                    />
                    <text
                      x={route.labelX}
                      y={route.labelY + 3.2}
                      textAnchor="middle"
                      className={cn(
                        'text-[9.5px] font-mono font-semibold pointer-events-none',
                        isActiveStep ? 'fill-primary-foreground' : 'fill-primary'
                      )}
                    >
                      {labelText}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Active Flow Telemetry Callout */}
        {activeEdge && (
          <div
            className="rounded-lg border border-primary/30 bg-primary/[0.04] dark:bg-primary/[0.08] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2"
            data-testid={`flow-callout-${id}`}
          >
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge className="font-mono text-[11px]">
                Flow {activeEdgeIndex + 1} / {edges.length}
              </Badge>
              <span className="font-semibold text-foreground">
                {activeFromNode?.label ?? activeEdge.from}
              </span>
              <span className="font-mono text-primary">
                {activeEdge.style === 'bidirectional'
                  ? '↔'
                  : activeEdge.style === 'dashed'
                    ? '⇢'
                    : '→'}
              </span>
              <span className="font-semibold text-foreground">
                {activeToNode?.label ?? activeEdge.to}
              </span>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              {activeRoute?.protocolNote ?? activeEdge.label}
            </span>
          </div>
        )}

        {/* Selected Node Inspector & Edge Matrix */}
        {inspectedNode && (
          <div
            className="rounded-xl border border-border bg-background/90 p-4 sm:p-5 grid gap-4 lg:grid-cols-5"
            data-testid={`diagram-inspector-${id}`}
          >
            <div className="lg:col-span-3 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    'font-mono text-[11px]',
                    NODE_STYLE_MAP[inspectedNode.nodeClass].badge
                  )}
                >
                  {inspectedNode.role}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">
                  {inspectedNode.boundary}
                </span>
              </div>
              <h4 className="text-base font-semibold text-foreground">{inspectedNode.label}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {inspectedNode.details}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {inspectedNode.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-border/60 pt-3 lg:pt-0 lg:pl-4 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Connected Trust &amp; Data Flows ({relatedEdges.length})
              </div>
              <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {relatedEdges.map((edge) => {
                  const isOutbound = edge.from === inspectedNode.id;
                  const peerId = isOutbound ? edge.to : edge.from;
                  const peerNode = nodeMap.get(peerId);
                  const edgeIdx = edges.findIndex((item) => item.id === edge.id);
                  return (
                    <li key={edge.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setInspectedNodeId(peerId);
                          setFocusedNodeId(peerId);
                          if (edgeIdx >= 0) setActiveEdgeIndex(edgeIdx);
                        }}
                        className="w-full text-left rounded-md border border-border/60 bg-muted/30 hover:bg-muted/70 px-2.5 py-1.5 text-xs transition-colors flex items-center justify-between gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="truncate">
                          <span className="font-mono text-[11px] text-primary mr-1.5">
                            {edge.style === 'bidirectional'
                              ? '↔'
                              : isOutbound
                                ? '→'
                                : '←'}
                          </span>
                          <span className="font-medium text-foreground">
                            {peerNode?.label ?? peerId}
                          </span>
                          <span className="text-muted-foreground"> · {edge.label}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Standard Animated UML Sequence Diagram (24-Step Runtime Execution)
// ============================================================================

export function InteractiveSequenceDiagram() {
  const prefersReducedMotion = useReducedMotion();
  const [activePhase, setActivePhase] = useState<'all' | SequencePhaseId>('all');
  const [selectedStepNumber, setSelectedStepNumber] = useState<number>(13);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1);
  const stepButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const visibleSteps = useMemo(
    () =>
      activePhase === 'all'
        ? SEQUENCE_STEPS
        : SEQUENCE_STEPS.filter((s) => s.phaseId === activePhase),
    [activePhase]
  );

  const activeStep =
    SEQUENCE_STEPS.find((s) => s.step === selectedStepNumber) ?? SEQUENCE_STEPS[0];

  const participantIndexMap = useMemo(
    () => new Map(SEQUENCE_PARTICIPANTS.map((p, idx) => [p.id, idx])),
    []
  );

  const participantById = useMemo(
    () => new Map(SEQUENCE_PARTICIPANTS.map((p) => [p.id, p])),
    []
  );

  useEffect(() => {
    if (!isAutoPlaying) return;
    const intervalMs = playbackSpeed === 2 ? 900 : 1700;
    const timer = window.setInterval(() => {
      setSelectedStepNumber((prev) => {
        const currentIdx = visibleSteps.findIndex((s) => s.step === prev);
        if (currentIdx === -1 || currentIdx + 1 >= visibleSteps.length) {
          return visibleSteps[0]?.step ?? 1;
        }
        return visibleSteps[currentIdx + 1].step;
      });
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [isAutoPlaying, playbackSpeed, visibleSteps]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const el = stepButtonRefs.current[selectedStepNumber];
    el?.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [selectedStepNumber, isAutoPlaying, prefersReducedMotion]);

  const handlePhaseSelect = (phase: 'all' | SequencePhaseId) => {
    setActivePhase(phase);
    if (phase !== 'all') {
      const firstInPhase = SEQUENCE_STEPS.find((s) => s.phaseId === phase);
      if (firstInPhase) setSelectedStepNumber(firstInPhase.step);
    }
  };

  // Determine which participants are currently holding an active execution bar in the turn
  const activeExecutionParticipants = useMemo(() => {
    const active = new Set<string>([activeStep.from, activeStep.to]);
    if (activeStep.step >= 4 && activeStep.step <= 23) active.add('AGW');
    if (activeStep.step >= 5 && activeStep.step <= 22) active.add('Act');
    return active;
  }, [activeStep]);

  const loopVisible = visibleSteps.some((s) => s.step >= 12 && s.step <= 17);
  const optVisible = visibleSteps.some((s) => s.step >= 18 && s.step <= 19);

  return (
    <div className="space-y-6" data-testid="topology-panel-sequence">
      {/* Intro & Controls */}
      <div className="rounded-xl border border-border/70 bg-card/70 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="inline-block font-mono text-xs font-medium text-primary">
              24-Step Standard UML Sequence Diagram
            </span>
            <h3 className="text-h3 text-xl sm:text-2xl font-semibold tracking-tight">
              Code Mode + AgentGateway + RFC 8693 Token Exchange
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Traces how a single user turn executes Code Mode inside ProjectA without storing raw
              credentials inside the Actor sandbox—with UML lifelines, activation bars,{' '}
              <code className="font-mono text-xs">loop</code> /{' '}
              <code className="font-mono text-xs">opt</code> fragments, and animated message packets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              variant={isAutoPlaying ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsAutoPlaying((prev) => !prev)}
              data-testid="button-seq-autoplay"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  Auto-Play Sequence
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPlaybackSpeed((prev) => (prev === 1 ? 2 : 1))}
              data-testid="button-seq-speed"
              aria-label={`Playback speed ${playbackSpeed}x`}
              className="font-mono text-xs"
            >
              <FastForward className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
              {playbackSpeed}x
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAutoPlaying(false);
                setSelectedStepNumber((prev) => Math.max(1, prev - 1));
              }}
              disabled={selectedStepNumber <= 1}
              data-testid="button-seq-prev"
            >
              <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
              Prev
            </Button>
            <Badge
              variant="secondary"
              className="font-mono text-xs px-2.5 py-1"
              data-testid="text-seq-step-counter"
            >
              Step {activeStep.step} / 24
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAutoPlaying(false);
                setSelectedStepNumber((prev) => Math.min(24, prev + 1));
              }}
              disabled={selectedStepNumber >= 24}
              data-testid="button-seq-next"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Phase Filter Pills */}
        <div
          className="flex flex-wrap gap-1.5 pt-1"
          role="group"
          aria-label="Filter sequence by phase"
        >
          <button
            type="button"
            aria-pressed={activePhase === 'all'}
            onClick={() => handlePhaseSelect('all')}
            data-testid="button-phase-all"
            className={cn(
              'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              activePhase === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-muted/50 text-muted-foreground border-border/70 hover:text-foreground'
            )}
          >
            All Phases (24)
          </button>
          {SEQUENCE_PHASES.map((phase) => (
            <button
              key={phase.id}
              type="button"
              aria-pressed={activePhase === phase.id}
              onClick={() => handlePhaseSelect(phase.id)}
              data-testid={`button-phase-${phase.id}`}
              className={cn(
                'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                activePhase === phase.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/50 text-muted-foreground border-border/70 hover:text-foreground'
              )}
            >
              {phase.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Step Inspector Card */}
      <div
        className="rounded-xl border border-primary/35 bg-primary/[0.03] dark:bg-primary/[0.06] p-4 sm:p-5 space-y-3"
        data-testid="sequence-step-inspector"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="font-mono text-xs">Step {activeStep.step}</Badge>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-foreground">
              <span>{participantById.get(activeStep.from)?.fullName}</span>
              <ArrowRight className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>{participantById.get(activeStep.to)?.fullName}</span>
            </span>
          </div>
          {activeStep.groupKind === 'loop' && (
            <Badge
              variant="outline"
              className="font-mono text-[11px] border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
            >
              loop · Code Mode Sandbox
            </Badge>
          )}
          {activeStep.groupKind === 'opt' && (
            <Badge
              variant="outline"
              className="font-mono text-[11px] border-rose-500/40 text-rose-700 dark:text-rose-300"
            >
              opt · Multi-Agent Collaboration
            </Badge>
          )}
        </div>

        <h4 className="text-base font-semibold text-foreground">{activeStep.title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{activeStep.detail}</p>

        <div className="grid gap-3 md:grid-cols-2 pt-1">
          <div className="rounded-lg border border-border/70 bg-background/80 p-3 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Security &amp; Isolation Invariant
              </div>
              <p className="text-xs text-foreground mt-0.5 leading-relaxed">
                {activeStep.securityNote}
              </p>
            </div>
          </div>

          {activeStep.payloadPreview ? (
            <div className="rounded-lg border border-border/70 bg-background/80 p-3 flex items-start gap-2.5">
              <Terminal className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div className="min-w-0">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Wire / Token / Policy Preview
                </div>
                <code className="block font-mono text-[11px] text-foreground mt-0.5 break-all">
                  {activeStep.payloadPreview}
                </code>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border/70 bg-background/80 p-3 flex items-start gap-2.5">
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Phase Context
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {SEQUENCE_PHASES.find((p) => p.id === activeStep.phaseId)?.summary}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Standard UML Sequence Swimlane Diagram */}
      <div
        className="rounded-xl border border-border/80 bg-card/50 overflow-x-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        tabIndex={0}
        role="region"
        aria-label="24-step runtime execution sequence diagram"
      >
        <div className="min-w-[900px] p-4 space-y-2">
          {/* Top UML Participant Boxes */}
          <div className="grid grid-cols-9 gap-1.5 pb-2 border-b border-border/70">
            {SEQUENCE_PARTICIPANTS.map((p) => {
              const style = NODE_STYLE_MAP[p.nodeClass];
              const isInvolved = activeStep.from === p.id || activeStep.to === p.id;
              return (
                <div
                  key={p.id}
                  className={cn(
                    'rounded-lg border px-2 py-2 text-center transition-all',
                    style.surface,
                    isInvolved && 'ring-2 ring-primary shadow-xs'
                  )}
                >
                  <div className="text-xs font-semibold truncate">{p.label}</div>
                  <div className="text-[10px] font-mono opacity-75 truncate">{p.id}</div>
                </div>
              );
            })}
          </div>

          {/* UML Lifelines + Activation Bars + Fragment Frames + Animated Arrows */}
          <div className="relative py-1">
            {/* Continuous vertical dashed lifelines spanning full diagram height */}
            <div
              className="absolute inset-0 grid grid-cols-9 pointer-events-none"
              aria-hidden="true"
            >
              {SEQUENCE_PARTICIPANTS.map((p) => {
                const isHoldingActivation = activeExecutionParticipants.has(p.id);
                return (
                  <div key={p.id} className="relative flex justify-center">
                    <div className="h-full border-l border-dashed border-border/80" />
                    {isHoldingActivation && (
                      <div className="absolute top-2 bottom-2 w-2 rounded-xs bg-primary/12 border border-primary/25" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="relative z-10 space-y-1">
              {visibleSteps.map((step, idx) => {
                const prevStep = visibleSteps[idx - 1];
                const showLoopHeader = loopVisible && step.step === 12 && prevStep?.step !== 12;
                const showOptHeader = optVisible && step.step === 18 && prevStep?.step !== 18;
                const inLoopFrame = step.step >= 12 && step.step <= 17;
                const inOptFrame = step.step >= 18 && step.step <= 19;

                const fromIdx = participantIndexMap.get(step.from) ?? 0;
                const toIdx = participantIndexMap.get(step.to) ?? 0;
                const leftCol = Math.min(fromIdx, toIdx);
                const rightCol = Math.max(fromIdx, toIdx);
                const isForward = toIdx > fromIdx;
                const isSelected = step.step === activeStep.step;

                const startPct = ((fromIdx + 0.5) / 9) * 100;
                const endPct = ((toIdx + 0.5) / 9) * 100;
                const leftPct = ((leftCol + 0.5) / 9) * 100;
                const widthPct = ((rightCol - leftCol) / 9) * 100;

                return (
                  <div key={step.step}>
                    {showLoopHeader && (
                      <div
                        className="mt-2 mb-0.5 flex items-center gap-2 rounded-t-lg border border-b-0 border-emerald-500/45 bg-emerald-500/[0.06] px-2.5 py-1"
                        data-testid="uml-fragment-loop"
                      >
                        <span className="rounded bg-emerald-600 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-white">
                          loop
                        </span>
                        <span className="font-mono text-[11px] font-medium text-emerald-800 dark:text-emerald-200">
                          [Programmatic Tool Execution inside Code Mode Sandbox]
                        </span>
                      </div>
                    )}

                    {showOptHeader && (
                      <div
                        className="mt-2 mb-0.5 flex items-center gap-2 rounded-t-lg border border-b-0 border-rose-500/45 bg-rose-500/[0.06] px-2.5 py-1"
                        data-testid="uml-fragment-opt"
                      >
                        <span className="rounded bg-rose-600 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase text-white">
                          opt
                        </span>
                        <span className="font-mono text-[11px] font-medium text-rose-800 dark:text-rose-200">
                          [Multi-Agent Collaboration]
                        </span>
                      </div>
                    )}

                    <div
                      className={cn(
                        inLoopFrame &&
                          'border-x border-emerald-500/45 bg-emerald-500/[0.03] px-1',
                        step.step === 17 &&
                          'border-b rounded-b-lg pb-1 mb-2 border-emerald-500/45',
                        inOptFrame && 'border-x border-rose-500/45 bg-rose-500/[0.03] px-1',
                        step.step === 19 &&
                          'border-b rounded-b-lg pb-1 mb-2 border-rose-500/45'
                      )}
                    >
                      <button
                        ref={(el) => {
                          stepButtonRefs.current[step.step] = el;
                        }}
                        type="button"
                        onClick={() => {
                          setIsAutoPlaying(false);
                          setSelectedStepNumber(step.step);
                        }}
                        aria-pressed={isSelected}
                        data-testid={`sequence-step-${step.step}`}
                        className={cn(
                          'w-full text-left rounded-lg border px-2 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-2xs'
                            : 'border-transparent hover:border-border/70 hover:bg-muted/40'
                        )}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={cn(
                                'inline-flex h-5 min-w-5 items-center justify-center rounded px-1 font-mono text-[11px] font-semibold',
                                isSelected
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {step.step}
                            </span>
                            <span className="text-xs font-medium text-foreground truncate">
                              {step.title}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-muted-foreground shrink-0">
                            {step.from} {step.arrowType === 'async' ? '⇢' : '→'} {step.to}
                          </span>
                        </div>

                        {/* UML Vector Arrow + Activation Blocks + Animated Message Packet */}
                        <div className="relative h-5 w-full" aria-hidden="true">
                          {/* Active lifeline execution rectangles for this step */}
                          <div
                            className={cn(
                              'absolute top-0.5 h-4 w-2 -translate-x-1/2 rounded-xs border transition-colors',
                              isSelected
                                ? 'bg-primary/25 border-primary'
                                : 'bg-muted/80 border-border'
                            )}
                            style={{ left: `${startPct}%` }}
                          />
                          <div
                            className={cn(
                              'absolute top-0.5 h-4 w-2 -translate-x-1/2 rounded-xs border transition-colors',
                              isSelected
                                ? 'bg-primary/25 border-primary'
                                : 'bg-muted/80 border-border'
                            )}
                            style={{ left: `${endPct}%` }}
                          />

                          {/* Horizontal arrow line */}
                          <svg
                            className="absolute inset-0 w-full h-full overflow-visible"
                            preserveAspectRatio="none"
                          >
                            <line
                              x1={`${leftPct}%`}
                              y1="10"
                              x2={`${leftPct + widthPct}%`}
                              y2="10"
                              stroke="currentColor"
                              strokeWidth={isSelected ? 2.4 : 1.5}
                              strokeDasharray={step.arrowType === 'async' ? '5 4' : undefined}
                              className={cn(
                                isSelected ? 'text-primary' : 'text-muted-foreground/75'
                              )}
                            />
                            {isSelected && (
                              <line
                                x1={`${leftPct}%`}
                                y1="10"
                                x2={`${leftPct + widthPct}%`}
                                y2="10"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                strokeDasharray="6 8"
                                className={cn(
                                  'text-primary',
                                  !prefersReducedMotion && 'animate-flow-dash'
                                )}
                              />
                            )}
                          </svg>

                          {/* Directional UML Arrowhead */}
                          <div
                            className={cn(
                              'absolute top-1/2 -translate-y-1/2 -translate-x-1/2',
                              isSelected ? 'text-primary' : 'text-muted-foreground'
                            )}
                            style={{
                              left: `${isForward ? leftPct + widthPct : leftPct}%`,
                            }}
                          >
                            <svg width="10" height="10" viewBox="0 0 10 10" className="block">
                              {isForward ? (
                                <path d="M 1 1.5 L 9 5 L 1 8.5 z" fill="currentColor" />
                              ) : (
                                <path d="M 9 1.5 L 1 5 L 9 8.5 z" fill="currentColor" />
                              )}
                            </svg>
                          </div>

                          {/* Animated Message Packet along the active horizontal arrow */}
                          {isSelected && !prefersReducedMotion && (
                            <motion.div
                              key={`${step.step}-${playbackSpeed}-${isAutoPlaying}`}
                              initial={{ left: `${startPct}%`, opacity: 0.4, scale: 0.85 }}
                              animate={{ left: `${endPct}%`, opacity: 1, scale: 1.1 }}
                              transition={{
                                duration: playbackSpeed === 2 ? 0.65 : 1.15,
                                repeat: Infinity,
                                repeatDelay: 0.25,
                                ease: 'easeInOut',
                              }}
                              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
                            />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom UML Participant Boxes */}
          <div className="grid grid-cols-9 gap-1.5 pt-2 border-t border-border/70">
            {SEQUENCE_PARTICIPANTS.map((p) => {
              const style = NODE_STYLE_MAP[p.nodeClass];
              const isInvolved = activeStep.from === p.id || activeStep.to === p.id;
              return (
                <div
                  key={`bottom-${p.id}`}
                  className={cn(
                    'rounded-lg border px-2 py-1.5 text-center transition-all opacity-90',
                    style.surface,
                    isInvolved && 'ring-2 ring-primary opacity-100'
                  )}
                >
                  <div className="text-[11px] font-semibold truncate">{p.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
