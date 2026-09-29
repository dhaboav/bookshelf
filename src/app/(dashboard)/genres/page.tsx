import { ItemTable } from '@/components/item/ItemTable';
import { deleteGenre, getGenresWithBookCount } from '@/db/crud/genres';

export default async function GenresPage() {
  const data = await getGenresWithBookCount();
  return <ItemTable items={data} label="Genre" onDelete={deleteGenre} />;
}
