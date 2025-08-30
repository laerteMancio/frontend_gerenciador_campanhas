import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Presell from "./components/Presell";
import PresellList from "./components/PresellList";
import PresellTemplate from "./components/PresellTemplate";
import Register from "./components/Register";

function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* Login público */}
        <Route path="/login" element={<Login onLoginSuccess={setUsuario} />} />

        {/* Dashboard protegido */}
        <Route
          path="/dashboard"
          element={
            usuario ? (
              <Dashboard usuario={usuario} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Criar Presell (proteção simples: precisa estar logado) */}
        <Route
          path="/presell"
          element={
            usuario ? <Presell usuario={usuario} /> : <Navigate to="/login" />
          }
        />

        {/* Listagem de Presells */}
        <Route
          path="/presells"
          element={
            usuario ? (
              <PresellList usuario={usuario} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Exibição de um Presell gerado */}
        <Route path="/presell/:nomePagina" element={<PresellTemplate />} />

        {/* Cadastro de usuários – apenas admin */}
        <Route
          path="/register"
          element={
            usuario?.role === "admin" ? (
              <Register usuario={usuario} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Rota padrão */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
