import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  User,
  Heart,
  ShoppingCart,
  Menu,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PermitaSeHeader({
  isAuthenticated,
  logout,
  cartItems,
  setIsCartOpen,
}: {
  isAuthenticated: boolean;
  logout: () => void;
  cartItems: { quantidade: number }[];
  setIsCartOpen: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const categorias = [
    "vestidos",
    "calças",
    "macacões",
    "blusas",
    "shorts",
    "jaquetas",
  ];

  return (
    <div className="w-full bg-black relative z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <a href="/" className="flex items-center">
          <img
            src="/img/logo4.png"
            alt="Permita-se"
            className="h-16 scale-x-100 object-contain"
          />
        </a>

        <div className="flex-1 max-w-md mx-8 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <input
              type="text"
              placeholder="O que você está procurando?"
              className="pl-10 pr-4 py-2 w-full bg-gray-900 border-0 rounded-full text-sm text-white placeholder:text-gray-500 focus:bg-gray-800 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="text-white hover:bg-gray-900 p-2 rounded-md md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <button className="text-white hover:bg-gray-900 p-2 rounded-md hidden md:inline-block">
            <MapPin className="h-4 w-4" />
          </button>

          {/* Botão Admin só aparece para admins */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/produtos")}
              className="text-white hover:bg-gray-900 p-2 rounded-md hidden md:inline-flex items-center gap-2"
              title="Administração de produtos"
            >
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Admin Produtos</span>
            </button>
          )}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu((prev: boolean) => !prev)}
              className="flex items-center justify-center w-10 h-10 text-white hover:text-orange-300 hover:bg-white/10 rounded-full transition-all duration-300 group"
            >
              <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                {/* Seta indicativa */}
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>

                {isAuthenticated ? (
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        Minha Conta
                      </p>
                      <p className="text-xs text-gray-500">
                        Bem-vindo de volta!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:text-white hover:bg-red-500 transition-all duration-300 flex items-center gap-2"
                    >
                      <span className="text-red-500 hover:text-white transition-colors">
                        🚪
                      </span>
                      Sair da Conta
                    </button>
                  </div>
                ) : (
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        Acesse sua conta
                      </p>
                      <p className="text-xs text-gray-500">
                        Entre ou crie uma conta
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:text-white hover:bg-orange-500 transition-all duration-300 flex items-center gap-2"
                    >
                      <span className="text-orange-500 hover:text-white transition-colors">
                        👤
                      </span>
                      Entrar / Cadastrar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="text-white hover:bg-gray-900 p-2 rounded-md hidden md:inline-block">
            <Heart className="h-5 w-5" />
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="text-white hover:bg-gray-900 p-2 rounded-md relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {cartItems.reduce((acc, item) => acc + item.quantidade, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* NavBar com categorias fixas */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center justify-center space-x-6 py-3 flex-wrap">
            {categorias.map((cat) => (
              <div
                key={cat}
                onClick={() => navigate(`/categoria/${cat}`)}
                className="group relative cursor-pointer"
              >
                <span className="text-sm font-medium text-white group-hover:text-gray-300 pb-2 transition-colors duration-200">
                  {cat.toUpperCase()}
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Menu mobile (inclui o atalho Admin se for admin) */}
      {isMobile && isMobileMenuOpen && (
        <div className="bg-black border-t border-gray-800 px-6 py-4 space-y-4 md:hidden">
          {isAdmin && (
            <button
              onClick={() => {
                navigate("/admin/produtos");
                setIsMobileMenuOpen(false);
              }}
              className="block text-left w-full text-white text-sm py-1 hover:text-orange-400"
            >
              Admin
            </button>
          )}
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                navigate(`/categoria/${cat}`);
                setIsMobileMenuOpen(false);
              }}
              className="block text-left w-full text-white text-sm py-1 hover:text-orange-400"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
