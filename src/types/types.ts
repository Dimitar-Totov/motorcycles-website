import type { LicenseCategory, SilhouetteCategory } from '../components/catalog-home/types';

export interface ProductForm {
  name: string;
  model: string;
  brand: string;
  year: string;
  color: string;
  powerKw: string;
  engine: string;
  price: string;
  inStock: boolean;
  licenseCategories: LicenseCategory[];
  silhouetteCategory: SilhouetteCategory | '';
}
