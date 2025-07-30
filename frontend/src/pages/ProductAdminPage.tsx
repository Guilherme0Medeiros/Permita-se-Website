import { useEffect, useState } from "react";
import api from "../services/api";
import { ProductCard } from "../components/ProductCard";

interface Categoria {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  imagem?: string;
  estoque: number;
  quantidade: number;
  categoria?: Categoria;
  em_promocao: boolean;
  em_destaque: boolean;
  em_carrosel: boolean;
}

export default function ProductAdminPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [galeriaFiles, setGaleriaFiles] = useState<File[]>([]);
  const [form, setForm] = useState({
    id: 0,
    nome: "",
    preco: 0,
    descricao: "",
    imagem: "",
    imagemFile: null as File | null,
    estoque: 0,
    categoria: 0,
    em_promocao: false,
    em_destaque: false,
    em_carrosel: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProdutos();
    fetchCategorias();
  }, []);

  const fetchProdutos = () => {
    api
      .get("/produtos/")
      .then((res) => {
        const data = res.data?.results ?? res.data;
        if (Array.isArray(data)) {
          setProdutos(
            data.map((p: any) => ({
              ...p,
              preco: Number(p.preco),
              quantidade: 1,
              estoque: p.estoque ?? 0,
              categoria: p.categoria,
            }))
          );
        } else {
          console.error("Formato inválido de resposta da API:", res.data);
        }
      })
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  };

  const fetchCategorias = () => {
    api
      .get("/categorias/")
      .then((res) => {
        const data = res.data?.results ?? res.data;
        setCategorias(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Erro ao carregar categorias:", err));
  };

  const criarNovaCategoria = async () => {
    if (!novaCategoria.trim()) return;
    try {
      const response = await api.post("/categorias/", { nome: novaCategoria });
      setCategorias((prev) => [...prev, response.data]);
      setForm((prev) => ({ ...prev, categoria: response.data.id }));
      setNovaCategoria("");
    } catch (err) {
      console.error("Erro ao criar categoria:", err);
    }
  };

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value, type } = e.target;
  const isCheckbox = type === "checkbox";
  const checked = isCheckbox ? (e.target as HTMLInputElement).checked : undefined;

  setForm((prev) => ({
    ...prev,
    [name]: isCheckbox
      ? checked
      : name === "preco" || name === "estoque" || name === "categoria"
      ? Number(value)
      : value,
  }));
};

  const resetForm = () => {
    setForm({
      id: 0,
      nome: "",
      preco: 0,
      descricao: "",
      imagem: "",
      imagemFile: null,
      estoque: 0,
      categoria: 0,
      em_promocao: false,
      em_destaque: false,
      em_carrosel: false,
    });
    setGaleriaFiles([]);
    setIsEditing(false);
  };

  const handleUploadGaleria = async (produtoId: number) => {
    if (galeriaFiles.length === 0) return;

    const uploads = galeriaFiles.map(async (file) => {
      const data = new FormData();
      data.append("produto", String(produtoId));
      data.append("imagem", file);

      return api.post("/imagens/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    });

    try {
      await Promise.all(uploads);
      alert("Imagens extras enviadas!");
      setGaleriaFiles([]);
    } catch (err) {
      console.error("Erro ao enviar imagens extras:", err);
      alert("Erro ao enviar imagens da galeria.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      id, nome, preco, descricao, imagem, imagemFile, estoque, categoria,
      em_promocao, em_destaque, em_carrosel,
    } = form;

    if (!nome || preco <= 0 || estoque < 0) {
      alert("Preencha nome, preço (> 0) e estoque (>= 0) corretamente!");
      return;
    }

    try {
      const data = new FormData();
      data.append("nome", nome);
      data.append("preco", preco.toString());
      data.append("descricao", descricao);
      data.append("estoque", estoque.toString());
      if (categoria > 0) data.append("categoria", categoria.toString());

      data.append("em_promocao", String(em_promocao));
      data.append("em_destaque", String(em_destaque));
      data.append("em_carrosel", String(em_carrosel));

      if (imagemFile) {
        data.append("imagem", imagemFile);
      } else if (imagem) {
        data.append("imagem_url", imagem);
      }

      let response;
      if (isEditing) {
        response = await api.patch(`/produtos/${id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await api.post("/produtos/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const produtoId = response?.data?.id ?? id;
      await handleUploadGaleria(produtoId);

      alert(isEditing ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");
      resetForm();
      fetchProdutos();
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error);
      if (error.response?.data) {
        alert("Erro: " + JSON.stringify(error.response.data));
      } else {
        alert("Erro inesperado ao salvar produto.");
      }
    }
  };

  const handleEdit = (id: number) => {
    const produto = produtos.find((p) => p.id === id);
    if (!produto) return alert("Produto não encontrado");

    resetForm();

    setForm({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      descricao: produto.descricao ?? "",
      imagem: produto.imagem ?? "",
      imagemFile: null,
      estoque: produto.estoque ?? 0,
      categoria: produto.categoria?.id ?? 0,
      em_promocao: produto.em_promocao ?? false,
      em_destaque: produto.em_destaque ?? false,
      em_carrosel: produto.em_carrosel ?? false,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return;

    try {
      await api.delete(`/produtos/${id}/`);
      setProdutos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      alert("Erro ao deletar produto.");
    }
  };

  const handleAddToCart = (id: number) => {
    console.log("Adicionar ao carrinho (admin):", id);
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Administração de Produtos</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Editar Produto" : "Adicionar Produto"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Preço"
            type="number"
            name="preco"
            min="0.01"
            step="0.01"
            value={form.preco === 0 ? "" : form.preco}
            onChange={handleChange}
          />
          <textarea
            className="border p-2 rounded col-span-2"
            placeholder="Descrição"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
          />
          <input
            className="border p-2 rounded col-span-2"
            placeholder="URL da Imagem"
            name="imagem"
            value={form.imagem}
            onChange={handleChange}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setForm((prev) => ({ ...prev, imagemFile: file }));
            }}
            className="border p-2 rounded col-span-2"
          />
          {form.imagemFile && (
            <img
              src={URL.createObjectURL(form.imagemFile)}
              alt="Preview da imagem"
              className="w-32 h-32 object-cover rounded mt-2 col-span-2"
            />
          )}
          <input
            className="border p-2 rounded col-span-2"
            placeholder="Estoque"
            type="number"
            min="0"
            step="1"
            name="estoque"
            value={form.estoque === 0 ? "" : form.estoque}
            onChange={handleChange}
          />

          <select
            className="border p-2 rounded col-span-2"
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
          >
            <option value={0}>Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>

          <div className="col-span-2 flex gap-2">
            <input
              type="text"
              placeholder="Nova Categoria"
              className="border p-2 rounded w-full"
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
            />
            <button
              type="button"
              onClick={criarNovaCategoria}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Criar
            </button>
          </div>

          <div className="col-span-2 flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="em_promocao" checked={form.em_promocao} onChange={handleChange} />
              Em Promoção
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="em_destaque" checked={form.em_destaque} onChange={handleChange} />
              Em Destaque
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="em_carrosel" checked={form.em_carrosel} onChange={handleChange} />
              Em Carrossel
            </label>
          </div>

          <label className="block font-medium col-span-2">Galeria de Imagens</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setGaleriaFiles(files);
            }}
            className="border p-2 rounded col-span-2"
          />
          {galeriaFiles.length > 0 && (
            <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {galeriaFiles.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`galeria-${index}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
        >
          {isEditing ? "Atualizar Produto" : "Salvar Produto"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            className="mt-2 ml-2 bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
          >
            Cancelar Edição
          </button>
        )}
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {produtos.map((produto) => (
          <div key={produto.id}>
            <ProductCard
              id={produto.id}
              nome={produto.nome}
              preco={produto.preco}
              descricao={produto.descricao}
              imagem={produto.imagem}
              onAddToCart={handleAddToCart}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(produto.id)}
                className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(produto.id)}
                className="w-full bg-red-500 text-white py-1 rounded hover:bg-red-600"
              >
                Deletar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
