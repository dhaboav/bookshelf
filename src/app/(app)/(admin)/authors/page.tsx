import { ItemFormDialog } from '@/components/item/item-form-dialog';
import { PageHeader } from '@/components/page-header';
import { DataPagination } from '@/components/pagination/data-pagination';
import { PageLimitPagination } from '@/components/pagination/page-limit-pagination';
import { addAuthor, getAuthors } from '@/db/crud/authors';

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
      <PageHeader
        title="Authors"
        description="Manage your author list."
        action={<ItemFormDialog entityType="author" onSubmitAction={addAuthor} />}
      />

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
