import type { CSSProperties } from 'react';
import type { Motorcycle } from '@/components/catalog-home/types';
import MotorcycleCard from '@/components/catalog-home/MotorcycleCard';
import './BrandMarquee.css';

interface Props {
  brand: string;
  motorcycles: Motorcycle[];
  /** Full-loop duration. Slow + elegant by default. */
  durationSeconds?: number;
  /** Pad (by cycling) to at least this many cards so the strip always fills. */
  minCards?: number;
}

/**
 * Auto-scrolling, seamless-loop strip of other listings from the same brand.
 *
 * Pure-CSS marquee (see BrandMarquee.css) — no client JS: hover/touch pause and
 * the reduced-motion fallback are all media queries + :hover/:active. The card
 * list is rendered twice; the duplicate copy is aria-hidden (and tagged so the
 * reduced-motion fallback can hide it) so assistive tech reads each card once.
 */
export default function BrandMarquee({
  brand,
  motorcycles,
  durationSeconds = 36,
  minCards = 10,
}: Props) {
  if (motorcycles.length === 0) return null;

  // The seamless loop only works when one set is wider than the viewport, so
  // pad sparse brands up to `minCards` by cycling the available listings.
  const base =
    motorcycles.length >= minCards
      ? motorcycles
      : Array.from({ length: minCards }, (_, i) => motorcycles[i % motorcycles.length]);

  // Render the set twice for the seamless loop (0 → -50%).
  const loop = [...base, ...base];
  const trackStyle = {
    '--marquee-duration': `${durationSeconds}s`,
  } as CSSProperties;

  return (
    // <div> not <section>: the global unlayered `section {}` reset strips
    // padding/background from real <section> elements.
    <div className="relative z-10 bg-[#0d0d0d] pb-16 pt-6 sm:pb-20">
      <div className="mx-auto mb-6 w-full max-w-7xl px-6 sm:px-10 lg:px-20">
        <h2
          className="!mb-1 text-[clamp(1.4rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          More from {brand}
        </h2>
        <span className="text-sm text-white/55">Keep exploring the lineup</span>
      </div>

      <div className="brand-marquee">
        <div className="brand-marquee__track" style={trackStyle}>
          {loop.map((m, i) => {
            const isDup = i >= base.length;
            return (
              <div
                key={`${m.id}-${i}`}
                className="brand-marquee__item"
                data-marquee-dup={isDup ? 'true' : undefined}
                aria-hidden={isDup ? true : undefined}
              >
                <MotorcycleCard motorcycle={m} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
