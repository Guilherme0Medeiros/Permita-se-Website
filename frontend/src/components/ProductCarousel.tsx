"use client";
import { useRef, useState, useEffect } from "react";
import { ProductCard } from "../components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const minSwipeDistance = 50

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
   
  /* Swipe mobile */

const onTouchStart = (e: React.TouchEvent) => {
  setTouchEnd(null)
  setTouchStart(e.targetTouches[0].clientX)
}

const onTouchMove = (e: React.TouchEvent) => {
  setTouchEnd(e.targetTouches[0].clientX)
}

const onTouchEnd = () => {
  if (!touchStart || !touchEnd) return

  const distance = touchStart - touchEnd

  if (distance > minSwipeDistance) {
    scroll("right")
  }

  if (distance < -minSwipeDistance) {
    scroll("left")
  }
}
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
      <div className="relative group">
        {/* left button ) */}
        <button
  onClick={() => scroll("left")}
  aria-label="Voltar"
  disabled={currentPage === 0}
  className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white/90 backdrop-blur-md backdrop-blur-sm text-foreground p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-30"
>
  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
</button>

        {/* right button ) */}
       <button
  onClick={() => scroll("right")}
  aria-label="Avançar"
  disabled={(currentPage + 1) * produtosPorPagina >= produtos.length}
  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white/90 backdrop-blur-md backdrop-blur-sm text-foreground p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-30"
>
  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
</button>


        {/* Carrossel */}
        <div
  ref={carouselRef}
  className="flex overflow-hidden"
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
>
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
              className={`h-1.5 rounded-full transition-all duration-500 ${
  index === currentPage
    ? "w-8 bg-primary"
    : "w-3 bg-foreground/30 hover:bg-foreground/50"
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
