'use client';

import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Truck, ShieldCheck, Loader2 } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, runTransaction } from 'firebase/firestore';
import type { Book } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const bookRef = useMemoFirebase(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'books', params.id);
  }, [firestore, params.id]);

  const { data: book, isLoading } = useDoc<Book>(bookRef);

  const handleAddToCart = () => {
    if (!user || !firestore || !book) {
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


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!book && !isLoading) {
    notFound();
  }

  if (!book) {
    return null; 
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg">
          <Image
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            data-ai-hint={book.imageHint}
          />
        </div>
        
        <div>
          <Badge variant="secondary">{book.genre}</Badge>
          <h1 className="text-3xl md:text-4xl font-headline font-bold mt-2">{book.title}</h1>
          <p className="text-lg text-muted-foreground mt-1">by {book.author}</p>
          
          <div className="flex items-center gap-2 mt-4">
            <div className="flex text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5" />
            </div>
            <span className="text-sm text-muted-foreground">(123 reviews)</span>
          </div>

          <p className="text-3xl font-bold text-primary mt-4">${book.price.toFixed(2)}</p>

          <div className="mt-6">
            <Button size="lg" className="w-full md:w-auto" disabled={book.stockQuantity === 0} onClick={handleAddToCart}>
              {book.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            {book.stockQuantity < 10 && book.stockQuantity > 0 && (
              <p className="text-sm text-destructive mt-2">Only {book.stockQuantity} left in stock!</p>
            )}
          </div>

          <Separator className="my-8" />

          <div>
            <h2 className="text-xl font-headline font-semibold">Description</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">{book.description}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-muted-foreground" />
              <div>
                <p className="font-semibold">Free Shipping</p>
                <p className="text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-muted-foreground" />
              <div>
                <p className="font-semibold">Secure Shopping</p>
                <p className="text-muted-foreground">Your data is always safe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}