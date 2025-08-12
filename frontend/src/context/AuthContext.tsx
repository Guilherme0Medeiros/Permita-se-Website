import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("accessToken");
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // aplica/remover Authorization no axios quando mudar autenticação
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [isAuthenticated]);

  // busca /me quando autenticado para descobrir se é admin
  useEffect(() => {
    if (!isAuthenticated) {
      setIsAdmin(false);
      return;
    }
    api
      .get("/me/")
      .then((res) => {
        const { is_staff, is_superuser } = res.data || {};
        setIsAdmin(Boolean(is_staff || is_superuser));
      })
      .catch(() => {
        setIsAdmin(false);
      });
  }, [isAuthenticated]);

  const login = (access: string, refresh: string) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    // garante header imediatamente
    api.defaults.headers.common["Authorization"] = `Bearer ${access}`;
    setIsAuthenticated(true);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete api.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return context;
};
