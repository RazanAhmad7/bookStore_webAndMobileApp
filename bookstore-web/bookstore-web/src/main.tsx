import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import "./style.css";

const App: React.FC = () => {
  const {
    user,
    isLoading,
    errorMessage,
    login,
    register,
    logout,
    clearError,
    validateAndRefreshUser,
  } = useAuth();
  const [currentView, setCurrentView] = useState<"login" | "register">("login");

  // Validate token when window regains focus (to sync with other apps)
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        validateAndRefreshUser();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, validateAndRefreshUser]);

  const handleLogin = async (
    username: string,
    password: string,
    rememberMe: boolean
  ): Promise<boolean> => {
    const success = await login(username, password, rememberMe);
    if (success) {
      clearError();
    }
    return success;
  };

  const handleRegister = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<boolean> => {
    const success = await register(email, password, firstName, lastName);
    if (success) {
      clearError();
    }
    return success;
  };

  const handleLogout = () => {
    logout();
  };

  const navigateToRegister = () => {
    setCurrentView("register");
    clearError();
  };

  const navigateToLogin = () => {
    setCurrentView("login");
    clearError();
  };

  // Show loading state
  if (isLoading && !user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show home page (public access)
  return <Home />;
};

// Render the React application
ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
