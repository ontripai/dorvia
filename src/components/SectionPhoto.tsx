'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Language } from '../types';

interface SectionPhotoProps {
  src: string;
  alt: string;
  captionFa: string;
  captionEn: string;
  currentLang: Language;
  className?: string;
}

/**
 * A self-hosted real photo (see scripts/fetch-wikimedia-photos.js) rendered as a
 * rounded hero block with a bottom gradient caption crediting the source — the same
 * treatment already used for the city guide photos in CityDetailContent.tsx, pulled
 * out here so every other section can reuse it consistently.
 *
 * Fails gracefully: if the photo file is missing (e.g. the fetch script hasn't been
 * run yet), the whole block just doesn't render instead of showing a broken image.
 */
export const SectionPhoto: React.FC<SectionPhotoProps> = ({
  src,
  alt,
  captionFa,
  captionEn,
  currentLang,
  className,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg ${className || ''}`}>
      <Image
        src={src}
        alt={alt}
        width={900}
        height={320}
        sizes="(max-width: 768px) 100vw, 900px"
        className="w-full h-56 sm:h-72 object-cover"
        loading="lazy"
        onError={() => setFailed(true)}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <p className="text-white text-xs">
          {currentLang === 'fa' ? captionFa : captionEn}
        </p>
      </div>
    </div>
  );
};
