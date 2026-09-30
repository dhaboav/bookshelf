import { authorUpdateSchema } from './authors';
import { genreUpdateSchema } from './genres';

export const schemas = {
  author: authorUpdateSchema,
  genre: genreUpdateSchema,
};

export type SchemaType = keyof typeof schemas;
