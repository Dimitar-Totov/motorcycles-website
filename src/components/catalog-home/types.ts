export type LicenseCategory = 'A' | 'A2' | 'A1' | 'B';

export type SilhouetteCategory = 'naked' | 'sport' | 'adventure' | 'scrambler' | 'electric' | 'cruiser';

export interface Motorcycle {
  /** UUID primary key from the `motorcycles` table (was a number in the old mock data). */
  id: string;
  name: string;
  model: string;
  brand: string;
  /** Derived from BRAND_TOKENS on the server; optional for listings with an unknown brand. */
  brandGradient?: string;
  year: number;
  color: string;
  powerKw: number;
  engine: string;
  price: number;
  inStock: boolean;
  /** Not stored in the DB — optional, kept for design parity with the old cards. */
  matriculate?: string;
  licenseCategories: LicenseCategory[];
  silhouetteCategory: SilhouetteCategory;
  /** Public Storage URLs from `photo_urls`. First entry is the cover photo. */
  photoUrls: string[];
}

export interface FilterState {
  brands: string[];
  colors: string[];
  years: number[];
  powerMin: number;
  powerMax: number;
}
