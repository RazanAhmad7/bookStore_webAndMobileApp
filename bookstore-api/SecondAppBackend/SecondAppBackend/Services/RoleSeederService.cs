using Microsoft.AspNetCore.Identity;
using SecondAppBackend.Models;

namespace SecondAppBackend.Services
{
    /// <summary>
    /// Role Seeder Service - Creates default roles for the application
    /// </summary>
    public class RoleSeederService
    {
        private readonly RoleManager<ApplicationRole> _roleManager;

        public RoleSeederService(RoleManager<ApplicationRole> roleManager)
        {
            _roleManager = roleManager;
        }

        /// <summary>
        /// Seed default roles
        /// </summary>
        public async Task SeedRolesAsync()
        {
            // Create Admin role
            if (!await _roleManager.RoleExistsAsync("Admin"))
            {
                var adminRole = new ApplicationRole
                {
                    Name = "Admin",
                    Description = "Administrator with full system access",
                    CreatedAt = DateTime.UtcNow
                };
                await _roleManager.CreateAsync(adminRole);
            }

            // Create User role
            if (!await _roleManager.RoleExistsAsync("User"))
            {
                var userRole = new ApplicationRole
                {
                    Name = "User",
                    Description = "Regular user with basic access",
                    CreatedAt = DateTime.UtcNow
                };
                await _roleManager.CreateAsync(userRole);
            }
        }
    }
}
