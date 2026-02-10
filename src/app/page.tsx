import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, BrainCircuit, Search } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <>
      <section className="relative w-full h-[calc(100vh-3.5rem)] -mt-14 flex items-center justify-center text-center">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-white drop-shadow-lg">
            Welcome to BookVerse
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
            Your gateway to a universe of stories. Manage your bookstore, discover new reads, and get personalized recommendations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/books">
                Explore Books <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/register">
                Join Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-bold">Features for Every Reader & Owner</h2>
            <p className="mt-2 text-lg text-muted-foreground">Everything you need to dive into the world of books.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl pt-2">Vast Collection</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">Browse a huge library of books across all genres. Search by title, author, or ISBN to find exactly what you're looking for.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <BrainCircuit className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl pt-2">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">Our GenAI powered engine suggests your next favorite book based on your reading history and preferences.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl pt-2">Powerful Management</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">For owners, a complete suite of tools to manage inventory, users, and orders seamlessly through a robust API.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">Ready to Start Your Journey?</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're looking for your next read or to manage your bookstore, BookVerse is your partner.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/books">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
