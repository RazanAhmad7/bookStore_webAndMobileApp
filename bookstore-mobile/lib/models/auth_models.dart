import 'user.dart';

/// Step 9.1: Authentication Request Models - Data transfer objects for auth API calls
/// Data Flow: Flutter Forms -> Request Objects -> JSON -> Backend API

/// Step 9.2: Login Request Model - Handles user login credentials
/// Data Flow: Login Form Input -> LoginRequest Object -> API Service -> Backend
class LoginRequest {
  final String usernameOrEmail;
  final String password;

  /// Step 9.2a: Constructor - Initialize login request with credentials
  LoginRequest({required this.usernameOrEmail, required this.password});

  /// Step 9.2b: JSON Serialization - Convert to JSON for API transmission
  /// Data Flow: LoginRequest Object -> JSON -> HTTP POST Body -> Backend /api/auth/login
  Map<String, dynamic> toJson() {
    return {'usernameOrEmail': usernameOrEmail, 'password': password};
  }

  /// Step 9.2c: Validation - Check if login data is valid before sending
  /// Data Flow: Form Validation -> Request Validation -> API Call Decision
  bool isValid() {
    return usernameOrEmail.trim().isNotEmpty &&
        password.isNotEmpty &&
        password.length >= 6;
  }

  @override
  String toString() => 'LoginRequest{usernameOrEmail: $usernameOrEmail}';
}

/// Step 9.3: Registration Request Model - Handles new user registration
/// Data Flow: Registration Form -> RegisterRequest Object -> API Service -> Backend
class RegisterRequest {
  final String email;
  final String password;
  final String? firstName;
  final String? lastName;

  /// Step 9.3a: Constructor - Initialize registration request with user data
  RegisterRequest({
    required this.email,
    required this.password,
    this.firstName,
    this.lastName,
  });

  /// Step 9.3b: JSON Serialization - Convert to JSON for API transmission
  /// Data Flow: RegisterRequest Object -> JSON -> HTTP POST Body -> Backend /api/auth/register
  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
      'firstName': firstName,
      'lastName': lastName,
    };
  }

  /// Step 9.3c: Validation - Comprehensive validation for registration data
  /// Data Flow: Form Input -> Validation Rules -> API Call Decision
  bool isValid() {
    return _isValidEmail() && _isValidPassword();
  }

  /// Step 9.3e: Email Validation - Check email format using regex
  /// Data Flow: Email Input -> Regex Pattern Check -> Validation Result
  bool _isValidEmail() {
    return RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    ).hasMatch(email.trim());
  }

  /// Step 9.3f: Password Validation - Check password strength requirements
  /// Data Flow: Password Input -> Security Rules Check -> Validation Result
  bool _isValidPassword() {
    return password.length >= 8 &&
        password.length <= 128 &&
        RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)').hasMatch(password);
  }

  /// Step 9.3g: Get validation error messages for UI display
  /// Data Flow: Validation Failure -> Error Messages -> UI Error Display
  List<String> getValidationErrors() {
    List<String> errors = [];

    if (!_isValidEmail()) {
      errors.add('Please enter a valid email address');
    }

    if (!_isValidPassword()) {
      errors.add(
        'Password must be 8+ characters with uppercase, lowercase, and number',
      );
    }

    return errors;
  }

  @override
  String toString() => 'RegisterRequest{email: $email}';
}

/// Step 9.4: Authentication Response Model - Handles API responses
/// Data Flow: Backend Response -> JSON Parsing -> AuthResponse Object -> State Update
class AuthResponse {
  final String token;
  final User user;
  final String message;

  /// Step 9.4a: Constructor - Initialize response with auth data
  AuthResponse({
    required this.token,
    required this.user,
    required this.message,
  });

  /// Step 9.4b: JSON Deserialization - Parse backend auth response
  /// Data Flow: Backend JSON -> AuthResponse Object -> Token Storage + User State
  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: json['token'] ?? '',
      user: User.fromJson(json['user'] ?? {}),
      message: json['message'] ?? '',
    );
  }

  /// Step 9.4c: Check if authentication was successful
  /// Data Flow: Response Validation -> Success Status -> UI Navigation Decision
  bool get isSuccess => token.isNotEmpty && user.id.isNotEmpty;

  @override
  String toString() => 'AuthResponse{message: $message, userId: ${user.id}}';
}

/// Step 9.5: Password Change Request Model - For future password update feature
/// Data Flow: Password Change Form -> PasswordChangeRequest -> API -> Backend Update
class PasswordChangeRequest {
  final String currentPassword;
  final String newPassword;

  PasswordChangeRequest({
    required this.currentPassword,
    required this.newPassword,
  });

  Map<String, dynamic> toJson() {
    return {'currentPassword': currentPassword, 'newPassword': newPassword};
  }

  bool isValid() {
    return currentPassword.isNotEmpty &&
        newPassword.length >= 8 &&
        RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)').hasMatch(newPassword);
  }
}
