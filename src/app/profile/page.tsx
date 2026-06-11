import type { Metadata } from 'next';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your favorites, listings, alerts and preferences.',
  robots: { index: false },
};

// Auth protection is enforced in middleware (unauthenticated users are
// redirected to /auth before this renders).
export default function ProfilePage() {
  return <ProfileClient />;
}
