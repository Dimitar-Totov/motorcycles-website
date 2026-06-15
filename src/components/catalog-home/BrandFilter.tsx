import { MOTORCYCLE_BRANDS as BRANDS } from '@/data/motorcycleBrands';

interface Props {
  selected: string[];
  onChange: (brands: string[]) => void;
}

export default function BrandFilter({ selected, onChange }: Props) {
  const toggle = (brand: string) => {
    onChange(
      selected.includes(brand)
        ? selected.filter(b => b !== brand)
        : [...selected, brand]
    );
  };

  return (
    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 pt-1">
      {BRANDS.map(brand => {
        const active = selected.includes(brand);
        return (
          <button
            key={brand}
            type="button"
            onClick={() => toggle(brand)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
              active
                ? 'bg-red-600 border-red-600 text-white shadow-sm shadow-red-200'
                : 'bg-white border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600 hover:shadow-sm'
            }`}
          >
            {brand}
          </button>
        );
      })}
    </div>
  );
}
