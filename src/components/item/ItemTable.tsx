import { UpdateAuthor } from '@/components/authors/UpdateAuthor';
import { UpdateGenre } from '@/components/genres/UpdateGenre';
import { ItemDelete } from '@/components/item/ItemDelete';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Item {
  id: number;
  name: string;
  totalBooks: number;
}

interface Props {
  items: Item[];
  label: string;
  onDelete: (id: number) => Promise<any>;
}

export const ItemTable = ({ items, label, onDelete }: Props) => {
  return (
    <Table className="mt-8">
      <TableCaption>A list of {label}s</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Books</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.totalBooks}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                {label === 'Author' ? (
                  <UpdateAuthor id={item.id} initialName={item.name} />
                ) : (
                  <UpdateGenre id={item.id} initialName={item.name} />
                )}
                <ItemDelete id={item.id} label={label} onDelete={onDelete} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
