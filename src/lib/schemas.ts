import { z } from 'zod';

export const BookSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  isbn: z.string(),
  price: z.number(),
  description: z.string(),
  stockQuantity: z.number(),
  imageUrl: z.string().url(),
  imageHint: z.string(),
});
