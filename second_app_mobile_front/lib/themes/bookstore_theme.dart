import 'package:flutter/material.dart';

/// Bookstore Theme - Consistent color scheme and styling for the entire application
/// This file defines the color palette and theme data that should be used throughout
/// the bookstore application to maintain visual consistency.

/// Primary Color Palette
const Color primaryOrangeBrown = Color(0xFFdc681b); // Primary brand color
const Color secondaryBrown = Color(0xFFad552f);     // Secondary accent color
const Color accentGold = Color(0xFFeab251);         // Accent/warm color
const Color lightBackground = Color(0xFFfafafa);    // Light background
const Color darkText = Color(0xFF131907);           // Primary text
const Color mediumText = Color(0xFF5a6063);         // Secondary text
const Color darkBackground = Color(0xFF283411);     // Dark background

/// Error and Success Colors
const Color errorColor = Color(0xFFdc3545);         // Standard error color
const Color successColor = Color(0xFF28a745);       // Standard success color

/// Bookstore Theme Data
final ThemeData bookstoreTheme = ThemeData(
  // Primary color scheme
  primaryColor: primaryOrangeBrown,
  colorScheme: ColorScheme.fromSeed(
    seedColor: primaryOrangeBrown,
    primary: primaryOrangeBrown,
    secondary: secondaryBrown,
    tertiary: accentGold,
  ),
  
  // AppBar styling
  appBarTheme: const AppBarTheme(
    backgroundColor: primaryOrangeBrown,
    foregroundColor: Colors.white,
    centerTitle: true,
    elevation: 4,
  ),
  
  // Button styling
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: primaryOrangeBrown,
      foregroundColor: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      elevation: 4,
    ),
  ),
  
  // Input field styling
  inputDecorationTheme: InputDecorationTheme(
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(
        color: primaryOrangeBrown,
      ),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(
        color: primaryOrangeBrown,
      ),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(
        color: secondaryBrown,
        width: 2.0,
      ),
    ),
    filled: true,
    fillColor: Colors.white,
  ),
  
  // Text theme
  textTheme: TextTheme(
    headlineMedium: const TextStyle(
      fontWeight: FontWeight.bold,
      color: darkText,
    ),
    bodyLarge: const TextStyle(
      color: mediumText,
    ),
  ),
  
  // Scaffold background
  scaffoldBackgroundColor: lightBackground,
  
  // Icon theme
  iconTheme: const IconThemeData(
    color: secondaryBrown,
  ),
);