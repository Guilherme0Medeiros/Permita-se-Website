"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
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
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const { addToCart } = useCart()

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

  const produtosEmPromocao = produtos.filter((produto) => produto.em_promocao === true)

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar
        isAuthenticated={isAuthenticated}
        logout={logout}
      />

      <main>
        <BannerCarousel />

        <motion.section
          className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
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

            {produtosEmPromocao.length > 0 && (
              <motion.div
                key={produtosEmPromocao.length}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {produtosEmPromocao.map((produto) => (
                  <motion.div key={produto.id} variants={itemVariants}>
                    <ProductCard
                      id={produto.id}
                      nome={produto.nome}
                      preco={produto.preco}
                      descricao={produto.descricao}
                      imagem={produto.imagem}
                      em_promocao={produto.em_promocao}
                      onAddToCart={addToCart}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.section>

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

        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-muted/50">
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
              onAddToCart={addToCart}
              onClickCard={(id) => navigate(`/produto/${id}`)}
            />
          </div>
        </section>

        <Footer />
      </main>

      <CartSidebar />
    </div>
  )
}