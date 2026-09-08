/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const response = await apiRequest("/auth/me");
        setUser(response.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(credentials) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setUser(response.user);
    return response.user;
  }

  async function register(credentials) {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setUser(response.user);
    return response.user;
  }

  async function logout() {
    await apiRequest("/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}