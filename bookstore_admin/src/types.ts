import * as DataGenerator from 'data-generator-retail';

export type ThemeName = 'light' | 'dark';

export type Category = DataGenerator.Category;
export type Product = DataGenerator.Product;
export type Customer = DataGenerator.Customer;
export type Order = DataGenerator.Order;
export type Invoice = DataGenerator.Invoice;
export type Review = DataGenerator.Review;
export type BasketItem = DataGenerator.BasketItem;

// Custom types for our bookstore
export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  biography?: string;
  nationality?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt?: string;
  fullName: string;
}

export interface Book {
  id: number;
  title: string;
  isbn?: string;
  description?: string;
  price: number;
  stockQuantity: number;
  publishedDate: string;
  coverImagePath?: string;
  publisher?: string;
  numberOfPages: number;
  language?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  bookCategories?: BookCategory[];
  bookAuthors?: BookAuthor[];
  author?: Author;
}

export interface BookCategory {
  bookId: number;
  categoryId: number;
  book?: Book;
  category?: Category;
}

export interface BookAuthor {
  bookId: number;
  authorId: number;
  book?: Book;
  author?: Author;
}

declare global {
    interface Window {
        restServer: any;
    }
}
