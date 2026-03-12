"use client"

import type React from "react"

import { useEffect, useState } from "react"
import api from "../services/api"
import { ProductCard } from "../components/ProductCard"
import Navbar from "../components/Navbar"

interface Categoria {
  id: number
  nome: string
}

interface Produto {
  id: number
  nome: string
  preco: number
  descricao?: string
  imagem?: string
  estoque: number
  quantidade: number
  categoria?: Categoria
  em_promocao: boolean
  em_destaque: boolean
  em_carrosel: boolean
}

export default function ProductAdminPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [novaCategoria, setNovaCategoria] = useState("")
  const [galeriaFiles, setGaleriaFiles] = useState<File[]>([])
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
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchProdutos()
    fetchCategorias()
  }, [])

  const fetchProdutos = () => {
    api
      .get("/produtos/")
      .then((res) => {
        const data = res.data?.results ?? res.data
        if (Array.isArray(data)) {
          setProdutos(
            data.map((p: any) => ({
              ...p,
              preco: Number(p.preco),
              quantidade: 1,
              estoque: p.estoque ?? 0,
              categoria: p.categoria,
            }))
          )
        } else {
          console.error("Formato inválido de resposta da API:", res.data)
        }
      })
      .catch((err) => console.error("Erro ao carregar produtos:", err))
  }

  const fetchCategorias = () => {
    api
      .get("/categorias/")
      .then((res) => {
        const data = res.data?.results ?? res.data
        setCategorias(Array.isArray(data) ? data : [])
      })
      .catch((err) => console.error("Erro ao carregar categorias:", err))
  }

  const criarNovaCategoria = async () => {
    if (!novaCategoria.trim()) return
    try {
      const response = await api.post("/categorias/", { nome: novaCategoria })
      setCategorias((prev) => [...prev, response.data])
      setForm((prev) => ({ ...prev, categoria: response.data.id }))
      setNovaCategoria("")
    } catch (err) {
      console.error("Erro ao criar categoria:", err)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const isCheckbox = type === "checkbox"
    const checked = isCheckbox ? (e.target as HTMLInputElement).checked : undefined

    setForm((prev) => ({
      ...prev,
      [name]: isCheckbox
        ? checked
        : name === "preco" || name === "estoque" || name === "categoria"
        ? Number(value)
        : value,
    }))
  }

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
    })
    setGaleriaFiles([])
    setIsEditing(false)
  }

  const handleUploadGaleria = async (produtoId: number) => {
    if (galeriaFiles.length === 0) return

    const uploads = galeriaFiles.map(async (file) => {
      const data = new FormData()
      data.append("produto", String(produtoId))
      data.append("imagem", file)
      return api.post("/imagens/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    })

    try {
      await Promise.all(uploads)
      alert("Imagens extras enviadas!")
      setGaleriaFiles([])
    } catch (err) {
      console.error("Erro ao enviar imagens extras:", err)
      alert("Erro ao enviar imagens da galeria.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const {
      id,
      nome,
      preco,
      descricao,
      imagem,
      imagemFile,
      estoque,
      categoria,
      em_promocao,
      em_destaque,
      em_carrosel,
    } = form

    if (!nome || preco <= 0 || estoque < 0) {
      alert("Preencha nome, preço (> 0) e estoque (>= 0) corretamente!")
      return
    }

    try {
      const data = new FormData()
      data.append("nome", nome)
      data.append("preco", preco.toString())
      data.append("descricao", descricao)
      data.append("estoque", estoque.toString())
      if (categoria > 0) data.append("categoria", categoria.toString())
      data.append("em_promocao", String(em_promocao))
      data.append("em_destaque", String(em_destaque))
      data.append("em_carrosel", String(em_carrosel))

      if (imagemFile) {
        data.append("imagem", imagemFile)
      } else if (imagem) {
        data.append("imagem_url", imagem)
      }

      let response
      if (isEditing) {
        response = await api.patch(`/produtos/${id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        response = await api.post("/produtos/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      const produtoId = response?.data?.id ?? id
      await handleUploadGaleria(produtoId)

      alert(isEditing ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!")
      resetForm()
      fetchProdutos()
    } catch (error: any) {
      console.error("Erro ao salvar produto:", error)
      if (error.response?.data) {
        alert("Erro: " + JSON.stringify(error.response.data))
      } else {
        alert("Erro inesperado ao salvar produto.")
      }
    }
  }

  const handleEdit = (id: number) => {
    const produto = produtos.find((p) => p.id === id)
    if (!produto) return alert("Produto não encontrado")

    resetForm()
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
    })

    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) return
    try {
      await api.delete(`/produtos/${id}/`)
      setProdutos((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Erro ao deletar produto:", err)
      alert("Erro ao deletar produto.")
    }
  }

  const handleAddToCart = (id: number) => {
    console.log("Adicionar ao carrinho (admin):", id)
  }

  return (
    <>
      <Navbar
        isAuthenticated={true}
        logout={() => {}}
        cartItems={[]}
        setIsCartOpen={() => {}}
      />

      <main className="min-h-screen bg-background text-foreground">
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                Painel Admin
              </span>

              <h1 className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
                Administração de Produtos
              </h1>

              <p className="section-subtitle mt-4 text-lg max-w-2xl mx-auto">
                Gerencie catálogo, categorias, imagens e destaques da loja
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mb-16 bg-card border border-border rounded-3xl shadow-lg p-6 sm:p-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-6">
                {isEditing ? "Editar Produto" : "Adicionar Novo Produto"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  className="block w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Nome do Produto"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                />

                <input
                  className="block w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Preço (R$)"
                  type="number"
                  name="preco"
                  min="0.01"
                  step="0.01"
                  value={form.preco === 0 ? "" : form.preco}
                  onChange={handleChange}
                  required
                />

                <textarea
                  className="block w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 col-span-2 min-h-[120px]"
                  placeholder="Descrição detalhada do produto"
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                />

                <input
                  className="block w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 col-span-2"
                  placeholder="URL da Imagem Principal (se não for fazer upload)"
                  name="imagem"
                  value={form.imagem}
                  onChange={handleChange}
                />

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Upload de Imagem Principal
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null
                      setForm((prev) => ({ ...prev, imagemFile: file }))
                    }}
                    className="block w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground cursor-pointer"
                  />
                </div>

                {form.imagemFile && (
                  <img
                    src={URL.createObjectURL(form.imagemFile) || "/placeholder.svg"}
                    alt="Preview da imagem"
                    className="w-40 h-40 object-cover rounded-2xl shadow-md col-span-2"
                  />
                )}

                <input
                  className="block w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 col-span-2"
                  placeholder="Estoque disponível"
                  type="number"
                  min="0"
                  step="1"
                  name="estoque"
                  value={form.estoque === 0 ? "" : form.estoque}
                  onChange={handleChange}
                  required
                />

                <select
                  className="block w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 col-span-2"
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

                <div className="col-span-2 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                  <input
                    type="text"
                    placeholder="Criar Nova Categoria"
                    className="block w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={criarNovaCategoria}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:opacity-90 transition font-semibold whitespace-nowrap"
                  >
                    Criar Categoria
                  </button>
                </div>

                <div className="col-span-2 flex flex-wrap gap-6 mt-2">
                  <label className="flex items-center gap-2 text-foreground font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      name="em_promocao"
                      checked={form.em_promocao}
                      onChange={handleChange}
                      className="h-4 w-4 accent-primary"
                    />
                    Em Promoção
                  </label>

                  <label className="flex items-center gap-2 text-foreground font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      name="em_destaque"
                      checked={form.em_destaque}
                      onChange={handleChange}
                      className="h-4 w-4 accent-primary"
                    />
                    Em Destaque
                  </label>

                  <label className="flex items-center gap-2 text-foreground font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      name="em_carrosel"
                      checked={form.em_carrosel}
                      onChange={handleChange}
                      className="h-4 w-4 accent-primary"
                    />
                    Em Carrossel
                  </label>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-foreground mb-2 mt-4">
                    Galeria de Imagens Adicionais
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? [])
                      setGaleriaFiles(files)
                    }}
                    className="block w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground cursor-pointer"
                  />
                </div>

                {galeriaFiles.length > 0 && (
                  <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {galeriaFiles.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={`galeria-${index}`}
                        className="w-full h-40 object-cover rounded-2xl shadow-sm"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-full hover:opacity-90 transition font-bold text-lg shadow-lg"
                >
                  {isEditing ? "Atualizar Produto" : "Salvar Produto"}
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-muted text-muted-foreground px-8 py-4 rounded-full hover:opacity-90 transition font-semibold text-lg"
                  >
                    Cancelar Edição
                  </button>
                )}
              </div>
            </form>

            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Produtos Cadastrados
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="bg-card border border-border rounded-2xl shadow-md overflow-hidden p-4 flex flex-col"
                >
                  <ProductCard
                    id={produto.id}
                    nome={produto.nome}
                    preco={produto.preco}
                    descricao={produto.descricao}
                    imagem={produto.imagem}
                    em_promocao={produto.em_promocao}
                    onAddToCart={handleAddToCart}
                  />

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleEdit(produto.id)}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(produto.id)}
                      className="w-full bg-destructive text-destructive-foreground py-3 rounded-xl hover:opacity-90 transition font-semibold"
                    >
                      Excluir
                    </button>
                  </div>

                  <div className="mt-3 text-xs text-muted-foreground space-y-1">
                    <p>Estoque: {produto.estoque}</p>
                    <p>Categoria: {produto.categoria?.nome ?? "Sem categoria"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
