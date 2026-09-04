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
  priority?: boolean;
}

/**
 * Optimized photo component with lazy loading, skeleton placeholder shimmer,
 * responsive sizing and modern WebP/AVIF compression.
 */
export const SectionPhoto: React.FC<SectionPhotoProps> = ({
  src,
  alt,
  captionFa,
  captionEn,
  currentLang,
  className = '',
  priority = false,
}) => {
  const [failed, setFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (failed) return null;

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg bg-slate-100 border border-[#dfe6ef] ${className}`}>
      {/* Skeleton Shimmer while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      )}

      <Image
        src={src}
        alt={alt}
        width={900}
        height={320}
        quality={80}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        decoding="async"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 900px"
        className={`w-full h-56 sm:h-72 object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setFailed(true)}
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
        <p className="text-white text-xs leading-relaxed font-medium">
          {currentLang === 'fa' ? captionFa : captionEn}
        </p>
      </div>
    </div>
  );
};
