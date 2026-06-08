import type { BookPublic } from '@/client/types.gen';
import type { BookCreateInput, BookEditInput } from '@/features/books/schemas/book.schema';
import { API_URL } from '../../../api/common';

export const bookService = {
  getAll: async (): Promise<BookPublic[]> => {
    const res = await fetch(`${API_URL}/books/`);
    if (!res.ok) throw new Error('Failed to fetch books from the server');
    return res.json();
  },

  create: async (data: BookCreateInput): Promise<BookPublic> => {
    const res = await fetch(`${API_URL}/books/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create a new book');
    return res.json();
  },

  update: async ({ id, data }: { id: number; data: BookEditInput }): Promise<BookPublic> => {
    const res = await fetch(`${API_URL}/books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to edit book');
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/books/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete book');
  },
};
