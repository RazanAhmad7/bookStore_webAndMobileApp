using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecondAppBackend.Data;
using SecondAppBackend.Models;

namespace SecondAppBackend.Controllers
{
    /// <summary>
    /// Authors Controller - Handles CRUD operations for authors
    /// Compatible with React Admin simple REST data provider
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all authors with React Admin compatible headers
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Author>>> GetAuthors()
        {
            var authors = await _context.Authors
                .OrderBy(a => a.FirstName)
                .ThenBy(a => a.LastName)
                .ToListAsync();

            // Add Content-Range header for React Admin pagination
            var totalCount = authors.Count;
            Response.Headers.Append("Content-Range", $"authors 0-{totalCount - 1}/{totalCount}");
            Response.Headers.Append("Access-Control-Expose-Headers", "Content-Range");

            return Ok(authors);
        }

        /// <summary>
        /// Get a specific author by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Author>> GetAuthor(int id)
        {
            var author = await _context.Authors.FindAsync(id);

            if (author == null)
            {
                return NotFound();
            }

            return Ok(author);
        }

        /// <summary>
        /// Create a new author
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Author>> PostAuthor(Author author)
        {
            _context.Authors.Add(author);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAuthor", new { id = author.Id }, author);
        }

        /// <summary>
        /// Update an existing author
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAuthor(int id, Author author)
        {
            if (id != author.Id)
            {
                return BadRequest();
            }

            _context.Entry(author).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AuthorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(author);
        }

        /// <summary>
        /// Delete an author
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuthor(int id)
        {
            var author = await _context.Authors.FindAsync(id);
            if (author == null)
            {
                return NotFound();
            }

            _context.Authors.Remove(author);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AuthorExists(int id)
        {
            return _context.Authors.Any(e => e.Id == id);
        }
    }
}
