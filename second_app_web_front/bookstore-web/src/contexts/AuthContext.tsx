import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  errorMessage: string | null;
  login: (
    username: string,
    password: string,
    rememberMe: boolean
  ) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  validateAndRefreshUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check for existing token on app load and validate with backend
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          // Validate token with backend
          const response = await fetch(
            "http://localhost:5070/api/auth/profile",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const userData = await response.json();
            setUser({
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
            });
          } else {
            // Token is invalid, clear it
            localStorage.removeItem("authToken");
            setUser(null);
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("authToken");
          setUser(null);
        }
      }
    };

    validateToken();
  }, []);

  const login = async (
    username: string,
    password: string,
    rememberMe: boolean
  ): Promise<boolean> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("http://localhost:5070/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernameOrEmail: username,
          password: password,
          rememberMe: rememberMe,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        localStorage.setItem("authToken", data.token);

        // Set user data
        setUser({
          email: data.user?.email || username,
          firstName: data.user?.firstName,
          lastName: data.user?.lastName,
        });

        return true;
      } else {
        setErrorMessage(data.message || "Login failed");
        return false;
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("http://localhost:5070/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        localStorage.setItem("authToken", data.token);

        // Set user data
        setUser({
          email: data.user?.email || email,
          firstName: data.user?.firstName || firstName,
          lastName: data.user?.lastName || lastName,
        });

        return true;
      } else {
        setErrorMessage(data.message || "Registration failed");
        return false;
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setErrorMessage(null);
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  // Validate current token and refresh user data
  const validateAndRefreshUser = async (): Promise<boolean> => {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    try {
      const response = await fetch("http://localhost:5070/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        });
        return true;
      } else {
        localStorage.removeItem("authToken");
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      localStorage.removeItem("authToken");
      setUser(null);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    errorMessage,
    login,
    register,
    logout,
    clearError,
    validateAndRefreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
