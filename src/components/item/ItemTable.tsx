'use client';

import { ItemDelete } from '@/components/item/ItemDelete';
import { EntityType } from '@/db/schema/registry';
import { InputField } from '@/ui/shared-form-fields';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';

import { ItemUpdate } from './ItemUpdate';

interface Item {
  id: number;
  name: string;
  totalBooks: number;
}

interface Props {
  items: Item[];
  label: string;

  updateMethod: any;
  deleteMethod: any;
}

function ItemTable({ items, label, updateMethod, deleteMethod }: Props) {
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
            <TableCell className="flex justify-end gap-2">
              <ItemUpdate
                id={item.id}
                label={label}
                initialData={{ name: item.name }}
                entity={label.toLowerCase() as EntityType}
                action="update"
                onUpdate={updateMethod}
              >
                {(form) => <InputField of={form} path="name" label="name" placeholder={`${label} name`} />}
              </ItemUpdate>
              <ItemDelete id={item.id} label={label.toLowerCase()} onDelete={deleteMethod} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export { ItemTable };
