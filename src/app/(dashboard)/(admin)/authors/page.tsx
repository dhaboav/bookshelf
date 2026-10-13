import { addAuthor, getAuthors } from '@/db/crud/authors';

import { columns } from './columns';
import { DataTable } from './data-table';
import { AuthorCreateForm } from './genre-form';

export default async function AuthorListPage() {
  const res = await getAuthors();

  return (
    <div className="pt-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span>Author</span>
          <span>Home / Author List</span>
        </div>
        <AuthorCreateForm actionType={addAuthor} />
      </div>
      <div className="bg-background rounded-lg px-4 pt-2 mt-6">
        <DataTable columns={columns} data={res.data as any} />
      </div>
    </div>
  );
}
