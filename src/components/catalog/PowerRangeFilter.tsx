import { POWER_MIN, POWER_MAX } from './mockData';

interface Props {
  value: [number, number];
  onChange: (range: [number, number]) => void;
}

export default function PowerRangeFilter({ value, onChange }: Props) {
  const [low, high] = value;
  const range = POWER_MAX - POWER_MIN;
  const leftPct = ((low - POWER_MIN) / range) * 100;
  const rightPct = ((POWER_MAX - high) / range) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100">
          {low} kW
        </span>
        <span className="text-xs text-gray-300 font-medium">—</span>
        <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold border border-red-100">
          {high} kW
        </span>
      </div>

      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />
        <div
          className="absolute h-1.5 bg-red-500 rounded-full pointer-events-none"
          style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
        />
        <input
          type="range"
          min={POWER_MIN}
          max={POWER_MAX}
          value={low}
          aria-label="Minimum power"
          onChange={e => {
            const v = Number(e.target.value);
            if (v <= high) onChange([v, high]);
          }}
          className="catalog-range"
          style={{ zIndex: low >= high - 5 ? 5 : 3 }}
        />
        <input
          type="range"
          min={POWER_MIN}
          max={POWER_MAX}
          value={high}
          aria-label="Maximum power"
          onChange={e => {
            const v = Number(e.target.value);
            if (v >= low) onChange([low, v]);
          }}
          className="catalog-range"
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
        <span>{POWER_MIN} kW</span>
        <span>{POWER_MAX} kW</span>
      </div>
    </div>
  );
}
