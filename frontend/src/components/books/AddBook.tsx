import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const currentYear = new Date().getFullYear();
const formSchema = z.object({
    title: z
        .string()
        .min(4, 'Title must be at least 4 characters.')
        .max(32, 'Title must be at most 32 characters.'),
    author: z
        .string()
        .min(4, 'Author must be at least 4 characters.')
        .max(32, 'Author must be at most 32 characters.'),
    genre: z
        .string()
        .min(4, 'Genre must be at least 4 characters.')
        .max(32, 'Genre must be at most 32 characters.'),
    total_pages: z.number(),
    published_year: z
        .number()
        .int('Year must be an integer')
        .min(1900, 'Year must be 1800 or later')
        .max(currentYear, 'Year cannot be in the future'),
    description: z
        .string()
        .min(20, 'Description must be at least 20 characters.')
        .max(100, 'Description must be at most 100 characters.')
        .optional()
        .or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

const AddBook = () => {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const API_URL = import.meta.env.VITE_API_URL;
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit',
        defaultValues: {
            title: '',
            author: '',
            genre: '',
            total_pages: 0,
            published_year: 2026,
            description: '',
        },
    });

    const addBookFn = async (data: FormData) => {
        const response = await fetch(`${API_URL}/books/add`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to save book');
        return response.json();
    };

    const mutation = useMutation({
        mutationFn: addBookFn,
        onSuccess: () => {
            toast.success('Successfully adding new book entry');
            form.reset();
            setIsOpen(false);
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete');
        },
    });

    const onSubmit = (data: FormData) => {
        mutation.mutate(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus />
                    Add Book
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-138 overflow-y-auto">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader className="mb-3">
                        <DialogTitle>Add a Book</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="sr-only">
                        Fill out the form below to add a new book to your library.
                    </DialogDescription>
                    <FieldGroup>
                        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Title<span className="text-red-600">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="text"
                                            placeholder="Book title"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            ></Controller>

                            <Controller
                                name="author"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Author<span className="text-red-600">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="text"
                                            placeholder="Author name"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            ></Controller>

                            <Controller
                                name="genre"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Genre<span className="text-red-600">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="text"
                                            placeholder="e.g. Fiction, Sci-Fi"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            ></Controller>

                            <Controller
                                name="total_pages"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Total Pages<span className="text-red-600">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="number"
                                            placeholder="e.g. 132"
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            ></Controller>

                            <Controller
                                name="published_year"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Year Published<span className="text-red-600">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="number"
                                            placeholder="e.g. 2026"
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            ></Controller>
                        </div>

                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                                    <Textarea
                                        {...field}
                                        id={field.name}
                                        placeholder="A short summary..."
                                        rows={8}
                                        className="h-32 overflow-y-auto"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        ></Controller>
                    </FieldGroup>

                    <DialogFooter className="mt-4 justify-start">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={mutation.isPending}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? (
                                <div className="flex flex-row items-center gap-x-1">
                                    <Spinner data-icon="inline-start" />
                                    <span>Save</span>
                                </div>
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddBook;
