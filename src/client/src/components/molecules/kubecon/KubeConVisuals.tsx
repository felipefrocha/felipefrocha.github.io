import { useEffect, useId, useRef, useState } from 'react';
import { ExternalLink, CornerDownLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  BADGE_LABELS,
  VERDICT_KEYS,
  ROW_SLUGS,
  kubecon2026Data,
  parseFormattedProse,
  type EvidenceBadgeKey,
  type KubeConFolder,
  type KubeConSource,
  type KubeConVizConfig,
  type ShiftSlug,
  type VerdictKey,
} from '@/content/kubecon2026Data';

const SOURCES_BY_ID: Record<number, KubeConSource> = Object.fromEntries(
  kubecon2026Data.sources.map((s) => [s.n, s])
);

const SHIFT_SHORT_NAMES: Record<ShiftSlug, string> = {
  scheduling: 'Scheduling',
  trust: 'Trust',
  cost: 'Cost',
  recovery: 'Recovery',
  standards: 'Standards',
  context: 'Context',
};

function getDomain(url?: string): string {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function getAutoChipLabel(sourceId?: number): string {
  if (!sourceId) return '';
  const s = SOURCES_BY_ID[sourceId];
  if (!s) return '';
  if (s.type === 'abstract') return '[abstract] schedule page';
  const typePrefix = s.type.split(' ')[0];
  return `[${typePrefix}] ${getDomain(s.urls[0])} · ${s.date}`;
}

/**
 * 7-Tier Verification SVG Glyph matching /tmp/kubecon2026 symbols,
 * mapped to the site's design system tokens (indigo-blue primary, amber updated, slate muted).
 */
export function VerificationGlyph({
  badge,
  className,
}: {
  badge: EvidenceBadgeKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn('h-3.5 w-3.5 shrink-0 inline-block align-[-0.125em]', className)}
    >
      {badge === 'verified' && (
        <circle cx="8" cy="8" r="6.2" className="fill-primary" />
      )}
      {badge === 'updated' && (
        <>
          <circle
            cx="8"
            cy="8"
            r="6"
            className="fill-none stroke-amber-500 dark:stroke-amber-400"
            strokeWidth="1.5"
          />
          <path
            d="M8 2a6 6 0 0 1 0 12z"
            className="fill-amber-500 dark:fill-amber-400"
          />
        </>
      )}
      {badge === 'vendor' && (
        <>
          <circle
            cx="8"
            cy="8"
            r="6"
            className="fill-none stroke-foreground/75"
            strokeWidth="1.5"
          />
          <circle cx="8" cy="8" r="2.3" className="fill-foreground/75" />
        </>
      )}
      {badge === 'partial' && (
        <>
          <circle
            cx="8"
            cy="8"
            r="6"
            className="fill-none stroke-muted-foreground"
            strokeWidth="1.5"
          />
          <path d="M8 8V2a6 6 0 0 1 6 6z" className="fill-muted-foreground" />
        </>
      )}
      {badge === 'talk' && (
        <circle
          cx="8"
          cy="8"
          r="6"
          className="fill-none stroke-muted-foreground"
          strokeWidth="1.5"
        />
      )}
      {badge === 'illustrative' && (
        <path
          d="M8 2 14 8 8 14 2 8z"
          className="fill-none stroke-muted-foreground"
          strokeWidth="1.5"
        />
      )}
      {badge === 'signal' && (
        <circle
          cx="8"
          cy="8"
          r="6"
          className="fill-none stroke-muted-foreground"
          strokeWidth="1.6"
          strokeDasharray="2.4 2.2"
        />
      )}
    </svg>
  );
}

/**
 * EvidenceBadge: 7-tier verification badge with optional qualifier and Tooltip explanation.
 */
export function EvidenceBadge({
  badge,
  qualifier,
  inline = false,
  isStage = false,
  className,
}: {
  badge: EvidenceBadgeKey;
  qualifier?: string;
  inline?: boolean;
  isStage?: boolean;
  className?: string;
}) {
  const label = BADGE_LABELS[badge] || badge;
  const legendDescription = kubecon2026Data.confidence.legend[badge];

  const badgeTone =
    badge === 'verified'
      ? 'border-primary/35 bg-primary/10 text-foreground'
      : badge === 'updated'
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300'
        : 'border-border/80 bg-muted/50 text-muted-foreground';

  const content = (
    <span className={cn('inline-flex items-center gap-1.5', inline && 'mx-0.5 align-baseline')}>
      <Badge
        variant="outline"
        data-badge={badge}
        className={cn(
          'inline-flex items-center gap-1.5 font-mono font-medium rounded-md transition-colors',
          inline ? 'px-1.5 py-0.5 text-[11px] leading-none' : 'px-2 py-0.5 text-xs',
          isStage && 'text-[max(15px,calc(1.05*var(--u)))] px-2.5 py-1',
          badgeTone,
          className
        )}
      >
        <VerificationGlyph
          badge={badge}
          className={cn(isStage && 'h-[1em] w-[1em]')}
        />
        <span>{label}</span>
      </Badge>
      {qualifier && !isStage && (
        <span className="font-mono text-xs text-muted-foreground">
          ({qualifier})
        </span>
      )}
    </span>
  );

  if (isStage || !legendDescription) {
    return content;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs leading-relaxed">
        <p>
          <strong className="font-semibold text-foreground">{label}:</strong>{' '}
          {legendDescription}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * Interactive Source Citation Chip backed by Shadcn Popover.
 * Records trigger focus ref when jumping to #src-N so "↩ Back" returns smoothly.
 */
export function SourceChip({
  sources,
  text,
  badgeContext,
  inline = false,
  isStage = false,
  onJumpToSource,
  className,
}: {
  sources: number[];
  text?: string;
  badgeContext?: EvidenceBadgeKey;
  inline?: boolean;
  isStage?: boolean;
  onJumpToSource?: (sourceId: number, triggerEl: HTMLElement | null) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const validSources = sources
    .map((id) => SOURCES_BY_ID[id])
    .filter((s): s is KubeConSource => Boolean(s));

  const label = text || getAutoChipLabel(validSources[0]?.n);
  const isAbstract =
    validSources[0]?.type === 'abstract' || /^\[abstract\]/i.test(label);

  if (isStage) {
    return null;
  }

  if (validSources.length === 0) {
    return (
      <span
        data-type={/^\[internal\]/.test(label) ? 'internal' : 'slides'}
        className={cn(
          'inline-flex items-center font-mono text-xs text-muted-foreground border border-border/80 rounded-md px-2 py-0.5 bg-background/50',
          inline && 'mx-0.5 text-[11px] py-0.5 px-1.5 align-baseline',
          className
        )}
      >
        {label}
      </span>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          data-src={validSources.map((s) => s.n).join(',')}
          data-type={validSources[0].type.split(' ')[0]}
          className={cn(
            'inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground border border-border hover:border-primary/60 rounded-md px-2 py-1 bg-card/50 hover:bg-card transition-colors cursor-pointer text-left',
            isAbstract && 'border-dashed',
            inline && 'mx-0.5 text-[11px] py-0.5 px-1.5 align-baseline',
            open && 'border-primary text-foreground bg-card',
            className
          )}
        >
          <span className="truncate max-w-[260px] sm:max-w-none">{label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-80 sm:w-96 p-4 space-y-3 shadow-lg border-border bg-popover text-popover-foreground z-50"
      >
        {badgeContext && (
          <div>
            <EvidenceBadge badge={badgeContext} />
          </div>
        )}
        <div className="space-y-3 divide-y divide-border/60">
          {validSources.map((src) => (
            <div key={src.n} className="pt-2.5 first:pt-0 space-y-1.5">
              <p className="text-xs font-semibold leading-snug text-foreground">
                <span className="font-mono text-primary mr-1">[{src.n}]</span>
                {src.title}
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                {src.publisher} · {src.date} · {src.type}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {src.urls[0] && (
                  <a
                    href={src.urls[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-mono font-medium text-primary hover:underline"
                  >
                    Open source
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                )}
                <a
                  href={`#src-${src.n}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    onJumpToSource?.(src.n, triggerRef.current);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground hover:underline"
                >
                  <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
                  See source [{src.n}]
                </a>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Safe React Prose Renderer for KubeCon formatted strings ({{b:...}}, {{c:...}}, **bold**, `code`).
 */
export function FormattedProse({
  text,
  isStage = false,
  onJumpToSource,
}: {
  text: string;
  isStage?: boolean;
  onJumpToSource?: (sourceId: number, triggerEl: HTMLElement | null) => void;
}) {
  const tokens = parseFormattedProse(text);
  return (
    <>
      {tokens.map((tok, idx) => {
        if (tok.type === 'text') {
          return <span key={idx}>{tok.value}</span>;
        }
        if (tok.type === 'bold') {
          return (
            <strong key={idx} className="font-semibold text-foreground">
              {tok.value}
            </strong>
          );
        }
        if (tok.type === 'code') {
          return (
            <code
              key={idx}
              className="font-mono text-[0.9em] px-1 py-0.5 rounded bg-muted text-foreground"
            >
              {tok.value}
            </code>
          );
        }
        if (tok.type === 'badge') {
          return (
            <EvidenceBadge
              key={idx}
              badge={tok.badge}
              qualifier={tok.qualifier}
              inline
              isStage={isStage}
            />
          );
        }
        if (tok.type === 'chip') {
          return (
            <SourceChip
              key={idx}
              sources={tok.sources}
              text={tok.text}
              inline
              isStage={isStage}
              onJumpToSource={onJumpToSource}
            />
          );
        }
        return null;
      })}
    </>
  );
}

/**
 * Animated 30-Tick Sorting Field (HeroTickField)
 * Preserves the exact 30-session folder sorting mechanics from /tmp/kubecon2026/index.html:
 * - Unsorted state: 30 ticks evenly distributed across the line.
 * - Sorted state: 30 ticks clustered into 6 groups (Scheduling, Trust, Cost, Recovery, Standards, Context)
 *   with group labels below (or 6 horizontal rows on mobile <600px).
 */
export function HeroTickField({
  folders,
  sorted,
  isStage = false,
  caption,
}: {
  folders: KubeConFolder[];
  sorted: boolean;
  isStage?: boolean;
  caption: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(960);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      if (el.clientWidth > 0) {
        setWidth(el.clientWidth);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [isStage]);

  const n = folders.length;
  const isStackedRows = !isStage && width < 600;

  // Compute positions
  if (isStackedRows) {
    const labelCol = 104;
    const step = Math.min(14, Math.max(8, (width - labelCol) / 9));
    const rowHeight = 28;
    const linearStep = Math.min(width / n, 11);
    const counts: Record<ShiftSlug, number> = {
      scheduling: 0,
      trust: 0,
      cost: 0,
      recovery: 0,
      standards: 0,
      context: 0,
    };
    const rowY: Record<ShiftSlug, number> = {
      scheduling: 0,
      trust: rowHeight,
      cost: rowHeight * 2,
      recovery: rowHeight * 3,
      standards: rowHeight * 4,
      context: rowHeight * 5,
    };

    const tickPositions = folders.map((f, i) => {
      const idxInGroup = counts[f.trend]++;
      const tx = sorted ? labelCol + idxInGroup * step : i * linearStep;
      const ty = sorted ? rowY[f.trend] : 0;
      return { tx, ty, trend: f.trend };
    });

    return (
      <div
        ref={containerRef}
        role="img"
        aria-label={caption}
        data-sorted={sorted ? 'true' : 'false'}
        data-testid="hero-tick-field"
        className="relative w-full max-w-5xl mt-8 select-none"
        style={{ height: `${ROW_SLUGS.length * rowHeight + 10}px` }}
      >
        {tickPositions.map((pos, i) => (
          <i
            key={folders[i].slug}
            data-tick-index={i}
            className={cn(
              'absolute left-0 top-0.5 block w-[2.5px] h-5 rounded-full transition-transform duration-700 ease-out',
              pos.trend === 'context'
                ? 'bg-muted-foreground/60'
                : 'bg-primary'
            )}
            style={{
              transform: `translate(${pos.tx}px, ${pos.ty}px)`,
            }}
          />
        ))}
        {ROW_SLUGS.map((slug) => (
          <span
            key={slug}
            className={cn(
              'absolute left-0 font-mono text-xs font-medium transition-opacity duration-500',
              slug === 'context' ? 'text-muted-foreground' : 'text-foreground',
              sorted ? 'opacity-100 visible' : 'opacity-0 invisible'
            )}
            style={{ top: `${rowY[slug] + 3}px` }}
          >
            {SHIFT_SHORT_NAMES[slug]}
          </span>
        ))}
      </div>
    );
  }

  const gaps = ROW_SLUGS.length - 1;
  const groupGap = Math.max(22, width * 0.042);
  const step = Math.min(isStage ? 38 : 24, Math.max(6, (width - gaps * groupGap) / n));
  const linearStep = Math.min(width / n, step * 1.15);

  let cursorX = 0;
  const posByIndex: Record<number, number> = {};
  const labelX: Record<ShiftSlug, number> = {
    scheduling: 0,
    trust: 0,
    cost: 0,
    recovery: 0,
    standards: 0,
    context: 0,
  };

  ROW_SLUGS.forEach((slug) => {
    labelX[slug] = cursorX;
    folders.forEach((f, idx) => {
      if (f.trend === slug) {
        posByIndex[idx] = cursorX;
        cursorX += step;
      }
    });
    cursorX += groupGap;
  });

  // Check if labels need two rows to prevent collision on medium screens
  let prevRight = -1e9;
  let needsTwoRows = false;
  const lowLabels: Partial<Record<ShiftSlug, boolean>> = {};
  ROW_SLUGS.forEach((slug) => {
    const estWidth = SHIFT_SHORT_NAMES[slug].length * (isStage ? 13 : 8.5);
    const x = Math.min(labelX[slug], Math.max(0, width - estWidth));
    if (x < prevRight + 10) {
      lowLabels[slug] = true;
      needsTwoRows = true;
      prevRight = -1e9;
    } else {
      prevRight = x + estWidth;
    }
  });

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={caption}
      data-sorted={sorted ? 'true' : 'false'}
      data-testid="hero-tick-field"
      className={cn(
        'relative w-full max-w-5xl mt-8 overflow-hidden select-none',
        isStage
          ? 'h-[calc(9*var(--u))] mt-[calc(3*var(--u))] max-w-none'
          : needsTwoRows
            ? 'h-32'
            : 'h-24'
      )}
    >
      {folders.map((folder, i) => {
        const tx = sorted ? posByIndex[i] ?? 0 : i * linearStep;
        return (
          <i
            key={folder.slug}
            data-tick-index={i}
            className={cn(
              'absolute left-0 block rounded-full transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]',
              folder.trend === 'context'
                ? 'bg-muted-foreground/65'
                : 'bg-primary',
              isStage
                ? 'w-[3px] h-[calc(5.8*var(--u))] bottom-[calc(2.8*var(--u))]'
                : needsTwoRows
                  ? 'w-[2.5px] h-11 bottom-14'
                  : 'w-[2.5px] h-11 bottom-9'
            )}
            style={{
              transform: `translateX(${tx}px)`,
            }}
          />
        );
      })}
      {ROW_SLUGS.map((slug) => {
        const isLow = Boolean(lowLabels[slug]);
        return (
          <span
            key={slug}
            className={cn(
              'absolute font-mono font-medium whitespace-nowrap transition-opacity duration-500 delay-300',
              slug === 'context'
                ? 'text-muted-foreground'
                : 'text-foreground/90',
              isStage
                ? 'text-[max(18px,calc(1.25*var(--u)))] bottom-0'
                : needsTwoRows
                  ? isLow
                    ? 'text-xs bottom-1'
                    : 'text-xs bottom-7'
                  : 'text-xs bottom-1.5',
              sorted ? 'opacity-100 visible' : 'opacity-0 invisible'
            )}
            style={{ left: `${labelX[slug]}px` }}
          >
            {SHIFT_SHORT_NAMES[slug]}
          </span>
        );
      })}
    </div>
  );
}

/**
 * 100-Cell Waffle Chart (used in Why Now: 66% of organisations use Kubernetes for AI inference)
 */
export function Waffle100({
  n,
  isStage = false,
}: {
  n: number;
  isStage?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      data-testid="viz-waffle100"
      className={cn(
        'grid grid-cols-10 gap-[3px] w-fit',
        isStage && 'gap-[calc(0.28*var(--u))]'
      )}
    >
      {Array.from({ length: 100 }).map((_, idx) => {
        const active = idx < n;
        return (
          <i
            key={idx}
            className={cn(
              'block rounded-[1.5px] transition-colors',
              isStage
                ? 'w-[calc(1.4*var(--u))] h-[calc(1.4*var(--u))]'
                : 'w-2.5 h-2.5',
              active
                ? 'bg-primary'
                : 'bg-muted/40 ring-1 ring-inset ring-border'
            )}
          />
        );
      })}
    </div>
  );
}

/**
 * 458-Cell Waffle Chart (used in Guess Slide Step 3 reveal and Confidence overview)
 * Plots all 458 claims in verdict order: C (108), U (84), S (15), P (149), N (102).
 */
export function Waffle458({
  onlyC = false,
  isStage = false,
}: {
  onlyC?: boolean;
  isStage?: boolean;
}) {
  const verdicts = kubecon2026Data.confidence.verdicts;
  const cells: VerdictKey[] = [];
  VERDICT_KEYS.forEach((k) => {
    for (let i = 0; i < verdicts[k]; i++) {
      cells.push(k);
    }
  });

  return (
    <div
      aria-hidden="true"
      data-testid="viz-waffle458"
      className={cn(
        'grid gap-[2.5px] w-fit',
        isStage ? 'gap-[calc(0.2*var(--u))]' : 'gap-[3px]'
      )}
      style={{
        gridTemplateColumns: isStage
          ? 'repeat(23, calc(1.18 * var(--u)))'
          : 'repeat(23, 10px)',
      }}
    >
      {cells.map((k, idx) => {
        const dimmed = onlyC && k !== 'C';
        return (
          <i
            key={idx}
            className={cn(
              'block rounded-[1px]',
              isStage
                ? 'w-[calc(1.18*var(--u))] h-[calc(1.18*var(--u))]'
                : 'w-[10px] h-[10px]',
              dimmed
                ? 'bg-transparent ring-1 ring-inset ring-border/60'
                : k === 'C'
                  ? 'bg-primary'
                  : k === 'U'
                    ? 'bg-amber-500 dark:bg-amber-400'
                    : k === 'S'
                      ? 'bg-[repeating-linear-gradient(45deg,theme(colors.amber.500)_0_2px,transparent_2px_4px)] ring-1 ring-inset ring-amber-500/50'
                      : k === 'P'
                        ? 'bg-muted-foreground/30 ring-1 ring-inset ring-border'
                        : 'bg-transparent ring-1 ring-inset ring-border'
            )}
          />
        );
      })}
    </div>
  );
}

/**
 * Inline Reading Visualizations (waffle, range, version, switch, stream, ticks, bars)
 * Preserves every custom SVG and CSS micro-diagram from /tmp/kubecon2026/index.html.
 */
export function ReadingViz({
  viz,
  isStage = false,
}: {
  viz?: KubeConVizConfig;
  isStage?: boolean;
}) {
  const patternId = useId();
  if (!viz) return null;

  if (viz.type === 'waffle') {
    return (
      <div className="mt-3" aria-hidden="true">
        <Waffle100 n={viz.n} isStage={isStage} />
      </div>
    );
  }

  if (viz.type === 'range') {
    return (
      <div
        className="mt-3 w-full max-w-[260px]"
        aria-hidden="true"
        data-testid="viz-range"
      >
        <svg
          viewBox="0 0 300 40"
          preserveAspectRatio="none"
          className={cn('w-full block', isStage ? 'h-9' : 'h-7')}
        >
          <line
            x1="0"
            y1="20"
            x2="300"
            y2="20"
            className="stroke-border"
            strokeWidth="2.5"
          />
          <rect
            x={viz.lo * 3}
            y="10"
            width={(viz.hi - viz.lo) * 3}
            height="20"
            rx="2"
            className="fill-primary"
          />
          <line
            x1="0"
            y1="12"
            x2="0"
            y2="28"
            className="stroke-muted-foreground"
            strokeWidth="2"
          />
          <line
            x1="300"
            y1="12"
            x2="300"
            y2="28"
            className="stroke-muted-foreground"
            strokeWidth="2"
          />
        </svg>
        <div className="flex justify-between font-mono text-[11px] text-muted-foreground mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    );
  }

  if (viz.type === 'version') {
    return (
      <div className="mt-3 space-y-1.5" aria-hidden="true" data-testid="viz-version">
        <p
          className={cn(
            'font-mono text-xs text-muted-foreground',
            isStage && 'text-[max(16px,calc(1.1*var(--u)))]'
          )}
        >
          {viz.top}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {viz.chips.map((c) => (
            <span
              key={c}
              className={cn(
                'inline-flex items-center gap-1 font-mono text-xs border border-primary/40 bg-primary/5 text-foreground rounded-md px-2 py-1',
                isStage && 'text-[max(16px,calc(1.15*var(--u)))] px-3 py-1.5'
              )}
            >
              <strong className="text-primary font-bold">+</strong> {c}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (viz.type === 'switch') {
    return (
      <div
        className={cn(
          'mt-3 inline-flex items-center gap-2.5 font-mono text-xs',
          isStage && 'text-[max(18px,calc(1.3*var(--u)))] gap-3'
        )}
        aria-hidden="true"
        data-testid="viz-switch"
      >
        <span className="font-semibold text-amber-600 dark:text-amber-400">
          {viz.on}
        </span>
        <span
          className={cn(
            'relative inline-block rounded-full border-2 border-amber-500 bg-amber-500/15',
            isStage ? 'w-16 h-8' : 'w-12 h-6'
          )}
        >
          <i
            className={cn(
              'block absolute top-0.5 left-0.5 rounded-full bg-amber-500 dark:bg-amber-400',
              isStage ? 'w-6 h-6' : 'w-4 h-4'
            )}
          />
        </span>
        <span className="text-muted-foreground">{viz.off}</span>
      </div>
    );
  }

  if (viz.type === 'stream') {
    return (
      <div
        className={cn('mt-3 w-full', isStage ? 'max-w-md' : 'max-w-[270px]')}
        aria-hidden="true"
        data-testid="viz-stream"
      >
        <svg
          viewBox="0 0 320 96"
          data-pattern-id={patternId}
          className="w-full h-auto block overflow-visible"
        >
          <line
            x1="0"
            y1="22"
            x2="120"
            y2="22"
            className="stroke-primary"
            strokeWidth="4"
          />
          <path
            d="M128 14 l16 16 M144 14 l-16 16"
            className="stroke-destructive fill-none"
            strokeWidth="3"
          />
          <text
            x="0"
            y="13"
            className="fill-muted-foreground font-mono text-[13px] font-medium"
          >
            #7
          </text>
          <line
            x1="60"
            y1="62"
            x2="300"
            y2="62"
            className="stroke-amber-500 dark:stroke-amber-400"
            strokeWidth="4"
          />
          <text
            x="60"
            y="52"
            className="fill-muted-foreground font-mono text-[13px] font-medium"
          >
            #8
          </text>
          <rect
            x="170"
            y="72"
            width="130"
            height="22"
            rx="3"
            className="fill-none stroke-border"
            strokeWidth="2"
            strokeDasharray="5 4"
          />
          <text
            x="184"
            y="87"
            className="fill-muted-foreground font-mono text-[13px] font-medium"
          >
            replay 0
          </text>
        </svg>
      </div>
    );
  }

  if (viz.type === 'ticks') {
    return (
      <div
        className="mt-3 flex items-end gap-[3.5px]"
        aria-hidden="true"
        data-testid="viz-ticks"
      >
        {Array.from({ length: viz.of }).map((_, idx) => {
          const active = idx < viz.n;
          return (
            <i
              key={idx}
              className={cn(
                'block w-[3px] rounded-full',
                active
                  ? isStage
                    ? 'bg-amber-500 dark:bg-amber-400 h-9'
                    : 'bg-amber-500 dark:bg-amber-400 h-7'
                  : isStage
                    ? 'bg-border h-6'
                    : 'bg-border h-5'
              )}
            />
          );
        })}
      </div>
    );
  }

  if (viz.type === 'bars') {
    const max = Math.max(viz.a, viz.b);
    return (
      <div
        className="mt-3 grid grid-cols-[auto_1fr] items-center gap-x-2.5 gap-y-1.5 font-mono text-xs text-muted-foreground max-w-[240px]"
        aria-hidden="true"
        data-testid="viz-bars"
      >
        <span>{viz.la}</span>
        <i
          className="block h-3 rounded-sm ring-1 ring-inset ring-border bg-muted/60"
          style={{ width: `${(viz.a / max) * 100}%` }}
        />
        <span className="text-foreground font-medium">{viz.lb}</span>
        <i
          className="block h-3 rounded-sm bg-primary"
          style={{ width: `${(viz.b / max) * 100}%` }}
        />
      </div>
    );
  }

  return null;
}

/**
 * 5-Segment Proportional Verdict Bar (used in the 30-Session Folder Matrix & Inspector)
 */
export function VerdictBar({
  verdicts,
  tall = false,
  vertical = false,
  className,
}: {
  verdicts: [number, number, number, number, number];
  tall?: boolean;
  vertical?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex gap-[2px] w-full overflow-hidden rounded-[2px]',
        vertical
          ? 'flex-col-reverse h-14 w-3.5'
          : tall
            ? 'h-2.5'
            : 'h-1.5 min-w-[60px]',
        className
      )}
    >
      {verdicts.map((count, idx) => {
        if (!count) return null;
        const k = VERDICT_KEYS[idx];
        return (
          <i
            key={k}
            style={{ flexGrow: count }}
            className={cn(
              'block min-w-[2px] min-h-[2px]',
              k === 'C' && 'bg-primary',
              k === 'U' && 'bg-amber-500 dark:bg-amber-400',
              k === 'S' &&
                'bg-[repeating-linear-gradient(45deg,theme(colors.amber.500)_0_2px,transparent_2px_4px)]',
              k === 'P' &&
                'bg-muted-foreground/35 ring-1 ring-inset ring-border',
              k === 'N' && 'bg-transparent ring-1 ring-inset ring-border'
            )}
          />
        );
      })}
    </span>
  );
}
