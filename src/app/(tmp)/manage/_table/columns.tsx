import { createColumnHelper } from '@tanstack/react-table';

import { ItemDeleteDialog } from '@/components/item/item-delete-dialog';
import { ItemFormDialog } from '@/components/item/item-form-dialog';
import { deleteAuthor, updateAuthor } from '@/db/crud/author';
import { deleteGenre, updateGenre } from '@/db/crud/genre';

import { DataTableFeatures } from './data-table-features';

export type ManageItem = {
  id: number;
  name: string;
  totalBooks: number;
};

const columnHelper = createColumnHelper<DataTableFeatures, ManageItem>();

export function createColumns({ entityType }: { entityType: 'author' | 'genre' }) {
  const updateAction = entityType === 'author' ? updateAuthor : updateGenre;
  const deleteAction = entityType === 'author' ? deleteAuthor : deleteGenre;
  return columnHelper.columns([
    columnHelper.accessor('id', {
      header: 'ID',
    }),
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('totalBooks', {
      header: 'Total Books',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const { id, name } = row.original;
        return (
          <div className="flex items-center gap-2">
            <ItemFormDialog
              initialData={{ name }}
              entityType={entityType}
              onSubmitAction={(values) => updateAction(id, values)}
            />

            <ItemDeleteDialog entityType={entityType} onDeleteAction={() => deleteAction(id)} />
          </div>
        );
      },
    }),
  ]);
}
