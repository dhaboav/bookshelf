import { ItemTable } from '@/components/item/ItemTable';
import { deleteAuthor, getAuthorsWithBookCount } from '@/db/crud/authors';

export default async function AuthorsPage() {
  const data = await getAuthorsWithBookCount();
  return <ItemTable items={data} label="Author" onDelete={deleteAuthor} />;
}
