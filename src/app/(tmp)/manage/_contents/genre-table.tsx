'use client';

import { createColumns } from '../_table/columns';
import type { ManageItem } from '../_table/columns';
import { DataTable } from '../_table/data-table';

export function GenreTable({ data }: { data: ManageItem[] }) {
  const columns = createColumns({ entityType: 'genre' });
  return <DataTable columns={columns} data={data} />;
}
