import { deleteAuthor, getAuthorsWithBookCount } from '@/actions/authors';
import { ItemTable } from '@/components/item/ItemTable';

export default async function AuthorsPage() {
  const data = await getAuthorsWithBookCount();
  return <ItemTable items={data} label="Author" onDelete={deleteAuthor} />;
}
