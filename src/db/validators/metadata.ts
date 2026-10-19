import * as v from 'valibot';

export const metaDataSchema = v.object({
  currentPage: v.number(),
  totalPage: v.number(),
  limit: v.number(),
});

export type Metadata = v.InferOutput<typeof metaDataSchema>;
