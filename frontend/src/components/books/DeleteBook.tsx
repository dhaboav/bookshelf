import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface DeleteBookProps {
    id: number;
    onSuccess: () => void;
}

const DeleteBook = ({ id, onSuccess }: DeleteBookProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const { handleSubmit } = useForm();
    const API_URL = import.meta.env.VITE_API_URL;

    const deleteBookFn = async (bookId: number) => {
        const response = await fetch(`${API_URL}/books/delete/${bookId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete');
        return response.json();
    };

    const mutation = useMutation({
        mutationFn: deleteBookFn,
        onSuccess: () => {
            toast.success('The book was deleted successfully');
            setIsOpen(false);
            onSuccess();
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete');
        },
    });

    const onSubmit = () => {
        mutation.mutate(id);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => e.preventDefault()}
                onClick={() => setIsOpen(true)}
            >
                <Trash />
                Delete
            </DropdownMenuItem>

            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Delete Book</DialogTitle>
                        <DialogDescription>
                            This book will be permanently deleted. Are you sure? You will not be
                            able to undo this action.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-2 lg:mt-0">
                        <DialogClose asChild>
                            <Button variant="ghost" type="button" disabled={mutation.isPending}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button
                            className="lg:w-24"
                            variant="destructive"
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <div className="flex flex-row items-center gap-x-1">
                                    <Spinner data-icon="inline-start" />
                                    <span>Delete</span>
                                </div>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteBook;
