import type { Metadata } from 'next';
import MotorcycleCatalog from '@/components/catalog-home/MotorcycleCatalog';
import { getMotorcycles } from '@/lib/motorcycles';

export const metadata: Metadata = {
  title: 'Catalog',
  description:
    'Browse the full motorcycle catalog — filter by brand, colour, year and power to find your perfect ride.',
};

export default async function CatalogPage() {
  // Server-fetch the listings; filtering happens client-side in MotorcycleCatalog.
  const motorcycles = await getMotorcycles();

  return <MotorcycleCatalog motorcycles={motorcycles} />;
}
