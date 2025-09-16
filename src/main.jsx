import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Layouts
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

// Componentes
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Presell from "./components/Presell";
import PresellList from "./components/PresellList";
import MontarPresell from "./components/MontarPresell";
import Register from "./components/Register";

function App() {
  // O estado 'usuario' ainda é necessário aqui para a lógica de proteção de rotas
  const [usuario, setUsuario] = useState(() => {
    const storedUser = localStorage.getItem('usuario');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Este useEffect garante que o estado do App seja sincronizado
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('usuario');
      setUsuario(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('usuario', JSON.stringify(userData));
    setUsuario(userData);
  };

  const ProtectedRoute = ({ children }) => {
    if (!usuario) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas de Autenticação */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={
            usuario?.role === "admin" ? <Register usuario={usuario} /> : <Navigate to="/dashboard" replace />
          } />
        </Route>

        {/* Rotas da Aplicação Protegidas (MUITO MAIS SIMPLES) */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/presell" element={<Presell />} />
          <Route path="/presells" element={<PresellList />} />
          <Route path="/montar-presell" element={<MontarPresell />} />
        </Route>

        {/* Rota Padrão */}
        <Route path="*" element={<Navigate to={usuario ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
