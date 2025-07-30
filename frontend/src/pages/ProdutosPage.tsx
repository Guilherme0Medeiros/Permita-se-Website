import { useEffect, useState } from "react";
import api from "../services/api";

type Produto = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
};

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState<Partial<Produto>>({});

  const fetchProdutos = async () => {
    const res = await api.get("/produtos/");
    setProdutos(res.data);
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.id) {
      await api.put(`/produtos/${form.id}/`, form);
    } else {
      await api.post("/produtos/", form);
    }
    setForm({});
    fetchProdutos();
  };

  const handleEdit = (produto: Produto) => {
    setForm(produto);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/produtos/${id}/`);
    fetchProdutos();
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gerenciar Produtos</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input name="nome" placeholder="Nome" value={form.nome || ""} onChange={handleChange} required />
        <input name="descricao" placeholder="Descrição" value={form.descricao || ""} onChange={handleChange} />
        <input name="preco" type="number" placeholder="Preço" value={form.preco || ""} onChange={handleChange} />
        <input name="estoque" type="number" placeholder="Estoque" value={form.estoque || ""} onChange={handleChange} />
        <button type="submit">{form.id ? "Atualizar" : "Adicionar"}</button>
      </form>

      <ul>
        {produtos.map((produto) => (
          <li key={produto.id}>
            <strong>{produto.nome}</strong> - R${produto.preco} | Estoque: {produto.estoque}
            <button onClick={() => handleEdit(produto)}>Editar</button>
            <button onClick={() => handleDelete(produto.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
