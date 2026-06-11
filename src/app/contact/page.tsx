import type { Metadata } from 'next';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    "Get in touch with Dimitar's Motorcycles — visit our Sofia showroom, call us, or send a message and a specialist will respond promptly.",
};

export default function ContactPage() {
  return <ContactContent />;
}
