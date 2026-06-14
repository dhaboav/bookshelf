import { useDeleteGenre } from '@/features/genres';
import { GenericDeleteDialog } from '@/shared/ui';

import { useState } from 'react';

interface DeleteGenreProps {
  id: number;
  onSuccess: () => void;
}

export const DeleteGenre = ({ id, onSuccess }: DeleteGenreProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteGenre, isPending } = useDeleteGenre();

  const handleDelete = () => {
    deleteGenre(id, {
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
      title="Delete Genre"
      labelName="Genre"
      isPending={isPending}
      onSubmit={handleDelete}
    />
  );
};
