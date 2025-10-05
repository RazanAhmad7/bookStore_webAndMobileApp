import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jwt_decoder/jwt_decoder.dart';
import '../config/api_config.dart';
import '../models/auth_models.dart';
import '../models/user.dart';
import 'secure_storage_service.dart';

/// Step 12.1: Authentication API Service - Handles all authentication-related API calls
/// Data Flow: Flutter UI -> Auth Service -> HTTP Requests -> Backend API -> Response Processing
class AuthApiService {
  /// Step 12.2: HTTP Client Configuration - Set up HTTP client with timeout
  /// Data Flow: Service Initialization -> HTTP Client Setup -> API Ready
  static final http.Client _client = http.Client();
  static const Duration _timeout = Duration(seconds: 30);

  /// Step 12.3: API Headers - Standard headers for all authentication requests
  /// Data Flow: Request Preparation -> Headers Addition -> HTTP Transmission
  static Map<String, String> get _baseHeaders => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  /// Step 12.4: Authenticated Headers - Include JWT token for protected endpoints
  /// Data Flow: Token Retrieval -> Header Construction -> Authenticated Request
  static Future<Map<String, String>> _getAuthHeaders() async {
    final token = await SecureStorageService.getToken();
    final headers = Map<String, String>.from(_baseHeaders);
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  /// Step 12.5: User Registration - Create new user account
  /// Data Flow: Registration Form -> RegisterRequest -> HTTP POST -> Backend Validation -> Account Creation
  static Future<AuthResponse> register(RegisterRequest request) async {
    try {
      // Step 12.5a: Validate request data before sending
      if (!request.isValid()) {
        throw Exception(
          'Invalid registration data: ${request.getValidationErrors().join(', ')}',
        );
      }

      // Step 12.5b: Prepare HTTP request
      final url = Uri.parse('${ApiConfig.currentBaseUrl}/Auth/register');
      final body = json.encode(request.toJson());

      print('Sending registration request to: $url');

      // Step 12.5c: Send registration request to backend
      final response = await _client
          .post(url, headers: _baseHeaders, body: body)
          .timeout(_timeout);

      print('Registration response status: ${response.statusCode}');
      print('Registration response body: ${response.body}');

      // Step 12.5d: Process response based on status code
      if (response.statusCode == 200 || response.statusCode == 201) {
        // Success: Parse response and store authentication data
        final responseData = json.decode(response.body);
        final authResponse = AuthResponse.fromJson(responseData);

        // Step 12.5e: Store token and user data for automatic login
        await SecureStorageService.storeToken(authResponse.token);
        await SecureStorageService.storeUserData(authResponse.user.toJson());

        return authResponse;
      } else {
        // Error: Parse error message from backend
        final errorData = json.decode(response.body);
        final errorMessage = errorData['message'] ?? 'Registration failed';
        throw Exception(errorMessage);
      }
    } catch (e) {
      print('Registration error: $e');
      if (e.toString().contains('SocketException') ||
          e.toString().contains('TimeoutException')) {
        throw Exception(
          'Unable to connect to server. Please check your internet connection.',
        );
      }
      rethrow;
    }
  }

  /// Step 12.6: User Login - Authenticate existing user
  /// Data Flow: Login Form -> LoginRequest -> HTTP POST -> Credential Validation -> JWT Token
  static Future<AuthResponse> login(LoginRequest request) async {
    try {
      // Step 12.6a: Validate login data
      if (!request.isValid()) {
        throw Exception('Invalid login data. Please check your credentials.');
      }

      // Step 12.6b: Prepare login request
      final url = Uri.parse('${ApiConfig.currentBaseUrl}/Auth/login');
      final body = json.encode(request.toJson());

      print('Sending login request to: $url');

      // Step 12.6c: Send login request to backend
      final response = await _client
          .post(url, headers: _baseHeaders, body: body)
          .timeout(_timeout);

      print('Login response status: ${response.statusCode}');

      // Step 12.6d: Process login response
      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        final authResponse = AuthResponse.fromJson(responseData);

        // Step 12.6e: Store authentication data for session persistence
        await SecureStorageService.storeToken(authResponse.token);
        await SecureStorageService.storeUserData(authResponse.user.toJson());

        return authResponse;
      } else {
        // Handle login failure
        final errorData = json.decode(response.body);
        final errorMessage = errorData['message'] ?? 'Login failed';
        throw Exception(errorMessage);
      }
    } catch (e) {
      print('Login error: $e');
      if (e.toString().contains('SocketException') ||
          e.toString().contains('TimeoutException')) {
        throw Exception(
          'Unable to connect to server. Please check your internet connection.',
        );
      }
      rethrow;
    }
  }

  /// Step 12.7: Get Current User - Fetch user profile using stored token
  /// Data Flow: Stored Token -> HTTP GET -> User Profile -> State Update
  static Future<User> getCurrentUser() async {
    try {
      // Step 12.7a: Check if we have a valid token
      final token = await SecureStorageService.getToken();
      if (token == null || token.isEmpty) {
        throw Exception('No authentication token found');
      }

      // Step 12.7b: Validate token expiry
      if (await SecureStorageService.isTokenExpired()) {
        throw Exception('Authentication token has expired');
      }

      // Step 12.7c: Request user profile from backend
      final url = Uri.parse('${ApiConfig.currentBaseUrl}/Auth/me');
      final headers = await _getAuthHeaders();

      final response = await _client
          .get(url, headers: headers)
          .timeout(_timeout);

      // Step 12.7d: Process user profile response
      if (response.statusCode == 200) {
        final userData = json.decode(response.body);
        final user = User.fromJson(userData);

        // Step 12.7e: Update cached user data
        await SecureStorageService.storeUserData(user.toJson());

        return user;
      } else if (response.statusCode == 401) {
        // Token is invalid, clear stored data
        await SecureStorageService.clearAuthData();
        throw Exception('Authentication expired. Please login again.');
      } else {
        throw Exception('Failed to fetch user profile');
      }
    } catch (e) {
      print('Get current user error: $e');
      rethrow;
    }
  }

  /// Step 12.8: Logout - Clear authentication and notify backend
  /// Data Flow: Logout Request -> Token Invalidation -> Local Data Cleanup -> Login Screen
  static Future<void> logout() async {
    try {
      // Step 12.8a: Optional: Notify backend about logout (if endpoint exists)
      final token = await SecureStorageService.getToken();
      if (token != null && token.isNotEmpty) {
        try {
          final url = Uri.parse('${ApiConfig.currentBaseUrl}/Auth/logout');
          final headers = await _getAuthHeaders();

          await _client
              .post(url, headers: headers)
              .timeout(Duration(seconds: 5)); // Short timeout for logout
        } catch (e) {
          // Ignore logout endpoint errors - still clear local data
          print('Backend logout notification failed: $e');
        }
      }

      // Step 12.8b: Clear all local authentication data
      await SecureStorageService.clearAuthData();
    } catch (e) {
      print('Logout error: $e');
      // Even if logout fails, clear local data
      await SecureStorageService.clearAuthData();
    }
  }

  /// Step 12.9: Validate JWT Token - Check if current token is valid
  /// Data Flow: Token Retrieval -> JWT Decode -> Expiry Check -> Validation Result
  static Future<bool> isTokenValid() async {
    try {
      final token = await SecureStorageService.getToken();
      if (token == null || token.isEmpty) return false;

      // Step 12.9a: Use JWT decoder to validate token structure and expiry
      return !JwtDecoder.isExpired(token);
    } catch (e) {
      print('Token validation error: $e');
      return false;
    }
  }

  /// Step 12.10: Get Token Claims - Extract user information from JWT
  /// Data Flow: Token Retrieval -> JWT Decode -> Claims Extraction -> User Info
  static Future<Map<String, dynamic>?> getTokenClaims() async {
    try {
      final token = await SecureStorageService.getToken();
      if (token == null || token.isEmpty) return null;

      if (JwtDecoder.isExpired(token)) return null;

      return JwtDecoder.decode(token);
    } catch (e) {
      print('Token claims extraction error: $e');
      return null;
    }
  }

  /// Step 12.11: Refresh Authentication - Check and restore authentication state
  /// Data Flow: App Start -> Token Check -> User Data Restoration -> Auto Login
  static Future<User?> refreshAuthentication() async {
    try {
      // Step 12.11a: Check if we have stored authentication data
      final isLoggedIn = await SecureStorageService.isLoggedIn();
      if (!isLoggedIn) return null;

      // Step 12.11b: Validate stored token
      if (await SecureStorageService.isTokenExpired()) {
        await SecureStorageService.clearAuthData();
        return null;
      }

      // Step 12.11c: Try to get user from cache first
      final cachedUserData = await SecureStorageService.getUserData();
      if (cachedUserData != null) {
        // Step 12.11d: Verify cached data is still valid by fetching fresh user data
        try {
          final freshUser = await getCurrentUser();
          return freshUser;
        } catch (e) {
          // If server request fails, use cached data temporarily
          print('Using cached user data due to server error: $e');
          return User.fromJson(cachedUserData);
        }
      }

      // Step 12.11e: No cached data, fetch fresh user data
      return await getCurrentUser();
    } catch (e) {
      print('Authentication refresh error: $e');
      await SecureStorageService.clearAuthData();
      return null;
    }
  }

  /// Step 12.12: Change Password - Update user password (future feature)
  /// Data Flow: Password Form -> PasswordChangeRequest -> HTTP PUT -> Password Update
  static Future<bool> changePassword(PasswordChangeRequest request) async {
    try {
      if (!request.isValid()) {
        throw Exception('Invalid password change data');
      }

      final url = Uri.parse('${ApiConfig.currentBaseUrl}/Auth/change-password');
      final headers = await _getAuthHeaders();
      final body = json.encode(request.toJson());

      final response = await _client
          .put(url, headers: headers, body: body)
          .timeout(_timeout);

      return response.statusCode == 200;
    } catch (e) {
      print('Password change error: $e');
      return false;
    }
  }

  /// Step 12.13: Cleanup - Dispose HTTP client resources
  /// Data Flow: App Shutdown -> Resource Cleanup -> Memory Management
  static void dispose() {
    _client.close();
  }
}
