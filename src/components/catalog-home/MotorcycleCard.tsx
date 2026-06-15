import Link from 'next/link';
import Image from 'next/image';
import type { LicenseCategory, Motorcycle } from './types';
import { MotorcycleSilhouette } from './Silhouettes';
import { Hash, ShieldCheck } from 'lucide-react';
import './MotorcycleCard.css';

const LICENSE_STYLES: Record<string, { background: string; color: string }> = {
  A1: { background: '#fef3c7', color: '#92400e' },
  A2: { background: '#dbeafe', color: '#1e40af' },
  A:  { background: '#fce7f3', color: '#9d174d' },
  B:  { background: '#dcfce7', color: '#166534' },
};

/**
 * Motorcycle licences are tiered: A (unrestricted) ⊃ A2 ⊃ A1. A holder of the
 * higher tier may ride anything the lower tiers allow, so showing both is
 * redundant — keep only the highest motorcycle licence. B (car licence) is a
 * separate category and is preserved independently. Original order is kept.
 */
function visibleLicenses(cats: LicenseCategory[]): LicenseCategory[] {
  const set = new Set(cats);
  if (set.has('A')) {
    set.delete('A2');
    set.delete('A1');
  } else if (set.has('A2')) {
    set.delete('A1');
  }
  return cats.filter(c => set.has(c));
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);
}

interface Props {
  motorcycle: Motorcycle;
  /** Prioritise the cover image (eager-load + preload) for above-the-fold
   *  cards so the LCP image isn't lazy-loaded. */
  priority?: boolean;
}

export default function MotorcycleCard({ motorcycle: m, priority = false }: Props) {
  const yearShort = `'${String(m.year).slice(-2)}`;
  // First photo is the cover; fall back to the silhouette when there are none.
  const coverUrl = m.photoUrls?.[0];

  return (
    <Link
      href={`/catalog/${m.id}/details`}
      className={`moto-card${m.inStock ? '' : ' moto-card--oos'}`}
      style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
    >
      {/* ── Header: cover photo (or gradient + silhouette fallback) ── */}
      <div className="moto-card__header" style={{ background: m.brandGradient }}>
        <div className="moto-card__status">
          <span className={m.inStock ? 'moto-dot-active' : 'moto-dot-inactive'} />
          <span className="moto-card__status-text">
            {m.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <div className="moto-card__year" aria-hidden="true">{yearShort}</div>

        {coverUrl ? (
          <>
            <Image
              src={coverUrl}
              alt={`${m.brand} ${m.model}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
              className="moto-card__cover"
              priority={priority}
            />
            {/* Top/bottom darkening keeps the status pill + year badge legible
                over bright photo backgrounds. */}
            <div className="moto-card__cover-overlay" aria-hidden="true" />
          </>
        ) : (
          <>
            <div className="moto-card__silhouette" aria-hidden="true">
              <MotorcycleSilhouette category={m.silhouetteCategory} />
            </div>
            <div className="moto-card__watermark" aria-hidden="true">{m.brand}</div>
          </>
        )}
      </div>

      {/* ── Content body ── */}
      <div className="moto-card__body">
        {(() => {
          const licenses = visibleLicenses(m.licenseCategories);
          if (licenses.length === 0) return null;
          return (
            <div className="moto-card__licenses">
              <span className="moto-card__licenses-label">
                <ShieldCheck className="moto-card__licenses-icon" aria-hidden="true" />
                Licence
              </span>
              {licenses.map(cat => (
                <span
                  key={cat}
                  className="moto-card__license-badge"
                  style={LICENSE_STYLES[cat] ?? { background: '#f3f4f6', color: '#374151' }}
                >
                  {cat}
                </span>
              ))}
            </div>
          );
        })()}

        <h3 className="moto-card__model">
          {m.brand.toUpperCase()} {m.model}
        </h3>

        {m.matriculate && (
          <div className="moto-card__matriculate">
            <Hash className="moto-card__meta-icon" aria-hidden="true" />
            <span>{m.matriculate}</span>
          </div>
        )}

        <p className="moto-card__specs">{m.year}&thinsp;·&thinsp;{m.engine}</p>

        <div className="moto-card__price-row">
          <span className="moto-card__vat-label">incl. VAT</span>
          <span className="moto-card__price">{formatPrice(m.price)}</span>
        </div>
      </div>
    </Link>
  );
}
