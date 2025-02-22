import { z } from 'zod';

export const metadataSchema = z.object({
  totalCount: z.number(),
  currentPage: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});
