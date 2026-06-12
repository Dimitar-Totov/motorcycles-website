'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

interface Props {
  photos: string[];
  alt: string;
}

/**
 * Cinematic product carousel (Client Component) for the detail hero.
 *
 * Shows ONE photo at a time as a simple rounded image (rounded-2xl, subtle
 * border + soft shadow — no device/tablet frame). The photo is muted and
 * vignetted so real-world backgrounds blend into the dark theme, with arrow +
 * dot navigation, a soft accent glow grounding it on the dark surface and a
 * blur+fade transition between frames. The textual specs around it stay
 * server-rendered for SEO; only the active-index switching needs client
 * state — that's the same carousel state this component has always owned.
 */
export default function Gallery({ photos, alt }: Props) {
  const [active, setActive] = useState(0);
  const count = photos.length;

  const go = useCallback(
    (dir: number) => setActive((i) => (i + dir + count) % count),
    [count],
  );

  if (count === 0) {
    return (
      <div className="hero-anim hero-img-in relative w-full" style={{ animationDelay: '150ms' }}>
        <div className="mx-auto flex aspect-[4/3] w-full max-w-[28rem] flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] text-white/40 shadow-2xl lg:max-w-[44rem]">
          <ImageOff className="h-10 w-10" strokeWidth={1.5} />
          <span className="text-sm">No photos available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-anim hero-img-in relative w-full" style={{ animationDelay: '150ms' }}>
      {/* Soft radial glow that grounds the bike on the dark surface, centered
          under the card (which fills its column). */}
      <div
        aria-hidden
        className="hero-anim hero-glow-in pointer-events-none absolute inset-x-0 bottom-[5%] z-0 mx-auto h-[45%] w-[85%] blur-3xl"
        style={{
          animationDelay: '800ms',
          background:
            'radial-gradient(ellipse at center, rgb(var(--accent-rgb) / 0.28) 0%, rgb(var(--accent-rgb) / 0.08) 35%, transparent 70%)',
        }}
      />

      {/* Rounded product image — subtle border + soft shadow, no device frame.
          overflow-hidden lives on the inner wrapper so the photos clip to the
          rounded corners while the arrows/dots (on this outer frame) are never
          clipped by the edge. */}
      <div className="relative z-10 mx-auto aspect-[4/3] w-full max-w-[28rem] rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl lg:max-w-[44rem]">
        {/* Photo stack clipped to the rounded frame; muted + vignetted so the
            real-world photo backgrounds blend into the dark theme. blur+fade
            between frames (outgoing blurs out, incoming sharpens in). */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          {photos.map((url, i) => (
            <Image
              key={url}
              src={url}
              alt={count > 1 ? `${alt} — photo ${i + 1} of ${count}` : alt}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className={`object-cover brightness-90 saturate-[.85] transition-[opacity,filter] duration-500 ease-out ${
                i === active ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
              }`}
            />
          ))}
          {/* Tone overlay: bottom-weighted darkening grounds the bike and hides
              bright ground (grass/asphalt); soft inset vignette darkens edges. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 shadow-[inset_0_0_70px_20px_rgba(0,0,0,0.45)]"
          />
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
            </button>

            {/* Dot indicators (current position / total) — inside the frame,
                over the vignetted bottom edge. */}
            <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-2">
              {photos.map((url, i) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View photo ${i + 1}`}
                  aria-current={i === active}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active ? 'w-6 bg-[var(--accent)]' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
