import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Link from 'next/link';
import { BookMarked } from 'lucide-react';

export const metadata: Metadata = {
  title: 'BookVerse',
  description: 'Your gateway to a universe of stories. Manage your bookstore, discover new reads, and get personalized recommendations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400..700;1,7..72,400..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background flex flex-col">
        <FirebaseClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="py-8 md:px-8 border-t bg-muted/50">
            <div className="container grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center md:text-left">
              <div className="flex items-center space-x-2 justify-center md:justify-start">
                <BookMarked className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline text-lg">BookVerse</span>
              </div>
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} BookVerse. All rights reserved.
              </p>
              <nav className="flex gap-4 text-sm text-muted-foreground justify-center md:justify-end">
                <Link href="#" className="hover:text-primary">About</Link>
                <Link href="#" className="hover:text-primary">Contact</Link>
                <Link href="#" className="hover:text-primary">Privacy Policy</Link>
              </nav>
            </div>
          </footer>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
