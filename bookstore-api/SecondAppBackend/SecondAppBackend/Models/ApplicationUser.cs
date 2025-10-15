using Microsoft.AspNetCore.Identity;

namespace SecondAppBackend.Models
{
    /// <summary>
    /// ApplicationUser - Extends IdentityUser for custom user properties
    /// This integrates with ASP.NET Core Identity while maintaining JWT compatibility
    /// </summary>
    public class ApplicationUser : IdentityUser
    {
        /// <summary>
        /// First Name - Optional user profile field
        /// </summary>
        public string? FirstName { get; set; }

        /// <summary>
        /// Last Name - Optional user profile field
        /// </summary>
        public string? LastName { get; set; }

        /// <summary>
        /// Account Status - For account management
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Created At - Track when user was created
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Updated At - Track when user was last updated
        /// </summary>
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Full Name - Computed property for display
        /// </summary>
        public string FullName => $"{FirstName} {LastName}".Trim();
    }
}
