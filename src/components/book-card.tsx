import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useUser } from '@/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!user || !firestore) {
      router.push('/login');
      return;
    }

    const cartItemRef = doc(firestore, 'users', user.uid, 'cart', book.id);
    
    runTransaction(firestore, async (transaction) => {
      const cartDoc = await transaction.get(cartItemRef);
      if (!cartDoc.exists()) {
        const cartItemData = {
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          imageUrl: book.imageUrl,
          imageHint: book.imageHint,
          quantity: 1,
        };
        transaction.set(cartItemRef, cartItemData);
      } else {
        const newQuantity = cartDoc.data().quantity + 1;
        transaction.update(cartItemRef, { quantity: newQuantity });
      }
    }).then(() => {
      toast({
        title: 'Added to cart!',
        description: `${book.title} has been added to your cart.`,
      });
    }).catch((error) => {
      console.error("Add to cart transaction failed: ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not add item to cart.",
      });
    });
  };

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
        <Button size="sm" disabled={book.stockQuantity === 0} onClick={handleAddToCart}>{book.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}</Button>
      </CardFooter>
    </Card>
  );
}