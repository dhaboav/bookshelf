import type { GenrePublic } from '@/client/types.gen';
import { API_URL } from '@/shared/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const genresQueryOptions = {
  queryKey: ['genres'],
  queryFn: async (): Promise<GenrePublic[]> => {
    const response = await fetch(`${API_URL}/genre/`);
    if (!response.ok) {
      throw new Error('Failed to fetch genres from the server');
    }
    return response.json();
  },
  staleTime: 1000 * 60 * 60,
};

export const createGenreMutation = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const fetchAPI = async (data: any) => {
    const response = await fetch(`${API_URL}/genre/`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to create a new genre');
    return response.json();
  };

  return useMutation({
    mutationFn: fetchAPI,
    onSuccess: () => {
      toast.success('Successfully added a new genre entry');
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create');
    },
  });
};

export const editGenreMutation = (id: number, onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const fetchAPI = async (data: any) => {
    const response = await fetch(`${API_URL}/genre/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to edited genre');
    return response.json();
  };

  return useMutation({
    mutationFn: fetchAPI,
    onSuccess: () => {
      toast.success('Successfully editing genre entry');
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to edited');
    },
  });
};

export const deleteGenreMutation = (id: number, onSuccess: () => void) => {
  const queryClient = useQueryClient();

  const fetchAPI = async (data: any) => {
    const response = await fetch(`${API_URL}/genre/${id}`, {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to delete genre');
    return response.json();
  };

  return useMutation({
    mutationFn: fetchAPI,
    onSuccess: () => {
      toast.success('The genre was deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['genres'] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete');
    },
  });
};
