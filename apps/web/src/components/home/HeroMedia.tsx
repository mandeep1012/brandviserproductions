'use client';

import { useEffect, useState } from 'react';
import { EventImage } from '@/components/common/EventImage';
import { HERO_VIDEO_URL } from '@/lib/config';

/**
 * The photograph is the LCP image (priority). On desktop only, after the page has loaded and
 * unless the visitor prefers reduced motion, a muted 8 s reel fades in over it. Phones keep
 * the still image, as the wireframe specifies.
 */
export function HeroMedia({ imageUrl, alt }: { imageUrl: string | null; alt: string }) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (!HERO_VIDEO_URL) return;
    const desktop = window.matchMedia('(min-width: 64rem)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const start = () => setShowVideo(desktop.matches && !calm.matches);
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => window.removeEventListener('load', start);
  }, []);

  return (
    <div className="relative aspect-[4/5] lg:aspect-auto lg:h-120">
      <EventImage
        src={imageUrl}
        alt={alt}
        label="Hero photograph"
        priority
        sizes="(min-width: 64rem) 40vw, 100vw"
        className="absolute inset-0 h-full"
      />
      {showVideo && HERO_VIDEO_URL && (
        <video
          className="absolute inset-0 h-full w-full animate-in rounded-md object-cover duration-700 fade-in"
          src={HERO_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      )}
    </div>
  );
}
