import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post("/token/", { username, password });
      const { access, refresh } = response.data;
      login(access, refresh);
    } catch (err) {
      setError("Usuário ou senha inválidos.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 border rounded">
      <h2 className="text-xl mb-4">Login</h2>

      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-3 w-full"
        required
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-3 w-full"
        required
      />

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <button
        type="submit"
        className="bg-orange-500 text-white py-2 rounded w-full hover:bg-orange-600"
      >
        Entrar
      </button>
    </form>
  );
}
