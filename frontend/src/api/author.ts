import type { AuthorPublic } from '@/client/types.gen';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { API_URL } from './common';

export const authorsQueryOptions = {
  queryKey: ['authors'],
  queryFn: async (): Promise<AuthorPublic[]> => {
    const response = await fetch(`${API_URL}/author/`);
    if (!response.ok) {
      throw new Error('Failed to fetch author from the server');
    }
    return response.json();
  },
  staleTime: 1000 * 60 * 60,
};

export const createAuthorMutation = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const fetchAPI = async (data: any) => {
    const response = await fetch(`${API_URL}/author/`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to create a new author');
    return response.json();
  };

  return useMutation({
    mutationFn: fetchAPI,
    onSuccess: () => {
      toast.success('Successfully added a new author entry');
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create');
    },
  });
};

export const editAuthorMutation = (id: number, onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const fetchAPI = async (data: any) => {
    const response = await fetch(`${API_URL}/author/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to edited author');
    return response.json();
  };

  return useMutation({
    mutationFn: fetchAPI,
    onSuccess: () => {
      toast.success('Successfully editing author entry');
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to edited');
    },
  });
};

export const deleteAuthorMutation = (id: number, onSuccess: () => void) => {
  const queryClient = useQueryClient();

  const fetchAPI = async (data: any) => {
    const response = await fetch(`${API_URL}/author/${id}`, {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to delete author');
    return response.json();
  };

  return useMutation({
    mutationFn: fetchAPI,
    onSuccess: () => {
      toast.success('The author was deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete');
    },
  });
};
