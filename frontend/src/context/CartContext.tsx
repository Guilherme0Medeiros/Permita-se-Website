"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext"
import api from "../services/api"

export interface ProdutoCarrinho {
  id: number
  nome: string
  preco: number
  descricao?: string
  imagem?: string
  quantidade: number
  em_promocao?: boolean
}

interface ItemCarrinhoApi {
  id: number
  produto: number
  produto_nome: string
  produto_preco: string
  produto_imagem?: string
  quantidade: number
}

interface CarrinhoApiResponse {
  id: number
  usuario: number
  itens: ItemCarrinhoApi[]
}

interface CartContextType {
  cartItems: ProdutoCarrinho[]
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  fetchCart: () => Promise<void>
  addToCart: (id: number) => Promise<void>
  removeAllItem: (id: number) => Promise<void>
  increaseQuantity: (id: number) => Promise<void>
  decreaseQuantity: (id: number) => Promise<void>
  handleCheckout: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<ProdutoCarrinho[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const mapCarrinhoApiToProduto = (data: CarrinhoApiResponse): ProdutoCarrinho[] => {
    return data.itens.map((item) => ({
      id: item.produto,
      nome: item.produto_nome,
      preco: Number(item.produto_preco),
      descricao: "",
      imagem: item.produto_imagem || "/placeholder.svg",
      quantidade: item.quantidade,
      em_promocao: false,
    }))
  }

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([])
      return
    }

    try {
      const response = await api.get("/carrinhos/meu-carrinho/")
      const itensFormatados = mapCarrinhoApiToProduto(response.data)
      setCartItems(itensFormatados)
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [isAuthenticated])

  const addToCart = async (id: number) => {
    try {
      await api.post("/carrinhos/adicionar-item/", {
        produto: id,
        quantidade: 1,
      })

      await fetchCart()
      setIsCartOpen(true)
    } catch (error) {
      console.error("Erro ao adicionar item no carrinho:", error)
    }
  }

  const removeAllItem = async (id: number) => {
    try {
      const item = cartItems.find((item) => item.id === id)
      if (!item) return

      await api.delete("/carrinhos/remover-item/", {
        data: { produto: id, quantidade: item.quantidade },
      })

      await fetchCart()
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

      await fetchCart()
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

      await fetchCart()
    } catch (error) {
      console.error("Erro ao diminuir quantidade:", error)
    }
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        fetchCart,
        addToCart,
        removeAllItem,
        increaseQuantity,
        decreaseQuantity,
        handleCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart deve ser usado dentro de <CartProvider>")
  }

  return context
}