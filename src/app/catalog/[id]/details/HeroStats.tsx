'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { SilhouetteCategory } from '@/components/catalog-home/types';

interface Props {
  engine: string;
  powerKw: number;
  year: number;
  category: SilhouetteCategory;
}

/** expo-out — matches the entrance easing used by the CSS keyframes. */
const easeOutExpo = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));

// useLayoutEffect on the client, no-op on the server (avoids the SSR warning
// and lets us reset to 0 *before* the first paint, so there's no flash).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Counts from 0 up to `target` once on mount. Initialises to the final value
 * so SSR / no-JS / reduced-motion all render the real number immediately.
 */
function useCountUp(target: number, delay: number, enabled: boolean) {
  const [value, setValue] = useState(target);
  const frame = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useIsoLayoutEffect(() => {
    if (!enabled || prefersReducedMotion()) {
      setValue(target);
      return;
    }
    setValue(0);
    timer.current = setTimeout(() => {
      let start: number | null = null;
      const step = (t: number) => {
        if (start === null) start = t;
        const p = Math.min((t - start) / 1000, 1);
        setValue(target * easeOutExpo(p));
        if (p < 1) frame.current = requestAnimationFrame(step);
        else setValue(target);
      };
      frame.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, delay, enabled]);

  return value;
}

/** Pull a leading number off a free-text spec like "937cc" → { 937, "cc" }. */
function parseLeadingNumber(raw: string): { numeric: number | null; suffix: string } {
  const match = raw.match(/^\s*(\d[\d.,]*)\s*(.*)$/);
  if (!match) return { numeric: null, suffix: '' };
  const numeric = parseFloat(match[1].replace(/,/g, ''));
  if (Number.isNaN(numeric)) return { numeric: null, suffix: '' };
  const rest = match[2].trim();
  return { numeric, suffix: rest ? ` ${rest}` : '' };
}

interface StatDef {
  label: string;
  numeric: number | null;
  display: string;
  suffix: string;
}

function Stat({ stat, index }: { stat: StatDef; index: number }) {
  const delay = 560 + index * 40;
  const counted = useCountUp(stat.numeric ?? 0, delay, stat.numeric !== null);
  const shown = stat.numeric === null ? stat.display : `${Math.round(counted)}${stat.suffix}`;

  return (
    <div
      className={`hero-anim hero-rise flex flex-col gap-1 ${
        // Divider before the right stat of each pair (Power, Category); the two
        // pairs are separated by the grid gutter, not a line.
        index % 2 === 1 ? 'md:border-l md:border-white/10 md:pl-5 lg:pl-6' : ''
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Label: sans (UI). Value: serif display family — same as the
          brand/model/price up top. All values share one colour (white) for a
          single, consistent rule. */}
      <span className="text-xs font-semibold uppercase tracking-[0.05em] text-gray-400">
        {stat.label}
      </span>
      <span
        className="text-2xl font-extrabold tabular-nums text-white lg:text-3xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {shown}
      </span>
    </div>
  );
}

/**
 * The 4-stat strip at the bottom of the hero. It sits on the SAME grid as the
 * hero above: a 42/58 two-column split (from lg) with the same gutter, so the
 * left pair (Engine, Power) sits under the text column and the right pair
 * (Year, Category) under the image. 2×2 grid on mobile. All values share one
 * colour; numeric values count up on entry.
 */
export default function HeroStats({ engine, powerKw, year, category }: Props) {
  const engineParsed = parseLeadingNumber(engine);

  const stats: StatDef[] = [
    {
      label: 'Engine',
      numeric: engineParsed.numeric,
      display: engine || '—',
      suffix: engineParsed.suffix,
    },
    { label: 'Power', numeric: powerKw || null, display: '—', suffix: ' kW' },
    { label: 'Year', numeric: year, display: String(year), suffix: '' },
    { label: 'Category', numeric: null, display: category.toUpperCase(), suffix: '' },
  ];

  return (
    // Mirrors the hero grid: base 2×2; from lg a 42/58 split with lg:gap-12.
    // The two pair-wrappers use `contents` on mobile (so all four stats flow
    // into the 2×2) and become 2-col subgrids from md up.
    <div className="relative z-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/[0.08] pt-6 md:gap-8 lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] lg:gap-12">
      <div className="contents md:grid md:grid-cols-2">
        <Stat stat={stats[0]} index={0} />
        <Stat stat={stats[1]} index={1} />
      </div>
      <div className="contents md:grid md:grid-cols-2">
        <Stat stat={stats[2]} index={2} />
        <Stat stat={stats[3]} index={3} />
      </div>
    </div>
  );
}
