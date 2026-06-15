// Filter option constants and presentational tokens used by the catalog UI.
// (The former in-memory `motorcycles` sample array was removed — listings now
// come from Supabase via src/lib/motorcycles.ts.)

import type { SilhouetteCategory } from './types';

export const CATEGORIES: { label: string; value: SilhouetteCategory }[] = [
  { label: 'Naked',             value: 'naked' },
  { label: 'Sport',             value: 'sport' },
  { label: 'Adventure',         value: 'adventure' },
  { label: 'Scrambler',         value: 'scrambler' },
  { label: 'Electric',          value: 'electric' },
  { label: 'Cruiser',           value: 'cruiser' },
  { label: 'Adventure Touring', value: 'adventure touring' },
  { label: 'Touring',           value: 'touring' },
  { label: 'Cafe Racer',        value: 'cafe racer' },
  { label: 'Dual Sport',        value: 'dual sport' },
  { label: 'Supermoto',         value: 'supermoto' },
  { label: 'Custom',            value: 'custom' },
  { label: 'Dirt Bike',         value: 'dirt bike' },
  { label: 'Moped',             value: 'moped' },
  { label: 'Scooter',           value: 'scooter' },
  { label: 'Enduro',            value: 'enduro' },
];

export const BRANDS = ['CFLITE', 'CFMOTO', 'Fantic', 'MV Agusta', 'VOGE', 'ZEEHO'];

export const COLORS = [
  { label: 'Black', value: 'Black' },
  { label: 'Black/Red', value: 'Black/Red' },
  { label: 'Black/Red/Blue', value: 'Black/Red/Blue' },
  { label: 'Black/Yellow', value: 'Black/Yellow' },
  { label: 'Blue', value: 'Blue' },
  { label: 'Green', value: 'Green' },
  { label: 'White', value: 'White' },
  { label: 'Red', value: 'Red' },
];

export const YEARS = [2022, 2023, 2024, 2025, 2026];
export const POWER_MIN = 0;
export const POWER_MAX = 300;

export const COLOR_SWATCHES: Record<string, string> = {
  Black: '#111827',
  'Black/Red': 'linear-gradient(135deg, #111827 50%, #dc2626 50%)',
  'Black/Red/Blue': 'linear-gradient(135deg, #111827 33%, #dc2626 33%, #dc2626 66%, #2563eb 66%)',
  'Black/Yellow': 'linear-gradient(135deg, #111827 50%, #eab308 50%)',
  Blue: '#2563eb',
  Green: '#16a34a',
  White: '#f3f4f6',
  Red: '#dc2626',
};

export const BRAND_TOKENS: Record<string, string> = {
  CFLITE: '#00A99D',
  CFMOTO: '#2A2A2A',
  Fantic: '#1F3B2A',
  'MV Agusta': '#7B1F2E',
  VOGE: '#8B5A2B',
  ZEEHO: '#00C2A8',
};
