import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
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
  const [cartItems, setCartItems] = useState<Produto[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

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

  const handleAddToCart = async (id: number) => {
    const produto = produtos.find((p) => p.id === id)
    if (!produto) return

    try {
      await api.post("/carrinhos/adicionar-item/", {
        produto: id,
        quantidade: 1,
      })

      setCartItems((prev) => {
        const existente = prev.find((item) => item.id === id)
        if (existente) {
          return prev.map((item) =>
            item.id === id
              ? { ...item, quantidade: item.quantidade + 1 }
              : item
          )
        }
        return [...prev, { ...produto, quantidade: 1 }]
      })

      setIsCartOpen(true)
    } catch (error) {
      console.error("Erro ao adicionar item ao carrinho:", error)
    }
  }

  const handleRemoveAllItem = async (id: number) => {
    const item = cartItems.find((i) => i.id === id)
    if (!item) return

    try {
      await api.delete("/carrinhos/remover-item/", {
        data: { produto: id, quantidade: item.quantidade },
      })

      setCartItems((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Erro ao remover item:", error)
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
          item.id === id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      )
    } catch (error) {
      console.error("Erro ao aumentar quantidade:", error)
    }
  }

  const decreaseQuantity = async (id: number) => {
    try {
      await api.delete("/carrinhos/remover-item/", {
        data: { produto: id, quantidade: 1 },
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
    <main className="min-h-screen bg-white text-gray-900 relative">
      {/* Navbar */}
      <Navbar
        isAuthenticated={isAuthenticated}
        logout={logout}
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
      />

      {/* Título da Categoria */}
      <section className="p-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 capitalize">
          Categoria: {nome}
        </h2>

        {/* Grid de Produtos */}
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
                onAddToCart={handleAddToCart}
              />
            ))
          )}
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
