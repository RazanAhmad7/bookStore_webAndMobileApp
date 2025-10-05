# Flutter ASP.NET Product API Integration

This Flutter application is configured to connect with an ASP.NET Web API backend for managing products.

## Setup Instructions

### 1. Update API Configuration

The API is already configured to connect to: `http://localhost:5070/api`

If your ASP.NET API runs on a different port, edit `lib/config/api_config.dart`:

```dart
static const String baseUrl = 'http://localhost:YOUR_PORT/api';
```

### 2. ASP.NET API Requirements

Your ASP.NET API should have the following endpoints:

#### Product Management
- `GET /api/Products` - Get all products
- `POST /api/Products` - Create new product
- `PUT /api/Products/{id}` - Update product
- `DELETE /api/Products/{id}` - Delete product

### 3. Expected JSON Format

#### Product Object
```json
{
  "id": 1,
  "name": "Sample Product",
  "price": 29.99
}
```

#### API Response for GET /api/Products
```json
[
  {
    "id": 1,
    "name": "Product 1",
    "price": 29.99
  },
  {
    "id": 2,
    "name": "Product 2",
    "price": 19.99
  }
]
```

### 4. CORS Configuration

Make sure your ASP.NET API has CORS configured to allow requests from your Flutter app:

```csharp
// In Program.cs or Startup.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFlutter",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Use CORS
app.UseCors("AllowFlutter");
```

### 5. Running the Application

1. Make sure your ASP.NET API is running
2. Update the API URL in `api_config.dart`
3. Run the Flutter app: `flutter run`

## Project Structure

```
lib/
├── config/
│   └── api_config.dart          # API configuration
├── models/
│   └── product.dart            # Product data model
├── providers/
│   └── product_provider.dart   # State management
├── repositories/
│   └── product_repository.dart # Data access layer
├── screens/
│   └── product_list_screen.dart # Main UI screen
├── services/
│   └── api_service.dart        # HTTP client service
└── main.dart                   # App entry point
```

## Dependencies

- `http: ^1.1.0` - For API communication
- `provider: ^6.1.1` - State management

## Testing the Connection

1. The app will show an error message if it can't connect to your API
2. Check the debug console for detailed error messages
3. Verify your ASP.NET API is running and accessible
4. Test API endpoints manually using tools like Postman

## Troubleshooting

### Common Issues

1. **Connection refused**: Check if ASP.NET API is running on port 5070
2. **CORS errors**: Configure CORS in your ASP.NET project
3. **Wrong port**: Update the port number in `api_config.dart`
4. **JSON format errors**: Ensure your API returns the expected Product format

### Debug Tips

- Check Flutter debug console for HTTP request/response details
- Use network inspection tools in your browser/IDE
- Test API endpoints directly with curl or Postman