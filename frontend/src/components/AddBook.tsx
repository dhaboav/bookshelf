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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function AddBook() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <form>
                <DialogTrigger asChild>
                    <Button>
                        <Plus />
                        Add Book
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader className="mb-3">
                        <DialogTitle>Add a Book</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-3">
                            <Field>
                                <FieldLabel htmlFor="title">
                                    Title<span className="text-red-600">*</span>
                                </FieldLabel>
                                <Input id="title" type="text" placeholder="Book title" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="author">
                                    Author<span className="text-red-600">*</span>
                                </FieldLabel>
                                <Input id="author" type="text" placeholder="Author name" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="isbn">
                                    ISBN<span className="text-red-600">*</span>
                                </FieldLabel>
                                <Input id="isbn" type="text" placeholder="978xxxxx" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="genre">
                                    Genre<span className="text-red-600">*</span>
                                </FieldLabel>
                                <Input id="genre" type="text" placeholder="e.g. Fiction, Sci-Fi" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="publisher">
                                    Publisher<span className="text-red-600">*</span>
                                </FieldLabel>
                                <Input id="publisher" type="text" placeholder="Publisher name" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="publish-year">
                                    Year Published<span className="text-red-600">*</span>
                                </FieldLabel>
                                <Input id="publish-year" type="number" placeholder="e.g. 2026" />
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <Textarea
                                id="Description"
                                placeholder="A short summary..."
                                rows={8}
                                className="h-32 overflow-y-auto"
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter className="justify-start">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
