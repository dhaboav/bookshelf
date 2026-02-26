import type { BookPublic } from '@/client';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import DeleteBook from './DeleteBook';
import EditBook from './EditBook';

interface BookActionsMenuProps {
    book: BookPublic;
}

export const BookActionsMenu = ({ book }: BookActionsMenuProps) => {
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-xs">
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <EditBook book={book} onSuccess={() => setOpen(false)} />
                <DeleteBook id={book.id} onSuccess={() => setOpen(false)} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
