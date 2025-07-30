import { useState } from "react";
import api from "../services/api";

interface RegisterProps {
  onRegisterSuccess: () => void;
}

export function Register({ onRegisterSuccess }: RegisterProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("As senhas não conferem.");
      return;
    }

    try {
      await api.post("register/", {
        username,
        email,
        password,
        confirm_password: passwordConfirm, // aqui o nome certo para o serializer
      });
      alert("Usuário criado com sucesso! Faça login.");
      onRegisterSuccess();
    } catch (err: any) {
      console.log(err.response?.data); // <== DEBUG: veja o que vem do backend
      if (err.response?.data) {
        const data = err.response.data;
        if (data.username) setError(data.username[0]);
        else if (data.email) setError(data.email[0]);
        else if (data.confirm_password) setError(data.confirm_password[0]);
        else if (data.non_field_errors) setError(data.non_field_errors[0]);
        else if (data.message) setError(data.message);
        else setError("Erro ao criar usuário.");
      } else {
        setError("Erro ao criar usuário.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-4 border rounded"
    >
      <h2 className="text-xl mb-4">Registrar</h2>

      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-3 w-full"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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

      <input
        type="password"
        placeholder="Confirmar senha"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        className="border p-2 mb-3 w-full"
        required
      />

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <button
        type="submit"
        className="bg-green-500 text-white py-2 rounded w-full hover:bg-green-600"
      >
        Registrar
      </button>
    </form>
  );
}
