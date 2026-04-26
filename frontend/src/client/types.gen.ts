export type GenrePublic = {
  id: number;
  genre: string;
};

export type BookPublic = {
  id: number;
  title: string;
  author?: string | null;
  genre?: GenrePublic | null;
  total_pages: number;
  published_year: number;
  description?: string | null;
};

export type BookSearch = {
  q?: string;
};
