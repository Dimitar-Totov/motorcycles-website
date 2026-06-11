'use client';

import { useEffect, useState } from 'react';
import serviceImg from '../../assets/service.png';
import { Bike, Wrench, Hammer, Package } from 'lucide-react';

const services = [
  {
    icon: Bike,
    title: 'New & Pre-Owned Sales',
    description:
      'Curated inventory spanning sport, adventure, cruiser, and touring categories — sourced from the world\'s top brands and ready to ride.',
    delay: 'delay-[100ms]',
  },
  {
    icon: Wrench,
    title: 'Expert Servicing',
    description:
      'Factory-trained technicians handle everything from routine tune-ups to full engine rebuilds, keeping your machine performing at its peak.',
    delay: 'delay-[200ms]',
  },
  {
    icon: Hammer,
    title: 'Custom Builds',
    description:
      'Turn your vision into a signature machine. We specialise in bespoke modifications — from custom paint and ergonomics to full performance overhauls.',
    delay: 'delay-[300ms]',
  },
  {
    icon: Package,
    title: 'Parts & Accessories',
    description:
      'Genuine OEM parts and premium aftermarket accessories to enhance your ride\'s performance, safety, and style — all under one roof.',
    delay: 'delay-[400ms]',
  },
];

export default function ServiceContent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="bg-white py-12 md:py-16 px-4" aria-label="Services hero">
        <div className="flex flex-col items-center text-center">
          <h1
            className="text-5xl md:text-6xl lg:text-8xl font-bold text-slate-900 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our Services
          </h1>
          <p
            className="mt-4 text-xl md:text-2xl lg:text-3xl max-w-2xl text-gray-500"
            style={{ fontFamily: "'Lora', serif" }}
          >
            From finding your next bike to keeping it in peak condition — we're
            with you at every stage of the ride.
          </p>
        </div>
        <img
          src={serviceImg.src}
          alt="Motorcycle service"
          className="mt-10 mx-auto block h-auto max-h-[600px] md:max-h-[730px] w-auto rounded-sm"
        />
      </section>

      {/* Service Cards */}
      <section className="bg-white pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map(({ icon: Icon, title, description, delay }) => (
              <div
                key={title}
                className={[
                  'text-center px-4 pb-10 pt-12',
                  'transition-all duration-700 ease-out',
                  delay,
                  visible
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-12',
                ].join(' ')}
              >
                {/* Icon circle overlapping hero boundary */}
                <div className="flex justify-center mt-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-900 flex items-center justify-center shadow-lg">
                    <Icon
                      className="w-7 h-7 md:w-9 md:h-9 text-white"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <h3 className="mt-5 text-xl font-bold text-amber-500">
                  {title}
                </h3>
                <p className="mt-2 text-gray-500 text-base leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
