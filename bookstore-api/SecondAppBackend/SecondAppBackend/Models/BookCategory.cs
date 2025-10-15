using System.ComponentModel.DataAnnotations;

namespace SecondAppBackend.Models
{
    /// <summary>
    /// Junction table for many-to-many relationship between Books and Categories
    /// </summary>
    public class BookCategory
    {
        public int BookId { get; set; }
        public int CategoryId { get; set; }

        // Navigation Properties
        public virtual Book Book { get; set; } = null!;
        public virtual Category Category { get; set; } = null!;
    }
}
