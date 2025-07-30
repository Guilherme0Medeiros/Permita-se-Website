import { useState } from "react";
import { Login } from "../components/Login";
import { Register } from "../components/Register";

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(true);

  const handleRegisterSuccess = () => {
    alert("Cadastro realizado! Faça login agora.");
    setShowLogin(true);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="flex justify-center mb-4 gap-4">
        <button
          onClick={() => setShowLogin(true)}
          className={`px-4 py-2 rounded ${
            showLogin ? "bg-orange-500 text-white" : "bg-gray-200"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setShowLogin(false)}
          className={`px-4 py-2 rounded ${
            !showLogin ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          Registrar
        </button>
      </div>

      {showLogin ? (
        <Login />
      ) : (
        <Register onRegisterSuccess={handleRegisterSuccess} />
      )}
    </div>
  );
}
