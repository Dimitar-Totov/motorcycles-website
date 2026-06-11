'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import nakedImg from '../assets/naked-street.jpeg';
import sportImg from '../assets/sport-supersport.jpg';
import touringImg from '../assets/touring.webp';
import adventureImg from '../assets/adventure-dual.jpg';
import cruiserImg from '../assets/cruiser.jpg';
import cafeImg from '../assets/cafe-scrambler.jpg';

const CARDS = [
  {
    id: 1,
    type: 'Naked / Street Fighter',
    description: 'Stripped down, aggressive, and unapologetically urban.',
    image: nakedImg,
    alt: 'Naked street fighter motorcycle — aggressive upright riding position with no fairings',
  },
  {
    id: 2,
    type: 'Sport / Supersport',
    description: 'Razor-sharp handling built for the apex of every corner.',
    image: sportImg,
    alt: 'Sport motorcycle — full fairing aerodynamic machine built for track-level performance',
  },
  {
    id: 3,
    type: 'Touring',
    description: 'Effortless miles, all-day comfort, the open road as your office.',
    image: touringImg,
    alt: 'Touring motorcycle — long-distance comfort cruiser with integrated luggage and wind protection',
  },
  {
    id: 4,
    type: 'Adventure / Dual Sport',
    description: 'Where the pavement ends, the real journey begins.',
    image: adventureImg,
    alt: 'Adventure dual-sport motorcycle — tall, rugged bike capable of both on and off-road riding',
  },
  {
    id: 5,
    type: 'Cruiser',
    description: 'Low, loud, and laid back — the soul of the open highway.',
    image: cruiserImg,
    alt: 'Cruiser motorcycle — low-slung relaxed riding position with classic American styling',
  },
  {
    id: 6,
    type: 'Cafe Racer / Scrambler',
    description: 'Timeless style with a rebellious streak.',
    image: cafeImg,
    alt: 'Cafe racer scrambler motorcycle — retro-inspired minimalist design with modern performance',
  },
];

const TOTAL = CARDS.length;
const TRANSITION_DURATION = 500;
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function RiderTypeCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [active, setActive] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const reducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Intersection observer — fire once
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setActive(((index % TOTAL) + TOTAL) % TOTAL);
      setTimeout(() => setIsTransitioning(false), TRANSITION_DURATION);
    },
    [isTransitioning]
  );

  const prev = useCallback(() => goTo(active - 1), [active, goTo]);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) >= 50) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  // Animate-in helpers
  const entrance = (
    delay: number,
    slideY = '16px'
  ): React.CSSProperties => {
    if (reducedMotion) return {};
    return {
      opacity: sectionVisible ? 1 : 0,
      transform: sectionVisible ? 'none' : `translateY(${slideY})`,
      transition: `opacity 0.6s ${EASING} ${delay}ms, transform 0.6s ${EASING} ${delay}ms`,
    };
  };

  return (
    <div
      ref={sectionRef}
      style={{ background: '#0A0A0B' }}
      className="w-full overflow-hidden"
    >
      <div
        style={{
          paddingTop: 'clamp(80px, 10vw, 120px)',
          paddingBottom: 'clamp(80px, 10vw, 120px)',
        }}
      >
        {/* ── Heading zone ──────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center px-6 mb-12 lg:mb-16">
          <span
            style={{
              ...entrance(0),
              fontSize: '13px',
              letterSpacing: '0.2em',
              color: '#E63946',
              fontWeight: 500,
              textTransform: 'uppercase' as const,
              fontFamily: '"Inter", "Space Grotesk", sans-serif',
              marginBottom: '18px',
            }}
          >
            Explore the Lineup
          </span>

          <h2
            style={{
              ...entrance(150, '24px'),
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 700,
              lineHeight: 1.07,
              letterSpacing: '-0.02em',
              color: '#F5F5F5',
              fontFamily: '"Inter", "Space Grotesk", sans-serif',
              margin: 0,
              maxWidth: '760px',
            }}
          >
            What Type of Rider Are You?
          </h2>

          <p
            style={{
              ...entrance(350),
              fontSize: '15px',
              fontWeight: 400,
              color: '#888',
              marginTop: '16px',
              fontFamily: '"Inter", "Space Grotesk", sans-serif',
              maxWidth: '420px',
              lineHeight: 1.6,
            }}
          >
            Six personalities. Six ways to take on the road. Find yours.
          </p>
        </div>

        {/* ── Carousel zone ─────────────────────────────────────── */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Motorcycle type selector"
          className="relative flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{ height: 'clamp(560px, 78vh, 820px)' }}
        >
          {/* Card track */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: '100%', height: '100%' }}
          >
            {CARDS.map((card, i) => {
              const offset = i - active;
              // Normalise for infinite loop: keep offset in [-2, 3] range
              const normOffset =
                offset > TOTAL / 2
                  ? offset - TOTAL
                  : offset < -TOTAL / 2
                  ? offset + TOTAL
                  : offset;

              const isActive = normOffset === 0;
              const isPrev = normOffset === -1;
              const isNext = normOffset === 1;
              const isVisible = isActive || isPrev || isNext;

              if (!isVisible) return null;

              const xPercent = normOffset * 85;
              const scale = isActive ? 1 : 0.85;
              const zIndex = isActive ? 10 : 5;

              return (
                <div
                  key={card.id}
                  aria-hidden={!isActive}
                  style={{
                    position: 'absolute',
                    width: 'clamp(320px, 38vw, 580px)',
                    height: 'clamp(480px, 70vh, 740px)',
                    transform: `translateX(${xPercent}%) scale(${scale})`,
                    opacity: isActive
                      ? sectionVisible
                        ? 1
                        : reducedMotion
                        ? 1
                        : 0
                      : sectionVisible
                      ? 0.4
                      : reducedMotion
                      ? 0.4
                      : 0,
                    zIndex,
                    transition: reducedMotion
                      ? 'none'
                      : isActive && !sectionVisible
                      ? `opacity 0.7s ${EASING} 500ms, transform 0.7s ${EASING} 500ms`
                      : `transform ${TRANSITION_DURATION}ms ${EASING}, opacity ${
                          !isActive && sectionVisible ? '0.5s' : TRANSITION_DURATION + 'ms'
                        } ${EASING} ${
                          !isActive && sectionVisible && !isTransitioning ? '700ms' : '0ms'
                        }`,
                    borderRadius: '18px',
                    overflow: 'hidden',
                    cursor: isActive ? 'default' : 'pointer',
                    // hide peek cards on tablet/mobile via CSS
                    display:
                      !isActive && !isPrev && !isNext ? 'none' : undefined,
                  }}
                  // Hide peek cards on small screens
                  className={!isActive ? 'hidden lg:block' : ''}
                  onClick={() => !isActive && goTo(i)}
                >
                  {/* Image */}
                  <img
                    src={card.image.src}
                    alt={card.alt}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                    className=""
                  />

                  {/* Gradient overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.78) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Text overlay */}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '32px',
                        pointerEvents: 'none',
                      }}
                    >
                      <h3
                        style={{
                          margin: '0 0 8px',
                          fontSize: 'clamp(22px, 3vw, 30px)',
                          fontWeight: 700,
                          letterSpacing: '-0.01em',
                          color: '#F5F5F5',
                          fontFamily: '"Inter", "Space Grotesk", sans-serif',
                          lineHeight: 1.1,
                        }}
                      >
                        {card.type}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '15px',
                          fontWeight: 400,
                          color: 'rgba(245,245,245,0.72)',
                          fontFamily: '"Inter", sans-serif',
                          lineHeight: 1.5,
                          maxWidth: '100%',
                        }}
                      >
                        {card.description}
                      </p>
                    </div>
                  )}

                  {/* Active card hover border */}
                  {isActive && (
                    <div
                      className="active-card-border"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '18px',
                        border: '1px solid transparent',
                        transition: 'border-color 300ms ease',
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Nav arrows ──────────────────────────────────────── */}
          <button
            onClick={prev}
            disabled={isTransitioning}
            aria-label="Previous rider type"
            style={{
              ...entrance(900),
              position: 'absolute',
              left: 'clamp(12px, 3vw, 48px)',
              zIndex: 20,
              width: 'clamp(44px, 5vw, 56px)',
              height: 'clamp(44px, 5vw, 56px)',
              borderRadius: '50%',
              border: '1px solid rgba(245,245,245,0.25)',
              background: 'transparent',
              cursor: isTransitioning ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: `background 200ms ease, border-color 200ms ease, ${
                reducedMotion ? '' : `opacity 0.4s ${EASING} 900ms`
              }`,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#E63946';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#E63946';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                'rgba(245,245,245,0.25)';
            }}
          >
            <ChevronLeft
              size={20}
              color="#F5F5F5"
              strokeWidth={1.5}
            />
          </button>

          <button
            onClick={next}
            disabled={isTransitioning}
            aria-label="Next rider type"
            style={{
              ...entrance(900),
              position: 'absolute',
              right: 'clamp(12px, 3vw, 48px)',
              zIndex: 20,
              width: 'clamp(44px, 5vw, 56px)',
              height: 'clamp(44px, 5vw, 56px)',
              borderRadius: '50%',
              border: '1px solid rgba(245,245,245,0.25)',
              background: 'transparent',
              cursor: isTransitioning ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: `background 200ms ease, border-color 200ms ease, ${
                reducedMotion ? '' : `opacity 0.4s ${EASING} 900ms`
              }`,
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#E63946';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#E63946';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                'rgba(245,245,245,0.25)';
            }}
          >
            <ChevronRight
              size={20}
              color="#F5F5F5"
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* ── Dot indicators ────────────────────────────────────── */}
        <div
          style={{
            ...entrance(900),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '32px',
          }}
        >
          {CARDS.map((card, i) => (
            <button
              key={card.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active ? 'true' : undefined}
              style={{
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background: i === active ? '#E63946' : 'rgba(245,245,245,0.3)',
                width: i === active ? '24px' : '8px',
                height: '8px',
                borderRadius: '9999px',
                transition: `width 300ms ${EASING}, background 300ms ease`,
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .active-card-border:hover {
          border-color: rgba(245,245,245,0.2) !important;
        }
      `}</style>
    </div>
  );
}
