import React, { useState } from "react";
import "./Login.css";

interface LoginProps {
  onLogin: (
    username: string,
    password: string,
    rememberMe: boolean
  ) => Promise<boolean>;
  onNavigateToRegister: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

const Login: React.FC<LoginProps> = ({
  onLogin,
  onNavigateToRegister,
  isLoading,
  errorMessage,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    await onLogin(username.trim(), password, rememberMe);
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="book-icon material-icons">menu_book</div>
        <h1>Welcome to Our Bookstore!</h1>
        <p>Sign in to explore our collection</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username or Email</label>
          <div className="input-container">
            <span className="input-icon material-icons">person</span>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username or email"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-container">
            <span className="input-icon material-icons">lock</span>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "visibility" : "visibility_off"}
            </button>
          </div>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="checkmark"></span>
            Remember me
          </label>
        </div>

        <button
          type="submit"
          className="auth-button primary"
          disabled={isLoading}
        >
          {isLoading ? <div className="loading-spinner"></div> : "Login"}
        </button>

        {errorMessage && (
          <div className="error-message">
            <span className="error-icon material-icons">error_outline</span>
            {errorMessage}
          </div>
        )}

        <div className="auth-link">
          <span>Don't have an account? </span>
          <button
            type="button"
            className="link-button"
            onClick={onNavigateToRegister}
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
