export type LicenseCategory = 'A' | 'A2' | 'A1' | 'B';

export type SilhouetteCategory = 'naked' | 'sport' | 'adventure' | 'scrambler' | 'electric' | 'cruiser';

export interface Motorcycle {
  id: number;
  name: string;
  model: string;
  brand: string;
  brandGradient: string;
  year: number;
  color: string;
  powerKw: number;
  engine: string;
  price: number;
  inStock: boolean;
  matriculate: string;
  licenseCategories: LicenseCategory[];
  silhouetteCategory: SilhouetteCategory;
}

export interface FilterState {
  brands: string[];
  colors: string[];
  years: number[];
  powerMin: number;
  powerMax: number;
}
