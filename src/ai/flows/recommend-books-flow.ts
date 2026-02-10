'use server';
/**
 * @fileOverview Provides AI-powered book recommendations.
 *
 * - getBookRecommendations - A function that returns a list of recommended books.
 * - BookRecommendationInput - The input type for the recommendation flow.
 * - BookRecommendationOutput - The output type for the recommendation flow.
 */

import { ai } from '@/ai/genkit';
import { BookSchema } from '@/lib/schemas';
import { z } from 'zod';

export const BookRecommendationInputSchema = z.object({
  bookToCompare: BookSchema.describe('The book to base recommendations on.'),
  allBooks: z
    .array(BookSchema)
    .describe('The list of all available books in the store.'),
});
export type BookRecommendationInput = z.infer<
  typeof BookRecommendationInputSchema
>;

export const BookRecommendationOutputSchema = z.object({
  recommendations: z
    .array(BookSchema)
    .describe('An array of 3 recommended books.'),
});
export type BookRecommendationOutput = z.infer<
  typeof BookRecommendationOutputSchema
>;

export async function getBookRecommendations(
  input: BookRecommendationInput
): Promise<BookRecommendationOutput> {
  return recommendBooksFlow(input);
}

const recommendBooksPrompt = ai.definePrompt({
  name: 'recommendBooksPrompt',
  input: { schema: BookRecommendationInputSchema },
  output: { schema: BookRecommendationOutputSchema },
  prompt: `You are a helpful and knowledgeable bookstore assistant. Your goal is to help customers discover new books they might like.

Based on the details of the book provided (title, author, genre, description), recommend exactly 3 other books from the list of available books.

- Prioritize books that are similar in genre and theme.
- Do not recommend the original book itself, even if it appears in the list.
- Ensure the books you recommend are present in the provided list of all available books.
- Format your response as a JSON object that strictly adheres to the output schema.

Book to base recommendations on:
Title: {{bookToCompare.title}}
Author: {{bookToCompare.author}}
Genre: {{bookToCompare.genre}}
Description: {{bookToCompare.description}}

List of available books in the store:
{{{json allBooks}}}
`,
});

const recommendBooksFlow = ai.defineFlow(
  {
    name: 'recommendBooksFlow',
    inputSchema: BookRecommendationInputSchema,
    outputSchema: BookRecommendationOutputSchema,
  },
  async (input) => {
    const { output } = await recommendBooksPrompt(input);
    if (!output) {
      return { recommendations: [] };
    }
    // Filter out the original book just in case the AI includes it
    const filteredRecommendations = output.recommendations.filter(
      (rec) => rec.id !== input.bookToCompare.id
    );
    return { recommendations: filteredRecommendations.slice(0, 3) };
  }
);
