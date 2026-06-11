import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Gauge, Cog, Calendar, Palette } from 'lucide-react';
import { getMotorcycleById } from '@/lib/motorcycles';
import Gallery from './Gallery';

// Dynamically server-rendered: the shared layout reads auth cookies, so the
// whole tree renders per-request. The HTML (incl. <title>/OG tags) is still
// fully server-rendered for SEO.
type PageProps = { params: Promise<{ id: string }> };

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);
}

const LICENSE_STYLES: Record<string, { background: string; color: string }> = {
  A1: { background: '#fef3c7', color: '#92400e' },
  A2: { background: '#dbeafe', color: '#1e40af' },
  A: { background: '#fce7f3', color: '#9d174d' },
  B: { background: '#dcfce7', color: '#166534' },
};

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

export default async function MotorcycleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const m = await getMotorcycleById(id);

  if (!m) notFound();

  const specs = [
    { icon: Calendar, label: 'Year', value: String(m.year) },
    { icon: Cog, label: 'Engine', value: m.engine || '—' },
    { icon: Gauge, label: 'Power', value: m.powerKw ? `${m.powerKw} kW` : '—' },
    { icon: Palette, label: 'Color', value: m.color || '—' },
  ];

  return (
    <main className="!bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Gallery (client) */}
          <Gallery photos={m.photoUrls} alt={`${m.brand} ${m.model}`} />

          {/* Specs (server-rendered for SEO) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  m.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${m.inStock ? 'bg-green-500' : 'bg-red-500'}`}
                />
                {m.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                {m.brand}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-2">
              {m.name}
            </h1>

            <p className="text-2xl font-semibold text-amber-600 mb-6">{formatPrice(m.price)}</p>

            {m.licenseCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {m.licenseCategories.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md"
                    style={LICENSE_STYLES[cat] ?? { background: '#f3f4f6', color: '#374151' }}
                  >
                    Licence {cat}
                  </span>
                ))}
              </div>
            )}

            <dl className="grid grid-cols-2 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white p-4 flex items-start gap-3">
                  <Icon className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <dt className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      {label}
                    </dt>
                    <dd className="text-sm font-medium text-slate-900 truncate">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-sm text-slate-500 capitalize">
              Category: <span className="font-medium text-slate-700">{m.silhouetteCategory}</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
