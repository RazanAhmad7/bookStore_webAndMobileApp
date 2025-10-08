using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using SecondAppBackend.Models;

namespace SecondAppBackend.Services
{
    /// <summary>
    /// Step 5.1: JWT Service - Handles JWT token generation and validation
    /// Data Flow: User Authentication -> JWT Generation -> Token Response -> Frontend Storage
    /// </summary>
    public class JwtService
    {
        private readonly IConfiguration _configuration;
        private readonly string _secretKey;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly int _expirationHours;

        /// <summary>
        /// Step 5.2: JWT Configuration - Load settings from appsettings.json
        /// Data Flow: Configuration -> JWT Service -> Token Generation
        /// </summary>
        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
            _secretKey = _configuration["Jwt:SecretKey"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";
            _issuer = _configuration["Jwt:Issuer"] ?? "SecondAppBackend";
            _audience = _configuration["Jwt:Audience"] ?? "SecondAppFrontend";
            _expirationHours = int.Parse(_configuration["Jwt:ExpirationHours"] ?? "24");
        }

        /// <summary>
        /// Step 5.3: Generate JWT Token - Creates a token for authenticated user
        /// Data Flow: User Login -> User Validation -> JWT Generation -> Token Response
        /// </summary>
        /// <param name="user">Authenticated user object</param>
        /// <returns>JWT token string for frontend storage</returns>
        public string GenerateToken(ApplicationUser user)
        {
            // Step 5.3a: Create security key from secret
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Step 5.3b: Define user claims (data stored in token)
            // These claims will be available in the frontend without API calls
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName ?? user.Email),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim("userId", user.Id),
                new Claim("username", user.UserName ?? user.Email),
                new Claim("firstName", user.FirstName ?? ""),
                new Claim("lastName", user.LastName ?? "")
            };

            // Step 5.3c: Create JWT token with claims and expiration
            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(_expirationHours),
                signingCredentials: credentials
            );

            // Step 5.3d: Convert token to string for transmission
            // Data Flow: Token Object -> String -> HTTP Response -> Frontend Storage
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Step 5.4: Validate JWT Token - Verifies token authenticity and extracts claims
        /// Data Flow: HTTP Request -> Token Extraction -> Validation -> User Claims
        /// </summary>
        /// <param name="token">JWT token from Authorization header</param>
        /// <returns>Claims principal with user information</returns>
        public ClaimsPrincipal? ValidateToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_secretKey);

                // Step 5.4a: Token validation parameters
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _issuer,
                    ValidateAudience = true,
                    ValidAudience = _audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                // Step 5.4b: Validate and extract claims
                var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
                return principal;
            }
            catch
            {
                // Step 5.4c: Return null for invalid tokens
                // Data Flow: Invalid Token -> Validation Failure -> Unauthorized Response
                return null;
            }
        }

        /// <summary>
        /// Step 5.5: Get User ID from Token - Extract user ID from JWT claims
        /// Data Flow: JWT Token -> Claims Extraction -> User ID -> Database Queries
        /// </summary>
        /// <param name="token">JWT token string</param>
        /// <returns>User ID or null if invalid</returns>
        public string? GetUserIdFromToken(string token)
        {
            var principal = ValidateToken(token);
            return principal?.FindFirst("userId")?.Value;
        }
    }
}