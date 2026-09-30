import { ItemTable } from '@/components/item/ItemTable';
import { deleteAuthor, getAuthors, updateAuthor } from '@/db/crud/authors';

export default async function AuthorsPage() {
  const data = await getAuthors();
  return <ItemTable items={data} label="Author" updateMethod={updateAuthor} deleteMethod={deleteAuthor} />;
}
