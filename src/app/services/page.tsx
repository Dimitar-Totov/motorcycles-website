import type { Metadata } from 'next';
import ServiceContent from './ServiceContent';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'New & pre-owned sales, expert servicing, custom builds, and genuine parts & accessories — we support you at every stage of the ride.',
};

export default function ServicesPage() {
  return <ServiceContent />;
}
