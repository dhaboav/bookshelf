import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const currentYear = new Date().getFullYear();

const formSchema = z.object({
    title: z
        .string()
        .min(4, 'Book title must be at least 4 characters.')
        .max(32, 'Book title must be at most 32 characters.'),
    author: z
        .string()
        .min(4, 'Book author name must be at least 4 characters.')
        .max(32, 'Book author name must be at most 32 characters.'),
    ISBN: z
        .string()
        .min(13, 'Book isbn must be at least 13 characters.')
        .max(13, 'Book isbn must be at most 13 characters.'),
    genre: z
        .string()
        .min(4, 'Book genre must be at least 4 characters.')
        .max(32, 'Book genre must be at most 32 characters.'),
    total_pages: z.number(),
    publisher: z
        .string()
        .min(4, 'Book publisher must be at least 4 characters.')
        .max(32, 'Book publisher must be at most 32 characters.'),
    publish_year: z
        .number()
        .int('Year must be an integer')
        .min(1800, 'Year must be 1800 or later')
        .max(currentYear, 'Year cannot be in the future'),
    description: z
        .string()
        .min(20, 'Description must be at least 20 characters.')
        .max(100, 'Description must be at most 100 characters.')
        .optional(),
});

export default function AddBook() {
    const [isOpen, setIsOpen] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit',
        defaultValues: {
            title: '',
            author: '',
            ISBN: '',
            genre: '',
            total_pages: 0,
            publisher: '',
            publish_year: 0,
            description: '',
        },
    });

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            const response = await fetch(`${API_URL}/books/add`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to save book');
            toast.success('Successfully adding new book entry');
            form.reset();
            setIsOpen(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred';
            toast.error(message);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Add Book
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader className="mb-3">
                        <DialogTitle>Add a Book</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-3">
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
                                name="ISBN"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            ISBN<span className="text-red-600">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="text"
                                            placeholder="978xxxxx"
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
                                name="publisher"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Publisher<span className="text-red-600">*</span>
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="text"
                                            placeholder="Publisher name"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            ></Controller>

                            <Controller
                                name="publish_year"
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
                                    <FieldLabel htmlFor={field.name}>
                                        Description<span className="text-red-600">*</span>
                                    </FieldLabel>
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
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
