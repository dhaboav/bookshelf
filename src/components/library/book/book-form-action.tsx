'use server';

import { getAllAuthors } from '@/db/crud/author';
import { getAllGenres } from '@/db/crud/genre';

export async function getBookFormOptions() {
  const [genres, authors] = await Promise.all([getAllGenres(), getAllAuthors()]);

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
