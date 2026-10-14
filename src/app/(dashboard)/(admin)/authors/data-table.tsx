'use client';

import { createColumnHelper, tableFeatures, useTable } from '@tanstack/react-table';
import { cn } from 'cn';

import { ItemDelete } from '@/components/item/item-delete';
import { ItemForm } from '@/components/item/item-form';
import { deleteAuthor, updateAuthor } from '@/db/crud/authors';
import { AuthorWithBook } from '@/db/schemas/authors';
import { Metadata } from '@/db/schemas/common';
import { InputField } from '@/shared/components/shared-form-fields';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

const features = tableFeatures({});
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

export function DataTable({ data, className }: { data: AuthorWithBook[]; className?: string }) {
  const table = useTable({
    features,
    columns,
    data: data,
  });

  return (
    <div className={cn('bg-background p-4 rounded-lg', className)}>
      <Table>
        <TableHeader className="bg-card">
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
  );
}
