using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecondAppBackend.Models
{
    /// <summary>
    /// Book entity for storing book information with inventory tracking
    /// </summary>
    public class Book
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(20)]
        public string? ISBN { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Price { get; set; }

        [Required]
        public int StockQuantity { get; set; } = 0;

        public DateTime PublishedDate { get; set; }

        [StringLength(500)]
        public string? CoverImageUrl { get; set; }

        [StringLength(100)]
        public string? Publisher { get; set; }

        public int NumberOfPages { get; set; }

        [StringLength(20)]
        public string? Language { get; set; } = "English";

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        [Required]
        public int CategoryId { get; set; }

        [Required]
        public int AuthorId { get; set; }

        // Navigation Properties
        public virtual Category Category { get; set; } = null!;
        public virtual Author Author { get; set; } = null!;

        // Computed Properties
        public bool IsInStock => StockQuantity > 0;
        public string DisplayPrice => $"${Price:F2}";
    }
}
