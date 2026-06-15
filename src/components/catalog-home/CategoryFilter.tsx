import { CATEGORIES } from './mockData';
import type { SilhouetteCategory } from './types';

interface Props {
  selected: SilhouetteCategory[];
  onChange: (categories: SilhouetteCategory[]) => void;
}

export default function CategoryFilter({ selected, onChange }: Props) {
  const toggle = (value: SilhouetteCategory) => {
    onChange(
      selected.includes(value)
        ? selected.filter(c => c !== value)
        : [...selected, value]
    );
  };

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {CATEGORIES.map(({ label, value }) => {
        const active = selected.includes(value);
        return (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
              active
                ? 'bg-red-600 border-red-600 text-white shadow-sm shadow-red-200'
                : 'bg-white border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600 hover:shadow-sm'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
