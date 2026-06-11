import type { Metadata } from 'next';
import CreateProductForm from './CreateProductForm';

export const metadata: Metadata = {
  title: 'Create Listing',
  description: 'Add a new motorcycle listing with photos and specifications.',
  robots: { index: false },
};

// Auth protection is enforced in middleware (unauthenticated users are
// redirected to /auth before this renders).
export default function CreateProductPage() {
  return <CreateProductForm />;
}
