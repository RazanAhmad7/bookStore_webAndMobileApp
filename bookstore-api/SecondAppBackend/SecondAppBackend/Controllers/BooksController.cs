using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecondAppBackend.Data;
using SecondAppBackend.Models;
using SecondAppBackend.Models.DTOs;
using SecondAppBackend.Services;

namespace SecondAppBackend.Controllers
{
    /// <summary>
    /// Books Controller - Handles CRUD operations for books
    /// Compatible with React Admin simple REST data provider
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly FileUploadService _fileUploadService;

        public BooksController(ApplicationDbContext context, FileUploadService fileUploadService)
        {
            _context = context;
            _fileUploadService = fileUploadService;
        }

        /// <summary>
        /// Get all books with React Admin compatible headers and filtering support
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks(
            [FromQuery] int? categoryId = null,
            [FromQuery] int? authorId = null,
            [FromQuery] decimal? price_gte = null,
            [FromQuery] decimal? price_lte = null,
            [FromQuery] int? stockQuantity_lte = null,
            [FromQuery] string? q = null)
        {
            try
            {
                // Debug logging
                Console.WriteLine($"GetBooks called with categoryId: {categoryId}");

                var query = _context.Books
                    .Include(b => b.BookAuthors)
                        .ThenInclude(ba => ba.Author)
                    .Include(b => b.BookCategories)
                        .ThenInclude(bc => bc.Category)
                    .AsQueryable();

                // Debug: Check total books before filtering
                var totalBooks = await query.CountAsync();
                Console.WriteLine($"Total books in database: {totalBooks}");

                // Handle category filtering
                if (categoryId.HasValue)
                {
                    Console.WriteLine($"Filtering by categoryId: {categoryId.Value}");

                    // Debug: Check how many books have this category
                    var booksWithCategory = await query.Where(b => b.BookCategories.Any(bc => bc.CategoryId == categoryId.Value)).CountAsync();
                    Console.WriteLine($"Books with category {categoryId.Value}: {booksWithCategory}");

                    query = query.Where(b => b.BookCategories.Any(bc => bc.CategoryId == categoryId.Value));
                }

                // Handle author filtering
                if (authorId.HasValue)
                {
                    query = query.Where(b => b.BookAuthors.Any(ba => ba.AuthorId == authorId.Value));
                }

                // Handle price range filtering
                if (price_gte.HasValue)
                {
                    query = query.Where(b => b.Price >= price_gte.Value);
                }

                if (price_lte.HasValue)
                {
                    query = query.Where(b => b.Price <= price_lte.Value);
                }

                // Handle stock filtering
                if (stockQuantity_lte.HasValue)
                {
                    query = query.Where(b => b.StockQuantity <= stockQuantity_lte.Value);
                }

                // Handle search filtering
                if (!string.IsNullOrEmpty(q))
                {
                    query = query.Where(b => b.Title.Contains(q) ||
                                           (b.Description != null && b.Description.Contains(q)));
                }

                var books = await query.OrderBy(b => b.Title).ToListAsync();

                // Debug: Log the final result
                Console.WriteLine($"Final filtered books count: {books.Count}");
                if (categoryId.HasValue && books.Count > 0)
                {
                    Console.WriteLine($"Sample book categories: {string.Join(", ", books.Take(3).Select(b => string.Join("|", b.BookCategories.Select(bc => bc.CategoryId))))}");
                }

                // Add Content-Range header for React Admin pagination
                var totalCount = books.Count;
                Response.Headers.Append("Content-Range", $"books 0-{totalCount - 1}/{totalCount}");
                Response.Headers.Append("Access-Control-Expose-Headers", "Content-Range");

                return Ok(books);
            }
            catch (Exception ex)
            {
                // Log the exception for debugging
                Console.WriteLine($"Error in GetBooks: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get a specific book by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            try
            {
                var book = await _context.Books
                    .Include(b => b.BookAuthors)
                        .ThenInclude(ba => ba.Author)
                    .Include(b => b.BookCategories)
                        .ThenInclude(bc => bc.Category)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (book == null)
                {
                    return NotFound();
                }

                return Ok(book);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetBook: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Create a new book with many-to-many relationships
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Book>> PostBook([FromForm] BookCreateDto bookDto)
        {
            try
            {
                var book = new Book
                {
                    Title = bookDto.Title,
                    ISBN = bookDto.ISBN,
                    Description = bookDto.Description,
                    Price = bookDto.Price,
                    StockQuantity = bookDto.StockQuantity,
                    PublishedDate = bookDto.PublishedDate,
                    Publisher = bookDto.Publisher,
                    NumberOfPages = bookDto.NumberOfPages,
                    Language = bookDto.Language,
                    IsActive = bookDto.IsActive,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Books.Add(book);
                await _context.SaveChangesAsync();

                // Handle file upload after getting the book ID
                if (bookDto.CoverImage != null)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/book-covers");
                    Directory.CreateDirectory(uploadsFolder);

                    var uniqueFileName = $"book_{book.Id}_{DateTime.Now:yyyyMMddHHmmss}{Path.GetExtension(bookDto.CoverImage.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await bookDto.CoverImage.CopyToAsync(fileStream);
                    }

                    book.CoverImagePath = $"/uploads/book-covers/{uniqueFileName}";
                    await _context.SaveChangesAsync();
                }

                // Add many-to-many relationships
                foreach (var categoryId in bookDto.CategoryIds)
                {
                    var bookCategory = new BookCategory
                    {
                        BookId = book.Id,
                        CategoryId = categoryId
                    };
                    _context.BookCategories.Add(bookCategory);
                }

                foreach (var authorId in bookDto.AuthorIds)
                {
                    var bookAuthor = new BookAuthor
                    {
                        BookId = book.Id,
                        AuthorId = authorId
                    };
                    _context.BookAuthors.Add(bookAuthor);
                }

                await _context.SaveChangesAsync();

                // Load related entities for response
                await _context.Entry(book)
                    .Collection(b => b.BookAuthors)
                    .LoadAsync();
                await _context.Entry(book)
                    .Collection(b => b.BookCategories)
                    .LoadAsync();

                return CreatedAtAction("GetBook", new { id = book.Id }, book);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PostBook: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Update an existing book with many-to-many relationships
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, [FromForm] BookUpdateDto bookDto)
        {
            // Remove the faulty validation - it was comparing book ID with category/author IDs
            // The book ID should match the route parameter, not the category/author IDs

            try
            {
                var book = await _context.Books
                    .Include(b => b.BookAuthors)
                    .Include(b => b.BookCategories)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (book == null)
                {
                    return NotFound();
                }

                // Update book properties
                book.Title = bookDto.Title;
                book.ISBN = bookDto.ISBN;
                book.Description = bookDto.Description;
                book.Price = bookDto.Price;
                book.StockQuantity = bookDto.StockQuantity;
                book.PublishedDate = bookDto.PublishedDate;
                book.Publisher = bookDto.Publisher;
                book.NumberOfPages = bookDto.NumberOfPages;
                book.Language = bookDto.Language;
                book.IsActive = bookDto.IsActive;
                book.UpdatedAt = DateTime.UtcNow;

                // Handle file upload
                if (bookDto.CoverImage != null)
                {
                    // Delete old image if exists
                    if (!string.IsNullOrEmpty(book.CoverImagePath))
                    {
                        var oldPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", book.CoverImagePath.TrimStart('/'));
                        if (System.IO.File.Exists(oldPath))
                        {
                            System.IO.File.Delete(oldPath);
                        }
                    }

                    // Save new image
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/book-covers");
                    Directory.CreateDirectory(uploadsFolder);

                    var uniqueFileName = $"book_{book.Id}_{DateTime.Now:yyyyMMddHHmmss}{Path.GetExtension(bookDto.CoverImage.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await bookDto.CoverImage.CopyToAsync(fileStream);
                    }

                    book.CoverImagePath = $"/uploads/book-covers/{uniqueFileName}";
                }

                // Update many-to-many relationships
                // Remove existing relationships
                _context.BookAuthors.RemoveRange(book.BookAuthors);
                _context.BookCategories.RemoveRange(book.BookCategories);

                // Add new relationships
                foreach (var categoryId in bookDto.CategoryIds)
                {
                    var bookCategory = new BookCategory
                    {
                        BookId = book.Id,
                        CategoryId = categoryId
                    };
                    _context.BookCategories.Add(bookCategory);
                }

                foreach (var authorId in bookDto.AuthorIds)
                {
                    var bookAuthor = new BookAuthor
                    {
                        BookId = book.Id,
                        AuthorId = authorId
                    };
                    _context.BookAuthors.Add(bookAuthor);
                }

                await _context.SaveChangesAsync();

                // Load related entities for response
                await _context.Entry(book)
                    .Collection(b => b.BookAuthors)
                    .LoadAsync();
                await _context.Entry(book)
                    .Collection(b => b.BookCategories)
                    .LoadAsync();

                return Ok(book);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in PutBook: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete a book
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            try
            {
                var book = await _context.Books.FindAsync(id);
                if (book == null)
                {
                    return NotFound();
                }

                // Delete associated file if exists
                if (!string.IsNullOrEmpty(book.CoverImagePath))
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", book.CoverImagePath.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                _context.Books.Remove(book);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteBook: {ex.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Debug endpoint to check BookCategory relationships
        /// </summary>
        [HttpGet("debug/relationships")]
        public async Task<ActionResult> DebugRelationships()
        {
            try
            {
                var totalBooks = await _context.Books.CountAsync();
                var totalCategories = await _context.Categories.CountAsync();
                var totalBookCategories = await _context.BookCategories.CountAsync();

                var bookCategoryRelations = await _context.BookCategories
                    .Include(bc => bc.Book)
                    .Include(bc => bc.Category)
                    .Select(bc => new
                    {
                        BookId = bc.BookId,
                        BookTitle = bc.Book.Title,
                        CategoryId = bc.CategoryId,
                        CategoryName = bc.Category.Name
                    })
                    .ToListAsync();

                return Ok(new
                {
                    totalBooks,
                    totalCategories,
                    totalBookCategories,
                    relationships = bookCategoryRelations
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Debug error", error = ex.Message });
            }
        }

        private bool BookExists(int id)
        {
            return _context.Books.Any(e => e.Id == id);
        }
    }
}
