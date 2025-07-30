import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import ProductAdminPage from "./pages/ProductAdminPage";
import LoginPage from "./pages/LoginPage";
import Categoria from "./pages/Categoria"; // ✅ nova página importada
import ProductPage from "./pages/ProductPage"; // ✅ nova importação
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin/produtos" element={<ProductAdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/categoria/:nome" element={<Categoria />} />
        <Route path="/produto/:id" element={<ProductPage />} /> {/* ✅ nova rota */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
