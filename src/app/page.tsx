import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import RiderTypeCarousel from '@/components/RiderTypeCarousel';
import BrandsGrid from '@/components/BrandsGrid';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <RiderTypeCarousel />
      <BrandsGrid />
    </>
  );
}
