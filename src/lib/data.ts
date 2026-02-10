import type { Book, User, Order } from './types';
import { PlaceHolderImages } from './placeholder-images';

const imageMap = PlaceHolderImages.reduce((acc, img) => {
  acc[img.id] = { url: img.imageUrl, hint: img.imageHint };
  return acc;
}, {} as Record<string, { url: string; hint: string }>);

export const books: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    isbn: '9780743273565',
    price: 10.99,
    description: 'The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when gin was the national drink and sex the national obsession.',
    stockQuantity: 15,
    imageUrl: imageMap['book-1']?.url || '/placeholder.svg',
    imageHint: imageMap['book-1']?.hint || 'book cover',
  },
  {
    id: '2',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Sci-Fi',
    isbn: '9780441013593',
    price: 15.99,
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness.',
    stockQuantity: 20,
    imageUrl: imageMap['book-2']?.url || '/placeholder.svg',
    imageHint: imageMap['book-2']?.hint || 'science fiction',
  },
  {
    id: '3',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    isbn: '9780618260300',
    price: 12.50,
    description: 'A reluctant hobbit, Bilbo Baggins, sets out to the Lonely Mountain with a spirited group of dwarves to reclaim their mountain home, and a dragon\'s treasure.',
    stockQuantity: 25,
    imageUrl: imageMap['book-3']?.url || '/placeholder.svg',
    imageHint: imageMap['book-3']?.hint || 'fantasy landscape',
  },
  {
    id: '4',
    title: 'And Then There Were None',
    author: 'Agatha Christie',
    genre: 'Mystery',
    isbn: '9780062073488',
    price: 9.99,
    description: 'Ten strangers are lured to an isolated island mansion off the Devon coast by a mysterious "U.N. Owen."',
    stockQuantity: 30,
    imageUrl: imageMap['book-4']?.url || '/placeholder.svg',
    imageHint: imageMap['book-4']?.hint || 'detective silhouette',
  },
  {
    id: '5',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    isbn: '9780141439518',
    price: 8.99,
    description: 'The story of the turbulent relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner.',
    stockQuantity: 18,
    imageUrl: imageMap['book-5']?.url || '/placeholder.svg',
    imageHint: imageMap['book-5']?.hint || 'couple love',
  },
  {
    id: '6',
    title: 'The Shining',
    author: 'Stephen King',
    genre: 'Horror',
    isbn: '9780385121675',
    price: 14.00,
    description: 'Jack Torrance\'s new job at the Overlook Hotel is the perfect chance for a fresh start. As the off-season caretaker at the atmospheric old hotel, he\'ll have plenty of time to spend reconnecting with his family and working on his writing.',
    stockQuantity: 0,
    imageUrl: imageMap['book-6']?.url || '/placeholder.svg',
    imageHint: imageMap['book-6']?.hint || 'haunted house',
  },
];

export const users: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Customer' },
  { id: '2', name: 'Bob Admin', email: 'admin@example.com', role: 'Admin' },
];

export const orders: Order[] = [
  {
    id: '101',
    userId: '1',
    items: [
      { bookId: '1', quantity: 1, price: 10.99 },
      { bookId: '2', quantity: 1, price: 15.99 },
    ],
    totalPrice: 26.98,
    orderStatus: 'Delivered',
    paymentStatus: 'Paid',
    createdAt: '2023-10-15T10:00:00Z',
  },
  {
    id: '102',
    userId: '1',
    items: [
      { bookId: '3', quantity: 2, price: 12.50 },
    ],
    totalPrice: 25.00,
    orderStatus: 'Shipped',
    paymentStatus: 'Paid',
    createdAt: '2023-10-28T14:30:00Z',
  },
];
