import { useDeleteAuthor } from '@/features/authors';
import { GenericDeleteDialog } from '@/shared/ui';

import { useState } from 'react';

interface DeleteAuthorProps {
  id: number;
  onSuccess: () => void;
}

export const DeleteAuthor = ({ id, onSuccess }: DeleteAuthorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteAuthor, isPending } = useDeleteAuthor();

  const handleDelete = () => {
    deleteAuthor(id, {
      onSuccess: () => {
        setIsOpen(false);
        onSuccess();
      },
    });
  };

  return (
    <GenericDeleteDialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Delete Author"
      labelName="Author"
      isPending={isPending}
      onSubmit={handleDelete}
    />
  );
};
