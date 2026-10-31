'use server';

import { getAuthors } from '@/db/crud/author';
import { getGenres } from '@/db/crud/genre';

export async function getBookFormOptions() {
  const [genres, authors] = await Promise.all([getGenres(), getAuthors()]);

  return {
    genreOptions: genres.map(({ id, name }) => ({
      value: id,
      label: name,
    })),
    authorOptions: authors.map(({ id, name }) => ({
      value: id,
      label: name,
    })),
  };
}
