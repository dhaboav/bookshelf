import * as z from 'zod';

const currentYear = new Date().getFullYear();

export const bookBaseSchema = z.object({
  title: z
    .string()
    .min(4, 'Title must be at least 4 characters.')
    .max(255, 'Title must be at most 255 characters.'),
  author_id: z.number(),
  genre_id: z.number(),
  total_pages: z.number(),
  published_year: z
    .number()
    .int('Year must be an integer.')
    .min(2000, 'Year must be 2000 or later.')
    .max(currentYear, 'Year cant more than present year.'),
  description: z
    .string()
    .max(255, 'Description must be at most 255 characters.')
    .optional()
    .or(z.literal('')),
});

export const editBookSchema = bookBaseSchema.extend({
  author_id: z.number().optional(),
  genre_id: z.number().optional(),
});

export type BookCreateInput = z.infer<typeof bookBaseSchema>;
export type BookEditInput = z.infer<typeof editBookSchema>;
