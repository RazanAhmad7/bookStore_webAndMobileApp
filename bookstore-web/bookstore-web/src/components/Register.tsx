import React, { useState } from "react";
import "./Register.css";

interface RegisterProps {
  onRegister: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<boolean>;
  onNavigateToLogin: () => void;
  isLoading: boolean;
  errorMessage: string | null;
}

const Register: React.FC<RegisterProps> = ({
  onRegister,
  onNavigateToLogin,
  isLoading,
  errorMessage,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain uppercase, lowercase, and number";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) return;
    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      alert(passwordError);
      return;
    }

    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    await onRegister(
      email.trim(),
      password,
      firstName.trim() || undefined,
      lastName.trim() || undefined
    );
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="book-icon material-icons">menu_book</div>
        <h1>Join Our Bookstore!</h1>
        <p>Create your account to explore our collection</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="firstName">First Name (Optional)</label>
            <div className="input-container">
              <span className="input-icon material-icons">person_outline</span>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
              />
            </div>
          </div>
          <div className="form-group half">
            <label htmlFor="lastName">Last Name (Optional)</label>
            <div className="input-container">
              <span className="input-icon material-icons">person_outline</span>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <div className="input-container">
            <span className="input-icon material-icons">email</span>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <div className="input-container">
            <span className="input-icon material-icons">lock</span>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
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
          <div className="password-help">
            At least 8 characters with uppercase, lowercase, and number
          </div>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
            />
            <span className="checkmark"></span>I agree to the Terms and
            Conditions and Privacy Policy
          </label>
        </div>

        <button
          type="submit"
          className="auth-button secondary"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            "Create Account"
          )}
        </button>

        {errorMessage && (
          <div className="error-message">
            <span className="error-icon material-icons">error_outline</span>
            {errorMessage}
          </div>
        )}

        <div className="auth-link">
          <span>Already have an account? </span>
          <button
            type="button"
            className="link-button"
            onClick={onNavigateToLogin}
            disabled={isLoading}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
