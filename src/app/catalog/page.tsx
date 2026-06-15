import type { Metadata } from 'next';
import MotorcycleCatalog from '@/components/catalog-home/MotorcycleCatalog';
import { getMotorcycles } from '@/lib/motorcycles';

export const metadata: Metadata = {
  title: 'Catalog',
  description:
    'Browse the full motorcycle catalog — filter by brand, colour, year and power to find your perfect ride.',
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const motorcycles = await getMotorcycles();

  return <MotorcycleCatalog motorcycles={motorcycles} initialCategory={category} />;
}
