'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface Props {
  photos: string[];
  alt: string;
}

/** Returns touch-swipe handlers that call onLeft/onRight when drag > threshold. */
function useSwipe(onLeft: () => void, onRight: () => void) {
  const startX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) dx < 0 ? onLeft() : onRight();
    startX.current = null;
  };

  return { onTouchStart, onTouchEnd };
}

interface LightboxProps {
  photos: string[];
  alt: string;
  initial: number;
  onClose: () => void;
}

function Lightbox({ photos, alt, initial, onClose }: LightboxProps) {
  const [active, setActive] = useState(initial);
  const count = photos.length;

  const go = useCallback((dir: number) => setActive((i) => (i + dir + count) % count), [count]);
  const swipe = useSwipe(() => go(1), () => go(-1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [go, onClose]);

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', overflow: 'hidden' }}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close lightbox"
        style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all duration-200 hover:bg-white/20"
      >
        <X className="h-5 w-5" strokeWidth={2} />
      </button>

      {/* Photo stack — each fills the whole screen, image centred via flex */}
      <div
        style={{ position: 'absolute', inset: 0 }}
        {...swipe}
      >
        {photos.map((url, i) => (
          <div
            key={url}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.5s ease-out, filter 0.5s ease-out',
              opacity: i === active ? 1 : 0,
              filter: i === active ? 'blur(0px)' : 'blur(8px)',
              pointerEvents: i === active ? 'auto' : 'none',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={count > 1 ? `${alt} — photo ${i + 1} of ${count}` : alt}
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(100vh - 8rem)',
                objectFit: 'contain',
                display: 'block',
                width: '100%',
              }}
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          {/* Arrows — desktop only (md+); touch devices use swipe */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            style={{ position: 'absolute', left: 32, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
            className="hidden h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-black/75 md:flex"
          >
            <ChevronLeft className="h-7 w-7" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
            className="hidden h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-black/75 md:flex"
          >
            <ChevronRight className="h-7 w-7" strokeWidth={2} />
          </button>

          {/* Dots */}
          <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, zIndex: 10 }} className="flex items-center justify-center gap-2">
            {photos.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View photo ${i + 1}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>,
    document.body,
  );
}

export default function Gallery({ photos, alt }: Props) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const count = photos.length;

  const go = useCallback((dir: number) => setActive((i) => (i + dir + count) % count), [count]);
  const swipe = useSwipe(() => go(1), () => go(-1));

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
    <>
      <div className="hero-anim hero-img-in relative w-full" style={{ animationDelay: '150ms' }}>
        {/* Accent glow under the card */}
        <div
          aria-hidden
          className="hero-anim hero-glow-in pointer-events-none absolute inset-x-0 bottom-[5%] z-0 mx-auto h-[45%] w-[85%] blur-3xl"
          style={{
            animationDelay: '800ms',
            background:
              'radial-gradient(ellipse at center, rgb(var(--accent-rgb) / 0.28) 0%, rgb(var(--accent-rgb) / 0.08) 35%, transparent 70%)',
          }}
        />

        <div className="relative z-10 mx-auto aspect-[4/3] w-full max-w-[28rem] rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl lg:max-w-[44rem]">
          {/* Inner photo wrapper — clips photos; swipe handlers here */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl"
            {...swipe}
            onClick={() => setLightboxOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="Open photo viewer"
            onKeyDown={(e) => e.key === 'Enter' && setLightboxOpen(true)}
            style={{ cursor: 'zoom-in' }}
          >
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
            {/* Tone overlay */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 shadow-[inset_0_0_70px_20px_rgba(0,0,0,0.45)]"
            />
          </div>

          {count > 1 && (
            <>
              {/* Arrows: hidden on mobile (md:flex), swipe handles touch */}
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:flex"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] md:flex"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
              </button>

              {/* Dots */}
              <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-2">
                {photos.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`View photo ${i + 1}`}
                    aria-current={i === active}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === active ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          photos={photos}
          alt={alt}
          initial={active}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
