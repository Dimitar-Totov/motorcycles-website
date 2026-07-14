import type { Metadata } from 'next';
import { getFavoriteMotorcycles } from '@/lib/motorcycles';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your favorites, listings, alerts and preferences.',
  robots: { index: false },
};

// Auth protection is enforced in middleware (unauthenticated users are
// redirected to /auth before this renders).
export default async function ProfilePage() {
  // Server-resolved so the Favorites tab renders with real data on first
  // paint, no client-side loading flash (same pattern as the detail page's
  // AddToFavoritesButton initial state).
  const favoriteMotorcycles = await getFavoriteMotorcycles();
  return <ProfileClient favoriteMotorcycles={favoriteMotorcycles} />;
}
