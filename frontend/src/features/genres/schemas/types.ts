import * as z from 'zod';

export const genreBaseSchema = z.object({
  genre: z
    .string()
    .min(4, 'Genre name must be at least 4 characters.')
    .max(255, 'Genre name must be at most 255 characters.'),
});

export type GenreSchema = z.infer<typeof genreBaseSchema>;
