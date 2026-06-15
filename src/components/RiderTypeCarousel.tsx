'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bike,
  Mountain,
  Gauge,
  TrendingUp,
} from 'lucide-react';

import RiderTypeModal, {
  type RiderCard,
  type RiderProfileCategory,
} from './RiderTypeModal';

import nakedImg from '../assets/naked-street.jpeg';
import sportImg from '../assets/sport-supersport.jpg';
import touringImg from '../assets/touring.webp';
import adventureImg from '../assets/adventure-dual.jpg';
import cruiserImg from '../assets/cruiser.jpg';
import cafeImg from '../assets/cafe-scrambler.jpg';

const CARDS: RiderCard[] = [
  {
    id: 1,
    type: 'Naked / Street Fighter',
    description: 'Stripped down, aggressive, and unapologetically urban.',
    image: nakedImg,
    alt: 'Naked street fighter motorcycle — aggressive upright riding position with no fairings',
    category: 'naked',
    longDescription:
      "Born for the urban jungle, naked bikes strip away the bodywork to reveal raw mechanical character. Wide bars and an upright stance give you total command in traffic, while punchy mid-range torque makes every light-to-light sprint addictive. It's the purist's choice — honest, agile, and endlessly fun.",
    specs: {
      position: 'Upright & aggressive',
      terrain: 'City & twisty roads',
      comfort: 'Moderate',
      experience: 'Beginner → Intermediate',
    },
    highlights: [
      'Minimal bodywork for pure character',
      'Wide handlebars for sharp control',
      'Punchy, accessible mid-range torque',
      'Light and easy to flick through traffic',
    ],
  },
  {
    id: 2,
    type: 'Sport / Supersport',
    description: 'Razor-sharp handling built for the apex of every corner.',
    image: sportImg,
    alt: 'Sport motorcycle — full fairing aerodynamic machine built for track-level performance',
    category: 'sport',
    longDescription:
      'Engineered around a single obsession: speed. Full aerodynamic fairings, race-bred suspension and high-revving engines turn every on-ramp into a runway. The aggressive forward lean puts your weight over the front for surgical cornering. Demanding, exhilarating, and built to chase the apex.',
    specs: {
      position: 'Aggressive forward lean',
      terrain: 'Track & canyon roads',
      comfort: 'Performance-focused',
      experience: 'Intermediate → Advanced',
    },
    highlights: [
      'Full aerodynamic fairings',
      'High-revving, high-output engines',
      'Race-derived suspension & brakes',
      'Precision handling at speed',
    ],
  },
  {
    id: 3,
    type: 'Touring',
    description: 'Effortless miles, all-day comfort, the open road as your office.',
    image: touringImg,
    alt: 'Touring motorcycle — long-distance comfort cruiser with integrated luggage and wind protection',
    category: 'touring',
    longDescription:
      'Designed to devour horizons. Touring machines pair plush ergonomics with wind protection, integrated luggage and a huge fuel range so the only thing that stops you is your own schedule. Add a passenger, pack your gear, and let the open road become your second home.',
    specs: {
      position: 'Relaxed & upright',
      terrain: 'Highways & long distance',
      comfort: 'Exceptional',
      experience: 'All levels',
    },
    highlights: [
      'Integrated, lockable luggage',
      'Full wind & weather protection',
      'Big fuel range for long hauls',
      'Comfortable two-up riding',
    ],
  },
  {
    id: 4,
    type: 'Adventure / Dual Sport',
    description: 'Where the pavement ends, the real journey begins.',
    image: adventureImg,
    alt: 'Adventure dual-sport motorcycle — tall, rugged bike capable of both on and off-road riding',
    category: 'adventure',
    longDescription:
      'The go-anywhere all-rounder. With long-travel suspension, a commanding riding position and rugged protection, adventure bikes are equally at home on a motorway as on a gravel mountain pass. When the pavement ends, the real journey begins.',
    specs: {
      position: 'Tall & commanding',
      terrain: 'On & off-road',
      comfort: 'High',
      experience: 'Intermediate',
    },
    highlights: [
      'Long-travel suspension',
      'Rugged off-road-ready wheels',
      'Engine & hand protection',
      'Versatile across any terrain',
    ],
  },
  {
    id: 5,
    type: 'Cruiser',
    description: 'Low, loud, and laid back — the soul of the open highway.',
    image: cruiserImg,
    alt: 'Cruiser motorcycle — low-slung relaxed riding position with classic American styling',
    category: 'cruiser',
    longDescription:
      'Low, relaxed and dripping with attitude. Cruisers put your feet forward and your mind at ease, powered by big, torquey engines that pull effortlessly from low revs. It\'s less about the destination and more about the rumble of the ride itself.',
    specs: {
      position: 'Feet-forward & laid back',
      terrain: 'Open highways & boulevards',
      comfort: 'High',
      experience: 'Beginner → Intermediate',
    },
    highlights: [
      'Low seat height, easy to plant',
      'Big, effortless low-end torque',
      'Iconic, timeless styling',
      'Relaxed all-day cruising',
    ],
  },
  {
    id: 6,
    type: 'Cafe Racer / Scrambler',
    description: 'Timeless style with a rebellious streak.',
    image: cafeImg,
    alt: 'Cafe racer scrambler motorcycle — retro-inspired minimalist design with modern performance',
    category: 'cafe racer',
    longDescription:
      'Where heritage meets rebellion. Cafe racers channel 60s racetrack cool with clip-ons and a sporty crouch, while scramblers add knobby tyres and a go-anywhere spirit. Lightweight, characterful and endlessly customisable — these are bikes with a story to tell.',
    specs: {
      position: 'Sporty crouch / upright',
      terrain: 'City streets & light trails',
      comfort: 'Moderate',
      experience: 'All levels',
    },
    highlights: [
      'Retro-inspired, minimalist design',
      'Light and nimble chassis',
      'Loaded with vintage character',
      'A blank canvas for customisation',
    ],
  },
];

const TOTAL = CARDS.length;
const TRANSITION_DURATION = 500;
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * Adapt a carousel `RiderCard` into the generic shape the modal consumes.
 * The hero image, title split and CTA target all derive from the card data —
 * so the same modal works for every bike category with nothing hardcoded.
 */
function toRiderProfile(card: RiderCard): RiderProfileCategory {
  const [titleLead, ...rest] = card.type.split('/').map((part) => part.trim());
  return {
    eyebrow: 'Rider Profile',
    index: card.id,
    titleLead,
    titleRest: rest.join(' / '),
    description: card.longDescription,
    image: card.image.src, // SAME asset shown on the carousel card
    imageAlt: card.alt,
    specs: [
      {
        icon: <Bike size={18} strokeWidth={2} />,
        label: 'Riding Position',
        value: card.specs.position,
      },
      {
        icon: <Mountain size={18} strokeWidth={2} />,
        label: 'Best Terrain',
        value: card.specs.terrain,
      },
      {
        icon: <Gauge size={18} strokeWidth={2} />,
        label: 'Comfort',
        value: card.specs.comfort,
      },
      {
        icon: <TrendingUp size={18} strokeWidth={2} />,
        label: 'Experience',
        value: card.specs.experience,
      },
    ],
    defines: card.highlights,
    ctaLabel: `Browse ${titleLead} bikes`,
    ctaHref: `/catalog?category=${encodeURIComponent(card.category)}`,
  };
}

export default function RiderTypeCarousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [active, setActive] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modalCard, setModalCard] = useState<RiderCard | null>(null);
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

  // Keyboard navigation — suspended while the modal owns the keyboard.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (modalCard) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next, modalCard]);

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
                    cursor: 'pointer',
                    // hide peek cards on tablet/mobile via CSS
                    display:
                      !isActive && !isPrev && !isNext ? 'none' : undefined,
                  }}
                  // Hide peek cards on small screens
                  className={!isActive ? 'hidden lg:block' : ''}
                  onClick={() => (isActive ? setModalCard(card) : goTo(i))}
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
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '16px',
                          padding: '8px 16px',
                          borderRadius: '9999px',
                          background: 'rgba(245,245,245,0.1)',
                          border: '1px solid rgba(245,245,245,0.2)',
                          backdropFilter: 'blur(8px)',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#F5F5F5',
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        View details
                        <ChevronRight size={15} strokeWidth={2} />
                      </span>
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

      {modalCard && (
        <RiderTypeModal
          open
          category={toRiderProfile(modalCard)}
          onClose={() => setModalCard(null)}
        />
      )}
    </div>
  );
}
