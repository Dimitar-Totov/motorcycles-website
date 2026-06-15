'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import type { FilterState, Motorcycle, SilhouetteCategory } from './types';
import { POWER_MIN, POWER_MAX } from './mockData';
import FilterSidebar from './FilterSidebar';
import ProductGrid from './ProductGrid';

const baseFilters: FilterState = {
  brands: [],
  colors: [],
  years: [],
  powerMin: POWER_MIN,
  powerMax: POWER_MAX,
  categories: [],
};

interface Props {
  /** Listings fetched on the server (Home page) and filtered here on the client. */
  motorcycles: Motorcycle[];
  /** Pre-selected category from ?category= URL param (set by the navbar dropdown). */
  initialCategory?: string;
}

export default function MotorcycleCatalog({ motorcycles, initialCategory }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    ...baseFilters,
    categories: initialCategory ? [initialCategory as SilhouetteCategory] : [],
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.categories.length > 0 ||
    filters.colors.length > 0 ||
    filters.years.length > 0 ||
    filters.powerMin > POWER_MIN ||
    filters.powerMax < POWER_MAX;

  const activeFilterCount =
    filters.brands.length +
    filters.categories.length +
    filters.colors.length +
    filters.years.length +
    (filters.powerMin > POWER_MIN || filters.powerMax < POWER_MAX ? 1 : 0);

  const filtered = useMemo(
    () =>
      motorcycles.filter(m => {
        if (filters.categories.length > 0 && !filters.categories.includes(m.silhouetteCategory)) return false;
        if (filters.brands.length > 0 && !filters.brands.some(b => b.toLowerCase() === m.brand.toLowerCase())) return false;
        if (filters.colors.length > 0 && !filters.colors.some(c => c.toLowerCase() === m.color.toLowerCase())) return false;
        if (filters.years.length > 0 && !filters.years.includes(m.year)) return false;
        if (m.powerKw > 0 && (m.powerKw < filters.powerMin || m.powerKw > filters.powerMax)) return false;
        return true;
      }),
    [filters, motorcycles]
  );

  const clearAll = () => setFilters(baseFilters);

  const sidebarProps = {
    filters,
    onBrandChange: (brands: string[]) => setFilters(f => ({ ...f, brands })),
    onCategoryChange: (categories: SilhouetteCategory[]) => setFilters(f => ({ ...f, categories })),
    onColorChange: (colors: string[]) => setFilters(f => ({ ...f, colors })),
    onYearChange: (years: number[]) => setFilters(f => ({ ...f, years })),
    onPowerChange: ([powerMin, powerMax]: [number, number]) =>
      setFilters(f => ({ ...f, powerMin, powerMax })),
    onClearAll: clearAll,
    hasActiveFilters,
  };

  return (
    <div className="bg-slate-50 w-full">
      {/* Mobile / tablet filter bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200/80">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{filtered.length}</span> results
          </p>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-150"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-red-600 text-white text-xs rounded-full font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-7 items-start">
          {/* Desktop sticky sidebar */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-28 self-start">
            <FilterSidebar {...sidebarProps} />
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0 min-h-[70vh]">
            <ProductGrid motorcycles={filtered} />
          </div>
        </div>
      </div>

      {/* Drawer backdrop */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className="fixed inset-y-0 left-0 z-50 w-full sm:w-[320px] bg-slate-50 shadow-2xl flex flex-col lg:hidden transition-transform duration-300 ease-in-out"
        style={{ transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-gray-900">Filters</span>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-150"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <FilterSidebar {...sidebarProps} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200 shrink-0">
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-colors duration-150"
          >
            Show {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </button>
        </div>
      </div>
    </div>
  );
}
