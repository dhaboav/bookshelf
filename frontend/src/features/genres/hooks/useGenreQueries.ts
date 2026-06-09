import type { GenrePublic } from '@/entities/genres';
import { API_URL } from '@/shared/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { GenreSchema } from '../schemas/genre.schema';

export const useCreateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GenreSchema): Promise<GenrePublic> => {
      const res = await fetch(`${API_URL}/genre/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create a new genre');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Successfully added a new genre entry');
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create');
    },
  });
};

export const useUpdateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: GenreSchema }): Promise<GenrePublic> => {
      const res = await fetch(`${API_URL}/genre/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to updated genre');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Successfully updating genre entry');
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to updated');
    },
  });
};

export const useDeleteGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      const res = await fetch(`${API_URL}/genre/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete genre');
    },
    onSuccess: () => {
      toast.success('The genre was deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['genres'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete');
    },
  });
};
