'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SeedDatabaseCard } from '@/components/admin/seed-database';
import { BookTable } from '@/components/admin/book-table';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Manage your bookstore.</p>
      </div>

      <Tabs defaultValue="books">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>
        <TabsContent value="books" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Book Inventory</CardTitle>
              <CardDescription>Manage your collection of books.</CardDescription>
            </CardHeader>
            <CardContent>
              <BookTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="database" className="mt-6">
          <SeedDatabaseCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
