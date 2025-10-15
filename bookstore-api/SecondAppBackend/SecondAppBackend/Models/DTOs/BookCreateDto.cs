using System.ComponentModel.DataAnnotations;

namespace SecondAppBackend.Models.DTOs
{
    /// <summary>
    /// DTO for creating a new book with many-to-many relationships
    /// </summary>
    public class BookCreateDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(20)]
        public string? ISBN { get; set; }

        [StringLength(2000)]
        public string? Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative")]
        public int StockQuantity { get; set; } = 0;

        public DateTime PublishedDate { get; set; }

        [StringLength(100)]
        public string? Publisher { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Number of pages must be greater than 0")]
        public int NumberOfPages { get; set; }

        [StringLength(20)]
        public string Language { get; set; } = "English";

        public bool IsActive { get; set; } = true;

        // Many-to-many relationships
        [Required]
        public List<int> CategoryIds { get; set; } = new List<int>();

        [Required]
        public List<int> AuthorIds { get; set; } = new List<int>();

        // File upload
        public IFormFile? CoverImage { get; set; }
    }
}
