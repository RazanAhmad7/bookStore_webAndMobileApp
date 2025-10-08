import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../models/auth_models.dart';
import '../services/auth_api_service.dart';
import '../services/secure_storage_service.dart';

/// Step 13.1: Authentication Provider - Central state management for user authentication
/// Data Flow: UI Actions -> Provider Methods -> API Calls -> State Updates -> UI Rebuilds
class AuthProvider extends ChangeNotifier {
  /// Step 13.2: Private State Variables - Internal authentication state
  /// Data Flow: State Changes -> notifyListeners() -> Consumer Widgets Rebuild
  User? _currentUser;
  bool _isAuthenticated = false;
  bool _isLoading = false;
  String? _errorMessage;
  bool _isInitialized = false;

  /// Step 13.3: Public Getters - Expose state to UI components
  /// Data Flow: Provider State -> Getter Methods -> UI Widget Access
  User? get currentUser => _currentUser;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isInitialized => _isInitialized;

  /// Step 13.4: User Display Properties - Convenient access to user info
  /// Data Flow: User Object -> Computed Properties -> UI Display
  String get userName => _currentUser?.username ?? '';
  String get userEmail => _currentUser?.email ?? '';
  String get userDisplayName => _currentUser?.displayName ?? '';
  String get userInitials => _currentUser?.initials ?? '';
  bool get hasUser => _currentUser != null;

  /// Step 13.5: Initialize Authentication - Check existing authentication on app start
  /// Data Flow: App Launch -> Storage Check -> Token Validation -> Auto Login
  Future<void> initializeAuth() async {
    if (_isInitialized) return;

    _setLoading(true);
    _clearError();

    try {
      print('Initializing authentication...');

      // Step 13.5a: Check if user was previously logged in
      final hasStoredAuth = await SecureStorageService.isLoggedIn();

      if (hasStoredAuth) {
        print('Found stored authentication, validating...');

        // Step 13.5b: Validate stored token and refresh user data
        final user = await AuthApiService.refreshAuthentication();

        if (user != null) {
          // Step 13.5c: Authentication is valid, restore user session
          _currentUser = user;
          _isAuthenticated = true;
          print('Authentication restored for user: ${user.username}');
        } else {
          // Step 13.5d: Stored authentication is invalid, clear data
          print('Stored authentication is invalid, clearing...');
          await _clearAuthenticationData();
        }
      } else {
        print('No stored authentication found');
      }
    } catch (e) {
      print('Authentication initialization error: $e');
      await _clearAuthenticationData();
      _setError('Failed to initialize authentication');
    } finally {
      _isInitialized = true;
      _setLoading(false);
    }
  }

  /// Step 13.6: User Registration - Handle new user account creation
  /// Data Flow: Registration Form -> Validation -> API Call -> Auto Login -> Home Screen
  Future<bool> register({
    required String email,
    required String password,
    String? firstName,
    String? lastName,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      print('Attempting registration for email: $email');

      // Step 13.6a: Create registration request object
      final request = RegisterRequest(
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      );

      // Step 13.6b: Validate registration data
      if (!request.isValid()) {
        final errors = request.getValidationErrors();
        _setError(errors.join('\\n'));
        return false;
      }

      // Step 13.6c: Send registration request to backend
      final authResponse = await AuthApiService.register(request);

      if (authResponse.isSuccess) {
        // Step 13.6d: Registration successful, update authentication state
        _currentUser = authResponse.user;
        _isAuthenticated = true;

        print(
          'Registration successful for user: ${authResponse.user.username}',
        );
        return true;
      } else {
        _setError(
          authResponse.message.isNotEmpty
              ? authResponse.message
              : 'Registration failed',
        );
        return false;
      }
    } catch (e) {
      print('Registration error: $e');
      _setError(_getErrorMessage(e));
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Step 13.7: User Login - Authenticate existing user credentials
  /// Data Flow: Login Form -> Credential Validation -> JWT Token -> User Session -> Navigation
  Future<bool> login({
    required String usernameOrEmail,
    required String password,
    bool rememberMe = false,
  }) async {
    _setLoading(true);
    _clearError();

    try {
      print('Attempting login for: $usernameOrEmail');

      // Step 13.7a: Create login request object
      final request = LoginRequest(
        usernameOrEmail: usernameOrEmail,
        password: password,
      );

      // Step 13.7b: Validate login data
      if (!request.isValid()) {
        _setError('Please enter valid credentials');
        return false;
      }

      // Step 13.7c: Send login request to backend
      final authResponse = await AuthApiService.login(request);

      if (authResponse.isSuccess) {
        // Step 13.7d: Login successful, update authentication state
        _currentUser = authResponse.user;
        _isAuthenticated = true;

        // Step 13.7e: Store remember me preference
        await SecureStorageService.setRememberMe(rememberMe);

        print('Login successful for user: ${authResponse.user.username}');
        return true;
      } else {
        _setError(
          authResponse.message.isNotEmpty
              ? authResponse.message
              : 'Login failed',
        );
        return false;
      }
    } catch (e) {
      print('Login error: $e');
      _setError(_getErrorMessage(e));
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Step 13.8: User Logout - Clear authentication and return to login screen
  /// Data Flow: Logout Action -> API Notification -> Local Data Cleanup -> Login Screen
  Future<void> logout() async {
    _setLoading(true);

    try {
      print('Logging out user: ${_currentUser?.username}');

      // Step 13.8a: Notify backend about logout (optional)
      await AuthApiService.logout();

      // Step 13.8b: Clear local authentication state
      await _clearAuthenticationData();

      print('Logout completed');
    } catch (e) {
      print('Logout error: $e');
      // Still clear local data even if backend call fails
      await _clearAuthenticationData();
    } finally {
      _setLoading(false);
    }
  }

  /// Step 13.9: Refresh User Data - Update user information from server
  /// Data Flow: Manual Refresh -> API Call -> User Data Update -> UI Refresh
  Future<bool> refreshUserData() async {
    if (!_isAuthenticated) return false;

    _setLoading(true);
    _clearError();

    try {
      print('Refreshing user data...');

      // Step 13.9a: Fetch fresh user data from backend
      final user = await AuthApiService.getCurrentUser();

      // Step 13.9b: Update current user state
      _currentUser = user;

      print('User data refreshed for: ${user.username}');
      return true;
    } catch (e) {
      print('User data refresh error: $e');

      // Step 13.9c: Handle authentication errors
      if (e.toString().contains('Authentication expired')) {
        await _clearAuthenticationData();
        _setError('Your session has expired. Please login again.');
      } else {
        _setError('Failed to refresh user data');
      }
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Step 13.10: Change Password - Update user password
  /// Data Flow: Password Form -> Validation -> API Call -> Success/Error Handling
  Future<bool> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    if (!_isAuthenticated) return false;

    _setLoading(true);
    _clearError();

    try {
      print('Attempting password change...');

      // Step 13.10a: Create password change request
      final request = PasswordChangeRequest(
        currentPassword: currentPassword,
        newPassword: newPassword,
      );

      // Step 13.10b: Validate password change data
      if (!request.isValid()) {
        _setError(
          'Invalid password data. New password must be at least 8 characters with uppercase, lowercase, and number.',
        );
        return false;
      }

      // Step 13.10c: Send password change request
      final success = await AuthApiService.changePassword(request);

      if (success) {
        print('Password changed successfully');
        return true;
      } else {
        _setError('Failed to change password');
        return false;
      }
    } catch (e) {
      print('Password change error: $e');
      _setError(_getErrorMessage(e));
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Step 13.11: Check Authentication Status - Validate current authentication
  /// Data Flow: Background Check -> Token Validation -> Session Status Update
  Future<bool> checkAuthStatus() async {
    try {
      if (!_isAuthenticated) return false;

      // Step 13.11a: Quick token validation
      final isTokenValid = await AuthApiService.isTokenValid();

      if (!isTokenValid) {
        // Step 13.11b: Token is invalid, clear authentication
        await _clearAuthenticationData();
        return false;
      }

      return true;
    } catch (e) {
      print('Auth status check error: $e');
      await _clearAuthenticationData();
      return false;
    }
  }

  /// Step 13.12: Private Helper Methods - Internal state management
  /// Data Flow: State Changes -> Helper Methods -> UI Updates

  /// Set loading state and notify listeners
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  /// Set error message and notify listeners
  void _setError(String error) {
    _errorMessage = error;
    notifyListeners();
  }

  /// Clear error message
  void _clearError() {
    _errorMessage = null;
  }

  /// Clear all authentication data and state
  Future<void> _clearAuthenticationData() async {
    _currentUser = null;
    _isAuthenticated = false;
    await SecureStorageService.clearAuthData();
    notifyListeners();
  }

  /// Convert exception to user-friendly error message
  String _getErrorMessage(dynamic error) {
    final errorStr = error.toString();

    if (errorStr.contains('SocketException') ||
        errorStr.contains('Unable to connect')) {
      return 'Unable to connect to server. Please check your internet connection.';
    } else if (errorStr.contains('TimeoutException')) {
      return 'Request timed out. Please try again.';
    } else if (errorStr.contains('FormatException')) {
      return 'Invalid server response. Please try again.';
    } else if (errorStr.contains('Exception:')) {
      // Extract the actual error message after 'Exception:'
      return errorStr.split('Exception:').last.trim();
    } else {
      return errorStr;
    }
  }

  /// Step 13.13: Development Helper - Reset authentication state
  /// Data Flow: Development Reset -> State Cleanup -> Fresh Start
  Future<void> resetAuth() async {
    await SecureStorageService.clearAllData();
    await _clearAuthenticationData();
    _isInitialized = false;
    print('Authentication state reset');
  }
}
