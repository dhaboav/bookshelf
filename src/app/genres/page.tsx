import { deleteGenre, getGenresWithBookCount } from '@/actions/genres';
import { ItemTable } from '@/components/item/ItemTable';

export default async function GenresPage() {
  const data = await getGenresWithBookCount();
  return <ItemTable items={data} label="Genre" onDelete={deleteGenre} />;
}
