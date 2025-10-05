using Microsoft.EntityFrameworkCore;
using SecondAppBackend.Models;

namespace SecondAppBackend.Data
{
    /// <summary>
    /// Step 3.1: Database Context - Central hub for all database operations
    /// Data Flow: Controllers → Repository Pattern → DbContext → SQL Server
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        /// <summary>
        /// Step 3.2: Users DbSet - Manages all user-related database operations
        /// Data Flow: Authentication API → Users Table → JWT Generation
        /// </summary>
        public DbSet<User> Users { get; set; }

        /// <summary>
        /// Step 3.4: Database Model Configuration - Defines table structure and constraints
        /// Data Flow: Code-First Migration → Database Schema Creation
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            /// <summary>
            /// Step 3.5: User Entity Configuration
            /// Following project specification: plural table name (Users), unique constraints
            /// Data Flow: Model Definition → Database Table Structure
            /// </summary>
            modelBuilder.Entity<User>(entity =>
            {
                // Step 3.5a: Primary Key Configuration
                entity.HasKey(e => e.Id);
                
                // Step 3.5b: Username Field - Required, max 100 chars, unique constraint
                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(100);
                    
                // Step 3.5c: Email Field - Required, max 200 chars, unique constraint
                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(200);
                    
                // Step 3.5d: Password Hash - Required field (never store plain passwords!)
                entity.Property(e => e.PasswordHash)
                    .IsRequired();
                    
                // Step 3.5e: Audit Field - Track creation time
                entity.Property(e => e.CreatedAt)
                    .IsRequired();

                // Step 3.5f: Unique Constraints - Prevent duplicate usernames and emails
                // Data Flow: Registration → Validation → Database Constraint Check
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });
        }
    }
}