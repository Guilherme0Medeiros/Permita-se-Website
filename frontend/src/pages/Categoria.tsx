import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import Navbar from "../components/Navbar"
import CartSidebar from "../components/CartSidebar"
import { ProductCard } from "../components/ProductCard"
import api from "../services/api"

interface Produto {
  id: number
  nome: string
  preco: number
  descricao: string
  imagem: string
  quantidade: number
  categoria: { nome: string }
}

export default function Categoria() {
  const { nome } = useParams<{ nome: string }>()
  const [produtos, setProdutos] = useState<Produto[]>([])
  const { isAuthenticated, logout } = useAuth()
  const { addToCart } = useCart()

  useEffect(() => {
    if (!nome) return

    api
      .get(`/produtos/?categoria__nome=${nome}`)
      .then((res) => {
        setProdutos(
          res.data.results.map((p: any) => ({
            ...p,
            preco: Number(p.preco),
            quantidade: 1,
          }))
        )
      })
      .catch((error) => {
        console.error("Erro ao carregar produtos da categoria:", error)
      })
  }, [nome])

  return (
    <main className="min-h-screen bg-white text-gray-900 relative">
      <Navbar
        isAuthenticated={isAuthenticated}
        logout={logout}
      />

      <section className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 capitalize">
          Categoria: {nome}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtos.length === 0 ? (
            <p className="text-gray-500">Nenhum produto encontrado.</p>
          ) : (
            produtos.map((produto) => (
              <ProductCard
                key={produto.id}
                id={produto.id}
                nome={produto.nome}
                preco={produto.preco}
                descricao={produto.descricao}
                imagem={produto.imagem}
                onAddToCart={addToCart}
              />
            ))
          )}
        </div>
      </section>

      <CartSidebar />
    </main>
  )
}