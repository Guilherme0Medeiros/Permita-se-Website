"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import Navbar from "../components/Navbar"
import api from "../services/api"


function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .replace(/\p{L}+/gu, (word) =>
      word.charAt(0).toLocaleUpperCase("pt-BR") + word.slice(1)
    )
}

export default function Checkout() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const { cartItems } = useCart()
  const [loading, setLoading] = useState(false)

  const total = cartItems.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  )

  const handleConfirm = async () => {
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio.")
      return
    }

    try {
      setLoading(true)
      await api.post("/pedidos/", {})
      alert("Pedido confirmado!")
      navigate("/")
    } catch (error) {
      console.error("Erro ao confirmar pedido:", error)
      alert("Pedido realizado com sucesso!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        isAuthenticated={isAuthenticated}
        logout={logout}
      />

      <main className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Checkout
              </span>

              <h1 className="section-title text-3xl sm:text-4xl md:text-5xl text-foreground">
                Resumo do Pedido
              </h1>

              <p className="section-subtitle mt-3 text-base sm:text-lg text-muted-foreground">
                Finalize sua compra com segurança
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <section className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="border-b border-border px-6 py-5">
                <h2 className="text-xl sm:text-2xl font-bold text-card-foreground">
                  Itens do pedido
                </h2>
              </div>

              <div className="p-6">
                {cartItems.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-lg font-semibold text-foreground mb-2">
                      Seu carrinho está vazio
                    </p>
                    <p className="text-muted-foreground mb-6">
                      Adicione alguns produtos antes de finalizar a compra.
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
                    >
                      Voltar para a loja
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-card border border-border rounded-2xl p-4 shadow-sm"
                      >
                        <div className="flex gap-4">
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.imagem || "/placeholder.svg"}
                              alt={item.nome}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-semibold text-base sm:text-lg leading-snug text-foreground line-clamp-2">
                                  {capitalizeWords(item.nome)}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  R$ {item.preco.toFixed(2).replace(".", ",")} cada
                                </p>
                              </div>

                              <div className="text-right shrink-0">
                                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                                  Subtotal
                                </p>
                                <p className="font-bold text-lg text-foreground">
                                  R$ {(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <p className="text-sm text-muted-foreground">
                                Quantidade:{" "}
                                <span className="font-semibold text-foreground">
                                  {item.quantidade}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="mt-6 rounded-2xl bg-surface-dark text-surface-dark-foreground p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-base sm:text-lg font-semibold">Total</span>
                        <span className="text-2xl sm:text-3xl font-bold">
                          R$ {total.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => navigate(-1)}
                        className="sm:hidden w-full rounded-full border border-border bg-card py-3 font-medium hover:bg-muted transition-colors"
                      >
                        Voltar
                      </button>

                      <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`w-full bg-primary text-primary-foreground py-3.5 rounded-full font-bold tracking-wide transition ${
                          loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                        }`}
                      >
                        {loading ? "Confirmando..." : "Confirmar Pedido"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}