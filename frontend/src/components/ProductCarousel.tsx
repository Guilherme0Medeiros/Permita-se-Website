"use client";
import { useRef, useState, useEffect } from "react";
import { ProductCard } from "../components/ProductCard";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  descricao?: string;
}

export default function ProductCarousel({
  produtos,
  onAddToCart,
  onClickCard,
}: {
  produtos: Produto[];
  onAddToCart: (id: number) => void;
  onClickCard: (id: number) => void;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [produtosPorPagina, setProdutosPorPagina] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setProdutosPorPagina(1);
      } else if (width < 768) {
        setProdutosPorPagina(2);
      } else if (width < 1024) {
        setProdutosPorPagina(3);
      } else {
        setProdutosPorPagina(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(produtos.length / produtosPorPagina);

  const scroll = (direction: "left" | "right") => {
    const nextPage =
      direction === "right"
        ? Math.min(currentPage + 1, totalPages - 1)
        : Math.max(currentPage - 1, 0);
    setCurrentPage(nextPage);
  };

  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    setIsTransitioning(true);
    const containerWidth = carousel.offsetWidth;
    const newTranslateX = -containerWidth * currentPage;

    const inner = carousel.querySelector<HTMLDivElement>("[data-carousel-inner]");
    if (inner) {
      inner.style.transform = `translateX(${newTranslateX}px)`;
    }

    const timeout = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timeout);
  }, [currentPage, produtosPorPagina]);

  return (
    <div className="p-6 w-full max-w-[1400px] mx-auto">
      <div className="relative">
        {/* Botão esquerdo (somente seta grande laranja) */}
        <button
          className="absolute z-10 left-0 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600 transition disabled:opacity-30"
          style={{ left: "-24px", fontSize: "60px", lineHeight: "1" }}
          onClick={() => scroll("left")}
          aria-label="Voltar"
          disabled={currentPage === 0}
        >
          &#x2039;
        </button>

        {/* Botão direito (somente seta grande laranja) */}
        <button
          className="absolute z-10 right-0 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600 transition disabled:opacity-30"
          style={{ right: "-24px", fontSize: "60px", lineHeight: "1" }}
          onClick={() => scroll("right")}
          aria-label="Avançar"
          disabled={(currentPage + 1) * produtosPorPagina >= produtos.length}
        >
          &#x203A;
        </button>

        {/* Carrossel */}
        <div ref={carouselRef} className="flex overflow-hidden">
          <div
            data-carousel-inner
            className="flex gap-6 transition-transform duration-700 ease-in-out"
            style={{
              minWidth: "100%",
              flexWrap: "nowrap",
            }}
          >
            {[...produtos, ...produtos.slice(0, produtosPorPagina)].map((produto, index) => (
              <div
                key={index}
                className="flex-shrink-0"
                style={{ width: `calc(100% / ${produtosPorPagina})` }}
              >
                <ProductCard
                  id={produto.id}
                  nome={produto.nome}
                  preco={produto.preco}
                  imagem={produto.imagem}
                  descricao={produto.descricao}
                  onAddToCart={onAddToCart}
                  onClick={() => onClickCard(produto.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botões de Paginação (dots) */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`w-8 h-1 rounded-sm transition-colors duration-300 ${
                index === currentPage ? "bg-orange-500" : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => goToPage(index)}
              aria-label={`Ir para a página ${index + 1}`}
              disabled={isTransitioning}
            />
          ))}
        </div>
      )}
    </div>
  );
}
