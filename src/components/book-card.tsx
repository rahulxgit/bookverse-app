import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/books/${book.id}`} className="block relative aspect-[2/3] w-full">
          <Image
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={book.imageHint}
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <Badge variant="secondary" className="mb-2">{book.genre}</Badge>
        <CardTitle className="font-headline text-lg mb-1 leading-tight">
          <Link href={`/books/${book.id}`} className="hover:text-primary transition-colors">
            {book.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{book.author}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-lg font-bold text-primary">${book.price.toFixed(2)}</p>
        <Button size="sm" disabled={book.stockQuantity === 0}>{book.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}</Button>
      </CardFooter>
    </Card>
  );
}
