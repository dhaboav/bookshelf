import type { BookPublic } from '@/client/types.gen';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { API_URL } from './common';

export const booksQueryOptions = {
  queryKey: ['books'],
  queryFn: async (): Promise<BookPublic[]> => {
    const response = await fetch(`${API_URL}/books/`);
    if (!response.ok) {
      throw new Error('Failed to fetch books from the server');
    }
    return response.json();
  },
};

export const createBookMutation = (onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const fetchAPI = async (data: any) => {
    const response = await fetch(`${API_URL}/books/`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to create a new book');
    return response.json();
  };

  return useMutation({
    mutationFn: fetchAPI,
    onSuccess: () => {
      toast.success('Successfully added a new book entry');
      queryClient.invalidateQueries({ queryKey: ['books'] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create');
    },
  });
};

export const editBookMutation = (id: number, onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const fetchAPI = async (data: any) => {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to edited book');
    return response.json();
  };

  return useMutation({
    mutationFn: fetchAPI,
    onSuccess: () => {
      toast.success('Successfully editing book entry');
      queryClient.invalidateQueries({ queryKey: ['books'] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to edited');
    },
  });
};

export const deleteBookMutation = (id: number, onSuccess: () => void) => {
  const queryClient = useQueryClient();

  const fetchAPI = async (data: any) => {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to delete book');
    return response.json();
  };

  return useMutation({
    mutationFn: fetchAPI,
    onSuccess: () => {
      toast.success('The book was deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['books'] });
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete');
    },
  });
};
