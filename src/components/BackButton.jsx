import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Não mostrar na tela de login
   if (location.pathname === "/login" || location.pathname === "/dashboard") return null;

  return (
    <button
      onClick={() => navigate("/dashboard")}
      style={{
        position: "fixed",
        top: 10,
        left: 10,
        padding: "8px 12px",
        zIndex: 1000,
      }}
    >
      Voltar
    </button>
  );
}

export default BackButton;
