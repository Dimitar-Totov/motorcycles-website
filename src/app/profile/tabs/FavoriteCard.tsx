'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { removeFavorite } from '@/services/favorites/favorites';
import MotorcycleCard from '@/components/catalog-home/MotorcycleCard';
import type { Motorcycle } from '@/components/catalog-home/types';
import './FavoriteCard.css';

interface Props {
  motorcycle: Motorcycle;
  /** Called once the removal succeeded and the shrink/fade-out has finished playing. */
  onRemoved: (id: string) => void;
}

// Keep in sync with the `--animate-fade-shrink-out` duration in globals.css.
const REMOVE_ANIM_MS = 220;

/**
 * Favorites-tab card. Every card here is, by definition, already favorited —
 * the heart is always rendered filled and only ever removes (no toggle-to-add
 * state, unlike `AddToFavoritesButton` on the detail page).
 *
 * Wraps the real catalog `MotorcycleCard` (so favorites and catalog always
 * render identically) with a heart-remove button layered on top as a SIBLING
 * of `MotorcycleCard`'s own `<Link>` — not nested inside it — so the button
 * doesn't need click-propagation tricks to avoid triggering navigation.
 */
export default function FavoriteCard({ motorcycle: m, onRemoved }: Props) {
  const [pending, setPending] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    if (pending) return;

    setPending(true);
    try {
      await removeFavorite(m.id);
      // Play the shrink/fade-out, then let the parent drop it from the list.
      setRemoving(true);
      window.setTimeout(() => onRemoved(m.id), REMOVE_ANIM_MS);
    } catch {
      toast.error('Something went wrong', {
        description: 'Failed to remove from your favorites. Please try again.',
      });
      setPending(false);
    }
  };

  return (
    <div
      className={`favorite-card relative ${removing ? 'animate-fade-shrink-out pointer-events-none' : ''}`}
    >
      <MotorcycleCard motorcycle={m} />

      {/* Heart button — always filled here, remove-only. Sibling of MotorcycleCard's
          own <Link>, not a descendant, so it never triggers card navigation.
          Positioned lower than a bare top-right corner (top-9, not top-2.5) so it
          clears `.moto-card__year`'s badge (top:8px, up to 40px font) instead of
          overlapping it — see FavoriteCard.css for the `favorite-card__remove`
          hover/active lift that keeps it visually anchored to the photo when
          `.moto-card:hover` lifts the card itself. */}
      <button
        type="button"
        onClick={handleRemove}
        disabled={pending}
        aria-label="Remove from favorites"
        className={[
          'favorite-card__remove',
          'absolute top-9 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center bg-orange-500 shadow-sm',
          'active:scale-90 hover:scale-110',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100',
          'focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-1 outline-none',
        ].join(' ')}
      >
        <Heart className="w-3.5 h-3.5 fill-white text-white" />
      </button>
    </div>
  );
}
