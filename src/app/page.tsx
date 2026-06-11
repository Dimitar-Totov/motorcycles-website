import MotorcycleCatalog from '@/components/catalog-home/MotorcycleCatalog';
import AboutSection from '@/components/AboutSection';
import RiderTypeCarousel from '@/components/RiderTypeCarousel';
import BrandsGrid from '@/components/BrandsGrid';
import { getMotorcycles } from '@/lib/motorcycles';

export default async function Home() {
  // Read on the server so the catalog is server-rendered for SEO; filtering
  // still happens client-side inside <MotorcycleCatalog>.
  const motorcycles = await getMotorcycles();

  return (
    <>
      <MotorcycleCatalog motorcycles={motorcycles} />
      <AboutSection />
      <RiderTypeCarousel />
      <BrandsGrid />
    </>
  );
}
