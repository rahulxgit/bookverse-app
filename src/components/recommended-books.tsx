'use client';

import { useState, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Book } from '@/lib/types';
import { getBookRecommendations } from '@/ai/flows/recommend-books-flow';
import { BookCard } from './book-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface RecommendedBooksProps {
  currentBook: Book;
}

export function RecommendedBooks({ currentBook }: RecommendedBooksProps) {
  const firestore = useFirestore();
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const booksCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'books');
  }, [firestore]);

  const { data: allBooks, isLoading: isBooksLoading } = useCollection<Book>(booksCollection);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!allBooks || allBooks.length === 0) {
        return;
      }
      
      // Filter out the current book from the list to recommend from
      const otherBooks = allBooks.filter(b => b.id !== currentBook.id);

      if (otherBooks.length < 3) {
          setRecommendations(otherBooks);
          setIsLoading(false);
          return;
      }

      setIsLoading(true);
      try {
        const result = await getBookRecommendations({
          bookToCompare: currentBook,
          allBooks: otherBooks,
        });
        setRecommendations(result.recommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    if (!isBooksLoading && currentBook) {
      fetchRecommendations();
    }
  }, [currentBook, allBooks, isBooksLoading]);

  if (isBooksLoading) {
    return (
        <div className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  if (recommendations.length === 0 && !isLoading) {
    return null; // Don't render the section if there are no recommendations
  }

  return (
    <div className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-headline font-bold text-center mb-8">You Might Also Like</h2>
        {isLoading ? (
            <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : (
            <Carousel
                opts={{
                    align: 'start',
                    loop: false,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {recommendations.map((book) => (
                        <CarouselItem key={book.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1 h-full">
                                <BookCard book={book} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>
        )}
      </div>
    </div>
  );
}
