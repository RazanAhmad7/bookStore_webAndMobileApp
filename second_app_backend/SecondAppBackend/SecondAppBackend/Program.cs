using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SecondAppBackend.Data;
using SecondAppBackend.Models;
using SecondAppBackend.Services;

var builder = WebApplication.CreateBuilder(args);

// Step 7.1: Add services to the container
// Data Flow: Service Registration → Dependency Injection → Controller Usage

// Step 7.2: Add Entity Framework for database operations
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Step 7.3: Register JWT Service for token operations
// Data Flow: JWT Service → Token Generation/Validation → Authentication
builder.Services.AddScoped<JwtService>();

// Step 7.4: Configure JWT Authentication
// Data Flow: HTTP Request → JWT Middleware → Token Validation → User Claims
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "SecondAppBackend",
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"] ?? "SecondAppFrontend",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Step 7.5: Add Authorization services
builder.Services.AddAuthorization();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Step 7.6: Configure CORS for Flutter app communication
// Data Flow: Flutter HTTP Request → CORS Validation → API Access
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFlutterApp",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});
var app = builder.Build();

// Step 7.7: Configure the HTTP request pipeline
// Data Flow: HTTP Request → Middleware Pipeline → Controller → Response

// Step 7.7a: Enable CORS for Flutter communication
app.UseCors("AllowFlutterApp");

// Step 7.7b: Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Step 7.7c: Add Authentication & Authorization middleware
// IMPORTANT: Order matters! Authentication must come before Authorization
// Data Flow: Request → Authentication → Authorization → Controller
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Step 7.8: Database initialization
// Data Flow: Application Startup → Database Check → Ensure Database Created
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Ensure database is created
    context.Database.EnsureCreated();
}

app.Run();
