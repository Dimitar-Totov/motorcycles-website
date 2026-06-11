import Link from 'next/link';
import type { Motorcycle } from './types';
import { MotorcycleSilhouette } from './Silhouettes';
import { Hash } from 'lucide-react';
import './MotorcycleCard.css';

const LICENSE_STYLES: Record<string, { background: string; color: string }> = {
  A1: { background: '#fef3c7', color: '#92400e' },
  A2: { background: '#dbeafe', color: '#1e40af' },
  A:  { background: '#fce7f3', color: '#9d174d' },
  B:  { background: '#dcfce7', color: '#166534' },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);
}

interface Props {
  motorcycle: Motorcycle;
}

export default function MotorcycleCard({ motorcycle: m }: Props) {
  const yearShort = `'${String(m.year).slice(-2)}`;

  return (
    <Link
      href={`/catalog/${m.id}/details`}
      className={`moto-card${m.inStock ? '' : ' moto-card--oos'}`}
      style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
    >
      {/* ── Header: dark gradient brand zone ── */}
      <div className="moto-card__header" style={{ background: m.brandGradient }}>
        <div className="moto-card__status">
          <span className={m.inStock ? 'moto-dot-active' : 'moto-dot-inactive'} />
          <span className="moto-card__status-text">
            {m.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <div className="moto-card__year" aria-hidden="true">{yearShort}</div>

        <div className="moto-card__silhouette" aria-hidden="true">
          <MotorcycleSilhouette category={m.silhouetteCategory} />
        </div>

        <div className="moto-card__watermark" aria-hidden="true">{m.brand}</div>
      </div>

      {/* ── Content body ── */}
      <div className="moto-card__body">
        <div className="moto-card__licenses">
          {m.licenseCategories.map(cat => (
            <span
              key={cat}
              className="moto-card__license-badge"
              style={LICENSE_STYLES[cat] ?? { background: '#f3f4f6', color: '#374151' }}
            >
              {cat}
            </span>
          ))}
        </div>

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
