import { ItemTable } from '@/components/item/item-table';
import { deleteGenre, getGenres, updateGenre } from '@/db/crud/genres';
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

export default async function GenrePage({ searchParams }: Props) {
  const { page = '1', limit = '12', q = '' } = await searchParams;
  const datas = await getGenres(Number(page), Number(limit), q);

  if (datas.data.length === 0) {
    return (
      <div className="py-12">
        <NoResult query={q} placeholder="book" />
      </div>
    );
  }

  return (
    <>
      <ItemTable items={datas.data} label="Genre" updateMethod={updateGenre} deleteMethod={deleteGenre} />
      <DataPagination currentPage={datas.metadata.currentPage} pageCount={datas.metadata.totalPage} />
    </>
  );
}
