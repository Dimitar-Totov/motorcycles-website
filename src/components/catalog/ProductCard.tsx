import { ArrowRight, Bike } from 'lucide-react';
import type { Motorcycle, LicenseCategory } from './types';
import { BRAND_GRADIENTS } from './mockData';

const LICENSE_STYLES: Record<LicenseCategory, string> = {
  A: 'from-red-500 to-red-700',
  A2: 'from-orange-400 to-orange-600',
  A1: 'from-amber-400 to-amber-600',
  B: 'from-blue-500 to-blue-700',
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
}

interface Props {
  motorcycle: Motorcycle;
}

export default function ProductCard({ motorcycle: m }: Props) {
  const gradient = BRAND_GRADIENTS[m.brand] ?? 'from-slate-700 to-slate-950';

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-red-200/60 transition-all duration-300 overflow-hidden">
      {/* Image placeholder */}
      <div className={`relative aspect-[16/10] bg-gradient-to-br ${gradient} overflow-hidden`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 group-hover:scale-105 transition-transform duration-500">
          <Bike className="w-14 h-14 text-white/15" strokeWidth={1.5} />
          <span className="text-white/[0.07] text-5xl font-black uppercase tracking-tight select-none">
            {m.brand}
          </span>
        </div>
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/40 backdrop-blur-sm text-white text-xs font-bold rounded-full">
          '{String(m.year).slice(-2)}
        </div>
        {m.inStock ? (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            In Stock
          </div>
        ) : (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-sm text-white/70 text-xs font-medium rounded-full">
            Out of Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {m.licenseCategories.map(cat => (
            <span
              key={cat}
              title={`License category ${cat}`}
              className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br ${LICENSE_STYLES[cat]} text-white text-xs font-bold shadow-sm`}
            >
              {cat}
            </span>
          ))}
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-red-700 transition-colors duration-200">
          {m.name}
        </h3>

        <div className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 font-medium shrink-0">Matriculate</span>
            <span className="text-gray-800 font-semibold">{m.matriculate}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 font-medium shrink-0">Year</span>
            <span className="text-gray-800 font-semibold">{m.year}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-gray-400 font-medium shrink-0">Engine</span>
            <span
              className="text-gray-800 font-semibold text-right truncate max-w-[58%]"
              title={m.engine}
            >
              {m.engine}
            </span>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-red-600">{formatPrice(m.price)}</span>
            <span className="text-xs text-gray-400 font-medium">incl. VAT</span>
          </div>
        </div>

        <button
          type="button"
          className="group/btn mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-gray-900/20 hover:from-gray-800 hover:to-gray-600 active:scale-[0.98]"
        >
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
