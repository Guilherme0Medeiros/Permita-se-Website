import { useEffect, useState } from "react";

const banners = [
  "img/banner1.png",
  "img/banner2.png",
   "https://tfcprw.vtexassets.com/assets/vtex.file-manager-graphql/images/e68101bb-ddc3-47ea-88ec-9c73db561cff___992e3d61e2f9ddedb91663b083c35165.jpg",
];

// Autoplay pra trocar as imagens automaticamente
// O UseEffect é chamado quando o componente é montado e quando currentIndex muda
export default function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    // limpa o intervalo antigo de tempo quando muda a imagem
    return () => clearInterval(interval);
  }, [currentIndex]); // roda toda vez que currentIndex mudar

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[400px] overflow-hidden group">
      {/* Imagens */}
      <div className="w-full h-full relative z-0">
        {banners.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Banner ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
      </div>

      {/* Botões */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={prevSlide}
          className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
        >
          ❯
        </button>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 gap-2 z-30 hidden group-hover:flex">
        {banners.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === currentIndex ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
