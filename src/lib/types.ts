export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  price: number;
  description: string;
  stockQuantity: number;
  imageUrl: string;
  imageHint: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Admin';
};

export type CartItem = {
  id: string; // This will be the bookId
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  quantity: number;
};

export type OrderItem = {
  bookId: string;
  quantity: number;
  price: number;
};

export type Order = {
  id:string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  orderStatus: 'Pending' | 'Shipped' | 'Delivered';
  paymentStatus: 'Paid' | 'Unpaid';
  createdAt: string;
};