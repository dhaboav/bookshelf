export type MetadataItem = {
  id: number;
  name: string;
};

export type MetadataItemTotalBook = MetadataItem & {
  totalBooks: number;
};

export type EntityType = 'author' | 'genre';
