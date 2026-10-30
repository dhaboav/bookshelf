'use client';

import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

export function DescriptionSection({ description, className }: { description?: string; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    setIsClamped(el.scrollHeight > el.clientHeight);
  }, [description]);

  if (!description) return null;

  return (
    <div className={className}>
      <p ref={textRef} className={expanded ? 'line-clamp-none' : 'line-clamp-3'}>
        {description}
      </p>

      {isClamped && (
        <Button variant="link" onClick={() => setExpanded((prev) => !prev)} className="h-auto p-0">
          {expanded ? 'Show Less' : 'Show More'}
          <ChevronDownIcon className={expanded ? 'rotate-180' : ''} />
        </Button>
      )}
    </div>
  );
}
