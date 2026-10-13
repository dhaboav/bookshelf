'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { ArrowUpDown, DeleteIcon, EditIcon, MoreHorizontal, TrashIcon } from 'lucide-react';

import { ItemDelete } from '@/components/item/item-delete';
import { ItemForm } from '@/components/item/item-form';
import { deleteAuthor, updateAuthor } from '@/db/crud/authors';
import { InputField } from '@/shared/components/shared-form-fields';
import { Button } from '@/shared/ui/button';

import { type DataTableFeatures } from './data-table-features';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Genre = {
  id: string;
  name: string;
  totalBooks: number;
};

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Genre>();

export const columns = columnHelper.columns([
  columnHelper.accessor('id', {
    header: 'UID',
  }),
  columnHelper.accessor('name', {
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  }),
  columnHelper.accessor('totalBooks', {
    header: () => <div className="text-right">Books Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalBooks'));

      return <div className="text-right font-medium">{amount}</div>;
    },
  }),

  columnHelper.display({
    id: 'actions',
    header: () => <div className="text-right">Action</div>,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex flex-row gap-3 justify-end">
          <ItemForm
            initialData={{ name: item.name }}
            entity="author"
            action="update"
            onSubmit={(values) => updateAuthor(Number(item.id), values)}
          >
            {(form) => <InputField of={form} path="name" label="name" placeholder="Author name" />}
          </ItemForm>
          <ItemDelete id={Number(item.id)} label="Author" onDelete={deleteAuthor} />
        </div>
      );
    },
  }),
]);
