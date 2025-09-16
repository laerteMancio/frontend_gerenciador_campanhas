import React from "react";
// 1. IMPORTAÇÃO DOS HOOKS NECESSÁRIOS
import { useNavigate, useOutletContext } from "react-router-dom";
import PresellList from "./PresellList";
import "./Dashboard.css";

// 2. O COMPONENTE NÃO RECEBE MAIS PROPS
function Dashboard() {
  // 3. OBTENÇÃO DO USUÁRIO A PARTIR DO CONTEXTO DO LAYOUT
  const { usuario } = useOutletContext();
  
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  // A lógica interna permanece a mesma, usando a variável 'usuario'
  const isAdmin = usuario?.role === "admin";

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1>Seu Painel</h1>
        {/* A variável 'usuario' agora vem do useOutletContext */}
        <p>Bem-vindo de volta, {usuario?.nome || usuario?.email || 'usuário'}!</p>
      </header>

      {/* Seção de Ações Rápidas */}
      <div className="dashboard-actions">
        <div className="action-card" onClick={() => handleNavigate("/montar-presell")}>
          <h3>🚀 Montar Nova Presell</h3>
          <p>Crie uma página de alta conversão em minutos.</p>
        </div>

        {/* Este card só aparece se o usuário for admin */}
        {isAdmin && (
          <div className="action-card" onClick={() => handleNavigate("/register")}>
            <h3>👤 Cadastrar Novo Usuário</h3>
            <p>Adicione novos membros à equipe.</p>
          </div>
        )}
      </div>

      {/* Seção da Lista de Presells */}
      <div className="dashboard-list-section">
        <h2>Suas Presells Criadas</h2>
        {/* 
          O componente PresellList também precisará ser atualizado 
          para usar useOutletContext se ele precisar dos dados do usuário.
          Se ele já recebe 'usuario' de outra forma ou não precisa, pode manter como está.
          Assumindo que ele também usará o contexto, não passamos mais props.
        */}
        <PresellList />
      </div>
    </div>
  );
}

export default Dashboard;
