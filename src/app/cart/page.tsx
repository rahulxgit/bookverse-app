'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, writeBatch, doc, serverTimestamp, addDoc } from 'firebase/firestore';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { CartItem, Order } from '@/lib/types';
import { CartItemCard } from '@/components/cart-item-card';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const cartCollection = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'cart');
  }, [firestore, user]);

  const { data: cartItems, isLoading: isCartLoading } = useCollection<CartItem>(cartCollection);

  const totalPrice = cartItems?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;

  const handleCheckout = async () => {
    if (!user || !firestore || !cartItems || cartItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Cannot proceed to checkout',
        description: 'Your cart is empty or there was an issue.',
      });
      return;
    }

    const ordersCollectionRef = collection(firestore, 'users', user.uid, 'orders');
    const newOrderRef = doc(ordersCollectionRef); // Create a reference with a new ID

    const newOrder: Omit<Order, 'createdAt'> = {
        id: newOrderRef.id,
        userId: user.uid,
        items: cartItems,
        totalPrice: totalPrice,
        status: 'Pending',
        paymentStatus: 'Unpaid',
    };
    
    const newOrderWithTimestamp = {
        ...newOrder,
        createdAt: serverTimestamp()
    }

    const batch = writeBatch(firestore);
    
    batch.set(newOrderRef, newOrderWithTimestamp);

    cartItems.forEach(item => {
        const cartItemRef = doc(firestore, 'users', user.uid, 'cart', item.id);
        batch.delete(cartItemRef);
    });

    try {
        await batch.commit();
        toast({
            title: 'Order Placed!',
            description: 'Your order has been successfully placed.',
        });
        router.push(`/orders/${newOrderRef.id}`);
    } catch (error: any) {
        console.error('Checkout failed:', error);
        toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: error.message || 'Could not place your order.',
        });
    }
  };


  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user && !isUserLoading) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold">Your Shopping Cart</h1>
      </div>
      
      {isCartLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {!isCartLoading && (!cartItems || cartItems.length === 0) && (
        <Card className="text-center py-12">
          <CardHeader>
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4">Your cart is empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Looks like you haven't added any books yet.</p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/books">Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {!isCartLoading && cartItems && cartItems.length > 0 && (
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map(item => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={handleCheckout}>Proceed to Checkout</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
