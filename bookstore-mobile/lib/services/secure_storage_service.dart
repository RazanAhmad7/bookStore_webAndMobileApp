import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

/// Step 11.1: Secure Storage Service - Manages secure token storage and user preferences
/// Data Flow: Authentication -> Token Storage -> Device Keychain -> Persistent Login
class SecureStorageService {
  /// Step 11.2: Storage Instances - Initialize secure storage with encryption options
  /// Data Flow: Service Creation -> Storage Configuration -> Secure Access Ready
  static const FlutterSecureStorage _secureStorage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock_this_device,
    ),
    lOptions: LinuxOptions(),
    wOptions: WindowsOptions(useBackwardCompatibility: false),
  );

  /// Step 11.3: Storage Keys - Define consistent keys for stored values
  /// Data Flow: Key Definition -> Storage Operations -> Data Retrieval
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _loginTimestampKey = 'login_timestamp';
  static const String _rememberMeKey = 'remember_me';

  /// Step 11.4: Store JWT Token - Securely save authentication token
  /// Data Flow: Login Success -> Token -> Encrypted Storage -> Device Keychain
  static Future<void> storeToken(String token) async {
    try {
      await _secureStorage.write(key: _tokenKey, value: token);
      await _storeLoginTimestamp();
    } catch (e) {
      print('Error storing token: $e');
      throw Exception('Failed to store authentication token');
    }
  }

  /// Step 11.5: Retrieve JWT Token - Get stored authentication token
  /// Data Flow: App Start -> Token Retrieval -> Authentication Check -> Auto Login
  static Future<String?> getToken() async {
    try {
      return await _secureStorage.read(key: _tokenKey);
    } catch (e) {
      print('Error retrieving token: $e');
      return null;
    }
  }

  /// Step 11.6: Store User Data - Cache user information for offline access
  /// Data Flow: Authentication Response -> User Object -> JSON -> Secure Storage
  static Future<void> storeUserData(Map<String, dynamic> userData) async {
    try {
      final userJson = json.encode(userData);
      await _secureStorage.write(key: _userKey, value: userJson);
    } catch (e) {
      print('Error storing user data: $e');
      throw Exception('Failed to store user data');
    }
  }

  /// Step 11.7: Retrieve User Data - Get cached user information
  /// Data Flow: App Start -> User Data Retrieval -> Object Reconstruction -> State Initialization
  static Future<Map<String, dynamic>?> getUserData() async {
    try {
      final userJson = await _secureStorage.read(key: _userKey);
      if (userJson != null) {
        return json.decode(userJson) as Map<String, dynamic>;
      }
      return null;
    } catch (e) {
      print('Error retrieving user data: $e');
      return null;
    }
  }

  /// Step 11.8: Store Refresh Token - Save refresh token for token renewal
  /// Data Flow: Token Refresh -> New Refresh Token -> Secure Storage -> Session Extension
  static Future<void> storeRefreshToken(String refreshToken) async {
    try {
      await _secureStorage.write(key: _refreshTokenKey, value: refreshToken);
    } catch (e) {
      print('Error storing refresh token: $e');
    }
  }

  /// Step 11.9: Get Refresh Token - Retrieve stored refresh token
  /// Data Flow: Token Expiry -> Refresh Token Retrieval -> Token Renewal Request
  static Future<String?> getRefreshToken() async {
    try {
      return await _secureStorage.read(key: _refreshTokenKey);
    } catch (e) {
      print('Error retrieving refresh token: $e');
      return null;
    }
  }

  /// Step 11.10: Clear All Authentication Data - Complete logout cleanup
  /// Data Flow: User Logout -> Data Cleanup -> Secure Deletion -> Fresh State
  static Future<void> clearAuthData() async {
    try {
      await Future.wait([
        _secureStorage.delete(key: _tokenKey),
        _secureStorage.delete(key: _userKey),
        _secureStorage.delete(key: _refreshTokenKey),
        _secureStorage.delete(key: _loginTimestampKey),
      ]);
    } catch (e) {
      print('Error clearing auth data: $e');
    }
  }

  /// Step 11.11: Check if User is Logged In - Verify authentication status
  /// Data Flow: App Start -> Token Check -> Login Status -> Navigation Decision
  static Future<bool> isLoggedIn() async {
    try {
      final token = await getToken();
      return token != null && token.isNotEmpty;
    } catch (e) {
      print('Error checking login status: $e');
      return false;
    }
  }

  /// Step 11.12: Remember Me Functionality - Store user preference for auto-login
  /// Data Flow: Login Form -> Remember Me Toggle -> Preference Storage -> Auto-Login Decision
  static Future<void> setRememberMe(bool remember) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_rememberMeKey, remember);
    } catch (e) {
      print('Error setting remember me: $e');
    }
  }

  /// Step 11.13: Get Remember Me Status - Check if user wants to stay logged in
  /// Data Flow: App Start -> Preference Check -> Auto-Login Decision -> UI State
  static Future<bool> getRememberMe() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getBool(_rememberMeKey) ?? false;
    } catch (e) {
      print('Error getting remember me: $e');
      return false;
    }
  }

  /// Step 11.14: Store Login Timestamp - Track when user logged in
  /// Data Flow: Login Success -> Timestamp Storage -> Session Tracking
  static Future<void> _storeLoginTimestamp() async {
    try {
      final timestamp = DateTime.now().millisecondsSinceEpoch.toString();
      await _secureStorage.write(key: _loginTimestampKey, value: timestamp);
    } catch (e) {
      print('Error storing login timestamp: $e');
    }
  }

  /// Step 11.15: Get Login Duration - Calculate how long user has been logged in
  /// Data Flow: Current Time -> Login Timestamp -> Duration Calculation -> Session Info
  static Future<Duration?> getLoginDuration() async {
    try {
      final timestampStr = await _secureStorage.read(key: _loginTimestampKey);
      if (timestampStr != null) {
        final timestamp = int.parse(timestampStr);
        final loginTime = DateTime.fromMillisecondsSinceEpoch(timestamp);
        return DateTime.now().difference(loginTime);
      }
      return null;
    } catch (e) {
      print('Error getting login duration: $e');
      return null;
    }
  }

  /// Step 11.16: Check Token Expiry - Validate if stored token is still valid
  /// Data Flow: Token Retrieval -> JWT Decode -> Expiry Check -> Validity Status
  static Future<bool> isTokenExpired() async {
    try {
      final token = await getToken();
      if (token == null || token.isEmpty) return true;

      // Basic JWT structure check (header.payload.signature)
      final parts = token.split('.');
      if (parts.length != 3) return true;

      // Decode payload (we'll implement proper JWT validation in auth service)
      final payload = parts[1];
      final normalizedPayload = base64Url.normalize(payload);
      final payloadBytes = base64Url.decode(normalizedPayload);
      final payloadMap = json.decode(utf8.decode(payloadBytes));

      final exp = payloadMap['exp'];
      if (exp != null) {
        final expiry = DateTime.fromMillisecondsSinceEpoch(exp * 1000);
        return DateTime.now().isAfter(expiry);
      }

      return false;
    } catch (e) {
      print('Error checking token expiry: $e');
      return true; // Assume expired if we can't check
    }
  }

  /// Step 11.17: Development Helper - Clear all app data (dev/testing only)
  /// Data Flow: Development Reset -> Complete Data Wipe -> Fresh App State
  static Future<void> clearAllData() async {
    try {
      await _secureStorage.deleteAll();
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();
      print('All app data cleared');
    } catch (e) {
      print('Error clearing all data: $e');
    }
  }
}
