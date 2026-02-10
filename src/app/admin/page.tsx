'use client';

import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { books as seedBooks } from '@/lib/data';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSeedDatabase = async () => {
    if (!firestore) return;

    const booksCollectionRef = collection(firestore, 'books');
    const batch = writeBatch(firestore);

    seedBooks.forEach(book => {
      const docRef = doc(booksCollectionRef, book.id);
      batch.set(docRef, book);
    });

    try {
      await batch.commit();
      toast({
        title: 'Database Seeded!',
        description: 'The book data has been successfully added to Firestore.',
      });
    } catch (error: any) {
      console.error("Error seeding database:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Could not seed the database.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
       <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Admin Panel</CardTitle>
          <CardDescription>Manage your bookstore settings and data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Seed Database</h3>
              <p className="text-sm text-muted-foreground">
                Populate the Firestore database with the initial set of books from the local data file. This is useful for initial setup or for resetting the demo.
              </p>
            </div>
            <Button onClick={handleSeedDatabase}>
              Seed Book Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
