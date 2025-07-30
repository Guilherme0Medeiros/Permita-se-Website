"use client"

interface ProductThumbnailsProps {
  images: string[] 
  activeIndex: number
  onImageSelect: (index: number) => void
}

export default function ProductThumbnails({
  images,
  activeIndex,
  onImageSelect,
}: ProductThumbnailsProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col space-y-2 max-h-96 overflow-y-auto pr-1">
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onImageSelect(index)}
          className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105
            ${activeIndex === index ? "border-orange-500 shadow-lg" : "border-gray-200 hover:border-gray-300"}
          `}
        >
          <img
            src={image || "/placeholder.svg"}
            alt={`Imagem ${index + 1}`}
            className="w-full h-full object-cover"
          />

          {activeIndex === index && (
            <div className="absolute inset-0 bg-orange-500 bg-opacity-20" />
          )}
        </button>
      ))}
    </div>
  );
}
