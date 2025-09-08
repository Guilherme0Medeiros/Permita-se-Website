"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { ProductCard } from "../components/ProductCard"
import BannerCarousel from "../components/BannerCarousel"
import CartSidebar from "../components/CartSidebar"
import ProductCarousel from "../components/ProductCarousel"
import CategoriasGrid from "../components/CategoriasGrid"
import Navbar from "../components/Navbar"
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
          return prev.map((item) => (item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item))
        } else {
          return [...prev, { ...produto, quantidade: 1 }]
        }
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
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item)))
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
          .map((item) => (item.id === id && item.quantidade > 1 ? { ...item, quantidade: item.quantidade - 1 } : item))
          .filter((item) => item.quantidade > 0),
      )
    } catch (error) {
      console.error("Erro ao diminuir quantidade:", error)
    }
  }

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } })
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 relative font-sans antialiased">
      {/* Navbar */}
      <Navbar isAuthenticated={isAuthenticated} logout={logout} cartItems={cartItems} setIsCartOpen={setIsCartOpen} />

      {/* Carrossel */}
      <BannerCarousel />

      {/* Produtos em destaque */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Peças Mais Amadas</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Selecionamos especialmente para você as peças que estão fazendo sucesso
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {produtos
              .filter((produto) => produto.em_promocao === true)
              .map((produto) => (
                <ProductCard
                  key={produto.id}
                  id={produto.id}
                  nome={produto.nome}
                  preco={produto.preco}
                  descricao={produto.descricao}
                  imagem={produto.imagem}
                  onAddToCart={handleAddToCart}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Encontre Seu Estilo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Navegue pelas nossas categorias e descubra peças perfeitas para cada ocasião
            </p>
          </div>
          <CategoriasGrid />
        </div>
      </section>

      {/* Carrossel com os produtos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 tracking-tight">
              Talvez você também goste
            </h2>
            <p className="text-lg text-gray-600 font-light">Seleções personalizadas baseadas no seu gosto</p>
          </div>
          <ProductCarousel
            produtos={produtos}
            onAddToCart={handleAddToCart}
            onClickCard={(id) => navigate(`/produto/${id}`)}
          />
        </div>
      </section>

      {/* Informações de Contato */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Fique Conectado</h2>
            <p className="text-xl text-gray-300 font-light">
              Siga-nos nas redes sociais e fique por dentro de todas as novidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Instagram */}
            <div className="text-center p-6 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📷</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Instagram</h3>
              <p className="text-gray-300 mb-4">Acompanhe nossos looks do dia e inspirações de moda</p>
              <a
                href="#"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                @permitase
              </a>
            </div>

            {/* WhatsApp */}
            <div className="text-center p-6 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-colors">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-bold mb-2">WhatsApp</h3>
              <p className="text-gray-300 mb-4">Tire suas dúvidas e receba atendimento personalizado</p>
              <a
                href="#"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Falar Conosco
              </a>
            </div>

            {/* Email */}
            <div className="text-center p-6 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-colors">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✉️</span>
              </div>
              <h3 className="text-xl font-bold mb-2">E-mail</h3>
              <p className="text-gray-300 mb-4">Entre em contato para parcerias e colaborações</p>
              <a
                href="mailto:contato@permitase.com"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                Enviar E-mail
              </a>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400">
              <div>
                <h4 className="font-semibold text-white mb-2">Horário de Atendimento</h4>
                <p>Segunda a Sexta: 9h às 18h</p>
                <p>Sábado: 9h às 14h</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Entrega</h4>
                <p>Frete grátis acima de R$ 199</p>
                <p>Entrega em todo o Brasil</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Troca e Devolução</h4>
                <p>30 dias para trocas</p>
                <p>Primeira troca grátis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sidebar do carrinho */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveAllItem}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onCheckout={handleCheckout}
      />
    </main>
  )
}
