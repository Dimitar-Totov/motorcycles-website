'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { addFavorite, removeFavorite } from '@/services/favorites/favorites';

interface Props {
  motorcycleId: string;
  name: string;
  initialFavorited: boolean;
}

/**
 * Secondary CTA that sits beside AddToCartButton. Persists via
 * `src/services/favorites/favorites.ts` (RLS-scoped `public.favorites` table),
 * with the initial state resolved server-side by the parent page (same
 * seeded-from-server pattern as `UserContext`'s `initialUser`) to avoid an
 * extra client-side fetch/flash. Toggling is optimistic — the UI flips
 * immediately and rolls back with an error toast if the write fails.
 * Unlike the cart button it stays enabled when the listing is out of stock —
 * favoriting isn't gated on availability, only on being signed in.
 */
export default function AddToFavoritesButton({ motorcycleId, name, initialFavorited }: Props) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, setPending] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleClick = async () => {
    if (pending) return;

    if (!user) {
      toast.error('Sign in to save favorites', {
        description: 'Create an account or sign in to favorite this listing.',
      });
      router.push('/auth');
      return;
    }

    const next = !favorited;
    setFavorited(next);
    setPending(true);

    try {
      if (next) {
        await addFavorite(motorcycleId);
      } else {
        await removeFavorite(motorcycleId);
      }
      toast.success(next ? 'Added to favorites' : 'Removed from favorites', {
        description: next
          ? `${name} was added to your favorites.`
          : `${name} was removed from your favorites.`,
      });
    } catch {
      setFavorited(!next);
      toast.error('Something went wrong', {
        description: 'Failed to update your favorites. Please try again.',
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={favorited}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      className={`group inline-flex aspect-square shrink-0 items-center justify-center rounded-md p-3.5 ring-1 ring-inset transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-70 ${
        favorited
          ? 'bg-[var(--accent)]/10 ring-[var(--accent)]/50'
          : 'bg-white/[0.06] ring-white/10 hover:bg-white/[0.09] hover:ring-white/25'
      }`}
    >
      <Heart
        className={`h-5 w-5 transition-colors duration-200 ${
          favorited ? 'fill-[var(--accent)] text-[var(--accent)]' : 'fill-none text-white/70 group-hover:text-white'
        }`}
        strokeWidth={2.2}
      />
    </button>
  );
}
