import { cn } from 'cn';

interface BookCoverProps {
  className?: string;
}

function BookCover({ className }: BookCoverProps) {
  return (
    <div
      className={cn(
        'relative aspect-2/3 w-10 shrink-0 overflow-hidden rounded-lg shadow-sm ring-1 ring-foreground/10',
        className,
      )}
    >
      <div className="flex size-full items-end p-1">
        <span
          className="line-clamp-3 text-[8px] font-semibold leading-tight text-background"
          aria-label={`test cover placeholder`}
        >
          test
        </span>
      </div>
    </div>
  );
}

export { BookCover };
