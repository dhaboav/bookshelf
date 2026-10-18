'use client';

import { cn } from 'cn';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { IMAGE_CONFIG } from '@/utils/image-config';

interface BookCoverProps {
  title?: string;
  image?: string | File | null;
  className?: string;
}

// ============================================
// Hooks: Image validation and preview hook
function canDecodeImage(imageSource: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image();

    img.onload = () => resolve(img.naturalWidth > 0 && img.naturalHeight > 0);

    img.onerror = () => resolve(false);

    img.src = imageSource;
  });
}

function useBookCoverPreview(image?: string | File | null) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | undefined;

    async function loadPreview() {
      setPreviewSrc(null);

      if (!image) return;

      if (image instanceof File) {
        console.log(image.type);
        if (!IMAGE_CONFIG.ALLOWED_TYPES.has(image.type)) return;

        objectUrl = URL.createObjectURL(image);
      }

      const src = objectUrl ?? (image as string);
      const isValid = await canDecodeImage(src);

      if (!cancelled && isValid) {
        setPreviewSrc(src);
      }
    }

    void loadPreview();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [image]);

  return previewSrc;
}
// ============================================

export function BookCover({ title = 'preview', image, className }: BookCoverProps) {
  console.log(image);
  const previewSrc = useBookCoverPreview(image);

  return (
    <div
      className={cn(
        'relative aspect-2/3 shrink-0 overflow-hidden rounded-lg shadow-sm ring-1 ring-foreground/10',
        !previewSrc && 'bg-primary',
        className,
      )}
    >
      {previewSrc ? (
        <Image
          src={previewSrc}
          alt={`Cover of ${title}`}
          fill
          sizes="160px"
          unoptimized
          className="object-cover"
        />
      ) : (
        <div className="flex size-full items-end p-1">
          <span
            className="line-clamp-3 text-xs font-semibold leading-tight text-background"
            aria-label={`${title} cover placeholder`}
          >
            {title}
          </span>
        </div>
      )}
    </div>
  );
}
