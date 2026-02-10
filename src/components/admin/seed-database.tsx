'use client';

import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { books as seedBooks } from '@/lib/data';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SeedDatabaseCard() {
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
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Seed Database</CardTitle>
        <CardDescription>
          Populate the database with initial book data. This will overwrite existing books with the same ID.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This action populates the Firestore database with the initial set of books from the local data file. It's useful for initial setup or for resetting the demo.
          </p>
          <Button onClick={handleSeedDatabase}>
            Seed Book Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
