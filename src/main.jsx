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
import BackButton from "./components/BackButton"
import PresellPage from "./components/PresellPage";

function App() {
  const [usuario, setUsuario] = useState(null);

  return (

    <BrowserRouter>
      <BackButton />
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

        {/* Exibição Template */}
        <Route
          path="/templates"
          element={
            <PresellTemplate
              titulo="Meu Presell"
              subtitulo="Subtítulo de teste"
              descricao="Descrição do produto ou serviço."
              imagemUrl="https://via.placeholder.com/600x400"
              linkAfiliado="https://example.com"
              destaque="Oferta especial!"
            />
          }
        />

        {/*  Template personalizado*/}
        <Route path="/presell/:nomePagina" element={<PresellPage />} />



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
