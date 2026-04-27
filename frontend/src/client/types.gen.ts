export type GenrePublic = {
  id: number;
  genre: string;
};

export type AuthorPublic = {
  id: number;
  author: string;
};

export type BookPublic = {
  id: number;
  title: string;
  author?: AuthorPublic | null;
  genre?: GenrePublic | null;
  total_pages: number;
  published_year: number;
  description?: string | null;
};

export type BookSearch = {
  q?: string;
};
