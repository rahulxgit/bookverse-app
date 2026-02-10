'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { useAuth, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

type CartItemCardProps = {
  item: CartItem;
};

export function CartItemCard({ item }: CartItemCardProps) {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleQuantityChange = (newQuantity: number) => {
    if (!auth.currentUser || !firestore) return;
    const quantity = Math.max(1, newQuantity);
    const cartItemRef = doc(firestore, 'users', auth.currentUser.uid, 'cart', item.id);
    updateDocumentNonBlocking(cartItemRef, { quantity });
  };

  const handleRemoveItem = () => {
    if (!auth.currentUser || !firestore) return;
    const cartItemRef = doc(firestore, 'users', auth.currentUser.uid, 'cart', item.id);
    deleteDocumentNonBlocking(cartItemRef);
    toast({
      title: 'Item removed',
      description: `${item.title} has been removed from your cart.`,
    });
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="relative h-24 w-16 flex-shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover rounded-md"
            sizes="64px"
            data-ai-hint={item.imageHint}
          />
        </div>
        <div className="flex-grow grid gap-1">
          <Link href={`/books/${item.id}`} className="font-semibold hover:text-primary leading-tight">{item.title}</Link>
          <p className="text-sm text-muted-foreground">{item.author}</p>
          <p className="font-bold text-primary">${item.price.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
            className="w-16 h-9"
            aria-label="Quantity"
          />
          <Button variant="ghost" size="icon" onClick={handleRemoveItem}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}