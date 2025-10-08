/// Step 16.1: Main App Entry Point - Application initialization with authentication
/// Data Flow: App Launch -> Provider Setup -> Authentication Check -> Initial Screen

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/dashboard_screen.dart';
import 'themes/bookstore_theme.dart'; // Import our custom theme

/// Step 16.2: Application Entry Point - Configure providers and start app
/// Data Flow: main() -> Provider Setup -> App Widget -> Authentication Flow
void main() {
  runApp(
    /// Step 16.3: Provider Setup - Configure state management
    /// Data Flow: Provider Configuration -> Dependency Injection -> Widget Tree
    ChangeNotifierProvider(create: (_) => AuthProvider(), child: const MyApp()),
  );
}

/// Step 16.4: Main App Widget - Root application widget with authentication routing
/// Data Flow: App Start -> Authentication Check -> Route Decision -> Screen Display
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bookstore App',

      /// Step 16.5: App Theme Configuration with Bookstore Theme
      /// Data Flow: Theme Setup -> Material Design -> Consistent UI
      theme: bookstoreTheme, // Use our custom bookstore theme

      /// Step 16.6: Route Configuration - Define app navigation routes
      /// Data Flow: Navigation Request -> Route Lookup -> Screen Navigation
      routes: {
        '/': (context) => const AuthWrapper(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
      },

      /// Step 16.7: Initial Route - App entry point
      /// Data Flow: App Launch -> Initial Route -> Authentication Check
      initialRoute: '/',

      /// Step 16.8: Debug Banner - Remove in production
      debugShowCheckedModeBanner: false,
    );
  }
}

/// Step 16.9: Authentication Wrapper - Determines initial screen based on auth status
/// Data Flow: App Launch -> Auth Check -> Login Screen OR Dashboard Screen
class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  @override
  void initState() {
    super.initState();

    /// Step 16.9a: Initialize authentication on app start
    /// Data Flow: Widget Init -> Auth Provider -> Token Check -> Auto Login
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AuthProvider>().initializeAuth();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        /// Step 16.9b: Show loading spinner while initializing
        /// Data Flow: Auth Initialization -> Loading State -> UI Display
        if (!authProvider.isInitialized) {
          return const Scaffold(
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('Initializing...'),
                ],
              ),
            ),
          );
        }

        /// Step 16.9c: Route to appropriate screen based on authentication
        /// Data Flow: Auth Status -> Screen Decision -> Navigation
        if (authProvider.isAuthenticated) {
          // User is logged in, show main dashboard
          return const DashboardScreen();
        } else {
          // User is not logged in, show login screen
          return const LoginScreen();
        }
      },
    );
  }
}
