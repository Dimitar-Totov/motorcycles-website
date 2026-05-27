import type { Motorcycle } from './types';
import ProductCard from './ProductCard';

interface Props {
  motorcycles: Motorcycle[];
}

export default function ProductGrid({ motorcycles }: Props) {
  if (motorcycles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-3xl">
          🏍️
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No motorcycles found</h3>
        <p className="text-sm text-gray-400">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-5">
        <span className="font-semibold text-gray-900">{motorcycles.length}</span>{' '}
        {motorcycles.length === 1 ? 'motorcycle' : 'motorcycles'} found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {motorcycles.map(moto => (
          <ProductCard key={moto.id} motorcycle={moto} />
        ))}
      </div>
    </div>
  );
}
