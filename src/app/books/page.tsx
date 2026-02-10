'use client';

import { useMemo, useState } from 'react';
import { collection } from 'firebase/firestore';
import { Loader2, Search } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Book } from '@/lib/types';
import { BookCard } from '@/components/book-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BooksPage() {
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  const booksCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'books');
  }, [firestore]);

  const { data: books, isLoading } = useCollection<Book>(booksCollection);

  const genres = useMemo(
    () => [...new Set(books?.map((book) => book.genre) || [])],
    [books]
  );

  const filteredBooks = useMemo(() => {
    if (!books) return [];
    return books.filter((book) => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch =
        book.title.toLowerCase().includes(searchTermLower) ||
        book.author.toLowerCase().includes(searchTermLower) ||
        book.isbn.toLowerCase().includes(searchTermLower);

      const matchesGenre =
        selectedGenre === 'all' || book.genre === selectedGenre;

      return matchesSearch && matchesGenre;
    });
  }, [books, searchTerm, selectedGenre]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight">
          Explore Our Collection
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find your next adventure between the pages.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, author, or ISBN..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {!isLoading && (
        <>
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">
                No books found matching your criteria.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
