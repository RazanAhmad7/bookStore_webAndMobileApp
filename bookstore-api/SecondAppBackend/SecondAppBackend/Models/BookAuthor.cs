using System.ComponentModel.DataAnnotations;

namespace SecondAppBackend.Models
{
    /// <summary>
    /// Junction table for many-to-many relationship between Books and Authors
    /// </summary>
    public class BookAuthor
    {
        public int BookId { get; set; }
        public int AuthorId { get; set; }

        // Navigation Properties
        public virtual Book Book { get; set; } = null!;
        public virtual Author Author { get; set; } = null!;
    }
}
