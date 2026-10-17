'use client';

import {
  type SortingState,
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import { cn } from 'cn';
import { ArrowUpDownIcon, CheckIcon } from 'lucide-react';
import { useState } from 'react';

import { ItemDelete } from '@/components/item/item-delete';
import { ItemForm } from '@/components/item/item-form';
import { SearchBar } from '@/components/search-bar';
import { InputField } from '@/components/shared-form-fields';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteAuthor, updateAuthor } from '@/db/crud/authors';
import { AuthorWithBook } from '@/db/schemas/authors';

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});
const columnHelper = createColumnHelper<typeof features, AuthorWithBook>();

const columns = columnHelper.columns([
  columnHelper.accessor('id', {
    header: 'ID',
  }),
  columnHelper.accessor('name', {
    header: "Author's Name",
  }),
  columnHelper.accessor('totalBooks', {
    header: 'Total Books',
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const authorID = row.original.id;
      return (
        <>
          <ItemForm
            initialData={{ name: row.original.name }}
            entity="author"
            action="update"
            onSubmit={(values) => updateAuthor(authorID, values)}
          >
            {(form) => <InputField of={form} path="name" label="name" placeholder="Author name" />}
          </ItemForm>
          <ItemDelete id={authorID} label="Author" onDelete={deleteAuthor} />
        </>
      );
    },
  }),
]);

const SortOptions = [
  { label: 'Name A-Z', columnId: 'name', isDesc: false },
  { label: 'Name Z-A', columnId: 'name', isDesc: true },
  { label: 'Most Books', columnId: 'totalBooks', isDesc: true },
  { label: 'Fewest Books', columnId: 'totalBooks', isDesc: false },
] as const;

export function DataTable({ data, className }: { data: AuthorWithBook[]; className?: string }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
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
        <SearchBar />
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
