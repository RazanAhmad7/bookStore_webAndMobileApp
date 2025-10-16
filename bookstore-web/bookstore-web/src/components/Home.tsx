import React, { useState } from "react";
import "./Home.css";

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  rating: number;
  isNew?: boolean;
  isBestseller?: boolean;
}

interface Category {
  id: number;
  name: string;
  image: string;
  bookCount: number;
}

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5000); // 5 seconds in milliseconds

  // Slider data
  const sliderData = [
    {
      title: "Atomic Habits",
      author: "James Clear",
      description:
        "Tiny changes, remarkable results — a practical guide to build good habits, break bad ones, and transform your life by focusing on incremental improvements.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/0/06/Atomic_habits.jpg",
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description:
        "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of Nick Carraway and his mysterious neighbor Jay Gatsby.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=300&fit=crop",
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      description:
        "A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch as her father defends a black man falsely accused of rape.",
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=300&fit=crop",
    },
    {
      title: "1984",
      author: "George Orwell",
      description:
        "A dystopian social science fiction novel that explores themes of totalitarianism, surveillance, and the manipulation of truth in a world where independent thinking is a crime.",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=300&fit=crop",
    },
  ];

  // Temporary data - will be replaced with API calls later
  const bestSellers: Book[] = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 12.99,
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      rating: 4.5,
      isBestseller: true,
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      rating: 4.8,
      isBestseller: true,
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      price: 13.99,
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      rating: 4.7,
      isBestseller: true,
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 11.99,
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
      rating: 4.6,
      isBestseller: true,
    },
  ];

  const newArrivals: Book[] = [
    {
      id: 5,
      title: "The Midnight Library",
      author: "Matt Haig",
      price: 15.99,
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop",
      rating: 4.4,
      isNew: true,
    },
    {
      id: 6,
      title: "Project Hail Mary",
      author: "Andy Weir",
      price: 16.99,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      rating: 4.9,
      isNew: true,
    },
    {
      id: 7,
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      rating: 4.3,
      isNew: true,
    },
    {
      id: 8,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      price: 17.99,
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
      rating: 4.2,
      isNew: true,
    },
  ];

  const categories: Category[] = [
    {
      id: 1,
      name: "Fiction",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      bookCount: 245,
    },
    {
      id: 2,
      name: "Mystery",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      bookCount: 189,
    },
    {
      id: 3,
      name: "Romance",
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop",
      bookCount: 156,
    },
    {
      id: 4,
      name: "Science Fiction",
      image:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      bookCount: 134,
    },
    {
      id: 5,
      name: "Biography",
      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
      bookCount: 98,
    },
    {
      id: 6,
      name: "History",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      bookCount: 112,
    },
  ];

  // Slider navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderData.length) % sliderData.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play functionality with hover pause
  React.useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 50) {
            nextSlide();
            return 5000; // Reset to 5 seconds
          }
          return prev - 50; // Decrease by 50ms every interval
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  // Progress bar animation synchronized with timer
  React.useEffect(() => {
    if (!isHovered) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 1; // 100% over 5 seconds (1% every 50ms)
        });
      }, 50);

      return () => clearInterval(progressInterval);
    }
  }, [isHovered]);

  // Reset timer and progress when slide changes
  React.useEffect(() => {
    setTimeRemaining(5000);
    setProgress(0);
  }, [currentSlide]);

  // Handle hover events
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <span className="brand-name">Rozana</span>
          </div>

          <div className="navbar-menu">
            <a href="#home" className="nav-link active">
              Home
            </a>
            <a href="#arabic" className="nav-link">
              Arabic
            </a>
            <a href="#fiction" className="nav-link">
              Fiction
            </a>
            <a href="#nonfiction" className="nav-link">
              Nonfiction
            </a>
            <a href="#children" className="nav-link">
              Children
            </a>
            <a href="#young-adult" className="nav-link">
              Young Adult
            </a>
            <a href="#toys" className="nav-link">
              Toys & Accessories
            </a>
          </div>

          <div className="navbar-actions">
            <button className="action-btn" title="Wishlist">
              <span className="material-icons">favorite_border</span>
              <span className="badge">0</span>
            </button>
            <button className="action-btn" title="Account">
              <span className="material-icons">account_circle</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Search Bar Section */}
      <div className="search-section">
        <div className="search-section-content">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Rozana BookStore</span>
          </div>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Search by keywords, title, author or ISBN"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <span className="material-icons">search</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Hero Slider Section */}
      <section className="hero-slider-section">
        <div className="slider-container">
          <div
            className="slider-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className="slider-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {sliderData.map((slide, index) => (
                <div
                  key={index}
                  className={`slide ${index === currentSlide ? "active" : ""}`}
                >
                  <div className="slide-content">
                    <div className="slide-left">
                      <h2 className="slide-title" style={{ paddingLeft: "2rem" }}>{slide.title}</h2>
                      <p className="slide-author" style={{ paddingLeft: "2rem" }}>By {slide.author}</p>
                    </div>

                    <div className="slide-center">
                      <div className="book-cover">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="book-cover-image"
                        />
                      </div>
                    </div>

                    <div className="slide-right">
                      <p className="slide-description">{slide.description}</p>
                      <button className="slide-cta">Order it NOW</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              className="slider-arrow slider-arrow-left"
              onClick={prevSlide}
            >
              <span className="material-icons">chevron_left</span>
            </button>
            <button
              className="slider-arrow slider-arrow-right"
              onClick={nextSlide}
            >
              <span className="material-icons">chevron_right</span>
            </button>

            {/* Navigation Dots */}
            <div className="slider-dots">
              {sliderData.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="slider-progress">
              <div
                className="slider-progress-bar"
                style={{
                  width: `${progress}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="section bestsellers-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Best Sellers</h2>
            <p className="section-subtitle">Discover our most popular books</p>
          </div>
          <div className="books-grid">
            {bestSellers.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-image-container">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="book-image"
                  />
                  {book.isBestseller && (
                    <div className="book-badge bestseller">Bestseller</div>
                  )}
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${
                            i < Math.floor(book.rating) ? "filled" : ""
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-text">({book.rating})</span>
                  </div>
                  <div className="book-price">${book.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="section new-arrivals-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-subtitle">
              Fresh books just added to our collection
            </p>
          </div>
          <div className="books-grid">
            {newArrivals.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-image-container">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="book-image"
                  />
                  {book.isNew && <div className="book-badge new">New</div>}
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${
                            i < Math.floor(book.rating) ? "filled" : ""
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-text">({book.rating})</span>
                  </div>
                  <div className="book-price">${book.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Categories</h2>
            <p className="section-subtitle">
              Browse books by your favorite genres
            </p>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card">
                <div className="category-image-container">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                  />
                  <div className="category-overlay">
                    <span className="category-count">
                      {category.bookCount} Books
                    </span>
                  </div>
                </div>
                <h3 className="category-name">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Stay Updated</h2>
            <p className="newsletter-subtitle">
              Subscribe to our newsletter and be the first to know about new
              releases, special offers, and exclusive deals.
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-brand">
                <span className="book-icon material-icons">menu_book</span>
                <span className="brand-name">Rozana</span>
              </div>
              <p className="footer-description">
                Your trusted bookstore for quality books and exceptional reading
                experiences. Discover, explore, and enjoy the world of
                literature with us.
              </p>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#categories">Categories</a>
                </li>
                <li>
                  <a href="#bestsellers">Best Sellers</a>
                </li>
                <li>
                  <a href="#new-arrivals">New Arrivals</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Customer Service</h3>
              <ul className="footer-links">
                <li>
                  <a href="#contact">Contact Us</a>
                </li>
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="#shipping">Shipping Info</a>
                </li>
                <li>
                  <a href="#returns">Returns</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-title">Connect With Us</h3>
              <div className="social-links">
                <a href="#" className="social-link">
                  <span className="material-icons">facebook</span>
                </a>
                <a href="#" className="social-link">
                  <span className="material-icons">twitter</span>
                </a>
                <a href="#" className="social-link">
                  <span className="material-icons">instagram</span>
                </a>
                <a href="#" className="social-link">
                  <span className="material-icons">email</span>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 Rozana Bookstore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
