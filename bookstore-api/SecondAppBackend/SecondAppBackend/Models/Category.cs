using System.ComponentModel.DataAnnotations;

namespace SecondAppBackend.Models
{
    /// <summary>
    /// Category entity for organizing books into different genres/topics
    /// </summary>
    public class Category
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties for Many-to-Many relationship
        public virtual ICollection<BookCategory> BookCategories { get; set; } = new List<BookCategory>();
    }
}
