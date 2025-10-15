// booksService.ts - Service for managing bookstore data

import { apiService } from './apiService';

// Define TypeScript interfaces for our bookstore models
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  price: number;
  description?: string;
  coverImage?: string;
  publishedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  price: number;
  description?: string;
  coverImage?: string;
  publishedDate?: string;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  isbn?: string;
  price?: number;
  description?: string;
  coverImage?: string;
  publishedDate?: string;
}

// Books service functions
export const booksService = {
  // Get all books
  getAllBooks: async (): Promise<Book[]> => {
    return await apiService.get<Book[]>('/books');
  },

  // Get book by ID
  getBookById: async (id: number): Promise<Book> => {
    return await apiService.get<Book>(`/books/${id}`);
  },

  // Create a new book
  createBook: async (bookData: CreateBookRequest): Promise<Book> => {
    return await apiService.post<Book>('/books', bookData);
  },

  // Update book by ID
  updateBook: async (id: number, bookData: UpdateBookRequest): Promise<Book> => {
    return await apiService.put<Book>(`/books/${id}`, bookData);
  },

  // Delete book by ID
  deleteBook: async (id: number): Promise<void> => {
    await apiService.delete<void>(`/books/${id}`);
  },
};