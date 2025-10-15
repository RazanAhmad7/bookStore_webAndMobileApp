using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecondAppBackend.Data;
using SecondAppBackend.Models;

namespace SecondAppBackend.Controllers
{
    /// <summary>
    /// Categories Controller - Handles CRUD operations for book categories
    /// Compatible with React Admin simple REST data provider
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all categories with React Admin compatible headers
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var categories = await _context.Categories
                .OrderBy(c => c.Name)
                .ToListAsync();

            // Add Content-Range header for React Admin pagination
            var totalCount = categories.Count;
            Response.Headers.Append("Content-Range", $"categories 0-{totalCount - 1}/{totalCount}");
            Response.Headers.Append("Access-Control-Expose-Headers", "Content-Range");

            return Ok(categories);
        }

        /// <summary>
        /// Get a specific category by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        /// <summary>
        /// Create a new category
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            category.CreatedAt = DateTime.UtcNow;
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCategory", new { id = category.Id }, category);
        }

        /// <summary>
        /// Update an existing category
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            category.UpdatedAt = DateTime.UtcNow;
            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(category);
        }

        /// <summary>
        /// Delete a category with proper cascade handling for books
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories
                .Include(c => c.BookCategories)
                .ThenInclude(bc => bc.Book)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound();
            }

            // Get all books related to this category
            var relatedBooks = category.BookCategories.Select(bc => bc.Book).ToList();

            // For each book, check if it has other categories
            foreach (var book in relatedBooks)
            {
                // Load the book with all its categories
                var bookWithCategories = await _context.Books
                    .Include(b => b.BookCategories)
                    .ThenInclude(bc => bc.Category)
                    .FirstOrDefaultAsync(b => b.Id == book.Id);

                if (bookWithCategories != null)
                {
                    // If the book has only this category, delete the book entirely
                    if (bookWithCategories.BookCategories.Count == 1)
                    {
                        _context.Books.Remove(bookWithCategories);
                    }
                    else
                    {
                        // If the book has multiple categories, just remove the relationship
                        var bookCategoryToRemove = bookWithCategories.BookCategories
                            .FirstOrDefault(bc => bc.CategoryId == id);
                        if (bookCategoryToRemove != null)
                        {
                            _context.BookCategories.Remove(bookCategoryToRemove);
                        }
                    }
                }
            }

            // Finally, remove the category
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CategoryExists(int id)
        {
            return _context.Categories.Any(e => e.Id == id);
        }
    }
}
