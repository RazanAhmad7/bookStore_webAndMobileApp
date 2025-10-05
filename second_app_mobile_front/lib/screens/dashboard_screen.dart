/// Step 17.1: Dashboard Screen - Main authenticated user screen
/// Data Flow: Authentication Success -> Dashboard Display -> User Actions

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

/// Step 17.2: Dashboard Screen Widget - Main screen for authenticated users
/// Data Flow: User Login -> Dashboard Display -> Navigation Options
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      /// Step 17.3: App Bar - Dashboard header with user info and logout
      /// Data Flow: User Info Display -> Logout Action -> Authentication Provider
      appBar: AppBar(
        title: const Text('Dashboard'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          /// Step 17.3a: User Profile Icon - Display current user info
          Consumer<AuthProvider>(
            builder: (context, authProvider, child) {
              return Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  children: [
                    Icon(Icons.person),
                    const SizedBox(width: 8),
                    Text(
                      authProvider.currentUser?.email ?? 'User',
                      style: const TextStyle(fontSize: 14),
                    ),
                  ],
                ),
              );
            },
          ),

          /// Step 17.3b: Logout Button - Sign out user
          /// Data Flow: Logout Tap -> Auth Provider -> Token Removal -> Login Screen
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              final authProvider = context.read<AuthProvider>();
              await authProvider.logout();

              if (context.mounted) {
                Navigator.of(context).pushReplacementNamed('/login');
              }
            },
            tooltip: 'Logout',
          ),
        ],
      ),

      /// Step 17.4: Dashboard Body - Main content area
      /// Data Flow: Dashboard Load -> Content Display -> User Interaction
      body: const Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// Step 17.4a: Welcome Section
            Text(
              'Welcome to your Dashboard!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16),

            /// Step 17.4b: Info Card
            Card(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Authentication Successful',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'You have successfully logged into the application. All product functionality has been removed as requested.',
                      style: TextStyle(fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),

            SizedBox(height: 24),

            /// Step 17.4c: Features Section
            Text(
              'Available Features:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
            ),
            SizedBox(height: 12),

            /// Step 17.4d: Feature List
            ListTile(
              leading: Icon(Icons.security),
              title: Text('JWT Authentication'),
              subtitle: Text('Secure token-based authentication'),
            ),
            ListTile(
              leading: Icon(Icons.person),
              title: Text('User Management'),
              subtitle: Text('User registration and login'),
            ),
            ListTile(
              leading: Icon(Icons.lock),
              title: Text('Secure Storage'),
              subtitle: Text('Encrypted token storage'),
            ),
          ],
        ),
      ),
    );
  }
}
