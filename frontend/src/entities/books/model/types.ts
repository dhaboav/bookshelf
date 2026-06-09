import type { AuthorPublic } from '@/entities/authors';
import type { GenrePublic } from '@/entities/genres';

export type BookPublic = {
  id: number;
  isbn?: string | null;
  title: string;
  author?: AuthorPublic | null;
  genre?: GenrePublic | null;
  total_pages: number;
  published_year: number;
  description?: string | null;
};
