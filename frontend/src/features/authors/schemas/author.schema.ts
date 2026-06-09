import * as z from 'zod';

export const authorSchema = z.object({
  author: z
    .string()
    .min(4, 'Author name must be at least 4 characters.')
    .max(255, 'Author name must be at most 255 characters.'),
});

export type AuthorSchema = z.infer<typeof authorSchema>;
