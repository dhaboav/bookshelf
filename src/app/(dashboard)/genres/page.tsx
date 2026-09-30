import { ItemTable } from '@/components/item/ItemTable';
import { deleteGenre, getGenres, updateGenre } from '@/db/crud/genres';

export default async function GenresPage() {
  const data = await getGenres();
  return <ItemTable items={data} label="Genre" updateMethod={updateGenre} deleteMethod={deleteGenre} />;
}
