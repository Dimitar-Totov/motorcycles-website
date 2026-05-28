import MotorcycleCatalog from '../components/catalog-home/MotorcycleCatalog';
import AboutSection from '../components/AboutSection';
import RiderTypeCarousel from '../components/RiderTypeCarousel';
import BrandsGrid from '../components/BrandsGrid';

export default function Home() {
  return (
    <>
      <MotorcycleCatalog />
      <AboutSection />
      <RiderTypeCarousel />
      <BrandsGrid />
    </>
  );
}
