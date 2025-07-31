"use client"

import { MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Função para deixar a primeira letra de cada palavra maiúscula
function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function CategoriasGrid() {
  const navigate = useNavigate()
  const categorias = [
    
    {
      id: 2,
      nome: "calças",
      titulo: "CALÇAS EM SALE",
      imagem: "/img/calcas.jpg",
    },
    
    {
      id: 2,
      nome: "blusas",
      titulo: "BLUSAS EM SALE",
      imagem: "/img/blusas.jpg",
    },
    {
      id: 3,
      nome: "macacões",
      titulo: "MACACÕES EM SALE",
      imagem: "https://img.freepik.com/fotos-gratis/retrato-ao-ar-livre-de-uma-mulher-caucasiana-com-macacao-classico-com-batom-vermelho-de-ferias-fora-do-hotel-villa_343596-420.jpg",
    },
    {
      id: 4,
      nome: "vestidos",
      titulo: "VESTIDOS EM SALE",
      imagem: "/img/vestidos.jpg",
    },
    {
      id: 5,
      nome: "shorts",
      titulo: "SHORTS EM SALE",
      imagem: "/img/shorts.jpg",
    },
    
  ]

  return (
    <div className="relative bg-red-900 py-12 md:py-20 px-6">
      {" "}
      <div className="text-center mb-12">
        <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
          até 50% de Desconto nas Peças
        </h2>
        <p className="text-orange-200 text-lg md:text-xl font-light max-w-2xl mx-auto">
          Aproveite as últimas unidades com descontos incríveis!
        </p>
      </div>
      {/* Grid de Categorias */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
          {categorias.map((categoria) => (
            <div key={categoria.id} className="flex flex-col items-center">
              {/* Círculo com imagem */}
              <div className="relative group cursor-pointer" onClick={() => navigate(`/categoria/${categoria.nome}`)}>
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-white shadow-xl transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl border-4 border-transparent group-hover:border-orange-400">
                  <img
                    src={categoria.imagem || "/placeholder.svg"}
                    alt={categoria.nome}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-lg md:text-xl font-bold">{capitalizeWords(categoria.nome)}</span>
                  </div>
                </div>
              </div>
              {/* Título da categoria */}
              <h3 className="mt-4 text-white text-base md:text-lg font-semibold tracking-wide uppercase">
                {categoria.titulo}
              </h3>
            </div>
          ))}
        </div>
      </div>
      {/* Ícone WhatsApp */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors duration-300">
          <MessageCircle size={24} />
        </button>
      </div>
    </div>
  )
}
