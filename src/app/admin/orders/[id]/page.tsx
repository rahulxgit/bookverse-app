'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();

  // Fetch from the top-level 'orders' collection for admin view
  const orderRef = useMemoFirebase(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'orders', params.id);
  }, [firestore, params.id]);

  const { data: order, isLoading } = useDoc<Order>(orderRef);
  
  const formatDate = (timestamp: any) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return format(timestamp.toDate(), 'PPP');
    }
    return 'N/A';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!order && !isLoading) {
    notFound();
  }

  if (!order) {
    return null; 
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <div>
                <h1 className="text-3xl font-headline font-bold">Order Details</h1>
                <p className="text-muted-foreground">Order #{order.id}</p>
            </div>
            <Button variant="outline" asChild>
                <Link href="/admin">
                    &larr; Back to Admin Panel
                </Link>
            </Button>
        </div>

        <Card>
          <CardHeader className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/50 rounded-t-lg">
            <div className="flex flex-col gap-1">
              <CardDescription>Order Date</CardDescription>
              <p className="font-semibold">{formatDate(order.createdAt)}</p>
            </div>
            <div className="flex flex-col gap-1">
              <CardDescription>Total Amount</CardDescription>
              <p className="font-semibold">${order.totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex flex-col gap-1">
              <CardDescription>Order Status</CardDescription>
              <p className="font-semibold">{order.status}</p>
            </div>
            <div className="flex flex-col gap-1">
              <CardDescription>Payment Status</CardDescription>
              <p className="font-semibold">{order.paymentStatus}</p>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <h2 className="text-xl font-headline font-semibold mb-4">Items in this order</h2>
            <div className="space-y-6">
              {order.items.map(item => (
                <div key={item.id} className="flex items-start gap-4">
                  <div className="relative h-24 w-20 flex-shrink-0">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover rounded-md" sizes="80px" data-ai-hint={item.imageHint} />
                  </div>
                  <div className="flex-grow">
                    <Link href={`/books/${item.id}`} className="font-semibold hover:text-primary leading-tight">{item.title}</Link>
                    <p className="text-sm text-muted-foreground">by {item.author}</p>
                    <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-6" />
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold mb-2">Customer</h3>
                    <div className="text-muted-foreground text-sm">
                        <p>{order.userName}</p>
                        <p>{order.userEmail}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex justify-end gap-4">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-end gap-4">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>$0.00</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-end gap-4 font-bold text-lg">
                        <span>Total</span>
                        <span>${order.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
