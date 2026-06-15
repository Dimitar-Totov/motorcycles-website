import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Palette, ShieldCheck, PackageCheck } from 'lucide-react';
import { getMotorcycleById, getMotorcyclesByBrand } from '@/lib/motorcycles';
import Gallery from './Gallery';
import AddToCartButton from './AddToCartButton';
import HeroStats from './HeroStats';
import BrandMarquee from './BrandMarquee';

// Dynamically server-rendered: the shared layout reads auth cookies, so the
// whole tree renders per-request. The HTML (incl. <title>/OG tags and all the
// spec text) is still fully server-rendered for SEO — only the carousel,
// CTA toast and stat count-up run on the client.
type PageProps = { params: Promise<{ id: string }> };

// App accent token (amber-500 — the brand colour used by the navbar logo/CTA).
// Exposed as --accent on the section root so the CTA, model name, first stat
// and icon highlights all stay in sync without hardcoding the colour.
const accentVars = {
  '--accent': '#f59e0b',
  '--accent-rgb': '245 158 11',
} as CSSProperties;

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const m = await getMotorcycleById(id);

  // The page component calls notFound() to render the 404 UI. We set the title
  // here too so a missing listing has correct metadata. (Note: because this
  // route is dynamic — the layout reads auth cookies — Next streams the
  // response, so notFound() yields a soft-404 with HTTP 200 rather than 404.
  // The cached fetch is reused by the page component below.)
  if (!m) return { title: 'Motorcycle not found' };

  const title = `${m.brand} ${m.model} (${m.year})`;
  const description = `${m.brand} ${m.model}${m.engine ? ` — ${m.engine}` : ''}, ${m.year}${
    m.powerKw ? `, ${m.powerKw} kW` : ''
  }${m.color ? `, ${m.color}` : ''}. ${m.inStock ? 'In stock' : 'Out of stock'} at ${formatPrice(
    m.price,
  )}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: m.photoUrls.length > 0 ? [{ url: m.photoUrls[0] }] : undefined,
    },
  };
}

export default async function ProductDetails({ params }: PageProps) {
  const { id } = await params;
  const m = await getMotorcycleById(id);

  if (!m) notFound();

  // Other listings from the same brand, for the auto-scrolling strip below.
  const brandBikes = await getMotorcyclesByBrand(m.brand, m.id, 10);

  // Left-column quick facts (kept distinct from the bottom stat strip, which
  // carries the headline Engine / Power / Year / Category numbers).
  const specs = [
    { icon: Palette, label: 'Color', value: m.color || '—' },
    {
      icon: ShieldCheck,
      label: 'License',
      value: m.licenseCategories.length ? m.licenseCategories.join(' · ') : '—',
    },
    { icon: PackageCheck, label: 'Availability', value: m.inStock ? 'In stock' : 'Out of stock' },
  ];

  return (
    // Override the global light <main>; pull up under the floating navbar so the
    // dark hero bleeds to the top edge, and clip horizontal overflow so the
    // oversized bike can bleed right without creating a scrollbar.
    <main className="!min-h-0 -mt-20 overflow-x-hidden !bg-[#0d0d0d] !p-0 lg:-mt-[5.75rem]">
      {/* A <div> (not <section>): the global unlayered `section {}` reset in
          globals.css strips padding/background from real <section> elements. */}
      <div
        style={accentVars}
        className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0d0d0d] pb-10 pt-24 lg:pt-28"
      >
        {/* Ambient depth — restrained accent + cool glows behind everything */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute -right-[8%] top-1/4 h-[60%] w-[55%] rounded-full blur-[120px]"
            style={{ background: 'rgb(var(--accent-rgb) / 0.06)' }}
          />
          <div className="absolute bottom-[8%] left-[4%] h-[40%] w-[40%] rounded-full bg-white/[0.015] blur-[120px]" />
        </div>

        {/* One centered max-width container — the single gutter system shared by
            BOTH the hero grid and the stats strip, so nothing hugs the viewport
            edge and both align to the same left/right rails. The dark background
            + ambient glows above still bleed full-width behind it. */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 sm:px-10 lg:justify-center lg:px-20">
          {/* Back-to-catalog — mobile + tablet only. On desktop (lg+) the
              floating navbar already provides navigation; here it collapses to
              a hamburger, leaving no visible way back, so we surface one. */}
          <Link
            href="/catalog"
            className="hero-anim hero-rise mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/75 backdrop-blur-sm transition-colors duration-200 hover:border-white/30 hover:text-white lg:hidden"
            style={{ animationDelay: '0ms' }}
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
            Back to catalog
          </Link>

          {/* Two-column hero — text left, image right. Columns top-align
              (items-start): the image card's top edge meets the brand heading's
              top edge. ~50/50 at md (tablet); 42/58 from lg with a deliberate
              gutter between the columns. */}
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] lg:gap-12">
            {/* Left: textual content + actions */}
            <div className="order-2 flex flex-col md:order-1">
              {/* <div>/<h1!> rather than <p>: the global unlayered `p {}` and
                  `h1 {}` resets otherwise force slate-700/text-base/36px here. */}
              <div
                className="hero-anim hero-rise text-[clamp(1.4rem,2.4vw,2.1rem)] font-extrabold leading-none tracking-tight text-white"
                style={{ animationDelay: '0ms', fontFamily: 'var(--font-display)' }}
              >
                {m.brand}.
              </div>

              <h1
                className="hero-anim hero-rise mt-2 !mb-0 !text-[clamp(2.5rem,6vw,5rem)] !font-black leading-[0.95] tracking-[-0.02em] text-[var(--accent)]"
                style={{ animationDelay: '100ms', fontFamily: 'var(--font-display)' }}
              >
                {m.model}
              </h1>

              {/* Serif (display family) like the brand/model/stats — keeps the
                  big headline values on one type system; sans is for labels. */}
              <div
                className="hero-anim hero-rise mt-5 text-[clamp(1.4rem,2.6vw,2rem)] font-bold text-white"
                style={{ animationDelay: '200ms', fontFamily: 'var(--font-display)' }}
              >
                {formatPrice(m.price)}
              </div>

              <dl className="mt-7 space-y-3.5">
                {specs.map(({ icon: Icon, label, value }, i) => (
                  <div
                    key={label}
                    className="hero-anim hero-rise flex items-center gap-3"
                    style={{ animationDelay: `${280 + i * 60}ms` }}
                  >
                    {/* -ml: optical nudge so the icon's visual mass sits on the
                        same left rail as the serif title/price (lucide icons
                        carry internal viewBox padding). */}
                    <Icon className="-ml-[2px] h-[18px] w-[18px] shrink-0 text-[var(--accent)]" strokeWidth={2} />
                    <dt className="text-sm font-semibold text-white">{label}</dt>
                    {/* white/70 ≈ 9.6:1 on #0d0d0d (AAA); stays clearly
                        secondary to the bold-white label beside it. */}
                    <dd className="m-0 text-sm font-normal text-white/70">{value}</dd>
                  </div>
                ))}
              </dl>

              {/* Entrance on the wrapper so the button keeps its own hover lift */}
              <div
                className="hero-anim hero-pop mt-8 w-full sm:w-auto"
                style={{ animationDelay: '480ms' }}
              >
                <AddToCartButton name={m.name} inStock={m.inStock} />
              </div>
            </div>

            {/* Right: image card. Fills its grid column, so it reaches the
                container's right edge just as the left content reaches the
                left edge — equal left/right margins from the centered container. */}
            <div className="relative order-1 md:order-2">
              <Gallery photos={m.photoUrls} alt={`${m.brand} ${m.model}`} />
            </div>
          </div>

          {/* Bottom spec strip — lives in the same container, so it shares the
              hero's exact left/right gutter. mt-10 is the only extra spacing. */}
          <div className="mt-10">
            <HeroStats
              engine={m.engine}
              powerKw={m.powerKw}
              year={m.year}
              category={m.silhouetteCategory}
            />
          </div>
        </div>
      </div>

      {/* Auto-scrolling strip of other bikes from the same brand. Full-bleed
          (outside the hero's max-w container) so cards fade at the screen edges. */}
      <BrandMarquee brand={m.brand} motorcycles={brandBikes} />
    </main>
  );
}
