import { useEffect, useRef, useState } from 'react';
import heroImage from '../assets/hero-image.webp';

function revealProps(isVisible: boolean, delay: number, extraClass = '') {
  return {
    className: `reveal-item${isVisible ? ' is-visible' : ''}${extraClass ? ` ${extraClass}` : ''}`,
    style: { transitionDelay: `${delay}ms` },
  };
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-16 xl:px-24 py-24 lg:py-36">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-12 lg:gap-20 items-center">
          <div className="flex flex-col gap-6 lg:gap-8">
            <h2
              {...revealProps(isVisible, 0, 'text-3xl sm:text-4xl lg:text-4xl font-semibold tracking-tight text-slate-900 [font-family:"Playfair_Display",serif]')}
            >
              Ride the Road You Were Born For
            </h2>

            <p {...revealProps(isVisible, 200, 'lg:!text-xl lg:!leading-[1.7] lg:!max-w-none [font-family:"Lora",serif]')}>
              Every great journey starts with the right machine. Whether you crave the raw
              thunder of a naked street fighter or the long-haul comfort of a touring tourer,
              our catalog brings together the finest bikes from the world's leading manufacturers
              — all in one place.
            </p>

            <p {...revealProps(isVisible, 400, 'lg:!text-xl lg:!leading-[1.7] lg:!max-w-none [font-family:"Lora",serif]')}>
              Our smart filtering system lets you zero in on exactly what you need: narrow by
              brand, colour, year of manufacture, or peak power output so you spend less time
              scrolling and more time riding. New inventory arrives weekly, so there's always
              something fresh to discover.
            </p>

            <p {...revealProps(isVisible, 600, 'lg:!text-xl lg:!leading-[1.7] lg:!max-w-none [font-family:"Lora",serif]')}>
              From city commuters to track-day weapons, we believe finding your next motorcycle
              should be as exhilarating as riding it. Explore the catalog, compare specs
              side-by-side, and let the road ahead inspire the choice.
            </p>
          </div>

          <div
            {...revealProps(isVisible, 800, 'rounded-2xl overflow-hidden shadow-xl')}
          >
            <img
              src={heroImage}
              alt="Motorcycle on an open road"
              className="w-full h-full object-cover lg:min-h-[420px] lg:max-h-[560px]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
