import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ProductThumbnails from "../components/ProductThumbnails";
import { Heart } from "lucide-react";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  imagem_url_final?: string;
  imagens_extra?: { imagem: string }[];
}

export default function ProductPage() {
  const { id } = useParams();
  const productId = Number(id);
  const [produto, setProduto] = useState<Produto | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [cep, setCep] = useState("");

  useEffect(() => {
    if (productId) {
      api
        .get(`/produtos/${productId}/`)
        .then((res) => setProduto(res.data))
        .catch((err) => console.error("Erro ao buscar produto:", err));
    }
  }, [productId]);

  if (!produto) return <p className="text-center p-6">Carregando produto...</p>;

  const images: string[] = [
    produto.imagem_url_final,
    ...(produto.imagens_extra?.map((img) => img.imagem) || []),
  ].filter(Boolean) as string[];

  const sizes = ["P", "M", "G", "GG"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lado Esquerdo - Imagens */}
        <div className="flex gap-4">
          {/* Thumbnails */}
          <div className="flex-shrink-0">
            <ProductThumbnails
              images={images} 
              activeIndex={activeImageIndex}
              onImageSelect={setActiveImageIndex}
            />
          </div>

          {/* Imagem Principal */}
          <div className="flex-1">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={images[activeImageIndex] || "/placeholder.svg"}
                alt="Produto Principal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Lado Direito - Informações */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900 flex-1">
              {produto.nome}
            </h1>
            <button className="ml-4 p-2 hover:bg-gray-100 rounded-full">
              <Heart className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <p className="text-sm text-gray-600">{produto.descricao}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                R$ {Number(produto.preco).toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                De: R$ 99,90
              </span>
              <span className="text-sm text-orange-500">sem juros</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                💎 3% OFF à vista no Pix
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Tamanho</h3>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 border rounded-lg font-medium transition-colors ${
                    selectedSize === size
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-medium transition-colors">
            🛒 ADICIONAR À SACOLA
          </button>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">
                Frete e prazo de entrega
              </span>
              <button className="text-sm text-blue-600 hover:underline">
                Não sei meu CEP 🔗
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="px-6 py-2 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
                CALCULAR
              </button>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-2">
                FRETE GRÁTIS EM TODO BRASIL
              </h4>
              <p className="text-sm text-orange-700">
                Acima de R$ 179,90 no Sul, Sudeste e C. Oeste.
                <br />
                Acima de R$ 199,90 no Norte e Nordeste.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
