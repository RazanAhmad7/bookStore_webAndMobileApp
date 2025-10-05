using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecondAppBackend.Data;
using SecondAppBackend.Models;
using SecondAppBackend.Services;
using BCrypt.Net;

namespace SecondAppBackend.Controllers
{
    /// <summary>
    /// Step 6.1: Authentication Controller - Handles user registration and login
    /// Data Flow: Flutter App -> HTTP Requests -> Controller -> Database -> JWT Response
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;

        /// <summary>
        /// Step 6.2: Constructor - Inject dependencies for database and JWT operations
        /// Data Flow: DI Container -> Controller -> Service Layer
        /// </summary>
        public AuthController(ApplicationDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        /// <summary>
        /// Step 6.3: User Registration Endpoint
        /// Data Flow: Flutter Registration Form -> HTTP POST -> Validation -> Password Hash -> Database -> JWT Token
        /// </summary>
        /// <param name="request">Registration data from Flutter app</param>
        /// <returns>JWT token and user information</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                // Step 6.3a: Validate request data
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Step 6.3b: Check if username already exists
                // Data Flow: Request -> Database Query -> Validation
                if (await _context.Users.AnyAsync(u => u.Username == request.Username))
                {
                    return BadRequest(new { message = "Username already exists" });
                }

                // Step 6.3c: Check if email already exists
                if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                // Step 6.3d: Hash the password using BCrypt
                // SECURITY: Never store plain text passwords!
                // Data Flow: Plain Password -> BCrypt Hashing -> Secure Hash
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                // Step 6.3e: Create new user object
                var user = new User
                {
                    Username = request.Username,
                    Email = request.Email,
                    PasswordHash = passwordHash,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                // Step 6.3f: Save user to database
                // Data Flow: User Object -> Entity Framework -> SQL Server
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Step 6.3g: Generate JWT token for immediate login
                // Data Flow: User Data -> JWT Service -> Token Generation
                var token = _jwtService.GenerateToken(user);

                // Step 6.3h: Return success response with token
                // Data Flow: Token + User Data -> HTTP Response -> Flutter App
                return Ok(new AuthResponse
                {
                    Token = token,
                    User = new UserResponse
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName
                    },
                    Message = "Registration successful"
                });
            }
            catch (Exception ex)
            {
                // Step 6.3i: Handle registration errors
                return StatusCode(500, new { message = "Registration failed", error = ex.Message });
            }
        }

        /// <summary>
        /// Step 6.4: User Login Endpoint
        /// Data Flow: Flutter Login Form -> HTTP POST -> Credential Validation -> JWT Token
        /// </summary>
        /// <param name="request">Login credentials from Flutter app</param>
        /// <returns>JWT token and user information</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                // Step 6.4a: Validate request data
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Step 6.4b: Find user by username or email
                // Data Flow: Login Input -> Database Query -> User Lookup
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == request.UsernameOrEmail || u.Email == request.UsernameOrEmail);

                // Step 6.4c: Check if user exists
                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid credentials" });
                }

                // Step 6.4d: Verify password using BCrypt
                // Data Flow: Input Password -> BCrypt Verification -> Stored Hash
                if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return Unauthorized(new { message = "Invalid credentials" });
                }

                // Step 6.4e: Check if account is active
                if (!user.IsActive)
                {
                    return Unauthorized(new { message = "Account is disabled" });
                }

                // Step 6.4f: Update last login timestamp
                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                // Step 6.4g: Generate JWT token
                // Data Flow: Authenticated User -> JWT Service -> Token Generation
                var token = _jwtService.GenerateToken(user);

                // Step 6.4h: Return success response with token
                // Data Flow: Token + User Data -> HTTP Response -> Flutter App -> Secure Storage
                return Ok(new AuthResponse
                {
                    Token = token,
                    User = new UserResponse
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName
                    },
                    Message = "Login successful"
                });
            }
            catch (Exception ex)
            {
                // Step 6.4i: Handle login errors
                return StatusCode(500, new { message = "Login failed", error = ex.Message });
            }
        }

        /// <summary>
        /// Step 6.5: Token Validation Endpoint (Optional)
        /// Data Flow: Flutter App -> Token Validation -> User Data
        /// </summary>
        /// <returns>Current user information if token is valid</returns>
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                // Step 6.5a: Extract token from Authorization header
                var authHeader = Request.Headers["Authorization"].FirstOrDefault();
                if (authHeader == null || !authHeader.StartsWith("Bearer "))
                {
                    return Unauthorized(new { message = "No token provided" });
                }

                var token = authHeader.Substring("Bearer ".Length).Trim();

                // Step 6.5b: Get user ID from token
                var userId = _jwtService.GetUserIdFromToken(token);
                if (userId == null)
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                // Step 6.5c: Get user from database
                var user = await _context.Users.FindAsync(userId);
                if (user == null || !user.IsActive)
                {
                    return Unauthorized(new { message = "User not found or inactive" });
                }

                // Step 6.5d: Return user data
                return Ok(new UserResponse
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to get user data", error = ex.Message });
            }
        }
    }

    /// <summary>
    /// Step 6.6: Request/Response Models - Data Transfer Objects for API communication
    /// Data Flow: Flutter Forms -> JSON -> C# Objects -> Database Operations
    /// </summary>
    
    public class LoginRequest
    {
        public string UsernameOrEmail { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }

    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public UserResponse User { get; set; } = new UserResponse();
        public string Message { get; set; } = string.Empty;
    }

    public class UserResponse
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }
}