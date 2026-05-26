export type LicenseCategory = 'A' | 'A2' | 'A1' | 'B';

export interface Motorcycle {
  id: number;
  name: string;
  brand: string;
  year: number;
  color: string;
  powerKw: number;
  engine: string;
  price: number;
  inStock: boolean;
  matriculate: string;
  licenseCategories: LicenseCategory[];
}

export interface FilterState {
  brands: string[];
  colors: string[];
  years: number[];
  powerMin: number;
  powerMax: number;
}
