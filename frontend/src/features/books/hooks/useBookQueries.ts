import { bookService } from '@/features/books/services/bookService';
import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const booksQueryOptions = queryOptions({
  queryKey: ['books'],
  queryFn: bookService.getAll,
});

export const useBooks = () => {
  return useQuery(booksQueryOptions);
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookService.create,
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
    mutationFn: bookService.update,
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
    mutationFn: bookService.delete,
    onSuccess: () => {
      toast.success('The book was deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete');
    },
  });
};
