"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { authAPI } from "@/services/api";

// Define types
interface User {
  id: string;
  email: string;
  username: string;
  nickname: string;
  profile_picture?: string;
  is_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  username: string;
  nickname: string;
  password: string;
  password_confirm: string;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authAPI.getProfile();
        setUser(userData);
      } catch (err) {
        // If token is invalid, clear it
        console.error("Error fetching user profile:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Logging in with:", { email });
      const { access, refresh } = await authAPI.login(email, password);
      console.log("Login successful, tokens received");

      // Save tokens
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);

      // Get user profile
      const userData = await authAPI.getProfile();
      setUser(userData);

      // Redirect to home page
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Login failed");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      await authAPI.register(userData);
      // After successful registration, log the user in
      await login(userData.email, userData.password);
    } catch (err) {
      console.error("Registration error:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Registration failed");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/auth/signin");
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
