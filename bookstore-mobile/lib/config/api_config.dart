class ApiConfig {
  // Update this URL to match your ASP.NET project
  static const String baseUrl =
      'http://localhost:5070/api'; // Your ASP.NET API URL

  // Timeout settings
  static const Duration connectionTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);

  // For development/testing
  static String get currentBaseUrl => baseUrl;
}
