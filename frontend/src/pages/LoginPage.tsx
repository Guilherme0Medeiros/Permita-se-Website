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
    <div className="min-h-screen bg-background text-foreground font-sans antialiased flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Acesso
          </span>

          <h1 className="section-title text-3xl sm:text-4xl font-extrabold text-foreground mb-2 tracking-tight">
            {showLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
          </h1>

          <p className="section-subtitle text-base sm:text-lg text-muted-foreground">
            {showLogin
              ? "Entre na sua conta para continuar comprando"
              : "Junte-se a nós e descubra as melhores peças"}
          </p>
        </div>

        
        <div className="bg-card text-card-foreground rounded-3xl shadow-xl border border-border overflow-hidden">
          <div className="flex bg-muted/40 border-b border-border">
            <button
              onClick={() => setShowLogin(true)}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                showLogin
                  ? "bg-card text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              Entrar
            </button>

            <button
              onClick={() => setShowLogin(false)}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                !showLogin
                  ? "bg-card text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              Registrar
            </button>
          </div>

          {/* content */}
          <div className="p-8">
            {showLogin ? (
              <Login />
            ) : (
              <Register onRegisterSuccess={handleRegisterSuccess} />
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Ao continuar, você concorda com nossos{" "}
            <a href="#" className="text-primary hover:opacity-80 font-medium transition">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="#" className="text-primary hover:opacity-80 font-medium transition">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}