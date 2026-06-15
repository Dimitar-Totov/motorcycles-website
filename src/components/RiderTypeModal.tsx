'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import type { StaticImageData } from 'next/image';
import { X, ArrowRight } from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────
   Data shapes
   `RiderCard` is the carousel's source-of-truth record. The modal
   itself is generic and consumes the flatter `RiderProfileCategory`
   shape so it can be reused for *any* bike category — nothing here is
   hardcoded to "Naked".
   ────────────────────────────────────────────────────────────────── */

export interface RiderCard {
  id: number;
  type: string;
  description: string;
  image: StaticImageData;
  alt: string;
  /** Catalog silhouette slug used for the "Browse" CTA (?category=). */
  category: string;
  longDescription: string;
  specs: {
    position: string;
    terrain: string;
    comfort: string;
    experience: string;
  };
  highlights: string[];
}

export interface RiderProfileSpec {
  icon: ReactNode;
  label: string;
  value: string;
}

export interface RiderProfileCategory {
  eyebrow?: string; // default "Rider Profile"
  /** Optional dossier index, rendered as e.g. "· 01". */
  index?: number;
  titleLead: string; // e.g. "Naked"
  titleRest?: string; // e.g. "Street Fighter"
  description: string;
  image: string; // SAME asset as the carousel card
  imageAlt: string;
  specs: RiderProfileSpec[]; // 4 items
  defines: string[]; // checklist items
  ctaLabel?: string; // default `Browse ${titleLead} bikes`
  ctaHref: string;
}

export interface RiderProfileModalProps {
  open: boolean;
  onClose: () => void;
  category: RiderProfileCategory;
}

/* ── Design tokens (brand red family, harmonised with the carousel) ── */
const ACCENT = '#F43F4E';
const ACCENT_BRIGHT = '#FF3B4E';
const SURFACE = '#101012';
const EXIT_MS = 260;

/** Compact film-grain noise, kept inline so there's no extra asset. */
const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/* ──────────────────────────────────────────────────────────────────
   Subcomponents
   ────────────────────────────────────────────────────────────────── */

function Eyebrow({ text, index }: { text: string; index?: number }) {
  return (
    <span
      className="rp-rise"
      style={{ animationDelay: '0ms', display: 'inline-flex' }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '5px 11px',
          borderRadius: '9999px',
          background: 'rgba(244,63,78,0.16)',
          border: '1px solid rgba(244,63,78,0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: '9999px',
            background: ACCENT_BRIGHT,
            boxShadow: `0 0 8px ${ACCENT_BRIGHT}`,
          }}
        />
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#fff',
          }}
        >
          {text}
          {typeof index === 'number'
            ? ` · ${String(index).padStart(2, '0')}`
            : ''}
        </span>
      </span>
    </span>
  );
}

function ModalHero({
  category,
  titleId,
}: {
  category: RiderProfileCategory;
  titleId: string;
}) {
  return (
    <div className="relative h-[40vh] min-h-[240px] w-full overflow-hidden md:h-full md:min-h-[560px]">
      {/* Hero image — same asset as the carousel card. Cover + Ken Burns. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={category.image}
        alt={category.imageAlt}
        className="rp-hero-img absolute inset-0 h-full w-full object-cover"
      />

      {/* Readability scrim — bottom + left */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(8,8,10,0.94) 0%, rgba(8,8,10,0.35) 40%, rgba(8,8,10,0) 72%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(8,8,10,0.55) 0%, rgba(8,8,10,0) 48%)',
        }}
      />
      {/* Desktop: blend the image's right edge into the content column */}
      <div
        aria-hidden
        className="absolute inset-0 hidden md:block"
        style={{
          background: `linear-gradient(to right, transparent 80%, ${SURFACE} 100%)`,
        }}
      />

      {/* Technical-dossier corner ticks + thin accent line */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-4 top-4 hidden md:block"
        style={{
          width: 18,
          height: 18,
          borderLeft: '2px solid rgba(255,255,255,0.5)',
          borderTop: '2px solid rgba(255,255,255,0.5)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-4 right-4 hidden md:block"
        style={{
          width: 18,
          height: 18,
          borderRight: `2px solid ${ACCENT_BRIGHT}`,
          borderBottom: `2px solid ${ACCENT_BRIGHT}`,
        }}
      />

      {/* Eyebrow + title, overlaid bottom-left (kills the overlap bug for good) */}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 md:p-8">
        <Eyebrow text={category.eyebrow ?? 'Rider Profile'} index={category.index} />
        <h2
          id={titleId}
          className="rp-rise"
          style={{
            animationDelay: '60ms',
            margin: '14px 0 0',
            fontSize: 'clamp(28px, 4vw, 42px)',
            lineHeight: 1.04,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#fff',
            textShadow: '0 2px 28px rgba(0,0,0,0.55)',
          }}
        >
          <span style={{ color: '#fff' }}>{category.titleLead}</span>
          {category.titleRest ? (
            <>
              <br />
              <span style={{ color: 'rgba(255,255,255,0.62)' }}>
                {category.titleRest}
              </span>
            </>
          ) : null}
        </h2>
      </div>
    </div>
  );
}

function SpecCard({ spec, delay }: { spec: RiderProfileSpec; delay: number }) {
  return (
    <div
      className="rp-spec rp-rise"
      style={{
        animationDelay: `${delay}ms`,
        position: 'relative',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '14px 14px 13px',
        overflow: 'hidden',
      }}
    >
      {/* Thin red accent on the top edge */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${ACCENT_BRIGHT}, transparent 82%)`,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ display: 'inline-flex', color: ACCENT_BRIGHT }}>
          {spec.icon}
        </span>
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: 700,
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.58)',
          }}
        >
          {spec.label}
        </span>
      </div>
      <div
        style={{
          marginTop: '8px',
          fontSize: '15px',
          fontWeight: 600,
          color: '#fff',
          lineHeight: 1.3,
        }}
      >
        {spec.value}
      </div>
    </div>
  );
}

function DrawCheck({ delay }: { delay: number }) {
  return (
    <svg
      className="rp-check"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 12.5l4.2 4.3L19 7.2"
        stroke={ACCENT_BRIGHT}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        style={{ animationDelay: `${delay}ms` }}
      />
    </svg>
  );
}

function DefinesList({ items }: { items: string[] }) {
  return (
    <ul
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {items.map((item, i) => (
        <li
          key={item}
          className="rp-rise"
          style={{
            animationDelay: `${480 + i * 70}ms`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <span
            style={{
              marginTop: '1px',
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '8px',
              background: 'rgba(244,63,78,0.14)',
              border: '1px solid rgba(244,63,78,0.3)',
            }}
          >
            <DrawCheck delay={560 + i * 70} />
          </span>
          <span
            style={{
              fontSize: '14.5px',
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function CtaButton({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="rp-cta rp-focus rp-rise"
      style={{
        animationDelay: '720ms',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        width: '100%',
        height: '52px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #FF4757 0%, #E0303F 100%)',
        color: '#fff',
        fontSize: '15px',
        fontWeight: 700,
        letterSpacing: '0.01em',
        boxShadow: '0 8px 24px rgba(244,63,78,0.32)',
        textDecoration: 'none',
        overflow: 'hidden',
      }}
    >
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
      <ArrowRight
        className="rp-arrow"
        size={18}
        strokeWidth={2.5}
        style={{ position: 'relative', zIndex: 1 }}
      />
    </a>
  );
}

/* ──────────────────────────────────────────────────────────────────
   Modal
   ────────────────────────────────────────────────────────────────── */

export default function RiderProfileModal({
  open,
  onClose,
  category,
}: RiderProfileModalProps) {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reducedMotion = prefersReducedMotion();

  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const closedRef = useRef(false);
  const titleId = useId();

  // Portals require the DOM; only render after mount.
  useEffect(() => setMounted(true), []);

  const requestClose = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    if (reducedMotion) {
      onClose();
      return;
    }
    setShow(false);
    window.setTimeout(onClose, EXIT_MS);
  }, [onClose, reducedMotion]);

  // Allow a parent to close by flipping `open` → false.
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current && !open) requestClose();
    prevOpen.current = open;
  }, [open, requestClose]);

  // Enter animation, body scroll lock, focus management + trap.
  useEffect(() => {
    if (!mounted) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => {
      setShow(true);
      (closeBtnRef.current ?? panelRef.current)?.focus({ preventScroll: true });
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        requestClose();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const activeEl = document.activeElement;
        if (e.shiftKey && (activeEl === first || activeEl === panelRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    // Capture phase so Esc/Tab don't leak to listeners on the page behind.
    document.addEventListener('keydown', onKeyDown, true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [mounted, requestClose]);

  if (!mounted) return null;

  const ctaLabel = category.ctaLabel ?? `Browse ${category.titleLead} bikes`;
  const panelTransition = reducedMotion
    ? 'opacity 150ms ease'
    : 'opacity 240ms ease, transform 420ms cubic-bezier(0.34, 1.3, 0.5, 1)';

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[9999] flex items-end justify-center md:items-center md:p-4"
      style={{ fontFamily: '"Inter", "Space Grotesk", sans-serif' }}
    >
      {/* Backdrop — blur + dim. Click to close. */}
      <div
        aria-hidden
        onClick={requestClose}
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          opacity: show ? 1 : 0,
          transition: reducedMotion ? 'none' : 'opacity 200ms ease',
        }}
      />

      {/* Red radial glow behind the panel — makes it feel "lit". */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: '70vw',
          maxWidth: '900px',
          height: '60vh',
          borderRadius: '9999px',
          background:
            'radial-gradient(circle, rgba(244,63,78,0.20), transparent 62%)',
          filter: 'blur(50px)',
          opacity: show ? 1 : 0,
          transition: reducedMotion ? 'none' : 'opacity 360ms ease',
        }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-[1] flex w-full max-w-[1040px] flex-col overflow-hidden rounded-t-[26px] outline-none md:rounded-[24px]"
        style={{
          maxHeight: '92vh',
          border: '1px solid transparent',
          background: `linear-gradient(${SURFACE}, ${SURFACE}) padding-box, linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.04)) border-box`,
          boxShadow:
            '0 40px 120px rgba(0,0,0,0.7), 0 0 90px rgba(244,63,78,0.12)',
          opacity: show ? 1 : 0,
          transform: show
            ? 'translateY(0) scale(1)'
            : 'translateY(24px) scale(0.96)',
          transition: panelTransition,
        }}
      >
        {/* Film-grain texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: NOISE_URI,
            opacity: 0.035,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Close button */}
        <button
          ref={closeBtnRef}
          type="button"
          onClick={requestClose}
          aria-label="Close dialog"
          className="rp-close rp-focus absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full text-white"
          style={{
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(10,10,12,0.5)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <X size={20} strokeWidth={2} />
        </button>

        {/* Cinematic split: hero | dossier */}
        <div className="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[44%_1fr] md:grid-rows-1">
          <ModalHero category={category} titleId={titleId} />

          {/* Dossier content */}
          <div className="relative flex min-h-0 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
              <div
                className="rp-rise md:pr-12"
                style={{
                  animationDelay: '140ms',
                  fontSize: '15px',
                  lineHeight: 1.62,
                  color: 'rgba(255,255,255,0.72)',
                }}
              >
                {category.description}
              </div>

              {/* Telemetry / HUD spec grid */}
              <div
                style={{
                  marginTop: '22px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                }}
              >
                {category.specs.map((spec, i) => (
                  <SpecCard key={spec.label} spec={spec} delay={200 + i * 70} />
                ))}
              </div>

              {/* What defines it */}
              <div
                className="rp-rise"
                style={{
                  animationDelay: '440ms',
                  marginTop: '26px',
                  marginBottom: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                What Defines It
              </div>
              <DefinesList items={category.defines} />
            </div>

            {/* CTA pinned to the bottom of the content column */}
            <div
              className="shrink-0 px-6 pb-6 pt-3 sm:px-8"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background:
                  'linear-gradient(to top, rgba(16,16,18,0.95), rgba(16,16,18,0))',
              }}
            >
              <CtaButton label={ctaLabel} href={category.ctaHref} />
            </div>
          </div>
        </div>
      </div>

      {/* Scoped styles: keyframes + hover/focus states (inline styles can't
          express :hover, ::after or @keyframes). Mirrors the carousel's
          existing inline-<style> approach. */}
      <style>{`
        @keyframes rpKenBurns {
          from { transform: scale(1.02); }
          to   { transform: scale(1.08); }
        }
        @keyframes rpRise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes rpDraw { to { stroke-dashoffset: 0; } }
        @keyframes rpSheen {
          0%   { transform: translateX(-160%) skewX(-18deg); }
          100% { transform: translateX(260%) skewX(-18deg); }
        }

        .rp-hero-img {
          transform-origin: center;
          animation: rpKenBurns 14s ease-in-out infinite alternate;
          will-change: transform;
        }
        .rp-rise {
          opacity: 0;
          animation: rpRise 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .rp-check path {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: rpDraw 0.5s ease forwards;
        }

        .rp-spec {
          transition: transform .2s ease, border-color .2s ease,
                      box-shadow .2s ease, background-color .2s ease;
        }
        .rp-spec:hover {
          transform: translateY(-2px);
          border-color: rgba(244,63,78,0.5);
          box-shadow: 0 8px 24px rgba(244,63,78,0.16);
          background-color: rgba(255,255,255,0.06);
        }

        .rp-close { transition: background .2s ease, color .2s ease, border-color .2s ease; }
        .rp-close svg { transition: transform .25s ease; }
        .rp-close:hover {
          background: rgba(244,63,78,0.2) !important;
          border-color: rgba(244,63,78,0.55) !important;
          color: #FF7A85;
        }
        .rp-close:hover svg { transform: rotate(90deg); }

        .rp-cta {
          transition: transform .2s cubic-bezier(0.16,1,0.3,1),
                      box-shadow .2s ease, filter .2s ease;
        }
        .rp-cta:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 32px rgba(244,63,78,0.42);
          filter: brightness(1.05);
        }
        .rp-cta:active { transform: scale(0.98); }
        .rp-cta::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 55%; height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: translateX(-160%) skewX(-18deg);
          pointer-events: none;
          z-index: 0;
        }
        .rp-cta:hover::after { animation: rpSheen 0.85s ease; }
        .rp-cta .rp-arrow { transition: transform .2s ease; }
        .rp-cta:hover .rp-arrow { transform: translateX(4px); }

        .rp-focus:focus-visible {
          outline: 2px solid rgba(244,63,78,0.75);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .rp-hero-img { animation: none !important; }
          .rp-rise {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .rp-check path { animation: none !important; stroke-dashoffset: 0 !important; }
          .rp-cta:hover::after { animation: none !important; }
        }
      `}</style>
    </div>,
    document.body
  );
}
