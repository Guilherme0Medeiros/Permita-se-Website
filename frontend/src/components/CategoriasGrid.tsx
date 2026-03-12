"use client"

import { MessageCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

// Função para deixar a primeira letra de cada palavra maiúscula
function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .replace(/\p{L}+/gu, (word) =>
      word.charAt(0).toLocaleUpperCase("pt-BR") + word.slice(1)
    )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
}

export default function CategoriasGrid() {
  const navigate = useNavigate()

  const categorias = [
    {
      id: 1,
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
      imagem:
        "https://img.freepik.com/fotos-gratis/retrato-ao-ar-livre-de-uma-mulher-caucasiana-com-macacao-classico-com-batom-vermelho-de-ferias-fora-do-hotel-villa_343596-420.jpg",
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
    {
      id: 6,
      nome: "jaquetas",
      titulo: "JAQUETAS EM SALE",
      imagem: "/img/jaquetas.jpg",
    },
  ]

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-surface-dark">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary-foreground uppercase tracking-tighter">
            Até 50% de Desconto nas Peças
          </h2>
          <p className="mt-4 text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Aproveite as últimas unidades com descontos incríveis!
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {categorias.map((categoria) => (
            <motion.div
              key={categoria.id}
              variants={itemVariants}
              className="group cursor-pointer flex flex-col items-center"
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/categoria/${categoria.nome}`)}
            >
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-orange-400 shadow-md group-hover:ring-orange-500 group-hover:shadow-xl transition-all duration-500">

                <img
                  src={categoria.imagem || "/placeholder.svg"}
                  alt={categoria.nome}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/10 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white text-sm sm:text-base font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">
                    {capitalizeWords(categoria.nome)}
                  </span>
                </div>
              </div>

              <h3 className="mt-4 text-primary-foreground text-sm sm:text-base font-bold uppercase tracking-wide text-center">
                {categoria.titulo}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Botão WhatsApp */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors duration-300">
          <MessageCircle size={24} />
        </button>
      </div>
    </section>
  )
}
