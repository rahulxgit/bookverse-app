'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, orderBy, query, writeBatch } from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Loader2, MoreHorizontal, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function OrderStatusSelector({ order }: { order: Order }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (!firestore) return;

    const globalOrderRef = doc(firestore, 'orders', order.id);
    const userOrderRef = doc(firestore, 'users', order.userId, 'orders', order.id);

    const batch = writeBatch(firestore);
    batch.update(globalOrderRef, { status: newStatus });
    batch.update(userOrderRef, { status: newStatus });

    try {
      await batch.commit();
      toast({
        title: 'Order status updated',
        description: `Order #${order.id.substring(0, 7)} is now ${newStatus}.`,
      });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: error.message || 'Could not update the order status.',
      });
    }
  };

  return (
    <Select onValueChange={handleStatusChange} defaultValue={order.status}>
      <SelectTrigger className="w-[120px] h-9">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Pending">Pending</SelectItem>
        <SelectItem value="Shipped">Shipped</SelectItem>
        <SelectItem value="Delivered">Delivered</SelectItem>
        <SelectItem value="Cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function OrderTable() {
  const firestore = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);
  
  const formatDate = (timestamp: any) => {
    if (timestamp && typeof timestamp.toDate === 'function') {
      return format(timestamp.toDate(), 'PPP');
    }
    return 'N/A';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              </TableCell>
            </TableRow>
          ) : orders && orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id.substring(0, 7)}...</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <div>{order.userName}</div>
                  <div className="text-xs text-muted-foreground">{order.userEmail}</div>
                </TableCell>
                <TableCell className="text-right">${order.totalPrice.toFixed(2)}</TableCell>
                <TableCell>
                    <OrderStatusSelector order={order} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/orders/${order.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
