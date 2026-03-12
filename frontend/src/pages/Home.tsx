"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { ProductCard } from "../components/ProductCard"
import BannerCarousel from "../components/BannerCarousel"
import CartSidebar from "../components/CartSidebar"
import ProductCarousel from "../components/ProductCarousel"
import CategoriasGrid from "../components/CategoriasGrid"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import api from "../services/api"

interface Produto {
  id: number
  nome: string
  preco: number
  descricao: string
  imagem: string
  quantidade: number
  em_promocao: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
}

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [cartItems, setCartItems] = useState<Produto[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    api
      .get("/produtos/")
      .then((res) => {
        setProdutos(
          res.data.results.map((p: any) => ({
            ...p,
            preco: Number(p.preco),
            quantidade: 1,
          })),
        )
      })
      .catch(console.error)
  }, [])

  const handleAddToCart = async (id: number) => {
    const produto = produtos.find((p) => p.id === id)
    if (!produto) return

    try {
      await api.post("/carrinhos/adicionar-item/", {
        produto: id,
        quantidade: 1,
      })

      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === id)
        if (existingItem) {
          return prev.map((item) =>
            item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
          )
        }

        return [...prev, { ...produto, quantidade: 1 }]
      })

      setIsCartOpen(true)
    } catch (error) {
      console.error("Erro ao adicionar item no carrinho:", error)
    }
  }

  const handleRemoveAllItem = async (id: number) => {
    try {
      const item = cartItems.find((item) => item.id === id)
      if (!item) return

      await api.delete("/carrinhos/remover-item/", {
        data: { produto: id, quantidade: item.quantidade },
      })

      setCartItems((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Erro ao remover todo o item do carrinho:", error)
    }
  }

  const increaseQuantity = async (id: number) => {
    try {
      await api.post("/carrinhos/adicionar-item/", {
        produto: id,
        quantidade: 1,
      })

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
        )
      )
    } catch (error) {
      console.error("Erro ao aumentar quantidade:", error)
    }
  }

  const decreaseQuantity = async (id: number) => {
    try {
      await api.delete("/carrinhos/remover-item/", {
        data: {
          produto: id,
          quantidade: 1,
        },
      })

      setCartItems((prev) =>
        prev
          .map((item) =>
            item.id === id && item.quantidade > 1
              ? { ...item, quantidade: item.quantidade - 1 }
              : item
          )
          .filter((item) => item.quantidade > 0)
      )
    } catch (error) {
      console.error("Erro ao diminuir quantidade:", error)
    }
  }

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } })
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar
        isAuthenticated={isAuthenticated}
        logout={logout}
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
      />

      <main>
        <BannerCarousel />

        {/* Produtos em destaque */}
        <motion.section
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div variants={itemVariants} className="text-center mb-12">
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Em Destaque
              </span>

              <h2 className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
                Peças Mais Amadas
              </h2>

              <p className="section-subtitle mt-4 text-lg max-w-2xl mx-auto">
                Selecionamos especialmente para você as peças que estão fazendo sucesso
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {produtos
                .filter((produto) => produto.em_promocao === true)
                .map((produto) => (
                  <motion.div key={produto.id} variants={itemVariants}>
                    <ProductCard
                      id={produto.id}
                      nome={produto.nome}
                      preco={produto.preco}
                      descricao={produto.descricao}
                      imagem={produto.imagem}
                      em_promocao={produto.em_promocao}
                      onAddToCart={handleAddToCart}
                    />
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Categorias */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Categorias
              </span>

              <h2 className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
                Encontre Seu Estilo
              </h2>

              <p className="section-subtitle mt-4 text-lg max-w-2xl mx-auto">
                Navegue pelas nossas categorias e descubra peças perfeitas para cada ocasião
              </p>
            </motion.div>
          </div>
          
        </section>
         <CategoriasGrid />
        {/* Carrossel com os produtos */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/50 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <h2 className="section-title text-3xl sm:text-4xl md:text-5xl text-foreground">
                Talvez Você Também Goste
              </h2>

              <p className="section-subtitle mt-4 text-lg">
                Seleções personalizadas baseadas no seu gosto
              </p>
            </motion.div>

            <ProductCarousel
              produtos={produtos}
              onAddToCart={handleAddToCart}
              onClickCard={(id) => navigate(`/produto/${id}`)}
              
            />
          </div>
        </section>
        <Footer />
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveAllItem}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onCheckout={handleCheckout}
      />
    </div>
  )
}
