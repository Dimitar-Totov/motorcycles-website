import { useState } from 'react';
import { COLORS, COLOR_SWATCHES } from './mockData';

interface Props {
  selected: string[];
  onChange: (colors: string[]) => void;
}

export default function ColorFilter({ selected, onChange }: Props) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? COLORS : COLORS.slice(0, 6);

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter(c => c !== value)
        : [...selected, value]
    );
  };

  return (
    <div>
      <div className="space-y-0.5">
        {visible.map(({ label, value }) => {
          const active = selected.includes(value);
          const swatch = COLOR_SWATCHES[value] ?? '#9ca3af';
          const isGradient = swatch.startsWith('linear');
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all duration-200 ${
                active ? 'bg-red-50' : 'hover:bg-gray-50'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full shrink-0 border-2 transition-all duration-200 ${
                  active
                    ? 'ring-2 ring-red-500 ring-offset-2 border-transparent'
                    : value === 'White'
                    ? 'border-gray-300'
                    : 'border-transparent'
                }`}
                style={
                  isGradient
                    ? { backgroundImage: swatch }
                    : { backgroundColor: swatch }
                }
              />
              <span
                className={`text-sm transition-colors duration-200 ${
                  active ? 'text-red-700 font-semibold' : 'text-gray-700 font-medium'
                }`}
              >
                {label}
              </span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
      {COLORS.length > 6 && (
        <button
          type="button"
          onClick={() => setShowAll(a => !a)}
          className="mt-2 text-xs text-red-600 font-semibold hover:text-red-700 transition-colors duration-150"
        >
          {showAll ? 'Show less' : `+ ${COLORS.length - 6} more colors`}
        </button>
      )}
    </div>
  );
}
