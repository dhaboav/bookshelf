import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Calendar,
    CircleUserRound,
    EllipsisVertical,
    ScrollText,
    SquarePen,
    Trash,
} from 'lucide-react';
import { toast } from 'sonner';

export default interface BookProps {
    id: number;
    title: string;
    author: string;
    genre: string;
    publisher?: string;
    publish_year: number;
    total_pages: number;
    description: string;
}

export default interface BookProps {
    id: number;
    onDeleteSuccess?: () => void;
}

export function BookCard(props: BookProps) {
    const API_URL = import.meta.env.VITE_API_URL;

    async function handleDelete(id: number) {
        try {
            const response = await fetch(`${API_URL}/books/delete/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to save book');
            if (props.onDeleteSuccess) {
                toast.success('Successfully deleted a book entry');
                props.onDeleteSuccess();
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            toast.error(message);
        }
    }

    return (
        <div className="flex h-36 w-full flex-row items-center overflow-hidden">
            <div className="h-full w-24 shrink-0">
                <img
                    src="/cover.jpg"
                    alt="Book cover"
                    className="h-full w-full rounded-sm object-cover"
                />
            </div>

            <div className="flex w-full flex-col justify-center overflow-hidden px-4 py-2">
                <div className="flex flex-row items-center justify-between">
                    <p className="text-primary line-clamp-1 text-xs font-semibold">
                        # {props.genre.toUpperCase()}
                    </p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs">
                                <EllipsisVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <SquarePen />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => handleDelete(props.id)}
                            >
                                <Trash />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <h3 className="truncate text-lg font-bold">{props.title}</h3>
                <p className="line-clamp-2 text-sm font-light text-gray-700">{props.description}</p>
                <div className="mt-1.5 grid grid-cols-3 items-center">
                    <div className="flex flex-row items-center gap-x-1">
                        <CircleUserRound className="w-4" />
                        <span className="text-[10px] font-semibold">{props.author}</span>
                    </div>

                    <div className="flex flex-row items-center gap-x-1">
                        <Calendar className="w-4" />
                        <span className="text-[10px] font-semibold">{props.publish_year}</span>
                    </div>

                    <div className="flex flex-row items-center gap-x-1">
                        <ScrollText className="w-4" />
                        <span className="text-[10px] font-semibold">{props.total_pages} Pages</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
