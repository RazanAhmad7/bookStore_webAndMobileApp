import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class ApiService {
  // Use configuration for base URL
  String get baseUrl => ApiConfig.currentBaseUrl;

  // Singleton pattern
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  // Default headers for API requests
  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Headers for authenticated requests
  Map<String, String> getAuthHeaders(String token) {
    return {..._headers, 'Authorization': 'Bearer $token'};
  }
}
