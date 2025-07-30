import { useLocation, useNavigate } from "react-router-dom";
import { Produto } from "../types/types"; // (ou defina a interface localmente)
import { ArrowLeft } from "lucide-react";
import api from "../services/api";
import { useState } from "react";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems: Produto[] = location.state?.cartItems || [];

  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  const handleConfirm = async () => {
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio.");
      return;
    }

    try {
      setLoading(true);

      // Faz o POST para criar o pedido
      // No backend, o usuário já será identificado pelo token
      const response = await api.post("/pedidos/", {});

      alert("Pedido confirmado! 🎉");

      // Após confirmar, pode voltar para home ou limpar estado do carrinho se tiver
      navigate("/");

    } catch (error) {
      console.error("Erro ao confirmar pedido:", error);
      alert("Não foi possível confirmar o pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Topo */}
      <div className="bg-black text-white">
        <div className="text-sm py-4 border-b border-gray-800 flex justify-between px-6 items-center">
          <div className="text-orange-500 font-bold text-xl">Shop Easy</div>
          <p className="text-orange-400">🛒 Finalize seu pedido com segurança</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm hover:underline"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
        </div>
      </div>

      <section className="p-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Resumo do Pedido</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Seu carrinho está vazio.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="border p-4 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.nome}</p>
                  <p className="text-sm text-gray-500">
                    Quantidade: {item.quantidade}
                  </p>
                </div>
                <p className="font-semibold">
                  R$ {(item.preco * item.quantidade).toFixed(2)}
                </p>
              </div>
            ))}

            <div className="border-t pt-4 mt-4 flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`mt-6 w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Confirmando..." : "Confirmar Pedido"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
