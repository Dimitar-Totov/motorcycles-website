'use client';

import { Bike } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  name: string;
  inStock: boolean;
}

/**
 * Primary CTA for the detail hero. Accent-filled (colour comes from the
 * section's --accent token via the .cta-accent class), with the app's
 * existing sonner toast as feedback. Disabled when the listing is sold out.
 */
export default function AddToCartButton({ name, inStock }: Props) {
  if (!inStock) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-white/[0.06] px-7 py-3.5 text-[0.95rem] font-semibold text-white/40 ring-1 ring-inset ring-white/10 sm:w-auto"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        toast.success('Added to cart', {
          description: `${name} was added to your cart.`,
        })
      }
      className="cta-accent group inline-flex w-full items-center justify-center gap-2.5 rounded-md px-7 py-3.5 text-[0.95rem] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:w-auto"
    >
      Add to Cart
      <Bike
        className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
        strokeWidth={2.2}
      />
    </button>
  );
}
