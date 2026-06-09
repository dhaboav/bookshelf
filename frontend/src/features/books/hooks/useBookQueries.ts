import type { BookPublic } from '@/entities/books';
import type { BookCreateInput, BookEditInput } from '@/features/books/schemas/book.schema';
import { API_URL } from '@/shared/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: BookCreateInput): Promise<BookPublic> => {
      const res = await fetch(`${API_URL}/books/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create a new book');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Successfully added a new book entry');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create');
    },
  });
};

export const useEditBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: BookEditInput }): Promise<BookPublic> => {
      const res = await fetch(`${API_URL}/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to edit book');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Successfully editing book entry');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to edited');
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const res = await fetch(`${API_URL}/books/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete book');
    },
    onSuccess: () => {
      toast.success('The book was deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete');
    },
  });
};
