'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface Props {
  photos: string[];
  alt: string;
}

/**
 * Interactive photo gallery (Client Component): the textual specs around it are
 * server-rendered for SEO, while the thumbnail switching needs client state.
 * Images go through next/image for optimization (remote host is allow-listed
 * in next.config.ts).
 */
export default function Gallery({ photos, alt }: Props) {
  const [active, setActive] = useState(0);

  if (photos.length === 0) {
    return (
      <div className="aspect-[4/3] w-full rounded-2xl bg-slate-100 flex flex-col items-center justify-center gap-3 text-slate-400">
        <ImageOff className="w-10 h-10" strokeWidth={1.5} />
        <span className="text-sm">No photos available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
        <Image
          src={photos[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {photos.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {photos.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square overflow-hidden rounded-lg bg-slate-100 transition-all duration-150 ${
                i === active ? 'ring-2 ring-amber-500' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={url}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
