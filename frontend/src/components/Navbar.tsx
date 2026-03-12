import { useEffect, useState } from "react"
import {
  Search,
  MapPin,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Shield,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function PermitaSeHeader({
  isAuthenticated,
  logout,
  cartItems,
  setIsCartOpen,
}: {
  isAuthenticated: boolean
  logout: () => void
  cartItems: { quantidade: number }[]
  setIsCartOpen: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const categorias = [
    "vestidos",
    "calças",
    "macacões",
    "blusas",
    "shorts",
    "jaquetas",
  ]

  const spring = { type: "spring" as const, stiffness: 300, damping: 30 }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantidade, 0)

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? "bg-surface-dark/95 backdrop-blur-md" : "bg-surface-dark"
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={spring}
    >
      {/* Top bar */}
      <div className="bg-primary px-4 py-1.5 text-center">
        <p className="text-xs font-medium text-primary-foreground tracking-wide uppercase">
          Frete grátis acima de R$ 199 • Parcele em até 6x sem juros
        </p>
      </div>

      {/* Main nav */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 max-w-7xl mx-auto">
        <motion.button
  onClick={() => navigate("/")}
  className="font-display text-2xl sm:text-3xl font-extrabold text-surface-dark-foreground uppercase tracking-tighter"
  whileHover={{ scale: 1.02 }}
  transition={spring}
>
  Permita-se
</motion.button>

        {/* Search - desktop */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="O que você está procurando?"
              className="w-full pl-10 pr-4 py-2.5 bg-surface-dark-foreground/10 rounded-full text-sm text-surface-dark-foreground placeholder:text-surface-dark-foreground/40 focus:bg-surface-dark-foreground/15 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="p-2 rounded-full text-surface-dark-foreground/80 hover:text-surface-dark-foreground hover:bg-surface-dark-foreground/10 transition-colors md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <button className="p-2 rounded-full text-surface-dark-foreground/80 hover:text-surface-dark-foreground hover:bg-surface-dark-foreground/10 transition-colors hidden md:flex">
            <MapPin className="h-5 w-5" />
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate("/admin/produtos")}
              className="hidden md:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-surface-dark-foreground/80 hover:text-surface-dark-foreground hover:bg-surface-dark-foreground/10 transition-colors"
              title="Administração de produtos"
            >
              <Shield className="h-4 w-4" />
              <span>Admin Produtos</span>
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setShowUserMenu((prev) => !prev)}
              className="p-2 rounded-full text-surface-dark-foreground/80 hover:text-surface-dark-foreground hover:bg-surface-dark-foreground/10 transition-colors"
            >
              <User className="h-5 w-5" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  className="absolute right-0 mt-3 w-56 bg-card text-card-foreground rounded-2xl shadow-2xl border border-border z-50 overflow-hidden"
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                >
                  {isAuthenticated ? (
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-card-foreground">
                          Minha Conta
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Bem-vindo de volta!
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                        }}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-card-foreground hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 flex items-center gap-2"
                      >
                        <span>🚪</span>
                        Sair da Conta
                      </button>
                    </div>
                  ) : (
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-card-foreground">
                          Acesse sua conta
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Entre ou crie uma conta
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          navigate("/login")
                          setShowUserMenu(false)
                        }}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-card-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center gap-2"
                      >
                        <span>👤</span>
                        Entrar / Cadastrar
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="p-2 rounded-full text-surface-dark-foreground/80 hover:text-surface-dark-foreground hover:bg-surface-dark-foreground/10 transition-colors hidden md:flex">
            <Heart className="h-5 w-5" />
          </button>

          <motion.button
            onClick={() => setIsCartOpen(true)}
            className="p-2 rounded-full text-surface-dark-foreground/80 hover:text-surface-dark-foreground hover:bg-surface-dark-foreground/10 transition-colors relative"
            whileTap={{ scale: 0.9 }}
            transition={spring}
          >
            <ShoppingCart className="h-5 w-5" />

            {cartCount > 0 && (
              <motion.span
                className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={spring}
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Categories bar - desktop */}
      <nav className="border-t border-surface-dark-foreground/10 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-8 py-2.5">
          {categorias.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => navigate(`/categoria/${cat}`)}
              className="relative text-sm font-medium text-surface-dark-foreground/70 hover:text-surface-dark-foreground uppercase tracking-wide transition-colors"
              whileHover="hover"
            >
              {cat}
              <motion.span
                className="absolute -bottom-0.5 left-0 h-0.5 bg-primary rounded-full"
                initial={{ width: 0 }}
                variants={{ hover: { width: "100%" } }}
                transition={spring}
              />
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-surface-dark border-t border-surface-dark-foreground/10 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Mobile search */}
            <div className="px-4 pt-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-dark-foreground/10 rounded-full text-sm text-surface-dark-foreground placeholder:text-surface-dark-foreground/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="px-4 py-3 space-y-1">
              {isAdmin && (
                <motion.button
                  onClick={() => {
                    navigate("/admin/produtos")
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-surface-dark-foreground/80 hover:text-primary py-2 text-sm font-medium uppercase tracking-wide transition-colors"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={spring}
                >
                  Admin
                </motion.button>
              )}

              {categorias.map((cat, i) => (
                <motion.button
                  key={cat}
                  onClick={() => {
                    navigate(`/categoria/${cat}`)
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-surface-dark-foreground/80 hover:text-primary py-2 text-sm font-medium uppercase tracking-wide transition-colors"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05, ...spring }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
