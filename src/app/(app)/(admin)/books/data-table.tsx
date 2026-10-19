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
import Image from 'next/image';
import { useState } from 'react';

import { BookFormDialog } from '@/components/books/book-form-dialog';
import { ItemDeleteDialog } from '@/components/item/item-delete-dialog';
import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteBook, updateBook } from '@/db/crud/book';
import { Author } from '@/db/validators/author';
import { Book } from '@/db/validators/book';
import { Genre } from '@/db/validators/genre';

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});

const columnHelper = createColumnHelper<typeof features, Book>();

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
  genres: Genre[];
  authors: Author[];
  className?: string;
}

export function DataTable({ data, genres, authors, className }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'title', desc: false }]);

  const genresList = genres.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const authorsList = authors.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const columns = columnHelper.columns([
    columnHelper.accessor('title', {
      header: 'Book',
      cell: (info) => {
        const book = info.row.original;
        const imgPath = book.cover_img ? `/img-data/${book.cover_img}` : '';
        return (
          <div className="flex items-center gap-3">
            <Image
              src={imgPath || '/cover.jpg'}
              width={1000}
              height={700}
              alt={book.title || 'Book cover'}
              className="h-12 w-9 rounded object-cover shadow-sm"
            />

            <div className="font-semibold">{book.title}</div>
          </div>
        );
      },
    }),
    columnHelper.accessor('isbn', {
      header: 'ISBN',
    }),
    columnHelper.accessor('author.name', {
      header: 'Author',
    }),
    columnHelper.accessor('genre.name', {
      header: 'Genre',
    }),
    columnHelper.accessor('published_year', {
      header: 'Published Year',
    }),
    columnHelper.accessor('created_at', {
      header: 'Added',
      cell: (info) => {
        const rawDate = info.getValue();
        if (!rawDate) return <span>-</span>;

        const formattedDate = new Date(rawDate).toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

        return <span className="whitespace-nowrap text-xs font-mono">{formattedDate}</span>;
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const bookID = row.original.id;
        return (
          <div className="flex items-center gap-2">
            <BookFormDialog
              initialData={{
                isbn: row.original.isbn,
                title: row.original.title,
                cover_img: row.original.cover_img,
                published_year: row.original.published_year,
                total_pages: row.original.total_pages,
                author_id: row.original.author?.id,
                genre_id: row.original.genre?.id,
                description: row.original.description,
              }}
              authorOptions={authorsList}
              genreOptions={genresList}
              onSubmitAction={(values) => updateBook(bookID, values)}
            />
            <ItemDeleteDialog entityType="Book" onDeleteAction={() => deleteBook(bookID)} />
          </div>
        );
      },
    }),
  ]);

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
