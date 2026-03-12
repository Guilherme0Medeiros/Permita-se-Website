"use client"

import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"

interface ProductCardProps {
  id: number
  nome: string
  preco: number
  descricao?: string
  onAddToCart: (id: number) => void
  imagem?: string
  em_promocao?: boolean
}

// Função para deixar a primeira letra de cada palavra maiúscula
function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .replace(/\p{L}+/gu, (word) =>
      word.charAt(0).toLocaleUpperCase("pt-BR") + word.slice(1)
    )
}

const spring = { type: "spring" as const, stiffness: 300, damping: 20 }

export function ProductCard({
  id,
  nome,
  preco,
  descricao,
  onAddToCart,
  imagem,
  em_promocao,
}: ProductCardProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      className="group relative flex flex-col h-full bg-card rounded-lg overflow-hidden cursor-pointer card-shadow hover:card-shadow-hover transition-shadow duration-300"
      whileHover={{ y: -6 }}
      transition={spring}
      onClick={() => navigate(`/produto/${id}`)}
    >
      {/* Image */}
      <div className="aspect-[3/4] relative overflow-hidden">
        {imagem ? (
          <img
            src={imagem || "/placeholder.svg"}
            alt={nome}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
            <span>Imagem</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {em_promocao && (
  <motion.span
    className="absolute top-3 right-3 bg-yellow-400 text-black text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm"
    initial={{ scale: 0, y: -8 }}
    animate={{ scale: 1, y: 0 }}
    transition={spring}
  >
    Promoção
  </motion.span>
)}

        
        <motion.button
          onClick={(e) => {
            e.stopPropagation()
            onAddToCart(id)
          }}
          className="absolute bottom-3 right-3 bg-primary text-primary-foreground p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={spring}
        >
          <ShoppingCart className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-sm text-card-foreground leading-snug mb-1">
          {capitalizeWords(nome)}
        </h3>

        {descricao && (
          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
            {descricao.substring(0, 60)}
          </p>
        )}

        <div className="mt-auto pt-2">
          <span className="text-lg font-bold text-foreground">
            R$ {preco.toFixed(2).replace(".", ",")}
          </span>
          <span className="block text-xs text-muted-foreground mt-0.5">
            ou 3x de R$ {(preco / 3).toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
