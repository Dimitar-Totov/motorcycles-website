import type { Motorcycle } from './types';
import MotorcycleCard from './MotorcycleCard';

interface Props {
  motorcycles: Motorcycle[];
}

export default function ProductGrid({ motorcycles }: Props) {
  if (motorcycles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ background: '#EEECEA' }}
        >
          <span
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontVariationSettings: '"opsz" 72',
              fontSize: '22px',
              lineHeight: 1,
            }}
          >
            ø
          </span>
        </div>
        <h3
          style={{
            fontFamily: "'Fraunces', Georgia, serif",
            fontVariationSettings: '"opsz" 72',
            fontSize: '18px',
            fontWeight: 500,
            color: '#1a1a18',
            marginBottom: '6px',
          }}
        >
          No motorcycles found
        </h3>
        <p
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: '13px',
            color: '#6b6b68',
          }}
        >
          Try adjusting your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p
        className="mb-5"
        style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: '13px',
          color: '#6b6b68',
        }}
      >
        <span style={{ fontWeight: 600, color: '#1a1a18' }}>{motorcycles.length}</span>{' '}
        {motorcycles.length === 1 ? 'motorcycle' : 'motorcycles'} found
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(16px, 2.5vw, 24px)',
          alignItems: 'start',
        }}
      >
        {motorcycles.map((moto, i) => (
          // Prioritise the first row (~4 cards) — these are above the fold and
          // hold the LCP image, so they should eager-load instead of lazy-load.
          <MotorcycleCard key={moto.id} motorcycle={moto} priority={i < 4} />
        ))}
      </div>
    </div>
  );
}
