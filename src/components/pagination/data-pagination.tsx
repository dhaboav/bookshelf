'use client';

import { cn } from 'cn';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { PaginationProps } from './types';
import { usePagination } from './use-pagination';

interface DataPaginationProps extends PaginationProps {
  isText?: boolean;
  className?: string;
}

function DataPagination({ currentPage, pageCount, isText = true, className }: DataPaginationProps) {
  const { visiblePages, buildUrl, previousPage, nextPage } = usePagination({ currentPage, pageCount });

  return (
    <Pagination className={cn(className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={previousPage.href}
            text={isText ? 'Previous' : ''}
            aria-disabled={previousPage.isDisabled}
            className={previousPage.isDisabled ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {visiblePages.map((pageNumber) => {
          const isActive = currentPage === pageNumber;

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink href={buildUrl(pageNumber)} isActive={isActive}>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={nextPage.href}
            text={isText ? 'Next' : ''}
            aria-disabled={nextPage.isDisabled}
            className={nextPage.isDisabled ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export { DataPagination };
