'use client';

import { createColumns } from '../_table/columns';
import type { ManageItem } from '../_table/columns';
import { DataTable } from '../_table/data-table';

export function AuthorTable({ data }: { data: ManageItem[] }) {
  const columns = createColumns({ entityType: 'author' });
  return <DataTable columns={columns} data={data} />;
}
