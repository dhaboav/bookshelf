import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { ItemDelete } from './ItemDelete';

interface Item {
  id: number;
  name: string;
  totalBooks: number;
}

interface Props {
  items: Item[];
  label: 'Author' | 'Genre';
  onDelete: (id: number) => Promise<void>;
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
                <span>Edit</span>
                <ItemDelete id={item.id} label={label} onDelete={onDelete} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
