using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SecondAppBackend.Models;

namespace SecondAppBackend.Data
{
    /// <summary>
    /// Step 3.1: Database Context - Central hub for all database operations
    /// Data Flow: Controllers → Repository Pattern → DbContext → SQL Server
    /// Now inherits from IdentityDbContext for ASP.NET Core Identity integration
    /// </summary>
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        /// <summary>
        /// Step 3.2: Users are now managed by Identity (AspNetUsers table)
        /// Data Flow: Authentication API → Identity → JWT Generation
        /// </summary>

        /// <summary>
        /// Categories DbSet - Manages book categories
        /// </summary>
        public DbSet<Category> Categories { get; set; }

        /// <summary>
        /// Authors DbSet - Manages author information
        /// </summary>
        public DbSet<Author> Authors { get; set; }

        /// <summary>
        /// Books DbSet - Manages book information and inventory
        /// </summary>
        public DbSet<Book> Books { get; set; }

        /// <summary>
        /// BookCategory DbSet - Junction table for many-to-many relationship between Books and Categories
        /// </summary>
        public DbSet<BookCategory> BookCategories { get; set; }

        /// <summary>
        /// BookAuthor DbSet - Junction table for many-to-many relationship between Books and Authors
        /// </summary>
        public DbSet<BookAuthor> BookAuthors { get; set; }

        /// <summary>
        /// Step 3.4: Database Model Configuration - Defines table structure and constraints
        /// Data Flow: Code-First Migration → Database Schema Creation
        /// </summary>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            /// <summary>
            /// Step 3.5: ApplicationUser Configuration
            /// Identity handles most configuration, we add custom properties
            /// Data Flow: Model Definition → Database Table Structure
            /// </summary>
            modelBuilder.Entity<ApplicationUser>(entity =>
            {
                // Custom properties configuration
                entity.Property(e => e.FirstName).HasMaxLength(50);
                entity.Property(e => e.LastName).HasMaxLength(50);
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt).IsRequired();
                entity.Property(e => e.IsActive).HasDefaultValue(true);
            });

            /// <summary>
            /// Step 3.6: ApplicationRole Configuration
            /// </summary>
            modelBuilder.Entity<ApplicationRole>(entity =>
            {
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).IsRequired();
            });

            // Category Entity Configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).IsRequired();
            });

            // Author Entity Configuration
            modelBuilder.Entity<Author>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Biography).HasMaxLength(1000);
                entity.Property(e => e.Nationality).HasMaxLength(100);
                entity.Property(e => e.CreatedAt).IsRequired();
            });

            // Book Entity Configuration
            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.ISBN).HasMaxLength(20);
                entity.Property(e => e.Description).HasMaxLength(2000);
                entity.Property(e => e.Price).HasColumnType("decimal(10,2)").IsRequired();
                entity.Property(e => e.StockQuantity).IsRequired();
                entity.Property(e => e.CoverImagePath).HasMaxLength(500);
                entity.Property(e => e.Publisher).HasMaxLength(100);
                entity.Property(e => e.Language).HasMaxLength(20).HasDefaultValue("English");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedAt).IsRequired();
            });

            // BookCategory Junction Table Configuration
            modelBuilder.Entity<BookCategory>(entity =>
            {
                entity.HasKey(e => new { e.BookId, e.CategoryId });

                entity.HasOne(e => e.Book)
                    .WithMany(e => e.BookCategories)
                    .HasForeignKey(e => e.BookId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Category)
                    .WithMany(e => e.BookCategories)
                    .HasForeignKey(e => e.CategoryId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // BookAuthor Junction Table Configuration
            modelBuilder.Entity<BookAuthor>(entity =>
            {
                entity.HasKey(e => new { e.BookId, e.AuthorId });

                entity.HasOne(e => e.Book)
                    .WithMany(e => e.BookAuthors)
                    .HasForeignKey(e => e.BookId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Author)
                    .WithMany(e => e.BookAuthors)
                    .HasForeignKey(e => e.AuthorId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}