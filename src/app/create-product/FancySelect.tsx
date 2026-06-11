'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

interface FancySelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyMessage?: string;
}

export default function FancySelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  emptyMessage = 'No results found',
}: FancySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = options.filter(o =>
    o.toLowerCase().includes(query.toLowerCase()),
  );

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
      // Scroll selected item into view
      const selected = listRef.current?.querySelector('[data-selected="true"]');
      selected?.scrollIntoView({ block: 'nearest' });
    } else {
      setQuery('');
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false);
  };

  const pick = (opt: string) => {
    onChange(opt);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={handleKeyDown}>
      {/* ── Trigger ── */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        className={[
          'flex items-center justify-between w-full px-4 py-2.5 rounded-lg border',
          'text-sm transition-colors duration-200 outline-none',
          disabled
            ? 'bg-white/[0.02] border-white/10 text-white/25 cursor-not-allowed'
            : open
              ? 'bg-white/5 border-amber-400 text-white cursor-pointer'
              : 'bg-white/5 border-white/20 text-white hover:border-white/40 cursor-pointer',
        ].join(' ')}
      >
        <span className={value ? 'text-white truncate' : 'text-white/30'}>
          {value || placeholder}
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
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.07]">
          <Search className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            tabIndex={open ? 0 : -1}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search…"
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
        <ul ref={listRef} className="max-h-52 overflow-y-auto overscroll-contain py-1">
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-white/30 text-center italic">
              {emptyMessage}
            </li>
          ) : (
            filtered.map(opt => (
              <li
                key={opt}
                role="option"
                data-selected={opt === value}
                aria-selected={opt === value}
                onClick={() => pick(opt)}
                className={[
                  'flex items-center justify-between px-4 py-[9px]',
                  'text-sm cursor-pointer transition-colors duration-75 select-none',
                  opt === value
                    ? 'text-amber-400 bg-amber-400/[0.08]'
                    : 'text-white/65 hover:text-white hover:bg-white/[0.06]',
                ].join(' ')}
              >
                <span className="truncate">{opt}</span>
                {opt === value && (
                  <Check className="w-3.5 h-3.5 flex-shrink-0 ml-2 text-amber-400" />
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
