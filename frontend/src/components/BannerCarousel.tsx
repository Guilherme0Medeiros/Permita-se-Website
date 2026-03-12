import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&q=80",
    title: "Nova Coleção",
    subtitle: "Chegou a coleção que vai transformar seu guarda-roupa",
    cta: "Ver Coleção",
  },
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
    title: "Até 50% Off",
    subtitle: "Promoções imperdíveis em peças selecionadas",
    cta: "Aproveitar",
  },
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80",
    title: "Edição Limitada",
    subtitle: "Peças exclusivas que você não encontra em outro lugar",
    cta: "Explorar",
  },
];

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((p) => (p + 1) % banners.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => (p === 0 ? banners.length - 1 : p - 1));
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden bg-surface-dark group">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img
            src={banners[current].image}
            alt={banners[current].title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 via-surface-dark/20 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-end pb-16 sm:pb-24 px-6 sm:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto w-full">
              <motion.span
                className="inline-block bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, ...spring }}
              >
                Destaque
              </motion.span>
              <motion.h1
                className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold text-surface-dark-foreground uppercase tracking-tighter leading-none mb-3"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, ...spring }}
                style={{ textWrap: "balance" }}
              >
                {banners[current].title}
              </motion.h1>
              <motion.p
                className="text-surface-dark-foreground/80 text-lg sm:text-xl max-w-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, ...spring }}
              >
                {banners[current].subtitle}
              </motion.p>
              <motion.button
                className="bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded-full text-sm uppercase tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, ...spring }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {banners[current].cta}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 bg-surface-dark-foreground/10 hover:bg-surface-dark-foreground/20 backdrop-blur-sm text-surface-dark-foreground p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 bg-surface-dark-foreground/10 hover:bg-surface-dark-foreground/20 backdrop-blur-sm text-surface-dark-foreground p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? "w-8 bg-primary" : "w-3 bg-surface-dark-foreground/40 hover:bg-surface-dark-foreground/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
