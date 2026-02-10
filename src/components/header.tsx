import Link from 'next/link';
import { BookMarked, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <BookMarked className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">BookVerse</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-4">
          <Link href="/books" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Books
          </Link>
          {/* <Link href="/recommendations" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Recommendations
          </Link> */}
          <Link href="/admin" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Admin
          </Link>
        </nav>
        <div className="flex items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <User className="h-5 w-5" />
              <span className="sr-only">Login</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
