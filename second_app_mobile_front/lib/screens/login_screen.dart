import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'register_screen.dart';

/// Step 14.1: Login Screen - User authentication interface with bookstore theme
/// Data Flow: User Input -> Form Validation -> AuthProvider.login() -> Navigation
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  /// Step 14.2: Form Controllers and State - Manage user input and validation
  /// Data Flow: User Input -> Controllers -> Validation -> API Request
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _rememberMe = false;
  bool _obscurePassword = true;

  @override
  void dispose() {
    /// Step 14.3: Cleanup - Dispose controllers to prevent memory leaks
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  /// Step 14.4: Login Handler - Process login form submission
  /// Data Flow: Form Submit -> Validation -> AuthProvider -> Success/Error Handling
  Future<void> _handleLogin() async {
    // Step 14.4a: Validate form input
    if (!_formKey.currentState!.validate()) {
      return;
    }

    // Step 14.4b: Get authentication provider
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    // Step 14.4c: Attempt login with user credentials
    final success = await authProvider.login(
      usernameOrEmail: _usernameController.text.trim(),
      password: _passwordController.text,
      rememberMe: _rememberMe,
    );

    if (mounted) {
      if (success) {
        // Step 14.4d: Login successful - Navigate to main app
        Navigator.of(context).pushReplacementNamed('/');
      } else {
        // Step 14.4e: Login failed - Show error message
        _showErrorSnackBar(authProvider.errorMessage ?? 'Login failed');
      }
    }
  }

  /// Step 14.5: Error Display - Show error messages to user
  /// Data Flow: Error Message -> SnackBar -> User Notification
  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: const Color(0xFFdc3545), // Standard error color
        duration: const Duration(seconds: 4),
        action: SnackBarAction(
          label: 'OK',
          textColor: Colors.white,
          onPressed: () {
            ScaffoldMessenger.of(context).hideCurrentSnackBar();
          },
        ),
      ),
    );
  }

  /// Step 14.6: Navigate to Registration - Switch to register screen
  /// Data Flow: User Action -> Navigation -> Registration Screen
  void _navigateToRegister() {
    Navigator.of(
      context,
    ).push(MaterialPageRoute(builder: (context) => const RegisterScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      /// Step 14.7: App Bar - Login screen header with bookstore theme
      appBar: AppBar(
        title: const Text('Bookstore Login'),
        backgroundColor: const Color(0xFFdc681b), // Primary orange/brown
        foregroundColor: Colors.white,
        centerTitle: true,
      ),

      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          return Container(
            // Background with subtle texture
            decoration: const BoxDecoration(
              color: Color(0xFFfafafa), // Light background
            ),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    /// Step 14.8: Welcome Text - User-friendly greeting with bookstore theme
                    /// Data Flow: Static Content -> UI Display
                    const Icon(
                      Icons.menu_book, 
                      size: 80, 
                      color: Color(0xFFdc681b) // Primary orange/brown
                    ),
                    const SizedBox(height: 20),

                    Text(
                      'Welcome to Our Bookstore!',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: const Color(0xFF131907), // Primary text
                      ),
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 8),

                    Text(
                      'Sign in to explore our collection',
                      style: Theme.of(
                        context,
                      ).textTheme.bodyLarge?.copyWith(
                        color: const Color(0xFF5a6063) // Secondary text
                      ),
                      textAlign: TextAlign.center,
                    ),

                    const SizedBox(height: 40),

                    /// Step 14.9: Username/Email Input Field with bookstore styling
                    /// Data Flow: User Input -> Validation -> Controller Storage
                    TextFormField(
                      controller: _usernameController,
                      decoration: InputDecoration(
                        labelText: 'Username or Email',
                        hintText: 'Enter your username or email',
                        prefixIcon: const Icon(
                          Icons.person,
                          color: Color(0xFFad552f), // Secondary brown
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(
                            color: Color(0xFFdc681b), // Primary orange/brown
                          ),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(
                            color: Color(0xFFdc681b), // Primary orange/brown
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(
                            color: Color(0xFFad552f), // Secondary brown
                            width: 2.0,
                          ),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                      ),
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Please enter your username or email';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 16),

                    /// Step 14.10: Password Input Field with bookstore styling
                    /// Data Flow: User Input -> Obscured Display -> Validation -> Controller Storage
                    TextFormField(
                      controller: _passwordController,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        hintText: 'Enter your password',
                        prefixIcon: const Icon(
                          Icons.lock,
                          color: Color(0xFFad552f), // Secondary brown
                        ),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword
                                ? Icons.visibility
                                : Icons.visibility_off,
                            color: const Color(0xFFad552f), // Secondary brown
                          ),
                          onPressed: () {
                            setState(() {
                              _obscurePassword = !_obscurePassword;
                            });
                          },
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(
                            color: Color(0xFFdc681b), // Primary orange/brown
                          ),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(
                            color: Color(0xFFdc681b), // Primary orange/brown
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(
                            color: Color(0xFFad552f), // Secondary brown
                            width: 2.0,
                          ),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                      ),
                      obscureText: _obscurePassword,
                      textInputAction: TextInputAction.done,
                      onFieldSubmitted: (_) => _handleLogin(),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your password';
                        }
                        if (value.length < 6) {
                          return 'Password must be at least 6 characters';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 12),

                    /// Step 14.11: Remember Me Checkbox with bookstore styling
                    /// Data Flow: User Toggle -> State Update -> Login Request Parameter
                    Row(
                      children: [
                        Checkbox(
                          value: _rememberMe,
                          onChanged: (value) {
                            setState(() {
                              _rememberMe = value ?? false;
                            });
                          },
                          activeColor: const Color(0xFFdc681b), // Primary orange/brown
                        ),
                        const Text(
                          'Remember me',
                          style: TextStyle(
                            color: Color(0xFF131907), // Primary text
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    /// Step 14.12: Login Button with Loading State and bookstore styling
                    /// Data Flow: Button Press -> Loading State -> Login Process -> Result Handling
                    ElevatedButton(
                      onPressed: authProvider.isLoading ? null : _handleLogin,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFdc681b), // Primary orange/brown
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 4,
                      ),
                      child: authProvider.isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  Colors.white,
                                ),
                              ),
                            )
                          : const Text(
                              'Login',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                    ),

                    const SizedBox(height: 16),

                    /// Step 14.13: Registration Link with bookstore styling
                    /// Data Flow: User Tap -> Navigation -> Registration Screen
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Don't have an account? ",
                          style: TextStyle(
                            color: const Color(0xFF5a6063), // Secondary text
                          ),
                        ),
                        TextButton(
                          onPressed: authProvider.isLoading
                              ? null
                              : _navigateToRegister,
                          child: const Text(
                            'Sign Up',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Color(0xFFad552f), // Secondary brown
                            ),
                          ),
                        ),
                      ],
                    ),

                    /// Step 14.14: Error Message Display with bookstore styling
                    /// Data Flow: AuthProvider Error -> Conditional Display -> User Notification
                    if (authProvider.errorMessage != null) ...[
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFdc3545).withOpacity(0.1),
                          border: Border.all(
                            color: const Color(0xFFdc3545), // Standard error color
                          ),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              Icons.error_outline, 
                              color: Color(0xFFdc3545) // Standard error color
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                authProvider.errorMessage!,
                                style: const TextStyle(
                                  color: Color(0xFFdc3545), // Standard error color
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],

                    const SizedBox(height: 20),

                    /// Step 14.15: Development Helper - Direct navigation to dashboard (remove in production)
                    /// Data Flow: Development Shortcut -> Direct Navigation -> Skip Authentication
                    if (const bool.fromEnvironment('dart.vm.product') ==
                        false) ...[
                      TextButton(
                        onPressed: () {
                          Navigator.of(context).pushReplacementNamed('/');
                        },
                        child: Text(
                          'Skip Login (Dev Only)',
                          style: TextStyle(
                            color: Colors.grey[500], 
                            fontSize: 12
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}