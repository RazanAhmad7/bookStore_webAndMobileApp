// Books.tsx - Component for displaying and managing books

import { booksService } from '../services/booksService';
import type { Book } from '../services/booksService';
import React, { useState, useEffect } from 'react';
import './Books.css';

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    price: 0,
    description: '',
  });

  // Fetch books from the API
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await booksService.getAllBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books. Please try again later.');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const book = await booksService.createBook(newBook);
      setBooks([...books, book]);
      setNewBook({ title: '', author: '', isbn: '', price: 0, description: '' });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add book. Please try again.');
      console.error('Error adding book:', err);
    }
  };

  const handleDeleteBook = async (id: number) => {
    try {
      await booksService.deleteBook(id);
      setBooks(books.filter(book => book.id !== id));
    } catch (err) {
      setError('Failed to delete book. Please try again.');
      console.error('Error deleting book:', err);
    }
  };

  if (loading) {
    return <div className="books-container">Loading books...</div>;
  }

  return (
    <div className="books-container">
      <div className="books-header">
        <h2>Book Inventory</h2>
        <button 
          className="add-book-button" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Book'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && (
        <form className="add-book-form" onSubmit={handleAddBook}>
          <h3>Add New Book</h3>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={newBook.title}
              onChange={(e) => setNewBook({...newBook, title: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="author">Author:</label>
            <input
              type="text"
              id="author"
              value={newBook.author}
              onChange={(e) => setNewBook({...newBook, author: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="isbn">ISBN:</label>
            <input
              type="text"
              id="isbn"
              value={newBook.isbn}
              onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              value={newBook.price}
              onChange={(e) => setNewBook({...newBook, price: parseFloat(e.target.value) || 0})}
              required
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={newBook.description}
              onChange={(e) => setNewBook({...newBook, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <button type="submit">Add Book</button>
        </form>
      )}

      <div className="books-grid">
        {books.map(book => (
          <div key={book.id} className="book-card">
            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="author">by {book.author}</p>
              <p className="isbn">ISBN: {book.isbn}</p>
              <p className="price">${book.price.toFixed(2)}</p>
              {book.description && (
                <p className="description">{book.description}</p>
              )}
            </div>
            <div className="book-actions">
              <button 
                className="delete-button"
                onClick={() => handleDeleteBook(book.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && !showAddForm && (
        <div className="no-books">
          <p>No books found in the inventory.</p>
          <button onClick={() => setShowAddForm(true)}>Add your first book</button>
        </div>
      )}
    </div>
  );
};

export default Books;