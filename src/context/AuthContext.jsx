import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Konsisten menggunakan key "token"
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);

      if (response.status && response.data) {
        // Ambil token dan data user
        const { accessToken, refreshToken, ...userInfo } = response.data;

        // --- PERBAIKAN 1: Tambahkan Role Default ---
        // Backend register biasanya belum mengirim role di body response, 
        // jadi kita paksa tambahkan role CUSTOMER agar ProtectedRoute mengizinkan masuk.
        const userWithRole = {
          ...userInfo,
          role: userInfo.role || "CUSTOMER", 
        };

        // --- PERBAIKAN 2: Samakan Key Token ---
        // Ganti "accessToken" menjadi "token" agar sesuai dengan api.js dan fungsi login
        localStorage.setItem("token", accessToken); 
        localStorage.setItem("refreshToken", refreshToken); // Opsional
        localStorage.setItem("user", JSON.stringify(userWithRole));

        // Update State
        setToken(accessToken);
        setUser(userWithRole);
        setIsAuthenticated(true);

        return { success: true, user: userWithRole };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registrasi gagal",
      };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);

      if (response.status === true && response.data) {
        const { accessToken, userData } = response.data;

        // Pastikan role ada saat login juga (Normalisasi huruf besar)
        const finalUser = {
            ...userData,
            role: (userData.role || "CUSTOMER").toUpperCase()
        };

        // Konsisten menggunakan key "token"
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(finalUser));

        setToken(accessToken);
        setUser(finalUser);
        setIsAuthenticated(true);

        return { success: true, user: finalUser };
      }

      return {
        success: false,
        message: response.message || "Login gagal",
      };
    } catch (error) {
      console.error("Login Error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Terjadi kesalahan koneksi",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken"); // Hapus juga refresh token jika ada
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  const hasRole = (allowedRoles) => {
    if (!user) return false;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return roles.includes(user.role);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};