import { useState, useEffect } from "react";
import { Search, User, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StoreNavbarProps {
  cartItemCount: number;
  onCartClick: () => void;
}

const categorias = ["camisetas", "moletons", "calças", "acessórios", "canecas", "coleções"];

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function StoreNavbar({ cartItemCount, onCartClick }: StoreNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <motion.a
          href="/"
          className="font-display text-2xl sm:text-3xl font-extrabold text-surface-dark-foreground uppercase tracking-tighter"
          whileHover={{ scale: 1.02 }}
          transition={spring}
        >
          Permita-se
        </motion.a>

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
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button className="p-2 rounded-full text-surface-dark-foreground/80 hover:text-surface-dark-foreground hover:bg-surface-dark-foreground/10 transition-colors hidden md:flex">
            <User className="h-5 w-5" />
          </button>

          <button className="p-2 rounded-full text-surface-dark-foreground/80 hover:text-surface-dark-foreground hover:bg-surface-dark-foreground/10 transition-colors hidden md:flex">
            <Heart className="h-5 w-5" />
          </button>

          <motion.button
            onClick={onCartClick}
            className="p-2 rounded-full text-surface-dark-foreground/80 hover:text-surface-dark-foreground hover:bg-surface-dark-foreground/10 transition-colors relative"
            whileTap={{ scale: 0.9 }}
            transition={spring}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <motion.span
                className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={spring}
              >
                {cartItemCount}
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
        {isMobileMenuOpen && (
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
              {categorias.map((cat, i) => (
                <motion.button
                  key={cat}
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
  );
}
