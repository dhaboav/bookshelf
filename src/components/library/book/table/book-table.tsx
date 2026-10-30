'use client';

import { type SortingState, useTable } from '@tanstack/react-table';
import { cn } from 'cn';
import { ArrowUpDownIcon, CheckIcon } from 'lucide-react';
import { useState } from 'react';

import { createColumns } from '@/components/library/book/table/book-columns';
import { features } from '@/components/library/table-features';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Book } from '@/db/validators/book';

const SortOptions = [
  { label: 'Name A-Z', columnId: 'title', isDesc: false },
  { label: 'Name Z-A', columnId: 'title', isDesc: true },
  { label: 'Recently Added', columnId: 'created_at', isDesc: true },
  { label: 'Oldest Added', columnId: 'created_at', isDesc: false },
  { label: 'Year (Newest)', columnId: 'published_year', isDesc: true },
  { label: 'Year (Oldest)', columnId: 'published_year', isDesc: false },
] as const;

interface DataTableProps {
  data: Book[];
  className?: string;
}

export function BookTable({ data, className }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'title', desc: false }]);
  const columns = createColumns();

  const table = useTable({
    features,
    columns,
    data: data,
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <div className={cn('bg-background p-4 rounded-lg flex flex-col h-full overflow-hidden', className)}>
      <div className="flex items-center justify-between pb-3 flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="w-full md:max-w-25">
                <ArrowUpDownIcon />
                Sort
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            {SortOptions.map((option) => {
              const isActive = sorting.some((s) => s.id === option.columnId && s.desc === option.isDesc);
              return (
                <DropdownMenuItem
                  key={option.label}
                  onClick={() => {
                    table.setSorting([{ id: option.columnId, desc: option.isDesc }]);
                  }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  {option.label}
                  {isActive && <CheckIcon className="size-4" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-auto rounded-lg min-h-0">
        <Table>
          <TableHeader className="bg-card sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
