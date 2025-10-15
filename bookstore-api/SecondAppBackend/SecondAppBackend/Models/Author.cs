using System.ComponentModel.DataAnnotations;

namespace SecondAppBackend.Models
{
    /// <summary>
    /// Author entity for storing author information
    /// </summary>
    public class Author
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Biography { get; set; }

        [StringLength(100)]
        public string? Nationality { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties for Many-to-Many relationship
        public virtual ICollection<BookAuthor> BookAuthors { get; set; } = new List<BookAuthor>();

        // Computed Property
        public string FullName => $"{FirstName} {LastName}";
    }
}
