'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import yamahaLogo        from '../assets/brands/yamaha.png';
import hondaLogo         from '../assets/brands/honda.webp';
import ducatiLogo        from '../assets/brands/ducati.jpg';
import ktmLogo           from '../assets/brands/ktm.webp';
import bmwLogo           from '../assets/brands/bmwmotorrad.png';
import kawasakiLogo      from '../assets/brands/kawasaki.webp';
import suzukiLogo        from '../assets/brands/suzuki.jpg';
import triumphLogo       from '../assets/brands/triumph.webp';
import harleyLogo        from '../assets/brands/harley-davidson.webp';
import apriliaLogo       from '../assets/brands/aprilia.png';

const BRANDS = [
  { name: 'Yamaha',          slug: 'yamaha',          logoSrc: yamahaLogo,   count: 18 },
  { name: 'Honda',           slug: 'honda',           logoSrc: hondaLogo,    count: 22 },
  { name: 'Ducati',          slug: 'ducati',          logoSrc: ducatiLogo,   count: 24 },
  { name: 'KTM',             slug: 'ktm',             logoSrc: ktmLogo,      count: 16 },
  { name: 'BMW Motorrad',    slug: 'bmw-motorrad',    logoSrc: bmwLogo,      count: 20 },
  { name: 'Kawasaki',        slug: 'kawasaki',        logoSrc: kawasakiLogo, count: 15 },
  { name: 'Suzuki',          slug: 'suzuki',          logoSrc: suzukiLogo,   count: 14 },
  { name: 'Triumph',         slug: 'triumph',         logoSrc: triumphLogo,  count: 12 },
  { name: 'Harley-Davidson', slug: 'harley-davidson', logoSrc: harleyLogo,   count: 19 },
  { name: 'Aprilia',         slug: 'aprilia',         logoSrc: apriliaLogo,  count: 11 },
];

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function BrandsGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [ctaHovered, setCtaHovered] = useState(false);

  const reducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const isTouch =
    typeof window !== 'undefined'
      ? window.matchMedia('(hover: none) and (pointer: coarse)').matches
      : false;

  // Intersection observer — fire once at 20% visibility
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Heading entrance: eyebrow 400ms/0ms, heading 600ms/150ms, subheading 400ms/350ms
  const eyebrowEntrance = (): React.CSSProperties => {
    if (reducedMotion) return {};
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(14px)',
      transition: `opacity 0.4s ${EASING} 0ms, transform 0.4s ${EASING} 0ms`,
    };
  };

  const headingEntrance = (): React.CSSProperties => {
    if (reducedMotion) return {};
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(22px)',
      transition: `opacity 0.6s ${EASING} 150ms, transform 0.6s ${EASING} 150ms`,
    };
  };

  const subheadingEntrance = (): React.CSSProperties => {
    if (reducedMotion) return {};
    return {
      opacity: visible ? 1 : 0,
      transition: `opacity 0.4s ${EASING} 350ms`,
    };
  };

  // Tile entrance: staggered 500ms base + 60ms per tile
  const tileEntrance = (index: number): React.CSSProperties => {
    if (reducedMotion) return {};
    const delay = 500 + index * 60;
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(20px)',
      transition: `opacity 0.5s ${EASING} ${delay}ms, transform 0.5s ${EASING} ${delay}ms`,
    };
  };

  // CTA fades in after the final tile completes
  const ctaEntrance = (): React.CSSProperties => {
    if (reducedMotion) return {};
    const delay = 500 + (BRANDS.length - 1) * 60 + 500;
    return {
      opacity: visible ? 1 : 0,
      transition: `opacity 0.5s ${EASING} ${delay}ms`,
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
          paddingTop: 'clamp(72px, 10vw, 120px)',
          paddingBottom: 'clamp(72px, 10vw, 120px)',
          maxWidth: '1400px',
          margin: '0 auto',
          paddingLeft: 'clamp(20px, 5vw, 48px)',
          paddingRight: 'clamp(20px, 5vw, 48px)',
        }}
      >
        {/* ── Heading zone ─────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mb-12 lg:mb-16">
          <span
            style={{
              ...eyebrowEntrance(),
              fontSize: '11px',
              letterSpacing: '0.22em',
              color: '#E63946',
              fontWeight: 500,
              textTransform: 'uppercase' as const,
              fontFamily: '"Inter", "Space Grotesk", sans-serif',
              marginBottom: '18px',
            }}
          >
            Trusted Manufacturers
          </span>

          <h2
            style={{
              ...headingEntrance(),
              fontSize: 'clamp(28px, 4vw, 38px)',
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: '-0.025em',
              color: '#F5F5F5',
              fontFamily: '"Inter", "Space Grotesk", sans-serif',
              margin: '0 0 16px',
              maxWidth: '560px',
            }}
          >
            Brands We Carry
          </h2>

          <p
            style={{
              ...subheadingEntrance(),
              fontSize: '15px',
              fontWeight: 400,
              color: '#666',
              fontFamily: '"Inter", "Space Grotesk", sans-serif',
              maxWidth: '480px',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            From legendary marques to track-bred specialists — every bike in our
            catalog comes from a name you can trust.
          </p>
        </div>

        {/* ── Logo grid ────────────────────────────────────────── */}
        <div className="brands-grid">
          {BRANDS.map((brand, i) => {
            const isHovered = hoveredIdx === i;

            const logoFilter = isTouch
              ? 'grayscale(0.4) opacity(0.85)'
              : isHovered
              ? 'none'
              : 'grayscale(1) brightness(1.6) opacity(0.55)';

            return (
              // Wrapper div owns the entrance animation (opacity + translateY slide-up)
              <div key={brand.slug} style={tileEntrance(i)}>
                {/*
                  NavLink owns the hover interaction (border, lift, logo colour).
                  Keeping them on separate elements avoids conflicting transform
                  transitions between the entrance slide and the hover lift.
                */}
                <Link
                  href="/catalog"
                  aria-label={`Browse ${brand.name} motorcycles`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column' as const,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // Reserve bottom space for the label so the logo never sits on top of it
                    paddingBottom: '36px',
                    position: 'relative',
                    background: '#141416',
                    border: `1px solid ${
                      isHovered ? 'rgba(230,57,70,0.5)' : 'rgba(255,255,255,0.08)'
                    }`,
                    borderRadius: '14px',
                    aspectRatio: '3/2',
                    cursor: 'pointer',
                    transform:
                      !reducedMotion && isHovered && !isTouch
                        ? 'translateY(-4px)'
                        : 'none',
                    transition: reducedMotion
                      ? 'border-color 0ms'
                      : 'border-color 350ms ease-out, transform 350ms ease-out',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    width: '100%',
                    outline: 'none',
                  }}
                  onMouseEnter={() => { if (!isTouch) setHoveredIdx(i); }}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onFocus={() => setHoveredIdx(i)}
                  onBlur={() => setHoveredIdx(null)}
                >
                  <img
                    src={brand.logoSrc.src}
                    alt={`${brand.name} logo`}
                    style={{
                      width: '62%',
                      height: 'clamp(52px, 5.5vw, 80px)',
                      objectFit: 'contain',
                      filter: logoFilter,
                      transition: reducedMotion ? 'none' : 'filter 350ms ease-out',
                      display: 'block',
                      flexShrink: 0,
                    }}
                  />

                  {/* Gradient scrim — fades in with the label so text stays legible */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '55%',
                      background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.72))',
                      opacity: isTouch ? 1 : isHovered ? 1 : 0,
                      transition: reducedMotion ? 'none' : 'opacity 350ms ease-out',
                      pointerEvents: 'none',
                      borderRadius: '0 0 13px 13px',
                    }}
                  />

                  {/* Name label — fades in on hover (desktop) / permanent (touch) */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: 0,
                      right: 0,
                      textAlign: 'center',
                      fontSize: '12px',
                      color: 'rgba(245,245,245,0.55)',
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 400,
                      letterSpacing: '0.01em',
                      opacity: isTouch ? 1 : isHovered ? 1 : 0,
                      transition: reducedMotion
                        ? 'none'
                        : 'opacity 350ms ease-out',
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap' as const,
                    }}
                  >
                    {brand.name} · {brand.count} bikes
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* ── CTA zone ─────────────────────────────────────────── */}
        <div
          style={{
            ...ctaEntrance(),
            display: 'flex',
            justifyContent: 'center',
            marginTop: '48px',
          }}
        >
          <Link
            href="/catalog"
            aria-label="Browse all motorcycle brands in our catalog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 28px',
              border: `1px solid ${
                ctaHovered ? '#E63946' : 'rgba(255,255,255,0.2)'
              }`,
              borderRadius: '8px',
              background: ctaHovered ? '#E63946' : 'transparent',
              color: '#F5F5F5',
              fontSize: '15px',
              fontWeight: 500,
              fontFamily: '"Inter", "Space Grotesk", sans-serif',
              letterSpacing: '0.01em',
              textDecoration: 'none',
              transition: reducedMotion
                ? 'none'
                : 'background 200ms ease, border-color 200ms ease',
              cursor: 'pointer',
              outline: 'none',
            }}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            onFocus={() => setCtaHovered(true)}
            onBlur={() => setCtaHovered(false)}
          >
            Browse All Brands
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      {/* Responsive grid columns */}
      <style>{`
        .brands-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(160px, 1fr));
          gap: 20px;
        }
        @media (max-width: 1023px) {
          .brands-grid {
            grid-template-columns: repeat(3, minmax(140px, 1fr));
            gap: 16px;
          }
        }
        @media (max-width: 767px) {
          .brands-grid {
            grid-template-columns: repeat(2, minmax(120px, 1fr));
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
