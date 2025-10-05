/// Step 8.1: User Model - Represents authenticated user data in Flutter
/// Data Flow: Backend JSON Response -> User.fromJson() -> Flutter State Management
class User {
  final int id;
  final String username;
  final String email;
  final String? firstName;
  final String? lastName;

  /// Step 8.2: Constructor - Initialize user object with required fields
  /// Data Flow: Model Creation -> State Storage -> UI Display
  User({
    required this.id,
    required this.username,
    required this.email,
    this.firstName,
    this.lastName,
  });

  /// Step 8.3: JSON Deserialization - Convert backend response to User object
  /// Data Flow: Backend API Response -> JSON Parsing -> User Object
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? 0,
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      firstName: json['firstName'],
      lastName: json['lastName'],
    );
  }

  /// Step 8.4: JSON Serialization - Convert User object to JSON for API requests
  /// Data Flow: User Object -> JSON -> HTTP Request Body
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'email': email,
      'firstName': firstName,
      'lastName': lastName,
    };
  }

  /// Step 8.5: User Display Methods - Helper methods for UI presentation
  /// Data Flow: User Object -> Computed Properties -> UI Text Display

  String get displayName {
    if (firstName != null && lastName != null) {
      return '$firstName $lastName';
    } else if (firstName != null) {
      return firstName!;
    } else {
      return username;
    }
  }

  String get initials {
    if (firstName != null && lastName != null) {
      return '${firstName![0]}${lastName![0]}'.toUpperCase();
    } else {
      return username.length > 1
          ? username.substring(0, 2).toUpperCase()
          : username.toUpperCase();
    }
  }

  /// Step 8.6: Object Equality - Compare User objects for state management
  /// Data Flow: State Comparison -> Widget Rebuild Optimization
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is User &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          username == other.username &&
          email == other.email;

  @override
  int get hashCode => id.hashCode ^ username.hashCode ^ email.hashCode;

  /// Step 8.7: String Representation - Debug and logging purposes
  /// Data Flow: Debug Output -> Console Logging -> Development Debugging
  @override
  String toString() {
    return 'User{id: $id, username: $username, email: $email, displayName: $displayName}';
  }

  /// Step 8.8: Copy Method - Create modified copies for state updates
  /// Data Flow: Existing User -> Modified Copy -> State Update
  User copyWith({
    int? id,
    String? username,
    String? email,
    String? firstName,
    String? lastName,
  }) {
    return User(
      id: id ?? this.id,
      username: username ?? this.username,
      email: email ?? this.email,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
    );
  }
}
