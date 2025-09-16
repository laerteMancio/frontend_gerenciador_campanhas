import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AppHeader.css'; // Criaremos este arquivo de estilo
import { FaSignOutAlt } from 'react-icons/fa'; // Ícone para o botão

function AppHeader({ usuario, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Chama a função de logout passada pelo App principal
    if (onLogout) {
      onLogout();
    }
    // Redireciona para a tela de login
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="user-info">
          <span className="welcome-text">Bem-vindo,</span>
          <span className="user-name">{usuario?.nome || usuario?.email}</span>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}

export default AppHeader;
