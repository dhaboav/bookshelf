import type { AuthorPublic } from '@/entities/authors';
import { API_URL } from '@/shared/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AuthorSchema } from '../schemas/author.schema';

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AuthorSchema): Promise<AuthorPublic> => {
      const res = await fetch(`${API_URL}/author/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create a new author');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Successfully added a new author entry');
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create');
    },
  });
};

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: AuthorSchema }): Promise<AuthorPublic> => {
      const res = await fetch(`${API_URL}/author/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to updated author');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Successfully updating author entry');
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to updated');
    },
  });
};

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const res = await fetch(`${API_URL}/author/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete book');
    },
    onSuccess: () => {
      toast.success('The author was deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete');
    },
  });
};
