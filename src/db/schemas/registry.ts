import { authorInsertSchema, authorUpdateSchema } from './authors';
import { bookInsertSchema, bookUpdateSchema } from './books';
import { genreInsertSchema, genreUpdateSchema } from './genres';

export const schemas = {
  author: {
    create: authorInsertSchema,
    update: authorUpdateSchema,
  },
  genre: {
    create: genreInsertSchema,
    update: genreUpdateSchema,
  },
  book: {
    create: bookInsertSchema,
    update: bookUpdateSchema,
  },
};

export type EntityType = keyof typeof schemas;
export type ActionType<T extends EntityType> = keyof (typeof schemas)[T];
