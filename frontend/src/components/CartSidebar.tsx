import { X, Plus, Minus } from "lucide-react";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Produto[];
  onRemoveItem: (id: number) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onCheckout: () => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onIncrease,
  onDecrease,
  onCheckout,
}: CartSidebarProps) {
  const total = cartItems.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Cabeçalho */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Seu Carrinho</h2>
        <button onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      {/* Lista de itens */}
      <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Seu carrinho está vazio.</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-start border-b pb-2"
            >
              <div className="flex flex-col gap-1 w-full">
                <p className="font-medium">{item.nome}</p>
                <p className="text-sm text-gray-600">
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => onDecrease(item.id)}
                    className="text-gray-600 hover:text-black border rounded px-1"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm">{item.quantidade}</span>
                  <button
                    onClick={() => onIncrease(item.id)}
                    className="text-gray-600 hover:text-black border rounded px-1"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-gray-500 hover:text-red-600"
              >
                <X size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Rodapé */}
      {cartItems.length > 0 && (
        <div className="p-4 border-t mt-auto">
          <div className="flex justify-between font-semibold mb-4">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Finalizar Compra
          </button>
        </div>
      )}
    </div>
  );
}
