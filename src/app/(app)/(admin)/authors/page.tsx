import { DataPagination } from '@/components/pagination/data-pagination';
import { PageLimitPagination } from '@/components/pagination/page-limit-pagination';
import { addAuthor, getAuthors } from '@/db/crud/authors';

import { AuthorCreateForm } from './author-create-form';
import { DataTable } from './data-table';

interface AuthorListPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    q?: string;
  }>;
}

export const instant = false;
export default async function AuthorListPage({ searchParams }: AuthorListPageProps) {
  const { page = '1', limit = '12', q = '' } = await searchParams;
  const { metadata, data } = await getAuthors(Number(page), Number(limit), q);

  return (
    <div className="pt-5 gap-6 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <span>Author</span>
          <span>Home / Author List</span>
        </div>
        <AuthorCreateForm actionType={addAuthor} />
      </div>

      <DataTable data={data} className="h-125" />

      <div className="flex gap-2 mx-auto">
        <PageLimitPagination className="hidden lg:flex" />
        <DataPagination
          currentPage={metadata.currentPage}
          pageCount={metadata.totalPage}
          isText={false}
          className="block"
        />
      </div>
    </div>
  );
}
