"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import Navbar from "../components/Navbar"
import CartSidebar from "../components/CartSidebar"
import ProductThumbnails from "../components/ProductThumbnails"
import { Heart } from "lucide-react"

// capitalize the first letter of each word
function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .replace(/\p{L}+/gu, (word) =>
      word.charAt(0).toLocaleUpperCase("pt-BR") + word.slice(1)
    )
}

interface Produto {
  id: number
  nome: string
  preco: number
  descricao: string
  imagem: string
  quantidade: number
  em_promocao: boolean
  imagem_url_final?: string
  imagens_extra?: { imagem: string }[]
}

export default function ProductPage() {
  const { id } = useParams()
  const productId = Number(id)
  const navigate = useNavigate()

  const [produto, setProduto] = useState<Produto | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")

  const [cartItems, setCartItems] = useState<Produto[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    if (!productId) return
    api
      .get(`/produtos/${productId}/`)
      .then((res) => {
        const p = res.data

        const normalizado: Produto = {
          id: p.id,
          nome: p.nome,
          preco: Number(p.preco),
          descricao: p.descricao ?? "",
          imagem: p.imagem ?? p.imagem_url_final ?? "",
          quantidade: 1,
          em_promocao: !!p.em_promocao,
          imagem_url_final: p.imagem_url_final,
          imagens_extra: p.imagens_extra,
        }
        setProduto(normalizado)
      })
      .catch((err) => console.error("Erro ao buscar produto:", err))
  }, [productId])

  if (!produto) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar
          isAuthenticated={true}
          logout={() => {}}
          cartItems={cartItems}
          setIsCartOpen={setIsCartOpen}
        />
        <p className="text-center p-10 text-muted-foreground">Carregando produto...</p>
      </div>
    )
  }

  const images: string[] = [
    produto.imagem_url_final || produto.imagem,
    ...(produto.imagens_extra?.map((img) => img.imagem) || []),
  ].filter(Boolean) as string[]

  const handleAddToCart = async (id: number) => {
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
        return [
          ...prev,
          {
            ...produto,
            imagem: produto.imagem || produto.imagem_url_final || "",
            quantidade: 1,
          },
        ]
      })

      setIsCartOpen(true)
    } catch (error) {
      console.error("Erro ao adicionar item no carrinho:", error)
    }
  }

  const handleRemoveAllItem = async (id: number) => {
    try {
      const item = cartItems.find((i) => i.id === id)
      if (!item) return

      await api.delete("/carrinhos/remover-item/", {
        data: { produto: id, quantidade: item.quantidade },
      })

      setCartItems((prev) => prev.filter((i) => i.id !== id))
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
        prev.map((i) =>
          i.id === id ? { ...i, quantidade: i.quantidade + 1 } : i
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
          .map((i) =>
            i.id === id && i.quantidade > 1
              ? { ...i, quantidade: i.quantidade - 1 }
              : i
          )
          .filter((i) => i.quantidade > 0)
      )
    } catch (error) {
      console.error("Erro ao diminuir quantidade:", error)
    }
  }

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } })
  }

  return (
    <>
      <Navbar
        isAuthenticated={true}
        logout={() => {}}
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
      />

      <main className="min-h-screen bg-background text-foreground">
        <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Imagem product */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <ProductThumbnails
                    images={images}
                    activeIndex={activeImageIndex}
                    onImageSelect={setActiveImageIndex}
                  />
                </div>

                <div className="flex-1">
                  <div className="relative aspect-square bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <img
                      src={images[activeImageIndex] || "/placeholder.svg"}
                      alt="Produto Principal"
                      className="w-full h-full object-cover"
                    />

                    {produto.em_promocao && (
                      <span className="absolute top-4 right-4 bg-yellow-400 text-black text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm">
                        Promoção
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* product information */}
              <div className="space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                      Produto
                    </span>

                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                      {capitalizeWords(produto.nome)}
                    </h1>
                  </div>

                  <button className="p-3 rounded-full border border-border bg-card hover:bg-muted transition-colors">
                    <Heart className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <p className="text-base text-muted-foreground leading-relaxed">
                  {produto.descricao}
                </p>

                <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-3xl font-bold text-foreground">
                      R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
                    </span>

                    <span className="text-sm text-muted-foreground line-through">
                      De: R$ 199,99
                    </span>

                    <span className="text-sm text-primary font-medium">
                      sem juros
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      💎 3% OFF à vista no Pix
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Tamanho</h3>

                  <div className="flex gap-2 flex-wrap">
                    {["P", "M", "G", "GG"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 rounded-xl border font-medium transition-all ${
                          selectedSize === size
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card hover:border-primary/40 hover:bg-muted"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(produto.id)}
                  className="w-full bg-primary hover:opacity-90 text-primary-foreground py-4 rounded-full font-bold tracking-wide transition"
                >
                  🛒 ADICIONAR À SACOLA
                </button>

                <div className="bg-surface-dark text-surface-dark-foreground rounded-2xl p-5 border border-white/10">
                  <h4 className="font-bold mb-2 uppercase tracking-wide text-sm">
                    Promoção de lançamento
                  </h4>
                  <p className="text-sm text-surface-dark-foreground/80 leading-relaxed">
                    Tudo abaixo de R$ 199,99.
                    <br />
                    3% de desconto à vista no Pix.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
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
    </>
  )
}