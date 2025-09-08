"use client"

import { useNavigate } from "react-router-dom"

interface ProductCardProps {
  id: number
  nome: string
  preco: number
  descricao?: string
  onAddToCart: (id: number) => void
  imagem?: string
}

// Função para deixar a primeira letra de cada palavra maiúscula
function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .replace(/\p{L}+/gu, (word) => 
      word.charAt(0).toLocaleUpperCase("pt-BR") + word.slice(1)
    )
}

export function ProductCard({ id, nome, preco, descricao, onAddToCart, imagem }: ProductCardProps) {
  const navigate = useNavigate()

  return (
    <div
      className="group bg-white rounded-b-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-500 max-w-xs border border-gray-100 hover:border-orange-200 cursor-pointer"
      onClick={() => navigate(`/produto/${id}`)} // 🔹 clicou, vai pro produto
    >
      <div className="aspect-[3/4] relative overflow-hidden rounded-none">
        {imagem ? (
          <img
            src={imagem || "/placeholder.svg"}
            alt={nome}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            <span>Imagem</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      <div className="p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
          {capitalizeWords(nome)}
        </h3>
        {descricao && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {descricao.substring(0, 60)}...
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-gray-900">R$ {preco.toFixed(2)}</span>
            <span className="text-sm text-gray-500">ou 3x sem juros</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation() // 🔹 evita disparar o clique do card
              onAddToCart(id)
            }}
            className="bg-black hover:bg-orange-500 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}
