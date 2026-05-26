import { SlidersHorizontal, X } from 'lucide-react';
import type { FilterState } from './types';
import FilterSection from './FilterSection';
import BrandFilter from './BrandFilter';
import ColorFilter from './ColorFilter';
import YearFilter from './YearFilter';
import PowerRangeFilter from './PowerRangeFilter';

interface Props {
  filters: FilterState;
  onBrandChange: (brands: string[]) => void;
  onColorChange: (colors: string[]) => void;
  onYearChange: (years: number[]) => void;
  onPowerChange: (range: [number, number]) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export default function FilterSidebar({
  filters,
  onBrandChange,
  onColorChange,
  onYearChange,
  onPowerChange,
  onClearAll,
  hasActiveFilters,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1 mb-1">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-900">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1.5 text-xs text-red-600 font-semibold hover:text-red-700 transition-colors duration-150 px-2 py-1 rounded-lg hover:bg-red-50"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Brand">
        <BrandFilter selected={filters.brands} onChange={onBrandChange} />
      </FilterSection>

      <FilterSection title="Color">
        <ColorFilter selected={filters.colors} onChange={onColorChange} />
      </FilterSection>

      <FilterSection title="Year">
        <YearFilter selected={filters.years} onChange={onYearChange} />
      </FilterSection>

      <FilterSection title="Power">
        <PowerRangeFilter
          value={[filters.powerMin, filters.powerMax]}
          onChange={onPowerChange}
        />
      </FilterSection>
    </div>
  );
}
