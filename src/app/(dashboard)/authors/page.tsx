import { ItemTable } from '@/components/item/item-table';
import { deleteAuthor, getAuthors, updateAuthor } from '@/db/crud/authors';
import { NoResult } from '@/shared/components/no-result';
import { DataPagination } from '@/shared/components/pagination/data-pagination';

export const instant = false;
interface Props {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    q?: string;
  }>;
}

export default async function AuthorPage({ searchParams }: Props) {
  const { page = '1', limit = '12', q = '' } = await searchParams;
  const datas = await getAuthors(Number(page), Number(limit), q);

  if (datas.data.length === 0) {
    return (
      <div className="py-12">
        <NoResult query={q} placeholder="book" />
      </div>
    );
  }

  return (
    <>
      <ItemTable items={datas.data} label="Genre" updateMethod={updateAuthor} deleteMethod={deleteAuthor} />
      <DataPagination currentPage={datas.metadata.currentPage} pageCount={datas.metadata.totalPage} />
    </>
  );
}
