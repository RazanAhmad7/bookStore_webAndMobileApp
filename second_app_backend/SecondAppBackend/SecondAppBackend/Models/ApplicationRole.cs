using Microsoft.AspNetCore.Identity;

namespace SecondAppBackend.Models
{
    /// <summary>
    /// ApplicationRole - Custom role model for bookstore roles
    /// </summary>
    public class ApplicationRole : IdentityRole
    {
        /// <summary>
        /// Role Description - Human-readable description of the role
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Created At - Track when role was created
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
