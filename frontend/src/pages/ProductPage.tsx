"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import CartSidebar from "../components/CartSidebar";
import ProductThumbnails from "../components/ProductThumbnails";
import { Heart } from "lucide-react";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao: string;         
  imagem: string;            
  quantidade: number;        
  em_promocao: boolean;      

  imagem_url_final?: string;
  imagens_extra?: { imagem: string }[];
}

export default function ProductPage() {
  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");

  const [cartItems, setCartItems] = useState<Produto[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (!productId) return;
    api
      .get(`/produtos/${productId}/`)
      .then((res) => {
        const p = res.data;
        
        const normalizado: Produto = {
          id: p.id,
          nome: p.nome,
          preco: Number(p.preco),
          descricao: p.descricao ?? "",
          imagem: p.imagem ?? p.imagem_url_final ?? "",
          quantidade: 1,
          em_promocao: !!p.em_promocao,
          imagem_url_final: p.imagem_url_final,
          imagens_extra: p.imagens_extra,
        };
        setProduto(normalizado);
      })
      .catch((err) => console.error("Erro ao buscar produto:", err));
  }, [productId]);

  if (!produto) return <p className="text-center p-6">Carregando produto...</p>;

  const images: string[] = [
    produto.imagem_url_final || produto.imagem,
    ...(produto.imagens_extra?.map((img) => img.imagem) || []),
  ].filter(Boolean) as string[];

  const handleAddToCart = async (id: number) => {
    try {
      await api.post("/carrinhos/adicionar-item/", { produto: id, quantidade: 1 });

      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === id);
        if (existingItem) {
          return prev.map((item) =>
            item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item
          );
        }
        return [
          ...prev,
          {
            ...produto,
            imagem: produto.imagem || produto.imagem_url_final || "",
            quantidade: 1,
          },
        ];
      });

      setIsCartOpen(true);
    } catch (error) {
      console.error("Erro ao adicionar item no carrinho:", error);
    }
  };

  const handleRemoveAllItem = async (id: number) => {
    try {
      const item = cartItems.find((i) => i.id === id);
      if (!item) return;

      await api.delete("/carrinhos/remover-item/", {
        data: { produto: id, quantidade: item.quantidade },
      });

      setCartItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Erro ao remover todo o item do carrinho:", error);
    }
  };

  const increaseQuantity = async (id: number) => {
    try {
      await api.post("/carrinhos/adicionar-item/", { produto: id, quantidade: 1 });
      setCartItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantidade: i.quantidade + 1 } : i))
      );
    } catch (error) {
      console.error("Erro ao aumentar quantidade:", error);
    }
  };

  const decreaseQuantity = async (id: number) => {
    try {
      await api.delete("/carrinhos/remover-item/", {
        data: { produto: id, quantidade: 1 },
      });
      setCartItems((prev) =>
        prev
          .map((i) =>
            i.id === id && i.quantidade > 1 ? { ...i, quantidade: i.quantidade - 1 } : i
          )
          .filter((i) => i.quantidade > 0)
      );
    } catch (error) {
      console.error("Erro ao diminuir quantidade:", error);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
  };

  return (
    <>
      {/* Navbar */}
      <Navbar
        isAuthenticated={true}
        logout={() => {}}
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
      />

      {/* Conteúdo da página */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lado Esquerdo - Imagens */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <ProductThumbnails
                images={images}
                activeIndex={activeImageIndex}
                onImageSelect={setActiveImageIndex}
              />
            </div>

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
                  De: R$ 199,99
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
                {["P", "M", "G", "GG"].map((size) => (
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

            <button
              onClick={() => handleAddToCart(produto.id)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-medium transition-colors"
            >
              🛒 ADICIONAR À SACOLA
            </button>

            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">
                  PROMOÇÃO DE LANÇAMENTO!!
                </h4>
                <p className="text-sm text-orange-700">
                  Tudo abaixo de R$ 199,99!.
                  <br />
                  3% de desconto à vista no Pix.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar do carrinho */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveAllItem}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onCheckout={handleCheckout}
      />
    </>
  );
}
