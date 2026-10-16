'use client';

import { cn } from 'cn';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

import { FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PageLimitPaginationProps {
  className?: string;
}

function PageLimitPagination({ className }: PageLimitPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentLimit = searchParams.get('limit') || '25';

  const handleValueChange = (value: string | null) => {
    if (!value) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', value);
    params.set('page', '1');

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <FieldLabel htmlFor="select-rows-per-page" className="text-sm font-medium whitespace-nowrap">
        Rows per page
      </FieldLabel>

      <Select value={currentLimit} onValueChange={handleValueChange} disabled={isPending}>
        <SelectTrigger className="w-20" id="select-rows-per-page">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start">
          <SelectGroup>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export { PageLimitPagination };
