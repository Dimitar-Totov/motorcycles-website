'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Black',        hex: '#0a0a0a' },
  { name: 'Matte Black',  hex: '#1c1c1e' },
  { name: 'Gloss Black',  hex: '#050505' },
  { name: 'White',        hex: '#f5f5f5' },
  { name: 'Pearl White',  hex: '#f0ede8' },
  { name: 'Off-White',    hex: '#e8e4dd' },
  { name: 'Silver',       hex: '#c0c0c0' },
  { name: 'Gray',         hex: '#808080' },
  { name: 'Graphite',     hex: '#3d3d3d' },
  { name: 'Gunmetal',     hex: '#2a3540' },
  { name: 'Titanium',     hex: '#878681' },
  { name: 'Red',          hex: '#cc0000' },
  { name: 'Racing Red',   hex: '#b91c1c' },
  { name: 'Candy Red',    hex: '#e63946' },
  { name: 'Dark Red',     hex: '#7f0000' },
  { name: 'Blue',         hex: '#1565c0' },
  { name: 'Midnight Blue',hex: '#1e3a8a' },
  { name: 'Navy Blue',    hex: '#001f5b' },
  { name: 'Cobalt Blue',  hex: '#0047ab' },
  { name: 'Sky Blue',     hex: '#4a90d9' },
  { name: 'Green',        hex: '#1a7a1a' },
  { name: 'Forest Green', hex: '#228b22' },
  { name: 'Olive Green',  hex: '#6b7c0f' },
  { name: 'Lime Green',   hex: '#65a30d' },
  { name: 'Yellow',       hex: '#e6b800' },
  { name: 'Orange',       hex: '#e65c00' },
  { name: 'Burnt Orange', hex: '#c84b00' },
  { name: 'Purple',       hex: '#6a0dad' },
  { name: 'Violet',       hex: '#7c3aed' },
  { name: 'Pink',         hex: '#e91e8c' },
  { name: 'Brown',        hex: '#654321' },
  { name: 'Beige',        hex: '#d4b896' },
  { name: 'Sand',         hex: '#c2b280' },
  { name: 'Gold',         hex: '#d4af37' },
  { name: 'Bronze',       hex: '#cd7f32' },
  { name: 'Copper',       hex: '#b87333' },
  { name: 'Champagne',    hex: '#f7e7ce' },
];

function getPreset(name: string) {
  return PRESET_COLORS.find(c => c.name.toLowerCase() === name.toLowerCase()) ?? null;
}

interface ColorSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ColorSelect({ value, onChange }: ColorSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const preset = getPreset(value);

  const filtered = query
    ? PRESET_COLORS.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : PRESET_COLORS;

  // Show "use custom" option when query doesn't exactly match a preset
  const exactMatch = PRESET_COLORS.some(c => c.name.toLowerCase() === query.toLowerCase());
  const showCustomOption = query.trim().length > 0 && !exactMatch;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 40);
    } else {
      setQuery('');
    }
  }, [open]);

  const pick = (name: string) => {
    onChange(name);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={handleKeyDown}>
      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={[
          'flex items-center justify-between w-full px-4 py-2.5 rounded-lg border',
          'text-sm transition-colors duration-200 outline-none cursor-pointer',
          open
            ? 'bg-white/5 border-amber-400 text-white'
            : 'bg-white/5 border-white/20 text-white hover:border-white/40',
        ].join(' ')}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          {/* Color swatch */}
          <span
            className="w-4 h-4 rounded-full flex-shrink-0 border border-white/20"
            style={{ backgroundColor: preset?.hex ?? (value ? '#666' : 'transparent') }}
            aria-hidden="true"
          />
          <span className={value ? 'text-white truncate' : 'text-white/30'}>
            {value || 'Select a color'}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform duration-200 ${
            open ? 'rotate-180 text-amber-400' : 'text-white/30'
          }`}
        />
      </button>

      {/* ── Panel ── */}
      <div
        role="listbox"
        aria-hidden={!open}
        className={[
          'absolute top-[calc(100%+6px)] left-0 right-0 z-50',
          'rounded-xl border border-white/10 bg-[#0d1117]',
          'shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden',
          'transition-all duration-150 origin-top',
          open
            ? 'opacity-100 scale-y-100 pointer-events-auto'
            : 'opacity-0 scale-y-95 pointer-events-none',
        ].join(' ')}
      >
        {/* Search / custom input */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.07]">
          <Search className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            tabIndex={open ? 0 : -1}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search or type custom color…"
            className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
          />
          {query && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setQuery('')}
              className="text-white/25 hover:text-white/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Options */}
        <ul className="max-h-52 overflow-y-auto overscroll-contain py-1">
          {filtered.map(c => (
            <li
              key={c.name}
              role="option"
              aria-selected={c.name === value}
              onClick={() => pick(c.name)}
              className={[
                'flex items-center gap-3 px-4 py-[9px]',
                'text-sm cursor-pointer transition-colors duration-75 select-none',
                c.name === value
                  ? 'text-amber-400 bg-amber-400/[0.08]'
                  : 'text-white/65 hover:text-white hover:bg-white/[0.06]',
              ].join(' ')}
            >
              <span
                className="w-4 h-4 rounded-full flex-shrink-0 border border-white/15"
                style={{ backgroundColor: c.hex }}
              />
              <span className="flex-1 truncate">{c.name}</span>
              {c.name === value && (
                <Check className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
              )}
            </li>
          ))}

          {/* Custom color option */}
          {showCustomOption && (
            <li
              onClick={() => pick(query.trim())}
              className="flex items-center gap-3 px-4 py-[9px] text-sm cursor-pointer transition-colors duration-75 select-none text-white/50 hover:text-white hover:bg-white/[0.06] border-t border-white/[0.07] mt-1"
            >
              <span className="w-4 h-4 rounded-full flex-shrink-0 border-2 border-dashed border-white/30" />
              <span>
                Use <strong className="text-white/80 font-medium">"{query.trim()}"</strong> as custom color
              </span>
            </li>
          )}

          {filtered.length === 0 && !showCustomOption && (
            <li className="px-4 py-3 text-sm text-white/30 text-center italic">
              No colors found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
