﻿using System.ComponentModel.DataAnnotations;

namespace SecondAppBackend.Models
{
    /// <summary>
    /// Step 2.1: User Model - Represents a user in our authentication system
    /// This model follows the database naming convention with plural table name (Users)
    /// and Id as primary key, as specified in project requirements
    /// </summary>
    public class User
    {
        /// <summary>
        /// Step 2.2: Primary Key - Auto-incrementing ID for each user
        /// Data Flow: Database → User Model → JWT Claims → Frontend
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Step 2.3: Username - Unique identifier for login (with unique constraint)
        /// Data Flow: Registration Form → API → Database → JWT Claims
        /// </summary>
        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Step 2.4: Email - Alternative login method (with unique constraint)
        /// Data Flow: Registration Form → Validation → Database Storage
        /// </summary>
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Step 2.5: Password Hash - Encrypted password using BCrypt
        /// Data Flow: Plain Password → BCrypt Hashing → Database Storage
        /// SECURITY: Never store plain text passwords!
        /// </summary>
        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        /// <summary>
        /// Step 2.6: Audit Fields - Track when user was created and last updated
        /// Data Flow: Auto-set during registration and updates
        /// </summary>
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Step 2.7: Optional Profile Fields - Can be extended later
        /// Data Flow: User Profile Updates → API → Database
        /// </summary>
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        
        /// <summary>
        /// Step 2.8: Account Status - For future account management features
        /// Data Flow: Admin Actions → Database → API Responses
        /// </summary>
        public bool IsActive { get; set; } = true;
    }
}