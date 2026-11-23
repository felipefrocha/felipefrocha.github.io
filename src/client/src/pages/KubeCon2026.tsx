import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link } from 'wouter';
import {
  ArrowRight,
  ArrowUp,
  Check,
  ChevronRight,
  Copy,
  CornerUpLeft,
  ExternalLink,
  HelpCircle,
  ListFilter,
  Maximize2,
  Menu,
  MonitorPlay,
  NotebookText,
  Share2,
  SunMoon,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { SEO } from '@/components/atoms/SEO';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import {
  BADGE_LABELS,
  BADGE_ORDER,
  ROW_SLUGS,
  VERDICT_KEYS,
  kubecon2026Data,
  stripProseFormatting,
  type EvidenceBadgeKey,
  type KubeConFolder,
  type KubeConTrend,
  type ShiftSlug,
} from '@/content/kubecon2026Data';
import {
  EvidenceBadge,
  FormattedProse,
  HeroTickField,
  ReadingViz,
  SourceChip,
  VerdictBar,
  VerificationGlyph,
  Waffle458,
} from '@/components/molecules/kubecon/KubeConVisuals';

interface SlideStepPos {
  slideId: string;
  slideIndex: number;
  shortTitle: string;
  shiftSlug?: ShiftSlug;
  stepInSlide: number;
  totalStepsInSlide: number;
}

declare global {
  interface Window {
    kcSlides?: () => Array<{
      n: number;
      slide: string;
      step: number;
      shortTitle: string;
    }>;
  }
}

const ALL_SHIFTS: KubeConTrend[] = [
  ...kubecon2026Data.trends,
  kubecon2026Data.bridge,
];

const SHIFT_BY_SLUG: Record<
  string,
  { slug: string; short: string; bridge?: boolean }
> = {
  ...Object.fromEntries(ALL_SHIFTS.map((t) => [t.slug, t])),
  context: { slug: 'context', short: kubecon2026Data.map.contextLabel },
};

function getSectionId(trend: { slug: string; bridge?: boolean }): string {
  return trend.bridge ? trend.slug : `trend-${trend.slug}`;
}

function getFourVerdicts(
  v: [number, number, number, number, number]
): [number, number, number, number] {
  return [v[0], v[1] + v[2], v[3], v[4]];
}

function getVerdictSummaryText(
  v: [number, number, number, number, number]
): string {
  const words = kubecon2026Data.map.verdictWords;
  const f = getFourVerdicts(v);
  const total = f[0] + f[1] + f[2] + f[3];
  return (
    f.map((n, i) => `${n} ${words[i].toLowerCase()}`).join(', ') +
    ` (${total} claims)`
  );
}

/**
 * Build the deterministic 35-step presentation sequence across the 13 slides.
 */
function buildPresentationSteps(): SlideStepPos[] {
  const slideDefs: Array<{
    id: string;
    short: string;
    steps: number;
    shift?: ShiftSlug;
  }> = [
    { id: 'top', short: 'Start', steps: 1 },
    { id: 'guess', short: 'How much held?', steps: 2 },
    { id: 'answer', short: 'Answer', steps: 1 },
    { id: 'why-now', short: 'Why now', steps: 3 },
    ...ALL_SHIFTS.map((t) => ({
      id: getSectionId(t),
      short: t.short,
      steps: 4,
      shift: t.slug as ShiftSlug,
    })),
    { id: 'contrarian', short: 'Contrarian', steps: 3 },
    { id: 'monday', short: 'Monday', steps: 3 },
    { id: 'confidence', short: 'Confidence', steps: 1 },
    { id: 'share', short: 'Close', steps: 1 },
  ];

  const positions: SlideStepPos[] = [];
  slideDefs.forEach((s, si) => {
    for (let k = 1; k <= s.steps; k++) {
      positions.push({
        slideId: s.id,
        slideIndex: si,
        shortTitle: s.short,
        shiftSlug: s.shift,
        stepInSlide: k,
        totalStepsInSlide: s.steps,
      });
    }
  });
  return positions;
}

const PRESENTATION_STEPS = buildPresentationSteps();

export default function KubeCon2026Page() {
  const C = kubecon2026Data;
  const { toggleTheme } = useTheme();

  // Scroll & navigation state
  const [readProgress, setReadProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('answer');
  const [mobileSectionsOpen, setMobileSectionsOpen] = useState(false);
  const [copiedAnchor, setCopiedAnchor] = useState<string | null>(null);

  // Hero tick sorting state
  const [ticksSorted, setTicksSorted] = useState(false);

  // Source jump & return focus reference
  const lastSourceTriggerRef = useRef<HTMLElement | null>(null);
  const [highlightedSource, setHighlightedSource] = useState<number | null>(
    null
  );

  // Monday checklist state
  const [checkedMoves, setCheckedMoves] = useState<Record<number, boolean>>({});
  const [checklistCopiedMsg, setChecklistCopiedMsg] = useState('');
  const [checklistFallback, setChecklistFallback] = useState<string | null>(
    null
  );

  // Folder Matrix Map state
  const [shiftFilter, setShiftFilter] = useState<string>('all');
  const [evidenceFilter, setEvidenceFilter] = useState<'all' | 'res' | 'open'>(
    'all'
  );
  const [hoveredFolderSlug, setHoveredFolderSlug] = useState<string | null>(
    null
  );
  const [pinnedFolderSlug, setPinnedFolderSlug] = useState<string | null>(null);
  const [mobileFolderSheetOpen, setMobileFolderSheetOpen] = useState(false);
  const [reorderStatusMsg, setReorderStatusMsg] = useState('');

  // Share state
  const [shareCopiedMsg, setShareCopiedMsg] = useState('');
  const [sharePostText, setSharePostText] = useState(C.share.post);

  // 35-Step Presentation Engine state
  const [isPresenting, setIsPresenting] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [diffApplied, setDiffApplied] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [fsBlockedHint, setFsBlockedHint] = useState(false);
  const digitBufferRef = useRef('');
  const idleTimerRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const currentPos = PRESENTATION_STEPS[stepIdx] || PRESENTATION_STEPS[0];
  const currentNote = useMemo(
    () => C.notes.find((n) => n.step === stepIdx + 1),
    [C.notes, stepIdx]
  );

  // Sort hero ticks automatically after 400ms in scroll mode
  useEffect(() => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduce) {
      setTicksSorted(true);
      return;
    }
    const timer = window.setTimeout(() => {
      setTicksSorted(true);
    }, 400);
    return () => window.clearTimeout(timer);
  }, []);

  // Scroll progress & IntersectionObserver scroll-spy
  useEffect(() => {
    if (isPresenting) return;

    const handleScroll = () => {
      const h = document.documentElement;
      const max = Math.max(1, h.scrollHeight - h.clientHeight);
      setReadProgress(Math.min(1, Math.max(0, h.scrollTop / max)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const sectionIds = [
      ...C.meta.nav.map((n) => n[0]),
      'contrarian',
      'map',
      'sources',
      'share',
    ];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!('IntersectionObserver' in window) || elements.length === 0) {
      return () => window.removeEventListener('scroll', handleScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [C.meta.nav, isPresenting]);

  // Enter / exit / navigate presentation helpers
  const goToStep = useCallback(
    (targetIdx: number, direction: 'forward' | 'back' = 'forward') => {
      const clamped = Math.max(
        0,
        Math.min(PRESENTATION_STEPS.length - 1, targetIdx)
      );
      const targetPos = PRESENTATION_STEPS[clamped];
      setStepIdx(clamped);

      const isBridge = targetPos.slideId === 'standards';
      if (targetPos.stepInSlide === 2 && !isBridge) {
        setDiffApplied(direction === 'back');
      } else {
        setDiffApplied(true);
      }

      if (targetPos.slideId === 'top') {
        const reduce = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;
        setTicksSorted(reduce || direction === 'back');
      }

      try {
        window.history.replaceState(null, '', `#step-${clamped + 1}`);
      } catch {
        // ignore history error
      }
    },
    []
  );

  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = window.setTimeout(() => {
      setIsIdle(true);
    }, 2500);
  }, []);

  const enterPresentation = useCallback(
    (startStepIdx?: number) => {
      let resolvedIdx = startStepIdx;
      if (resolvedIdx == null) {
        // Find slide nearest current scroll position
        const viewportY = window.innerHeight * 0.4;
        let matchingSlideId = 'top';
        const uniqueSlides = Array.from(
          new Set(PRESENTATION_STEPS.map((p) => p.slideId))
        );
        for (const id of uniqueSlides) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= viewportY) {
            matchingSlideId = id;
          }
        }
        const found = PRESENTATION_STEPS.findIndex(
          (p) => p.slideId === matchingSlideId
        );
        resolvedIdx = found >= 0 ? found : 0;
      }

      setIsPresenting(true);
      setIsBlackout(false);
      goToStep(resolvedIdx, 'forward');
      resetIdleTimer();
    },
    [goToStep, resetIdleTimer]
  );

  const exitPresentation = useCallback(() => {
    const activeSlideId =
      PRESENTATION_STEPS[stepIdx]?.slideId || 'answer';
    setIsPresenting(false);
    setIsBlackout(false);
    setShowHelp(false);
    setShowNotes(false);
    setTicksSorted(true);

    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    window.requestAnimationFrame(() => {
      const targetId = activeSlideId === 'guess' ? 'answer' : activeSlideId;
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'auto' });
      }
      try {
        window.history.replaceState(null, '', `#${targetId}`);
      } catch {
        // ignore
      }
    });
  }, [stepIdx]);

  const nextStep = useCallback(() => {
    const pos = PRESENTATION_STEPS[stepIdx];
    if (!pos) return;

    // On Hero slide, first advance sorts the 30 ticks if not yet sorted
    if (pos.slideId === 'top' && !ticksSorted) {
      setTicksSorted(true);
      return;
    }

    // On Shift slides Step 2, first advance applies the "+ To" diff beat before moving to Step 3
    const isShiftWithApplyBeat =
      pos.slideId.startsWith('trend-') && pos.stepInSlide === 2;
    if (isShiftWithApplyBeat && !diffApplied) {
      setDiffApplied(true);
      return;
    }

    if (stepIdx < PRESENTATION_STEPS.length - 1) {
      goToStep(stepIdx + 1, 'forward');
    }
  }, [diffApplied, goToStep, stepIdx, ticksSorted]);

  const prevStep = useCallback(() => {
    if (stepIdx > 0) {
      goToStep(stepIdx - 1, 'back');
    }
  }, [goToStep, stepIdx]);

  const jumpToSlideId = useCallback(
    (slideId: string) => {
      const idx = PRESENTATION_STEPS.findIndex((p) => p.slideId === slideId);
      if (idx >= 0) {
        goToStep(idx, 'forward');
      }
    },
    [goToStep]
  );

  const toggleFullscreen = useCallback(() => {
    try {
      const docEl = document.documentElement;
      if (!document.fullscreenElement) {
        if (!docEl.requestFullscreen) {
          setFsBlockedHint(true);
          window.setTimeout(() => setFsBlockedHint(false), 3500);
          return;
        }
        docEl.requestFullscreen().catch(() => {
          setFsBlockedHint(true);
          window.setTimeout(() => setFsBlockedHint(false), 3500);
        });
      } else if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {
      setFsBlockedHint(true);
      window.setTimeout(() => setFsBlockedHint(false), 3500);
    }
  }, []);

  // Expose window.kcSlides diagnostic helper
  useEffect(() => {
    window.kcSlides = () =>
      PRESENTATION_STEPS.map((p, idx) => ({
        n: idx + 1,
        slide: p.slideId,
        step: p.stepInSlide,
        shortTitle: p.shortTitle,
      }));
    return () => {
      delete window.kcSlides;
    };
  }, []);

  // Parse URL hash (#present, #step-N, #folder-<slug>, #<section>)
  useEffect(() => {
    const applyHash = () => {
      const hash = decodeURIComponent(window.location.hash || '');
      const stepMatch = hash.match(/^#step-(\d+)$/);
      if (stepMatch) {
        enterPresentation(Number(stepMatch[1]) - 1);
        return;
      }
      if (hash === '#present') {
        enterPresentation(0);
        return;
      }
      const folderMatch = hash.match(/^#folder-([a-z0-9-]+)$/);
      if (folderMatch) {
        const slug = folderMatch[1];
        if (C.map.folders.some((f) => f.slug === slug)) {
          setPinnedFolderSlug(slug);
          const mapEl = document.getElementById('map');
          mapEl?.scrollIntoView({ behavior: 'auto' });
        }
        return;
      }
      if (hash.length > 1) {
        const el = document.getElementById(hash.slice(1));
        el?.scrollIntoView({ behavior: 'auto' });
      }
    };

    applyHash();
    const onHashChange = () => {
      if (/^#step-\d+$|^#present$/.test(window.location.hash)) {
        applyHash();
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [C.map.folders, enterPresentation]);

  // Global keyboard handler for both scroll mode (P / Esc) and presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = (target?.tagName || '').toLowerCase();
      if (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        target?.isContentEditable
      ) {
        return;
      }

      const k = e.key;
      if (!isPresenting) {
        if (k === 'p' || k === 'P') {
          e.preventDefault();
          enterPresentation();
        } else if (k === 'Escape' && pinnedFolderSlug) {
          setPinnedFolderSlug(null);
        }
        return;
      }

      resetIdleTimer();

      if (isBlackout) {
        setIsBlackout(false);
        e.preventDefault();
        return;
      }

      if (/^[0-9]$/.test(k)) {
        digitBufferRef.current += k;
        e.preventDefault();
        return;
      }

      if (k === 'Enter' && digitBufferRef.current) {
        const targetStep = parseInt(digitBufferRef.current, 10);
        digitBufferRef.current = '';
        e.preventDefault();
        goToStep(targetStep - 1, 'back');
        return;
      }
      digitBufferRef.current = '';

      const onInteractive = tag === 'button' || tag === 'a';

      switch (k) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          nextStep();
          break;
        case ' ':
        case 'Enter':
          if (onInteractive && k === 'Enter') return;
          e.preventDefault();
          if (e.shiftKey) prevStep();
          else nextStep();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
          e.preventDefault();
          prevStep();
          break;
        case 'Home':
          e.preventDefault();
          goToStep(0, 'forward');
          break;
        case 'End':
          e.preventDefault();
          goToStep(PRESENTATION_STEPS.length - 1, 'back');
          break;
        case 'f':
        case 'F':
        case 'F5':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'b':
        case 'B':
        case '.':
          e.preventDefault();
          setIsBlackout(true);
          break;
        case 't':
        case 'T':
          e.preventDefault();
          toggleTheme();
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          setShowNotes((prev) => !prev);
          break;
        case '?':
          e.preventDefault();
          setShowHelp((prev) => !prev);
          break;
        case 'Escape':
          e.preventDefault();
          if (showHelp) setShowHelp(false);
          else exitPresentation();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          exitPresentation();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    enterPresentation,
    exitPresentation,
    goToStep,
    isBlackout,
    isPresenting,
    nextStep,
    pinnedFolderSlug,
    prevStep,
    resetIdleTimer,
    showHelp,
    toggleFullscreen,
    toggleTheme,
  ]);

  // Lock body scroll when in full-viewport presentation mode
  useEffect(() => {
    if (isPresenting) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.body.classList.add('is-presenting');
      return () => {
        document.body.style.overflow = prevOverflow;
        document.body.classList.remove('is-presenting');
      };
    }
  }, [isPresenting]);

  // Source citation jump & focus return
  const handleJumpToSource = useCallback(
    (sourceId: number, triggerEl: HTMLElement | null) => {
      lastSourceTriggerRef.current = triggerEl;
      setHighlightedSource(sourceId);
      const target = document.getElementById(`src-${sourceId}`);
      if (target) {
        const reduce = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;
        target.scrollIntoView({
          behavior: reduce ? 'auto' : 'smooth',
          block: 'center',
        });
      }
    },
    []
  );

  const handleBackFromSource = useCallback(() => {
    const trigger = lastSourceTriggerRef.current;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (trigger && document.body.contains(trigger)) {
      trigger.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'center',
      });
      trigger.focus({ preventScroll: true });
    } else {
      document.getElementById('top')?.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
      });
    }
  }, []);

  // Copy section anchor link
  const copySectionLink = useCallback((sectionId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    try {
      window.history.replaceState(null, '', `#${sectionId}`);
    } catch {
      // ignore
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedAnchor(sectionId);
        window.setTimeout(() => setCopiedAnchor(null), 2000);
      });
    }
  }, []);

  // Copy Monday checklist as Markdown
  const handleCopyChecklist = useCallback(() => {
    const selectedIds = Object.entries(checkedMoves)
      .filter(([, checked]) => checked)
      .map(([id]) => Number(id));

    let counter = 0;
    const lines: string[] = [];
    C.monday.horizons.forEach(([horizonName, moves]) => {
      moves.forEach((m) => {
        counter++;
        if (selectedIds.length === 0 || selectedIds.includes(counter)) {
          lines.push(
            `- [ ] ${stripProseFormatting(m.title)} — ${stripProseFormatting(m.step)} (${stripProseFormatting(m.owner)}, ${horizonName})`
          );
        }
      });
    });

    const markdown =
      `## Monday moves\n\n${lines.join('\n')}\n\n### Stop funding these\n` +
      C.monday.stop.map((s) => `- [ ] ${s}`).join('\n') +
      '\n';

    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(markdown)
        .then(() => {
          setChecklistCopiedMsg('Copied to clipboard');
          setChecklistFallback(null);
          window.setTimeout(() => setChecklistCopiedMsg(''), 3500);
        })
        .catch(() => {
          setChecklistFallback(markdown);
          setChecklistCopiedMsg(
            'Clipboard blocked: select and copy the text below.'
          );
        });
    } else {
      setChecklistFallback(markdown);
      setChecklistCopiedMsg(
        'Clipboard unavailable: select and copy the text below.'
      );
    }
  }, [C.monday.horizons, C.monday.stop, checkedMoves]);

  // Folder Matrix Inspector active folder
  const activeFolderSlug = pinnedFolderSlug || hoveredFolderSlug;
  const activeFolder = useMemo(
    () => C.map.folders.find((f) => f.slug === activeFolderSlug) || null,
    [C.map.folders, activeFolderSlug]
  );

  const isFolderEvidenceMatch = useCallback(
    (folder: KubeConFolder) => {
      if (evidenceFilter === 'all') return true;
      const tot = folder.v.reduce((a, b) => a + b, 0);
      if (evidenceFilter === 'res') {
        return (folder.v[0] + folder.v[1] + folder.v[2]) * 2 >= tot;
      }
      return (folder.v[3] + folder.v[4]) * 2 >= tot;
    },
    [evidenceFilter]
  );

  const siteUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://www.feliperocha.systems';
  const canonicalUrl = `${siteUrl}/kubecon-2026`;

  // Render Section Anchor Copy Button
  const renderAnchorButton = (id: string) => (
    <button
      type="button"
      onClick={() => copySectionLink(id)}
      aria-label="Copy link to this section"
      className="ml-2 inline-flex items-center justify-center h-6 w-6 rounded text-xs font-mono text-muted-foreground/60 hover:text-primary hover:bg-muted transition-colors align-middle"
    >
      {copiedAnchor === id ? (
        <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      ) : (
        '#'
      )}
    </button>
  );

  // Render Folder Inspector Card Content
  const renderFolderDetailContent = (folder: KubeConFolder) => {
    const primaryShift = SHIFT_BY_SLUG[folder.trend];
    const v4 = getFourVerdicts(folder.v);
    const words = C.map.verdictWords;

    return (
      <div className="space-y-3" data-testid="folder-detail-content">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-base text-foreground leading-snug">
              {folder.name}
              {folder.mixed && (
                <span className="text-amber-600 dark:text-amber-400 ml-1">
                  †
                </span>
              )}
            </p>
            <p className="font-mono text-xs text-muted-foreground break-all mt-0.5">
              {folder.slug}
            </p>
          </div>
          {pinnedFolderSlug && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              aria-label="Close details"
              onClick={() => {
                setPinnedFolderSlug(null);
                setMobileFolderSheetOpen(false);
              }}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        <p className="text-xs font-mono text-muted-foreground">
          <strong className="text-primary font-semibold">
            {primaryShift?.short}
          </strong>
          {folder.also.length > 0 && (
            <span>
              {' '}
              · also{' '}
              {folder.also
                .map((s) => SHIFT_BY_SLUG[s]?.short || s)
                .join(', ')}
            </span>
          )}
        </p>

        <div className="pt-1">
          <VerdictBar verdicts={folder.v} tall />
        </div>

        <ul className="space-y-1 font-mono text-xs text-muted-foreground pt-1">
          {v4.map((count, i) => (
            <li key={words[i]} className="flex items-center gap-2">
              <strong className="text-foreground font-semibold w-6 tabular-nums inline-block">
                {count}
              </strong>
              <span>{words[i]}</span>
            </li>
          ))}
        </ul>

        {folder.adds && (
          <p className="text-xs text-foreground/90 leading-relaxed pt-1 border-t border-border/60">
            {folder.adds}
          </p>
        )}

        {folder.mixed && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              †
            </span>{' '}
            {C.map.mixedNote}
          </p>
        )}

        {folder.trend !== 'context' && primaryShift && (
          <div className="pt-2">
            <a
              href={`#${getSectionId(primaryShift)}`}
              onClick={() => setMobileFolderSheetOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-primary hover:underline"
            >
              Go to {primaryShift.short}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    );
  };

  // ============================================================================
  // PRESENTATION STAGE VIEW (35 Steps across 13 Slides)
  // ============================================================================
  const renderPresentationStage = () => {
    if (!isPresenting) return null;

    const { slideId, stepInSlide } = currentPos;
    const activeShift = ALL_SHIFTS.find((t) => getSectionId(t) === slideId);

    // Tickstrip progress status
    const currentShiftIdx = currentPos.shiftSlug
      ? ROW_SLUGS.indexOf(currentPos.shiftSlug)
      : -1;

    return (
      <div
        data-testid="kubecon-presentation-stage"
        data-slide={slideId}
        data-step={stepInSlide}
        onMouseMove={resetIdleTimer}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (
            target.closest(
              'a,button,input,textarea,[data-stage-ui],[role="dialog"]'
            )
          ) {
            return;
          }
          if (e.clientX < window.innerWidth / 3) {
            prevStep();
          } else {
            nextStep();
          }
        }}
        onTouchStart={(e) => {
          touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        }}
        onTouchEnd={(e) => {
          if (!touchStartRef.current) return;
          const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
          const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) nextStep();
            else prevStep();
          }
          touchStartRef.current = null;
        }}
        style={
          {
            '--u': 'min(1vw, 1.7778vh)',
          } as React.CSSProperties
        }
        className={cn(
          'fixed inset-0 z-50 bg-background text-foreground flex flex-col justify-between overflow-hidden select-none',
          'px-[calc(6*var(--u))] py-[calc(5*var(--u))]',
          isIdle && 'cursor-none'
        )}
      >
        {/* Top-Right Stage Controls */}
        <div
          data-stage-ui="true"
          className={cn(
            'fixed top-[calc(1.5*var(--u))] right-[calc(1.5*var(--u))] z-50 flex items-center gap-2 transition-opacity duration-300',
            isIdle && 'opacity-0 pointer-events-none'
          )}
        >
          <Button
            type="button"
            variant={showNotes ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowNotes((v) => !v)}
            data-testid="button-stage-notes"
            className="rounded-full font-mono text-xs h-9 px-3.5"
          >
            <NotebookText className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
            Notes (N)
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowHelp((v) => !v)}
            data-testid="button-stage-help"
            aria-label="Keyboard shortcuts (?)"
            className="rounded-full font-mono text-xs h-9 px-3"
          >
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            data-testid="button-stage-theme"
            aria-label="Toggle theme (T)"
            className="rounded-full font-mono text-xs h-9 px-3"
          >
            <SunMoon className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            data-testid="button-stage-fullscreen"
            className="rounded-full font-mono text-xs h-9 px-3.5 hidden sm:inline-flex"
          >
            <Maximize2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
            Full screen
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={exitPresentation}
            data-testid="button-stage-exit"
            className="rounded-full font-mono text-xs h-9 px-3.5"
          >
            <X className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
            Exit (Esc)
          </Button>
        </div>

        {fsBlockedHint && (
          <div
            data-stage-ui="true"
            className="fixed top-16 right-6 z-50 rounded-lg border border-border bg-popover px-3.5 py-2 text-xs font-mono text-popover-foreground shadow-md"
          >
            Full screen is blocked here: press F11 (or Ctrl+Cmd+F on a Mac).
          </div>
        )}

        {/* Active Slide Stage Content */}
        <div className="flex-1 flex flex-col justify-center min-h-0 w-full max-w-[1600px] mx-auto">
          {/* SLIDE 1: HERO (Step 1) */}
          {slideId === 'top' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-[calc(4*var(--u))] items-center">
              <p className="lg:col-span-12 font-mono text-[max(16px,calc(1.2*var(--u)))] text-muted-foreground mb-[calc(1.2*var(--u))]">
                {C.hero.eyebrow}
              </p>
              <h1 className="lg:col-span-7 font-bold tracking-tight text-[calc(4.8*var(--u))] leading-[1.02] text-balance">
                {C.hero.h1}
              </h1>
              <p
                className={cn(
                  'lg:col-span-5 text-[max(20px,calc(1.85*var(--u)))] text-muted-foreground leading-snug self-end transition-opacity duration-300',
                  ticksSorted && 'lg:opacity-25'
                )}
              >
                {C.hero.subtitle}
              </p>
              <div className="lg:col-span-12">
                <HeroTickField
                  folders={C.map.folders}
                  sorted={ticksSorted}
                  isStage
                  caption={C.hero.tickCaption}
                />
              </div>
            </div>
          )}

          {/* SLIDE 2: GUESS / LIVE MOMENT 1 (Steps 2-3) */}
          {slideId === 'guess' && (
            <div>
              {stepInSlide === 1 ? (
                <div className="space-y-[calc(2.5*var(--u))]">
                  <Badge
                    variant="outline"
                    className="font-mono text-xs border-primary/40 bg-primary/10 text-primary"
                  >
                    Live Moment 1 · Audience Poll
                  </Badge>
                  <h2 className="font-bold tracking-tight text-[calc(3.4*var(--u))] leading-[1.1] max-w-[26ch]">
                    {C.guess.q}
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-[calc(1.4*var(--u))] max-w-4xl pt-2">
                    {C.guess.options.map((opt) => (
                      <li
                        key={opt}
                        className="font-semibold text-[calc(2.4*var(--u))] leading-tight border-l-4 border-primary pl-[calc(1.2*var(--u))] py-[calc(0.5*var(--u))]"
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                  <p className="font-mono text-[max(18px,calc(1.5*var(--u)))] text-muted-foreground">
                    {C.guess.footer}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-[calc(4*var(--u))] items-center">
                  <div className="space-y-[calc(1.2*var(--u))]">
                    <p className="font-bold tabular-nums tracking-tight text-primary text-[calc(9.5*var(--u))] leading-[0.9]">
                      {C.guess.big}
                    </p>
                    {C.guess.lines.map((line) => (
                      <p
                        key={line}
                        className="font-medium text-[max(20px,calc(1.95*var(--u)))] leading-snug max-w-[42ch]"
                      >
                        {line}
                      </p>
                    ))}
                    <p className="text-[max(18px,calc(1.65*var(--u)))] text-muted-foreground">
                      {C.guess.line3}
                    </p>
                    <div className="pt-2">
                      <EvidenceBadge
                        badge={C.guess.badge}
                        qualifier={C.guess.bq}
                        isStage
                      />
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <Waffle458 onlyC isStage />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SLIDE 3: THE ANSWER (Step 4) */}
          {slideId === 'answer' && (
            <div className="space-y-[calc(2.6*var(--u))]">
              <p className="font-bold tracking-tight text-[calc(3.2*var(--u))] leading-[1.08] max-w-[30ch]">
                {C.answer.stageLine}
              </p>

              <div className="space-y-[calc(1.6*var(--u))]">
                {/* Standards Bridge Band above the 4 promises */}
                <button
                  type="button"
                  onClick={() => jumpToSlideId('standards')}
                  className="w-full text-left rounded-xl border border-dashed border-primary/50 bg-card/80 p-[calc(1.5*var(--u))] flex flex-wrap items-baseline gap-[calc(1.5*var(--u))] hover:border-primary transition-colors cursor-pointer"
                >
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Bridge
                  </span>
                  <span className="font-bold text-primary text-[calc(2.1*var(--u))]">
                    {C.bridge.short}
                  </span>
                  <span className="text-[max(18px,calc(1.5*var(--u)))] text-muted-foreground">
                    {C.bridge.q}
                  </span>
                </button>

                {/* 4 Core Shifts */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-[calc(1.5*var(--u))]">
                  {C.trends.map((t) => (
                    <button
                      key={t.slug}
                      type="button"
                      onClick={() => jumpToSlideId(getSectionId(t))}
                      className="text-left rounded-xl border border-border bg-card/60 hover:bg-card hover:border-primary/60 p-[calc(1.5*var(--u))] transition-colors cursor-pointer space-y-2"
                    >
                      <p className="font-bold text-primary text-[calc(2.1*var(--u))] leading-tight">
                        {t.short}
                      </p>
                      <p className="text-[max(16px,calc(1.35*var(--u)))] text-muted-foreground leading-snug">
                        {t.q}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: WHY NOW / SCQ (Steps 5-7) */}
          {slideId === 'why-now' && (
            <div className="space-y-[calc(2*var(--u))]">
              {C.why.blocks.map((block, idx) => {
                const blockStep = idx + 1;
                if (blockStep !== stepInSlide) return null;
                return (
                  <div
                    key={block.label}
                    className="space-y-[calc(1.8*var(--u))] animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <Badge
                      variant="outline"
                      className="font-mono text-xs border-primary/40 bg-primary/10 text-primary"
                    >
                      {block.label}
                    </Badge>
                    <h2 className="font-bold tracking-tight text-[calc(2.9*var(--u))] leading-[1.12] max-w-[30ch]">
                      {block.text}
                    </h2>

                    {block.stat && (
                      <div className="flex flex-wrap lg:flex-nowrap items-center gap-[calc(3.5*var(--u))] pt-2">
                        <div className="space-y-2 max-w-xl">
                          <p className="font-bold tabular-nums text-primary text-[calc(5.6*var(--u))] leading-none">
                            {block.stat.value}
                          </p>
                          <p className="text-[max(20px,calc(1.85*var(--u)))] text-foreground/90 leading-snug">
                            {block.stat.text}
                          </p>
                          <EvidenceBadge
                            badge={block.stat.badge}
                            isStage
                          />
                        </div>
                        <ReadingViz viz={block.stat.viz} isStage />
                      </div>
                    )}

                    {block.lines && (
                      <ul className="space-y-[calc(1.1*var(--u))] pt-2">
                        {block.lines.map(([lineText, lineBadge]) => (
                          <li
                            key={lineText}
                            className="flex items-center gap-3 text-[max(20px,calc(1.95*var(--u)))] font-medium"
                          >
                            <VerificationGlyph
                              badge={lineBadge}
                              className="h-5 w-5"
                            />
                            <span>{lineText}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* SLIDES 5-9: FOUR SHIFTS + STANDARDS BRIDGE (Steps 8-27) */}
          {activeShift && (
            <div className="w-full">
              {/* Step 1: Shift Chapter Opener */}
              {stepInSlide === 1 && (
                <div className="space-y-[calc(1.2*var(--u))] animate-in fade-in duration-300">
                  <p className="font-mono uppercase tracking-wider text-muted-foreground text-[max(16px,calc(1.2*var(--u)))]">
                    {activeShift.bridge ? 'Bridge' : 'Shift'}
                  </p>
                  <h2 className="font-bold tracking-tight text-primary text-[calc(8.5*var(--u))] leading-[0.95]">
                    {activeShift.short}
                  </h2>
                  <p className="font-medium text-muted-foreground text-[calc(2.5*var(--u))] leading-snug">
                    {activeShift.q}
                  </p>
                  <div className="flex items-center gap-3 pt-[calc(1.2*var(--u))]">
                    {activeShift.strip.map((b, i) => (
                      <VerificationGlyph
                        key={`${b}-${i}`}
                        badge={b}
                        className="h-6 w-6"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Title + From/To Diff (with + application beat) */}
              {stepInSlide === 2 && (
                <div className="space-y-[calc(2.5*var(--u))] animate-in fade-in duration-300">
                  <h2 className="font-bold tracking-tight text-[calc(2.8*var(--u))] leading-[1.12] max-w-[32ch]">
                    {activeShift.title}
                  </h2>
                  <div className="border-l-2 border-border font-sans space-y-2">
                    <div className="grid grid-cols-[3.4em_1.2em_1fr] items-baseline pl-5 py-2 text-[calc(2.2*var(--u))] text-muted-foreground">
                      <span className="font-mono text-[0.75em] uppercase tracking-wider">
                        From
                      </span>
                      <span className="font-mono font-bold">−</span>
                      <span>{activeShift.from}</span>
                    </div>
                    <div
                      data-testid="stage-diff-to"
                      className={cn(
                        'grid grid-cols-[3.4em_1.2em_1fr] items-baseline pl-5 py-2.5 text-[calc(2.2*var(--u))] border-l-4 border-primary -ml-[2px] bg-gradient-to-r from-primary/10 to-transparent text-foreground font-semibold transition-opacity duration-300',
                        !diffApplied && !activeShift.bridge
                          ? 'opacity-0 invisible'
                          : 'opacity-100 visible'
                      )}
                    >
                      <span className="font-mono text-[0.75em] uppercase tracking-wider text-primary">
                        To
                      </span>
                      <span className="font-mono font-bold text-primary">
                        +
                      </span>
                      <span>{activeShift.to}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Steps 3 & 4: Diff docks left; Hero Reading (Step 3) or So What (Step 4) docks right */}
              {(stepInSlide === 3 || stepInSlide === 4) && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-[calc(3.5*var(--u))] items-start animate-in fade-in duration-300">
                  <div className="lg:col-span-6 space-y-[calc(1.5*var(--u))]">
                    <p className="font-mono uppercase tracking-wider text-sm text-primary font-semibold">
                      {activeShift.short} · {activeShift.q}
                    </p>
                    <div className="border-l-2 border-border space-y-2">
                      <div className="grid grid-cols-[3.4em_1.1em_1fr] items-baseline pl-4 py-1.5 text-[calc(1.75*var(--u))] text-muted-foreground">
                        <span className="font-mono text-[0.75em] uppercase">
                          From
                        </span>
                        <span className="font-mono">−</span>
                        <span>{activeShift.from}</span>
                      </div>
                      <div className="grid grid-cols-[3.4em_1.1em_1fr] items-baseline pl-4 py-2 text-[calc(1.75*var(--u))] border-l-4 border-primary -ml-[2px] bg-primary/10 text-foreground font-semibold">
                        <span className="font-mono text-[0.75em] uppercase text-primary">
                          To
                        </span>
                        <span className="font-mono text-primary">+</span>
                        <span>{activeShift.to}</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    {stepInSlide === 3 ? (
                      (() => {
                        const heroReading =
                          activeShift.readings.find((r) => r.stage) ||
                          activeShift.readings[0];
                        return (
                          <div className="rounded-xl border border-border bg-card/70 p-[calc(2*var(--u))] space-y-3">
                            <p className="font-bold tabular-nums tracking-tight text-primary text-[calc(4.8*var(--u))] leading-none">
                              {heroReading.value}
                            </p>
                            <ReadingViz viz={heroReading.viz} isStage />
                            <p className="text-[max(18px,calc(1.65*var(--u)))] text-foreground leading-snug pt-1">
                              {heroReading.label}
                            </p>
                            <div className="pt-1">
                              <EvidenceBadge
                                badge={heroReading.badge}
                                qualifier={heroReading.bq}
                                isStage
                              />
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="rounded-xl border-t-4 border-t-primary border border-border bg-card p-[calc(2.2*var(--u))] space-y-3 shadow-sm">
                        <p className="font-mono text-xs uppercase tracking-wider text-primary">
                          So what for platform leaders
                        </p>
                        <p className="font-semibold text-[max(22px,calc(1.95*var(--u)))] leading-snug text-foreground">
                          {activeShift.soWhatStage}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SLIDE 10: CONTRARIAN FINDING (Steps 28-30) */}
          {slideId === 'contrarian' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[calc(3.5*var(--u))] items-center">
              <div className="lg:col-span-8 space-y-[calc(2*var(--u))]">
                {stepInSlide === 1 && (
                  <div className="space-y-[calc(2*var(--u))]">
                    <Badge
                      variant="outline"
                      className="font-mono text-xs border-primary/40 bg-primary/10 text-primary"
                    >
                      Live Moment 2 · The Human Gate
                    </Badge>
                    <p className="font-bold text-[calc(3.1*var(--u))] leading-tight max-w-[28ch]">
                      {C.contrarian.live1}
                    </p>
                    <p className="font-semibold text-[calc(2.7*var(--u))] leading-tight text-muted-foreground max-w-[28ch] animate-in fade-in duration-700 delay-700">
                      {C.contrarian.live2}
                    </p>
                  </div>
                )}

                {stepInSlide === 2 && (
                  <div className="space-y-[calc(2*var(--u))]">
                    <h2 className="font-bold tracking-tight text-[calc(2.7*var(--u))] leading-[1.12]">
                      {C.contrarian.title}
                    </h2>
                    <ul className="space-y-[calc(1.1*var(--u))]">
                      {C.contrarian.toggles.map((item) => {
                        const [datePart, ...rest] = item.split(': ');
                        return (
                          <li
                            key={item}
                            className="flex items-center gap-4 text-[max(18px,calc(1.85*var(--u)))] font-medium"
                          >
                            <span className="font-mono text-muted-foreground w-28 shrink-0">
                              {datePart}:
                            </span>
                            <span
                              aria-hidden="true"
                              className="relative inline-block w-12 h-6 rounded-full border border-border bg-muted shrink-0"
                            >
                              <i className="block absolute top-1 left-1 w-4 h-4 rounded-full bg-muted-foreground transition-transform" />
                            </span>
                            <span>{rest.join(': ')}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {stepInSlide === 3 && (
                  <div className="space-y-[calc(2*var(--u))]">
                    <h2 className="font-bold tracking-tight text-[calc(2.5*var(--u))] leading-[1.12]">
                      {C.contrarian.title}
                    </h2>
                    <div className="rounded-xl border-t-4 border-t-primary border border-border bg-card p-[calc(2*var(--u))] space-y-2">
                      <p className="font-mono text-xs uppercase tracking-wider text-primary">
                        So what
                      </p>
                      <p className="font-semibold text-[max(22px,calc(2*var(--u)))] leading-snug">
                        {C.contrarian.soWhat}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {(stepInSlide === 1 || stepInSlide === 2) && (
                <div
                  aria-hidden="true"
                  className="lg:col-span-4 flex flex-col items-center justify-center text-center"
                >
                  <div
                    className={cn(
                      'relative w-36 h-20 rounded-full border-4 transition-colors duration-500',
                      stepInSlide === 1
                        ? 'bg-primary border-primary'
                        : 'bg-transparent border-border'
                    )}
                  >
                    <i
                      className={cn(
                        'block absolute top-2 w-14 h-14 rounded-full transition-all duration-500',
                        stepInSlide === 1
                          ? 'left-18 bg-primary-foreground'
                          : 'left-2 bg-muted-foreground'
                      )}
                    />
                  </div>
                  <p className="font-mono text-sm font-semibold mt-4 text-muted-foreground">
                    {stepInSlide === 1
                      ? 'Human approval: required'
                      : 'Human approval: admin setting'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SLIDE 11: MONDAY PLAYBOOK (Steps 31-33) */}
          {slideId === 'monday' && (
            <div className="space-y-[calc(2*var(--u))]">
              {stepInSlide === 1 && (
                <div className="space-y-[calc(1.5*var(--u))]">
                  <p className="font-mono text-sm uppercase tracking-wider text-primary font-semibold">
                    Start Monday
                  </p>
                  <ol className="space-y-[calc(1*var(--u))]">
                    {C.monday.startStage.map((item) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-4 font-semibold text-[calc(2.3*var(--u))] leading-snug"
                      >
                        <span className="font-mono font-bold text-primary">
                          +
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {stepInSlide === 2 && (
                <div className="space-y-[calc(1.5*var(--u))]">
                  <p className="font-mono text-sm uppercase tracking-wider text-muted-foreground font-semibold">
                    {C.monday.stopHeading}
                  </p>
                  <ul className="space-y-[calc(1*var(--u))]">
                    {C.monday.stop.map((item) => (
                      <li
                        key={item}
                        className="flex items-baseline gap-4 font-semibold text-[calc(2.3*var(--u))] text-muted-foreground leading-snug"
                      >
                        <span className="font-mono font-bold">−</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {stepInSlide === 3 && (
                <div className="rounded-xl border-l-4 border-l-primary border border-border bg-card p-[calc(2.4*var(--u))] space-y-3">
                  <p className="font-mono text-xs uppercase tracking-wider text-primary">
                    For the CTO
                  </p>
                  <p className="font-bold text-[calc(2.6*var(--u))] leading-snug">
                    {C.monday.cto}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SLIDE 12: CONFIDENCE / RECONCILE REPORT (Step 34) */}
          {slideId === 'confidence' && (
            <div className="space-y-[calc(2.2*var(--u))]">
              <h2 className="font-bold tracking-tight text-[calc(2.6*var(--u))] leading-[1.12] max-w-[34ch]">
                {C.confidence.title}
              </h2>

              <div
                role="img"
                aria-label={C.confidence.aria}
                className="grid gap-1.5 pt-2"
                style={{
                  gridTemplateColumns: '108fr 84fr 15fr 149fr 102fr',
                }}
              >
                <div
                  style={{ gridColumn: '1 / 2' }}
                  className="pb-2 border-b border-border mb-1"
                >
                  <strong className="block font-bold tabular-nums text-[calc(3.4*var(--u))] leading-none">
                    108
                  </strong>
                  <span className="text-xs font-mono text-muted-foreground">
                    Checked out as presented
                  </span>
                </div>
                <div
                  style={{ gridColumn: '2 / 4' }}
                  className="pb-2 border-b border-border mb-1"
                >
                  <strong className="block font-bold tabular-nums text-[calc(3.4*var(--u))] leading-none">
                    99
                  </strong>
                  <span className="text-xs font-mono text-muted-foreground">
                    Corrected or overtaken
                  </span>
                </div>
                <div
                  style={{ gridColumn: '4 / 6' }}
                  className="pb-2 border-b border-border mb-1"
                >
                  <strong className="block font-bold tabular-nums text-[calc(3.4*var(--u))] leading-none">
                    251
                  </strong>
                  <span className="text-xs font-mono text-muted-foreground">
                    Not fully confirmed
                  </span>
                </div>

                <div className="h-14 rounded-sm bg-primary" />
                <div className="h-14 rounded-sm bg-amber-500 dark:bg-amber-400" />
                <div className="h-14 rounded-sm bg-[repeating-linear-gradient(45deg,theme(colors.amber.500)_0_2px,transparent_2px_4px)] ring-1 ring-inset ring-amber-500/50" />
                <div className="h-14 rounded-sm bg-muted-foreground/30 ring-1 ring-inset ring-border" />
                <div className="h-14 rounded-sm border border-dashed border-border" />
              </div>

              <p className="font-semibold text-[max(20px,calc(1.8*var(--u)))] text-muted-foreground">
                {C.confidence.note}
              </p>
            </div>
          )}

          {/* SLIDE 13: SHARE / CLOSE (Step 35) */}
          {slideId === 'share' && (
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-[calc(4*var(--u))]">
              <div className="space-y-[calc(1.5*var(--u))]">
                <h2 className="font-bold tracking-tight text-[calc(3.4*var(--u))] leading-[1.08] max-w-[24ch]">
                  {C.share.stage1}
                </h2>
                <p className="text-[max(20px,calc(1.9*var(--u)))] text-muted-foreground max-w-[38ch]">
                  {C.share.stage2}
                </p>
                <p className="font-mono font-semibold text-primary text-[calc(2*var(--u))] pt-2">
                  {C.shareCfg.display}
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  {C.hero.byline}
                </p>
              </div>
              {C.shareCfg.qr && (
                <div
                  role="img"
                  aria-label={`QR code for ${C.shareCfg.display}`}
                  className="w-44 h-44 p-3 rounded-xl bg-white border border-border shrink-0 [&_svg]:w-full [&_svg]:h-full [&_.qr-bg]:fill-white [&_.qr-fg]:fill-slate-900"
                  dangerouslySetInnerHTML={{ __html: C.shareCfg.qr }}
                />
              )}
            </div>
          )}
        </div>

        {/* Presenter Notes Floating Panel (N) */}
        {showNotes && (
          <div
            data-stage-ui="true"
            data-testid="presenter-notes-panel"
            className="fixed left-6 right-6 bottom-14 z-50 max-w-4xl mx-auto rounded-xl border border-border bg-popover/95 backdrop-blur-md p-4 text-popover-foreground shadow-xl max-h-[34vh] overflow-y-auto"
          >
            {currentNote ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4 font-mono text-xs text-muted-foreground border-b border-border/60 pb-1.5">
                  <span>
                    Step {currentNote.step} · {currentNote.slide}
                  </span>
                  <span>
                    {currentNote.time} · ends {currentNote.clock}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  <FormattedProse text={currentNote.say} isStage />
                </p>
                {currentNote.cue && currentNote.cue !== '—' && (
                  <p className="text-xs font-mono text-primary">
                    Cue: <FormattedProse text={currentNote.cue} isStage />
                  </p>
                )}
              </div>
            ) : (
              <p className="font-mono text-xs text-muted-foreground">
                No presenter notes for this step.
              </p>
            )}
          </div>
        )}

        {/* Bottom Stage Chrome: Counter, 30-Folder Tickstrip, Section Name & Progress Bar */}
        <div
          data-stage-ui="true"
          className="fixed inset-x-0 bottom-0 z-40 pointer-events-none"
        >
          <div className="flex items-end justify-between px-6 pb-3">
            <span
              data-testid="stage-step-count"
              className="font-mono text-xs text-muted-foreground tabular-nums"
            >
              {stepIdx + 1} / {PRESENTATION_STEPS.length}
            </span>

            {/* 30-Folder Tickstrip Map */}
            <div
              aria-hidden="true"
              className="hidden sm:flex items-end gap-3"
            >
              {ROW_SLUGS.map((rowSlug, rowIdx) => {
                const count = C.map.folders.filter(
                  (f) => f.trend === rowSlug
                ).length;
                const state =
                  slideId === 'share'
                    ? 'full'
                    : currentShiftIdx < 0
                      ? 'visited'
                      : rowIdx < currentShiftIdx
                        ? 'visited'
                        : rowIdx === currentShiftIdx
                          ? 'current'
                          : 'future';
                return (
                  <span
                    key={rowSlug}
                    data-state={state}
                    className="flex items-end gap-[3px]"
                  >
                    {Array.from({ length: count }).map((_, idx) => (
                      <i
                        key={idx}
                        className={cn(
                          'block w-[2px] rounded-full transition-all',
                          state === 'current'
                            ? 'h-4 bg-primary'
                            : state === 'full'
                              ? 'h-3 bg-primary/80'
                              : state === 'visited'
                                ? 'h-3 bg-foreground/45'
                                : 'h-3 bg-border'
                        )}
                      />
                    ))}
                  </span>
                );
              })}
            </div>

            <span
              data-testid="stage-section-name"
              className="font-mono text-xs text-muted-foreground"
            >
              {currentPos.shortTitle}
            </span>
          </div>

          <div className="h-1 w-full bg-border/50">
            <div
              className="h-full bg-primary transition-transform duration-300 origin-left"
              style={{
                transform: `scaleX(${(stepIdx + 1) / PRESENTATION_STEPS.length})`,
              }}
            />
          </div>
        </div>

        {/* Blackout Overlay (B or .) */}
        {isBlackout && (
          <div
            data-testid="stage-blackout"
            onClick={() => setIsBlackout(false)}
            className="fixed inset-0 z-50 bg-black cursor-pointer"
          />
        )}

        {/* Presenter Keyboard Shortcuts Help Dialog (?) */}
        <Dialog open={showHelp} onOpenChange={setShowHelp}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Presenter Keyboard Shortcuts</DialogTitle>
              <DialogDescription>
                Navigate the 35-step presentation deck using keyboard, clicker,
                or touch gestures.
              </DialogDescription>
            </DialogHeader>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs font-mono pt-2">
              <dt className="font-semibold text-foreground">
                → / Space / PgDn
              </dt>
              <dd className="text-muted-foreground">
                Next step (clicker works)
              </dd>
              <dt className="font-semibold text-foreground">← / PgUp</dt>
              <dd className="text-muted-foreground">Previous step</dd>
              <dt className="font-semibold text-foreground">Home / End</dt>
              <dd className="text-muted-foreground">First / last step</dd>
              <dt className="font-semibold text-foreground">12 + Enter</dt>
              <dd className="text-muted-foreground">Jump to step 12</dd>
              <dt className="font-semibold text-foreground">N</dt>
              <dd className="text-muted-foreground">Toggle presenter notes</dd>
              <dt className="font-semibold text-foreground">F</dt>
              <dd className="text-muted-foreground">Full screen (or F11)</dd>
              <dt className="font-semibold text-foreground">B or .</dt>
              <dd className="text-muted-foreground">Blackout screen</dd>
              <dt className="font-semibold text-foreground">T</dt>
              <dd className="text-muted-foreground">Toggle light/dark theme</dd>
              <dt className="font-semibold text-foreground">P or Esc</dt>
              <dd className="text-muted-foreground">Return to scroll mode</dd>
              <dt className="font-semibold text-foreground">?</dt>
              <dd className="text-muted-foreground">Toggle this help</dd>
            </dl>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // ============================================================================
  // SCROLL RESEARCH VIEW (12 Sections)
  // ============================================================================
  return (
    <article className="relative pb-16">
      <SEO
        title={C.meta.title}
        description={C.meta.ogDesc}
        image="/assets/kubecon2026-og.png"
        imageAlt={C.meta.ogAlt}
        type="article"
        canonical={canonicalUrl}
        publishedTime="2026-11-17T00:00:00.000Z"
        author="Felipe F. Rocha"
        tags={[
          'kubecon',
          'kubernetes',
          'ai-agents',
          'mcp',
          'platform-engineering',
          'cloud-native',
        ]}
      />

      {/* Reading Progress Bar */}
      <div
        aria-hidden="true"
        className={cn(
          'fixed top-0 left-0 right-0 h-0.5 bg-primary origin-left z-50 pointer-events-none transition-transform duration-75',
          isPresenting && 'hidden'
        )}
        style={{ transform: `scaleX(${readProgress})` }}
      />

      {/* Sticky Section Sub-Navigation Bar */}
      <div
        className={cn(
          'sticky top-12 z-30 border-b border-border/70 bg-background/90 backdrop-blur-md',
          isPresenting && 'hidden'
        )}
      >
        <div className="container-default max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-3">
          <a
            href="#top"
            className="font-mono text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap flex items-center gap-1.5"
          >
            <span>{C.meta.shortTitle}</span>
            <span className="text-muted-foreground font-normal">
              · {C.meta.shortTitleSub}
            </span>
          </a>

          {/* Desktop Scroll-Spy Section Links */}
          <nav
            aria-label="KubeCon 2026 report sections"
            className="hidden lg:flex items-center gap-0.5 overflow-x-auto"
          >
            {C.meta.nav.map(([id, label]) => {
              const isCurrent = activeSection === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  aria-current={isCurrent ? 'true' : undefined}
                  className={cn(
                    'px-2 h-12 inline-flex items-center text-[11px] xl:text-xs font-mono border-b-2 transition-colors whitespace-nowrap',
                    isCurrent
                      ? 'border-primary text-foreground font-semibold'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Mobile / Tablet Sections Sheet Drawer */}
            <Sheet
              open={mobileSectionsOpen}
              onOpenChange={setMobileSectionsOpen}
            >
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="xl:hidden h-8 text-xs font-mono"
                  data-testid="button-kubecon-sections"
                >
                  <Menu className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  Sections
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[80vh] overflow-auto">
                <SheetHeader className="text-left pb-3">
                  <SheetTitle className="font-mono text-sm">
                    Report Sections
                  </SheetTitle>
                  <SheetDescription className="text-xs">
                    Jump directly to any shift, audit matrix, or playbook
                    section.
                  </SheetDescription>
                </SheetHeader>
                <ul className="divide-y divide-border/60">
                  {[
                    ...C.meta.nav,
                    ['contrarian', 'Contrarian'],
                    ['map', 'Map (30 Session Folders)'],
                    ['sources', 'Sources (54 Checked)'],
                    ['share', 'Share'],
                  ].map(([id, label]) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        onClick={() => setMobileSectionsOpen(false)}
                        className="flex items-center justify-between py-3 text-sm font-medium text-foreground hover:text-primary"
                      >
                        <span>{label}</span>
                        <ChevronRight
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </SheetContent>
            </Sheet>

            <Button
              type="button"
              size="sm"
              onClick={() => enterPresentation()}
              data-testid="button-present-mode"
              title="Presentation mode (P)"
              className="h-8 text-xs font-mono rounded-full px-3.5"
            >
              <MonitorPlay className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
              Present
              <kbd className="ml-1.5 hidden sm:inline-block rounded border border-primary-foreground/30 px-1 py-0.2 text-[10px] opacity-90">
                P
              </kbd>
            </Button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'container-default max-w-6xl mx-auto px-4 sm:px-6',
          isPresenting && 'hidden'
        )}
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground pt-6 pb-2"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="text-foreground truncate">
            KubeCon NA 2026 Trends
          </span>
        </nav>

        {/* ================================================================
            SECTION 1: HERO (#top)
            ================================================================ */}
        <section
          id="top"
          aria-label="Cover"
          className="py-10 md:py-16 border-b border-border/60"
        >
          <p className="font-mono text-xs sm:text-sm text-primary font-medium mb-2">
            {C.hero.eyebrow}
          </p>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground mb-4">
            {C.hero.kicker}
          </p>
          <h1
            data-testid="text-kubecon-title"
            className="text-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance max-w-[18ch] mb-6"
          >
            {C.hero.h1}
          </h1>
          <p className="text-body-lg text-lg sm:text-xl text-foreground/90 leading-relaxed max-w-[54ch] text-pretty">
            {C.hero.subtitle}
          </p>
          <p className="mt-4 text-xs sm:text-sm font-mono text-muted-foreground">
            {C.hero.byline} · {C.hero.checked}
          </p>

          {/* Animated 30-Tick Sorting Field */}
          <HeroTickField
            folders={C.map.folders}
            sorted={ticksSorted}
            caption={C.hero.tickCaption}
          />
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            {C.hero.tickCaption}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <a href="#answer">Read the 4 Shifts</a>
            </Button>
            <Button
              type="button"
              onClick={() => enterPresentation(0)}
              data-testid="button-hero-present"
              className="rounded-full"
            >
              <MonitorPlay className="h-4 w-4 mr-2" aria-hidden="true" />
              Present (35-Step Deck)
            </Button>
            <Button asChild variant="ghost" size="sm" className="font-mono text-xs">
              <a href="#map">Explore 30 Session Folders →</a>
            </Button>
          </div>
        </section>

        {/* ================================================================
            SECTION 2: THE ANSWER & 5-NODE PYRAMID TREE (#answer)
            ================================================================ */}
        <section
          id="answer"
          aria-labelledby="h-answer"
          className="py-14 md:py-20 border-b border-border/60 scroll-mt-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <p className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
                  Executive Synthesis
                </p>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {C.answer.rail}
                </p>
              </div>
            </aside>

            <div className="lg:col-span-9 space-y-6">
              <h2
                id="h-answer"
                className="text-h2 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight leading-snug text-foreground text-pretty"
              >
                {C.answer.governing}
                {renderAnchorButton('answer')}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-[65ch]">
                {C.answer.split}
              </p>

              {/* 5-Node Pyramid Decision Tree */}
              <div className="pt-4" data-testid="pyramid-decision-tree">
                <div
                  aria-hidden="true"
                  className="hidden lg:block w-px h-7 bg-border ml-6"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {C.trends.map((t) => {
                    const secId = getSectionId(t);
                    return (
                      <a
                        key={t.slug}
                        href={`#${secId}`}
                        data-testid={`tree-node-${t.slug}`}
                        className="group relative flex flex-col justify-between rounded-xl border border-border/80 border-t-2 border-t-primary bg-card/50 hover:bg-card hover:border-primary/60 p-4 transition-all"
                      >
                        <div className="space-y-2">
                          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                            Shift
                          </p>
                          <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            {t.short}
                          </p>
                          <p className="text-xs font-mono text-primary/90">
                            {t.q}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                            {t.title}
                          </p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between">
                          <span
                            className="flex items-center gap-1.5"
                            aria-label={`Evidence: ${t.strip.map((k) => BADGE_LABELS[k]).join(', ')}`}
                          >
                            {t.strip.map((b, i) => (
                              <VerificationGlyph key={`${b}-${i}`} badge={b} />
                            ))}
                          </span>
                          <span className="font-mono text-[11px] text-muted-foreground group-hover:text-foreground">
                            Go →
                          </span>
                        </div>
                      </a>
                    );
                  })}

                  {/* Bridge Node: Standards */}
                  <a
                    href={`#${getSectionId(C.bridge)}`}
                    data-testid="tree-node-standards"
                    className="group relative flex flex-col justify-between rounded-xl border border-dashed border-border hover:border-primary bg-muted/30 hover:bg-card p-4 transition-all"
                  >
                    <div className="space-y-2">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        Bridge
                      </p>
                      <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {C.bridge.short}
                      </p>
                      <p className="text-xs font-mono text-primary/90">
                        {C.bridge.q}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                        {C.bridge.title}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-dashed border-border/50 flex items-center justify-between">
                      <span
                        className="flex items-center gap-1.5"
                        aria-label={`Evidence: ${C.bridge.strip.map((k) => BADGE_LABELS[k]).join(', ')}`}
                      >
                        {C.bridge.strip.map((b, i) => (
                          <VerificationGlyph key={`${b}-${i}`} badge={b} />
                        ))}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground group-hover:text-foreground">
                        Go →
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#contrarian"
                  className="inline-flex items-center gap-2 text-sm font-mono font-medium text-primary hover:underline"
                >
                  <span>{C.answer.contrarian}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 3: WHY NOW — SCQ FRAMEWORK (#why-now)
            ================================================================ */}
        <section
          id="why-now"
          aria-labelledby="h-why"
          className="py-14 md:py-20 border-b border-border/60 scroll-mt-24"
        >
          <h2
            id="h-why"
            className="text-h2 text-2xl sm:text-3xl font-bold tracking-tight text-balance max-w-[34ch] mb-8"
          >
            {C.why.title}
            {renderAnchorButton('why-now')}
          </h2>

          <div className="divide-y divide-border/60">
            {C.why.blocks.map((block) => (
              <div
                key={block.label}
                className="py-7 first:pt-0 last:pb-0 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12"
              >
                <div className="lg:col-span-3">
                  <Badge
                    variant="outline"
                    className="font-mono text-xs border-border bg-muted/40 text-muted-foreground"
                  >
                    {block.label}
                  </Badge>
                </div>

                <div className="lg:col-span-9 space-y-4">
                  <p className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground max-w-[38ch]">
                    {block.text}
                  </p>

                  {block.stat && (
                    <div className="flex flex-wrap items-center gap-6 rounded-xl border border-border/70 bg-card/50 p-5">
                      <div className="space-y-2 max-w-lg">
                        <div className="flex items-baseline gap-3">
                          <strong className="text-3xl sm:text-4xl font-bold tabular-nums text-primary">
                            {block.stat.value}
                          </strong>
                          <span className="text-sm sm:text-base text-foreground font-medium">
                            {block.stat.text}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <EvidenceBadge badge={block.stat.badge} />
                          <SourceChip
                            sources={block.stat.chip.s}
                            text={block.stat.chip.t}
                            badgeContext={block.stat.badge}
                            onJumpToSource={handleJumpToSource}
                          />
                        </div>
                      </div>
                      <ReadingViz viz={block.stat.viz} />
                    </div>
                  )}

                  {block.lines && (
                    <ul className="space-y-2.5 pt-1">
                      {block.lines.map(([lineText, lineBadge]) => (
                        <li
                          key={lineText}
                          className="flex flex-wrap items-center gap-2.5 text-base font-medium text-foreground"
                        >
                          <VerificationGlyph badge={lineBadge} />
                          <span>{lineText}</span>
                          <span className="font-mono text-xs text-muted-foreground border border-border/70 rounded px-1.5 py-0.5">
                            {BADGE_LABELS[lineBadge]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {block.gloss && (
                    <p className="text-xs sm:text-sm font-mono text-muted-foreground bg-muted/40 border-l-2 border-primary/50 pl-3 py-1.5 rounded-r">
                      {block.gloss}
                    </p>
                  )}

                  {block.support && (
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[65ch]">
                      <FormattedProse
                        text={block.support}
                        onJumpToSource={handleJumpToSource}
                      />
                    </p>
                  )}

                  {block.teaser && (
                    <div className="pt-1">
                      <a
                        href="#answer"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-primary hover:underline"
                      >
                        <span>{block.teaser}</span>
                        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            SECTIONS 4-8: FOUR SHIFTS + STANDARDS BRIDGE
            ================================================================ */}
        {ALL_SHIFTS.map((trend) => {
          const secId = getSectionId(trend);
          const isBridge = Boolean(trend.bridge);
          const stageReadings = trend.readings.filter((r) => r.stage);
          const restReadings = trend.readings.filter((r) => !r.stage);
          const orderedReadings = [...stageReadings, ...restReadings];

          return (
            <section
              key={secId}
              id={secId}
              aria-labelledby={`h-${secId}`}
              className="py-14 md:py-20 border-b border-border/60 scroll-mt-24"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left Sticky Rail */}
                <aside className="lg:col-span-3">
                  <div className="lg:sticky lg:top-28 space-y-2">
                    <p className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
                      {isBridge ? 'Bridge' : 'Shift'}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {trend.short}
                    </p>
                    <p className="text-sm font-mono text-muted-foreground">
                      {trend.q}
                    </p>
                    <div
                      className="flex items-center gap-1.5 pt-2"
                      aria-label={`Evidence: ${trend.strip.map((k) => BADGE_LABELS[k]).join(', ')}`}
                    >
                      {trend.strip.map((b, i) => (
                        <VerificationGlyph key={`${b}-${i}`} badge={b} />
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Main Shift Column */}
                <div className="lg:col-span-9 space-y-8 min-w-0">
                  <div>
                    <h2
                      id={`h-${secId}`}
                      className="text-h2 text-2xl sm:text-3xl font-bold tracking-tight text-balance max-w-[32ch]"
                    >
                      {trend.title}
                      {renderAnchorButton(secId)}
                    </h2>
                    {trend.intro && (
                      <p className="mt-3 text-base text-muted-foreground leading-relaxed max-w-[65ch]">
                        {trend.intro}
                      </p>
                    )}
                  </div>

                  {/* From (−) / To (+) Diff Card */}
                  <div
                    data-testid={`diff-card-${trend.slug}`}
                    className="rounded-r-xl border-l-2 border-border bg-card/40 overflow-hidden"
                  >
                    <div className="grid grid-cols-[3.6em_1.2em_1fr] items-baseline px-4 py-2.5 text-base sm:text-lg text-muted-foreground">
                      <span className="font-mono text-xs uppercase tracking-wider">
                        From
                      </span>
                      <span className="font-mono font-bold" aria-hidden="true">
                        −
                      </span>
                      <span>{trend.from}</span>
                    </div>
                    <div className="grid grid-cols-[3.6em_1.2em_1fr] items-baseline px-4 py-3 text-base sm:text-lg border-l-4 border-primary bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-foreground font-semibold">
                      <span className="font-mono text-xs uppercase tracking-wider text-primary">
                        To
                      </span>
                      <span
                        className="font-mono font-bold text-primary"
                        aria-hidden="true"
                      >
                        +
                      </span>
                      <span>{trend.to}</span>
                    </div>
                  </div>

                  {trend.gloss && (
                    <p className="text-xs sm:text-sm font-mono text-muted-foreground">
                      {trend.gloss}
                    </p>
                  )}

                  {/* Arguments & Provenance Notes */}
                  <div className="space-y-6 max-w-[68ch]">
                    {trend.args.map((arg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          'space-y-2.5',
                          idx > 0 && 'pt-6 border-t border-border/50'
                        )}
                      >
                        <p className="text-base text-muted-foreground leading-relaxed">
                          <strong className="font-semibold text-foreground">
                            {arg.lead}
                          </strong>{' '}
                          <FormattedProse
                            text={arg.text}
                            onJumpToSource={handleJumpToSource}
                          />
                        </p>
                        {arg.notes.map((note, nIdx) => (
                          <p
                            key={nIdx}
                            className="text-sm text-muted-foreground pl-3.5 border-l-2 border-border leading-relaxed"
                          >
                            <FormattedProse
                              text={note}
                              onJumpToSource={handleJumpToSource}
                            />
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* 4-Column Readings Grid + Inline Visualizations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-4">
                    {orderedReadings.map((r, rIdx) => (
                      <figure
                        key={rIdx}
                        data-condition={r.badge}
                        className={cn(
                          'flex flex-col justify-between rounded-xl border p-4 bg-card/50',
                          r.stage
                            ? 'border-primary/40 bg-card shadow-2xs'
                            : 'border-border/70'
                        )}
                      >
                        <div>
                          <p
                            className={cn(
                              'text-2xl sm:text-3xl font-bold tabular-nums tracking-tight',
                              r.badge === 'signal' || r.badge === 'illustrative'
                                ? 'text-foreground/80'
                                : 'text-foreground'
                            )}
                          >
                            {r.value}
                          </p>
                          <ReadingViz viz={r.viz} />
                          <figcaption className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {r.label}
                          </figcaption>
                        </div>

                        <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap items-center gap-1.5">
                          <EvidenceBadge badge={r.badge} qualifier={r.bq} />
                          <SourceChip
                            sources={r.chip.s}
                            text={r.chip.t}
                            badgeContext={r.badge}
                            onJumpToSource={handleJumpToSource}
                          />
                        </div>
                      </figure>
                    ))}
                  </div>

                  {/* "So what for platform leaders" Callout Card */}
                  <div className="rounded-xl border border-border/80 bg-muted/40 p-6 sm:p-7 max-w-[72ch] space-y-2.5">
                    <p className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
                      So what for platform leaders
                    </p>
                    <p className="text-base sm:text-lg text-foreground leading-relaxed font-medium">
                      {trend.soWhat}
                    </p>
                  </div>

                  {/* Watch in 2027 */}
                  <div className="flex items-baseline gap-2.5 text-sm text-muted-foreground max-w-[70ch]">
                    <span
                      aria-hidden="true"
                      className="inline-block w-2.5 h-2.5 rounded-full border-2 border-primary shrink-0 translate-y-0.5"
                    />
                    <p className="leading-relaxed">
                      <strong className="font-mono text-xs uppercase tracking-wider text-foreground mr-1.5">
                        Watch in 2027:
                      </strong>
                      <FormattedProse
                        text={trend.watch}
                        onJumpToSource={handleJumpToSource}
                      />
                    </p>
                  </div>

                  {trend.next && (
                    <div className="flex justify-end pt-2">
                      <a
                        href={`#${getSectionId(SHIFT_BY_SLUG[trend.next.toLowerCase()])}`}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                      >
                        <span>Next: {trend.next}</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}

        {/* ================================================================
            SECTION 9: CONTRARIAN FINDING (#contrarian)
            ================================================================ */}
        <section
          id="contrarian"
          aria-labelledby="h-contra"
          className="py-14 md:py-20 border-b border-border/60 scroll-mt-24 space-y-8"
        >
          <div>
            <Badge
              variant="outline"
              className="mb-3 font-mono text-xs border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
            >
              Contrarian Finding
            </Badge>
            <h2
              id="h-contra"
              className="text-h2 text-2xl sm:text-3xl font-bold tracking-tight text-balance max-w-[32ch]"
            >
              {C.contrarian.title}
              {renderAnchorButton('contrarian')}
            </h2>
          </div>

          {/* 3 Dated Switches */}
          <ul className="space-y-3 max-w-2xl">
            {C.contrarian.toggles.map((item) => {
              const [datePart, ...rest] = item.split(': ');
              return (
                <li
                  key={item}
                  className="flex items-center gap-3.5 rounded-xl border border-border/70 bg-card/50 px-4 py-3 text-base font-medium"
                >
                  <span className="font-mono text-xs sm:text-sm text-muted-foreground w-24 shrink-0 tabular-nums">
                    {datePart}:
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative inline-block w-9 h-5 rounded-full border border-border bg-muted shrink-0"
                  >
                    <i className="block absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-muted-foreground" />
                  </span>
                  <span className="text-foreground">{rest.join(': ')}</span>
                </li>
              );
            })}
          </ul>

          {/* So What Card */}
          <div className="rounded-xl border border-border/80 bg-muted/40 p-6 max-w-[72ch] space-y-2">
            <p className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
              So what for platform leaders
            </p>
            <p className="text-base sm:text-lg font-medium text-foreground">
              {C.contrarian.soWhat}
            </p>
          </div>

          {/* Responsive Keyboard-Scrollable Evidence Table (per modern-web-guidance responsive-table) */}
          <div
            tabIndex={0}
            role="region"
            aria-labelledby="contrarian-evidence-caption"
            className="overflow-x-auto max-w-4xl rounded-xl border border-border/70 bg-card/40"
          >
            <table className="w-full text-sm border-collapse">
              <caption
                id="contrarian-evidence-caption"
                className="text-left font-semibold text-base px-4 pt-4 pb-2 text-foreground"
              >
                Evidence
              </caption>
              <thead>
                <tr className="border-b border-border/70 text-left font-mono text-xs text-muted-foreground">
                  <th className="py-2.5 px-4">Claim</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {C.contrarian.evidence.map(([claim, badgeKey, qual, chipRef]) => (
                  <tr key={claim}>
                    <td className="py-3 px-4 text-foreground font-medium">
                      {claim}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <EvidenceBadge
                        badge={badgeKey}
                        qualifier={qual || undefined}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <SourceChip
                        sources={chipRef.s}
                        text={chipRef.t}
                        badgeContext={badgeKey}
                        onJumpToSource={handleJumpToSource}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                {C.contrarian.counterTitle}
              </h3>
              <ul className="divide-y divide-border/60 text-sm text-muted-foreground">
                {C.contrarian.counter.map((item) => (
                  <li key={item} className="py-2.5 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                {C.contrarian.watchTitle}
              </h3>
              <ul className="divide-y divide-border/60 text-sm text-muted-foreground">
                {C.contrarian.watch.map((item, idx) => (
                  <li key={idx} className="py-2.5 leading-relaxed">
                    <FormattedProse
                      text={item}
                      onJumpToSource={handleJumpToSource}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 10: MONDAY PLAYBOOK (#monday)
            ================================================================ */}
        <section
          id="monday"
          aria-labelledby="h-monday"
          className="py-14 md:py-20 border-b border-border/60 scroll-mt-24 space-y-10"
        >
          <h2
            id="h-monday"
            className="text-h2 text-2xl sm:text-3xl font-bold tracking-tight text-balance max-w-[32ch]"
          >
            {C.monday.title}
            {renderAnchorButton('monday')}
          </h2>

          {/* Interactive Horizons Checklist */}
          <div className="space-y-8">
            {(() => {
              let moveCounter = 0;
              return C.monday.horizons.map(([horizonTitle, moves]) => (
                <div key={horizonTitle} className="space-y-3">
                  <h3 className="font-mono text-sm uppercase tracking-wider text-foreground font-semibold flex items-center gap-2 pb-2 border-b border-border">
                    <span
                      aria-hidden="true"
                      className="inline-block w-2 h-2 rounded-full bg-primary"
                    />
                    {horizonTitle}
                  </h3>
                  <ol className="divide-y divide-border/60">
                    {moves.map((move) => {
                      moveCounter++;
                      const moveId = moveCounter;
                      const isChecked = Boolean(checkedMoves[moveId]);
                      const linkedShift = SHIFT_BY_SLUG[move.trend];

                      return (
                        <li
                          key={move.title}
                          className="py-4 flex items-start gap-3.5"
                        >
                          <Checkbox
                            id={`move-${moveId}`}
                            data-testid={`checkbox-move-${moveId}`}
                            checked={isChecked}
                            onCheckedChange={(val) =>
                              setCheckedMoves((prev) => ({
                                ...prev,
                                [moveId]: Boolean(val),
                              }))
                            }
                            aria-label={`Add to my list: ${move.title}`}
                            className="mt-1"
                          />
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <label
                              htmlFor={`move-${moveId}`}
                              className="text-base font-semibold text-foreground cursor-pointer block"
                            >
                              {move.title}
                            </label>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
                              <span>Owner: {move.owner}</span>
                              {linkedShift && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <a
                                    href={`#${getSectionId(linkedShift)}`}
                                    className="text-primary hover:underline"
                                  >
                                    {linkedShift.short}
                                  </a>
                                </>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-[64ch]">
                              <strong className="text-foreground/90 font-medium">
                                First step:
                              </strong>{' '}
                              <FormattedProse
                                text={move.step}
                                onJumpToSource={handleJumpToSource}
                              />
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ));
            })()}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs font-mono text-muted-foreground">
                Tick moves to add them to your list (or copy all).
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyChecklist}
                data-testid="button-copy-checklist"
                className="rounded-full font-mono text-xs"
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                Copy as checklist
              </Button>
              <span
                role="status"
                aria-live="polite"
                className="text-xs font-mono text-primary"
              >
                {checklistCopiedMsg}
              </span>
            </div>

            {checklistFallback && (
              <Textarea
                readOnly
                value={checklistFallback}
                rows={6}
                aria-label="Checklist text to copy"
                className="font-mono text-xs"
              />
            )}
          </div>

          {/* Stop Funding These */}
          <div className="space-y-3 pt-4">
            <h3 className="text-lg font-semibold text-foreground pb-2 border-b border-border">
              {C.monday.stopHeading}
            </h3>
            <ul className="space-y-2">
              {C.monday.stop.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-3 text-base font-medium text-foreground/90"
                >
                  <span
                    className="font-mono font-bold text-muted-foreground"
                    aria-hidden="true"
                  >
                    −
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* For the CTO */}
          <div className="rounded-r-xl border-l-4 border-l-primary border border-border/80 bg-card/60 p-6 sm:p-8 max-w-[72ch] space-y-4">
            <p className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
              For the CTO
            </p>
            <p className="text-lg sm:text-xl font-semibold text-foreground leading-snug">
              {C.monday.cto}
            </p>
            <div className="space-y-3 text-sm text-muted-foreground pt-2 border-t border-border/60">
              <p className="italic">{C.monday.ctoLabel}</p>
              {C.monday.ctoDetail.map(([heading, detail]) => (
                <div key={heading}>
                  <strong className="font-semibold text-foreground">
                    {heading}
                  </strong>{' '}
                  {detail}
                  {heading === 'Where to start.' && (
                    <ul className="list-disc pl-5 mt-1.5 space-y-1">
                      {C.monday.whereToStart.map((w) => (
                        <li key={w}>{w}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 11: CONFIDENCE & RECONCILE REPORT (#confidence)
            ================================================================ */}
        <section
          id="confidence"
          aria-labelledby="h-conf"
          className="py-14 md:py-20 border-b border-border/60 scroll-mt-24 space-y-10"
        >
          <h2
            id="h-conf"
            className="text-h2 text-2xl sm:text-3xl font-bold tracking-tight text-balance max-w-[34ch]"
          >
            {C.confidence.title}
            {renderAnchorButton('confidence')}
          </h2>

          {/* Proportional 5-Segment Marimekko Reconcile Bar */}
          <div className="max-w-4xl space-y-4" data-testid="reconcile-report-bar">
            <div
              role="img"
              aria-label={C.confidence.aria}
              className="grid gap-1"
              style={{
                gridTemplateColumns: '108fr 84fr 15fr 149fr 102fr',
              }}
            >
              <div
                style={{ gridColumn: '1 / 2' }}
                className="pb-2 border-b border-border mb-1"
              >
                <strong className="block text-xl sm:text-3xl font-bold tabular-nums text-foreground">
                  108
                </strong>
                <span className="hidden sm:block text-xs font-mono text-muted-foreground mt-0.5">
                  Checked out as presented
                </span>
              </div>
              <div
                style={{ gridColumn: '2 / 4' }}
                className="pb-2 border-b border-border mb-1"
              >
                <strong className="block text-xl sm:text-3xl font-bold tabular-nums text-foreground">
                  99
                </strong>
                <span className="hidden sm:block text-xs font-mono text-muted-foreground mt-0.5">
                  Corrected or overtaken
                </span>
              </div>
              <div
                style={{ gridColumn: '4 / 6' }}
                className="pb-2 border-b border-border mb-1"
              >
                <strong className="block text-xl sm:text-3xl font-bold tabular-nums text-foreground">
                  251
                </strong>
                <span className="hidden sm:block text-xs font-mono text-muted-foreground mt-0.5">
                  Not fully confirmed
                </span>
              </div>

              <div
                title="Checked out (C): 108"
                className="h-12 rounded-sm bg-primary"
              />
              <div
                title="Updated (U): 84"
                className="h-12 rounded-sm bg-amber-500 dark:bg-amber-400"
              />
              <div
                title="Superseded (S): 15"
                className="h-12 rounded-sm bg-[repeating-linear-gradient(45deg,theme(colors.amber.500)_0_2px,transparent_2px_4px)] ring-1 ring-inset ring-amber-500/50"
              />
              <div
                title="Partial (P): 149"
                className="h-12 rounded-sm bg-muted-foreground/30 ring-1 ring-inset ring-border"
              />
              <div
                title="No public source (N): 102"
                className="h-12 rounded-sm border border-dashed border-border"
              />
            </div>

            <ul className="space-y-2 text-sm text-muted-foreground pt-2">
              {C.confidence.families.map(([famName, , famDesc], idx) => (
                <li key={famName} className="flex items-center gap-2.5">
                  <i
                    aria-hidden="true"
                    className={cn(
                      'inline-block w-3 h-3 rounded-[2px] shrink-0',
                      idx === 0 && 'bg-primary',
                      idx === 1 && 'bg-amber-500 dark:bg-amber-400',
                      idx === 2 &&
                        'bg-muted-foreground/30 ring-1 ring-inset ring-border'
                    )}
                  />
                  <span>{famDesc}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm font-medium text-foreground">
              {C.confidence.note}
            </p>
          </div>

          {/* Solid Ground vs Still Open */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border">
                <VerificationGlyph badge="verified" />
                <span>Solid ground</span>
              </h3>
              <ul className="divide-y divide-border/60 text-sm text-muted-foreground">
                {C.confidence.solid.map((s) => (
                  <li key={s} className="py-3 flex items-baseline gap-2.5">
                    <VerificationGlyph
                      badge="verified"
                      className="translate-y-0.5"
                    />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border">
                <VerificationGlyph badge="signal" />
                <span>Still open</span>
              </h3>
              <ul className="divide-y divide-border/60 text-sm text-muted-foreground">
                {C.confidence.open.map((s) => (
                  <li key={s} className="py-3 flex items-baseline gap-2.5">
                    <VerificationGlyph
                      badge="signal"
                      className="translate-y-0.5"
                    />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What We Are Not Saying */}
          <div className="space-y-3 max-w-[72ch]">
            <h3 className="text-lg font-semibold text-foreground">
              What we are not saying
            </h3>
            <ul className="divide-y divide-border/60 text-sm text-muted-foreground">
              {C.confidence.notSaying.map((s) => (
                <li key={s} className="py-2.5 leading-relaxed">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* 4-Step Method */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Method</h3>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-foreground/40 pt-4">
              {C.confidence.method.map((stepText, idx) => (
                <li key={idx} className="space-y-2">
                  <span className="block font-mono text-2xl font-bold text-primary">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {stepText}
                  </p>
                </li>
              ))}
            </ol>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-[80ch]">
              {C.confidence.methodNote}
            </p>
          </div>

          {/* 7-Tier Verification Badge Legend */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-semibold text-foreground">
              {C.confidence.legendTitle}
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-5 gap-y-3 items-baseline max-w-4xl">
              {BADGE_ORDER.map((k: EvidenceBadgeKey) => (
                <div key={k} className="contents">
                  <dt>
                    <EvidenceBadge badge={k} />
                  </dt>
                  <dd className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground font-semibold">
                      {BADGE_LABELS[k]}:
                    </strong>{' '}
                    {C.confidence.legend[k]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ================================================================
            SECTION 12: 30-SESSION FOLDER MATRIX MAP (#map)
            ================================================================ */}
        <section
          id="map"
          aria-labelledby="h-map"
          className="py-14 md:py-20 border-b border-border/60 scroll-mt-24 space-y-8"
        >
          <div>
            <h2
              id="h-map"
              className="text-h2 text-2xl sm:text-3xl font-bold tracking-tight text-balance max-w-[34ch]"
            >
              {C.map.title}
              {renderAnchorButton('map')}
            </h2>
            <p className="mt-2 text-base text-muted-foreground max-w-[65ch]">
              {C.map.caption}
            </p>
          </div>

          {/* Screen-reader status for filter updates (per modern-web-guidance dynamic-sort) */}
          <p role="status" className="sr-only">
            {reorderStatusMsg}
          </p>

          {/* Dual Filter Bars */}
          <div className="space-y-3">
            <div
              role="group"
              aria-label="Filter by shift"
              className="flex flex-wrap items-center gap-1.5"
            >
              <span className="font-mono text-xs text-muted-foreground w-20 shrink-0 flex items-center gap-1">
                <ListFilter className="h-3 w-3" aria-hidden="true" />
                Shift:
              </span>
              {[
                { slug: 'all', label: 'All' },
                ...ALL_SHIFTS.map((t) => ({ slug: t.slug, label: t.short })),
              ].map((item) => {
                const pressed = shiftFilter === item.slug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    data-testid={`filter-shift-${item.slug}`}
                    aria-pressed={pressed}
                    onClick={() => {
                      setShiftFilter(item.slug);
                      setReorderStatusMsg(
                        `Filtered session folders by shift: ${item.label}`
                      );
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-md font-mono text-xs border transition-colors cursor-pointer',
                      pressed
                        ? 'bg-primary text-primary-foreground border-primary font-medium'
                        : 'bg-card/50 text-muted-foreground border-border hover:text-foreground'
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div
              role="group"
              aria-label="Highlight by evidence"
              className="flex flex-wrap items-center gap-1.5"
            >
              <span className="font-mono text-xs text-muted-foreground w-20 shrink-0">
                Evidence:
              </span>
              {(
                [
                  ['all', 'All evidence'],
                  ['res', 'Mostly resolved'],
                  ['open', 'Mostly open'],
                ] as const
              ).map(([key, label]) => {
                const pressed = evidenceFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    data-testid={`filter-evidence-${key}`}
                    aria-pressed={pressed}
                    onClick={() => {
                      setEvidenceFilter(key);
                      setReorderStatusMsg(
                        `Highlighted session folders by evidence: ${label}`
                      );
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-md font-mono text-xs border transition-colors cursor-pointer',
                      pressed
                        ? 'bg-primary text-primary-foreground border-primary font-medium'
                        : 'bg-card/50 text-muted-foreground border-border hover:text-foreground'
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground max-w-[70ch]">
              {C.map.filterCaption}
            </p>
          </div>

          {/* Matrix + Sticky Detail Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
            <div className="divide-y divide-border/60" data-testid="folder-matrix">
              {ROW_SLUGS.map((rowSlug) => {
                const shiftMeta = SHIFT_BY_SLUG[rowSlug];
                const primaryFolders = C.map.folders.filter(
                  (f) => f.trend === rowSlug
                );
                const secondaryFolders = C.map.folders.filter((f) =>
                  f.also.includes(rowSlug)
                );
                const isRowDimmed =
                  shiftFilter !== 'all' && shiftFilter !== rowSlug;

                return (
                  <div
                    key={rowSlug}
                    data-trend={rowSlug}
                    className={cn(
                      'py-4 grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-4 transition-opacity',
                      isRowDimmed && 'opacity-30'
                    )}
                  >
                    <div>
                      <p
                        className={cn(
                          'font-semibold text-sm',
                          rowSlug === 'context'
                            ? 'text-muted-foreground'
                            : 'text-foreground'
                        )}
                      >
                        {shiftMeta?.short}
                      </p>
                      <span className="block font-mono text-xs text-muted-foreground mt-0.5">
                        {primaryFolders.length} folders
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {/* Primary Folder Chips */}
                      <div className="flex flex-wrap gap-2">
                        {primaryFolders.map((folder) => {
                          const matchesEvidence =
                            isFolderEvidenceMatch(folder);
                          const isSelected =
                            activeFolderSlug === folder.slug;
                          const isPinned = pinnedFolderSlug === folder.slug;

                          return (
                            <button
                              key={folder.slug}
                              type="button"
                              data-slug={folder.slug}
                              data-testid={`folder-chip-${folder.slug}`}
                              aria-label={`${folder.name}${folder.mixed ? ' (mixed folder)' : ''}: ${getVerdictSummaryText(folder.v)}`}
                              onMouseEnter={() => {
                                if (!pinnedFolderSlug) {
                                  setHoveredFolderSlug(folder.slug);
                                }
                              }}
                              onMouseLeave={() => {
                                if (!pinnedFolderSlug) {
                                  setHoveredFolderSlug(null);
                                }
                              }}
                              onFocus={() => {
                                if (!pinnedFolderSlug) {
                                  setHoveredFolderSlug(folder.slug);
                                }
                              }}
                              onClick={() => {
                                if (pinnedFolderSlug === folder.slug) {
                                  setPinnedFolderSlug(null);
                                  setMobileFolderSheetOpen(false);
                                } else {
                                  setPinnedFolderSlug(folder.slug);
                                  if (window.innerWidth < 1024) {
                                    setMobileFolderSheetOpen(true);
                                  }
                                  try {
                                    window.history.replaceState(
                                      null,
                                      '',
                                      `#folder-${folder.slug}`
                                    );
                                  } catch {
                                    // ignore
                                  }
                                }
                              }}
                              className={cn(
                                'inline-flex flex-col justify-center gap-1.5 min-h-[42px] px-2.5 py-2 rounded-md border text-left font-mono text-xs transition-all cursor-pointer max-w-[260px]',
                                isSelected
                                  ? 'border-primary bg-primary/10 text-foreground'
                                  : 'border-border bg-card/60 hover:bg-card hover:border-foreground/40 text-foreground',
                                isPinned && 'ring-2 ring-primary',
                                !matchesEvidence && 'opacity-30'
                              )}
                            >
                              <span className="flex items-center gap-1 leading-tight">
                                <span>{folder.name}</span>
                                {folder.mixed && (
                                  <span
                                    aria-hidden="true"
                                    className="text-amber-600 dark:text-amber-400 font-bold"
                                  >
                                    †
                                  </span>
                                )}
                              </span>
                              <VerdictBar verdicts={folder.v} />
                            </button>
                          );
                        })}
                      </div>

                      {/* Secondary Ghost Folder Chips */}
                      {secondaryFolders.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="font-mono text-[11px] text-muted-foreground mr-1">
                            Also feeds:
                          </span>
                          {secondaryFolders.map((folder) => {
                            const matchesEvidence =
                              isFolderEvidenceMatch(folder);
                            const isSelected =
                              activeFolderSlug === folder.slug;
                            return (
                              <button
                                key={`${rowSlug}-${folder.slug}`}
                                type="button"
                                data-slug={folder.slug}
                                aria-label={`${folder.name} (second shift): ${getVerdictSummaryText(folder.v)}`}
                                onMouseEnter={() => {
                                  if (!pinnedFolderSlug) {
                                    setHoveredFolderSlug(folder.slug);
                                  }
                                }}
                                onClick={() => {
                                  setPinnedFolderSlug(folder.slug);
                                  if (window.innerWidth < 1024) {
                                    setMobileFolderSheetOpen(true);
                                  }
                                }}
                                className={cn(
                                  'px-2 py-1 rounded border border-dashed font-mono text-[11px] transition-colors cursor-pointer',
                                  isSelected
                                    ? 'border-primary text-foreground bg-primary/10'
                                    : 'border-border text-muted-foreground hover:text-foreground',
                                  !matchesEvidence && 'opacity-30'
                                )}
                              >
                                {folder.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Legend */}
              <div
                aria-hidden="true"
                className="pt-4 flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground"
              >
                <span className="inline-flex items-center gap-1.5">
                  <i className="inline-block w-3.5 h-2 rounded-xs bg-primary" />
                  {C.map.verdictWords[0]}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="inline-block w-3.5 h-2 rounded-xs bg-amber-500 dark:bg-amber-400" />
                  {C.map.verdictWords[1]}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="inline-block w-3.5 h-2 rounded-xs bg-muted-foreground/35 ring-1 ring-inset ring-border" />
                  {C.map.verdictWords[2]}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="inline-block w-3.5 h-2 rounded-xs ring-1 ring-inset ring-border" />
                  {C.map.verdictWords[3]}
                </span>
              </div>
            </div>

            {/* Sticky Desktop Detail Inspector */}
            <aside
              aria-live="polite"
              data-testid="folder-detail-panel"
              className="hidden lg:block sticky top-28 rounded-xl border border-border/80 bg-card/70 p-5 min-h-[220px]"
            >
              {activeFolder ? (
                renderFolderDetailContent(activeFolder)
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Hover or tap a session folder chip to see how its claims held
                  up. Click to pin it; press Esc to unpin.
                </p>
              )}
            </aside>
          </div>

          {/* Mobile Folder Inspector Drawer */}
          <Sheet
            open={mobileFolderSheetOpen && Boolean(activeFolder)}
            onOpenChange={(open) => {
              setMobileFolderSheetOpen(open);
              if (!open) setPinnedFolderSlug(null);
            }}
          >
            <SheetContent side="bottom" className="max-h-[75vh] overflow-auto">
              <SheetHeader className="sr-only">
                <SheetTitle>Session Folder Verdict Breakdown</SheetTitle>
                <SheetDescription>
                  Audit breakdown for the selected KubeCon session folder.
                </SheetDescription>
              </SheetHeader>
              {activeFolder && renderFolderDetailContent(activeFolder)}
            </SheetContent>
          </Sheet>

          <p className="text-xs text-muted-foreground flex items-baseline gap-1.5">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              †
            </span>
            <span>{C.map.mixedNote}</span>
          </p>
        </section>

        {/* ================================================================
            SECTION 13: 54 NUMBERED PUBLIC SOURCES (#sources)
            ================================================================ */}
        <section
          id="sources"
          aria-labelledby="h-src"
          className="py-14 md:py-20 border-b border-border/60 scroll-mt-24 space-y-6"
        >
          <div>
            <h2
              id="h-src"
              className="text-h2 text-2xl sm:text-3xl font-bold tracking-tight"
            >
              Sources
              {renderAnchorButton('sources')}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-[70ch]">
              Every public source behind a number, with its date. Dates are the
              page&apos;s own; &ldquo;fetched&rdquo; means the page shows none.
            </p>
          </div>

          <ol className="columns-1 lg:columns-2 gap-12 text-xs sm:text-sm text-muted-foreground">
            {C.sources.map((src) => {
              const isHighlighted = highlightedSource === src.n;
              return (
                <li
                  key={src.n}
                  id={`src-${src.n}`}
                  className={cn(
                    'break-inside-avoid py-3 border-t border-border/60 scroll-mt-28 transition-colors',
                    isHighlighted && 'bg-primary/10 px-2 rounded-md'
                  )}
                >
                  <div className="space-y-1">
                    <div>
                      <span className="font-mono font-semibold text-foreground mr-2">
                        [{src.d}]
                      </span>
                      <span className="text-foreground font-medium">
                        {src.title}
                      </span>
                      <span>
                        , {src.publisher}, {src.date}
                      </span>
                      <Badge
                        variant="outline"
                        className="ml-2 font-mono text-[10px] py-0 px-1.5"
                      >
                        {src.type}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                      <div className="space-y-0.5 break-all">
                        {src.urls.length > 0 ? (
                          src.urls.map((u) => (
                            <a
                              key={u}
                              href={u}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block font-mono text-xs text-primary hover:underline"
                            >
                              {u}
                            </a>
                          ))
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">
                            {src.nourl}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleBackFromSource}
                        className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                      >
                        <CornerUpLeft className="h-3 w-3" aria-hidden="true" />
                        Back
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ================================================================
            SECTION 14: SHARE & CLOSE (#share)
            ================================================================ */}
        <section
          id="share"
          aria-labelledby="h-share"
          className="py-14 md:py-20 scroll-mt-24"
        >
          <div className="flex flex-wrap lg:flex-nowrap items-start justify-between gap-10">
            <div className="space-y-6 flex-1 min-w-0 max-w-2xl">
              <div>
                <h2
                  id="h-share"
                  className="text-h2 text-2xl sm:text-3xl font-bold tracking-tight"
                >
                  {C.share.h2}
                </h2>
                <p className="mt-2 text-base text-muted-foreground">
                  {C.share.pitch}
                </p>
                <p className="mt-3 font-mono text-sm font-semibold text-primary">
                  {C.shareCfg.display}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (navigator.clipboard?.writeText) {
                      navigator.clipboard.writeText(canonicalUrl).then(() => {
                        setShareCopiedMsg('Link copied!');
                        window.setTimeout(() => setShareCopiedMsg(''), 3000);
                      });
                    }
                  }}
                  data-testid="button-copy-share-link"
                  className="rounded-full"
                >
                  <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
                  Copy link
                </Button>

                <Button asChild className="rounded-full">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                    Share on LinkedIn
                    <ExternalLink
                      className="h-3.5 w-3.5 ml-1.5 opacity-80"
                      aria-hidden="true"
                    />
                  </a>
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => enterPresentation(0)}
                  className="rounded-full"
                >
                  <MonitorPlay className="h-4 w-4 mr-2" aria-hidden="true" />
                  Present this
                </Button>
              </div>

              <div className="space-y-2 pt-2">
                <label
                  htmlFor="suggested-post-textarea"
                  className="block font-mono text-xs text-muted-foreground"
                >
                  Suggested post
                </label>
                <Textarea
                  id="suggested-post-textarea"
                  rows={4}
                  value={sharePostText}
                  onChange={(e) => setSharePostText(e.target.value)}
                  className="bg-card/60 text-sm leading-relaxed"
                />
                <div className="flex items-center gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const fullText = `${sharePostText}\n\n${canonicalUrl}`;
                      if (navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(fullText).then(() => {
                          setShareCopiedMsg('Suggested post copied!');
                          window.setTimeout(() => setShareCopiedMsg(''), 3000);
                        });
                      }
                    }}
                    className="rounded-full font-mono text-xs"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                    Copy text
                  </Button>
                  <span
                    role="status"
                    aria-live="polite"
                    className="font-mono text-xs text-primary"
                  >
                    {shareCopiedMsg}
                  </span>
                </div>
              </div>
            </div>

            {C.shareCfg.qr && (
              <div
                role="img"
                aria-label={`QR code for ${C.shareCfg.display}`}
                className="w-40 h-40 p-3 rounded-xl bg-white border border-border shrink-0 [&_svg]:w-full [&_svg]:h-full [&_.qr-bg]:fill-white [&_.qr-fg]:fill-slate-900"
                dangerouslySetInnerHTML={{ __html: C.shareCfg.qr }}
              />
            )}
          </div>

          <div className="mt-12 pt-6 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
            <p>{C.meta.footer}</p>
            <div className="flex items-center gap-3">
              <a href="#sources" className="hover:text-foreground">
                Sources
              </a>
              <span>·</span>
              <a href="#top" className="hover:text-foreground">
                Back to top ↑
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Render Full-Viewport Presentation Stage when active */}
      {renderPresentationStage()}
    </article>
  );
}
