import { X, Plus, Minus } from "lucide-react";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  quantidade: number;
  imagem?: string;
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

function capitalizeWords(str: string) {
  return str
    .toLowerCase()
    .replace(/\p{L}+/gu, (word) =>
      word.charAt(0).toLocaleUpperCase("pt-BR") + word.slice(1)
    );
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
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-background text-foreground shadow-2xl transform transition-transform duration-300 z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-card">
          <div>
            <h2 className="text-xl font-bold">Seu Carrinho</h2>
            <p className="text-sm text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? "item" : "itens"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Product list*/}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <p className="text-lg font-semibold mb-2">Seu carrinho está vazio</p>
              <p className="text-sm text-muted-foreground">
                Adicione alguns produtos para continuar.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-2xl p-3 shadow-sm"
              >
                <div className="flex gap-3">
                  {/* Imagem */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.imagem || "/placeholder.svg"}
                      alt={item.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* car content  */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm leading-snug text-foreground line-clamp-2">
                          {capitalizeWords(item.nome)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          R$ {item.preco.toFixed(2).replace(".", ",")} cada
                        </p>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-muted transition-colors flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* quantity */}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center bg-muted rounded-full border border-border overflow-hidden">
                        <button
                          onClick={() => onDecrease(item.id)}
                          className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-10 text-center text-sm font-semibold">
                          {item.quantidade}
                        </span>

                        <button
                          onClick={() => onIncrease(item.id)}
                          className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Subtotal</p>
                        <p className="font-bold text-foreground">
                          R$ {(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        
        {cartItems.length > 0 && (
          <div className="border-t border-border bg-card px-5 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Total</span>
              <span className="text-2xl font-bold">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-bold tracking-wide hover:opacity-90 transition"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </aside>
    </>
  );
}