"use client"

import { useState } from "react"
import { Login } from "../components/Login"
import { Register } from "../components/Register"

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(true)

  const handleRegisterSuccess = () => {
    alert("Cadastro realizado! Faça login agora.")
    setShowLogin(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header da página */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
            {showLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
          </h1>
          <p className="text-lg text-gray-600 font-light">
            {showLogin ? "Entre na sua conta para continuar comprando" : "Junte-se a nós e descubra as melhores peças"}
          </p>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tabs de navegação */}
          <div className="flex bg-gray-50 border-b border-gray-200">
            <button
              onClick={() => setShowLogin(true)}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                showLogin
                  ? "bg-white text-orange-600 border-b-2 border-orange-500 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                !showLogin
                  ? "bg-white text-orange-600 border-b-2 border-orange-500 shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              Registrar
            </button>
          </div>

          {/* Conteúdo do formulário */}
          <div className="p-8">{showLogin ? <Login /> : <Register onRegisterSuccess={handleRegisterSuccess} />}</div>
        </div>

        {/* Footer informativo */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Ao continuar, você concorda com nossos{" "}
            <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
              Política de Privacidade
            </a>
          </p>
        </div>

        
      </div>
    </div>
  )
}
