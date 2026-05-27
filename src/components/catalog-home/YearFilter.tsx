import { YEARS } from './mockData';

interface Props {
  selected: number[];
  onChange: (years: number[]) => void;
}

export default function YearFilter({ selected, onChange }: Props) {
  const toggle = (year: number) => {
    onChange(
      selected.includes(year)
        ? selected.filter(y => y !== year)
        : [...selected, year]
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {YEARS.map(year => {
        const active = selected.includes(year);
        return (
          <button
            key={year}
            type="button"
            onClick={() => toggle(year)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 active:scale-95 ${
              active
                ? 'bg-red-600 border-red-600 text-white shadow-sm shadow-red-200'
                : 'bg-white border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}
