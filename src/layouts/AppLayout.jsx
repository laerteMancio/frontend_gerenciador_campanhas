import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import BackButton from '../components/BackButton';

// O AppLayout agora gerencia seus próprios dados, tornando-o independente
function AppLayout() {
  const navigate = useNavigate();

  // Pega os dados do usuário diretamente do localStorage
  const [usuario, setUsuario] = React.useState(() => {
    const storedUser = localStorage.getItem('usuario');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogout = () => {
    // Limpa o estado e o localStorage
    setUsuario(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('projects');
    localStorage.removeItem('montarPresellData');
    // Redireciona para o login
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* O AppHeader agora usa o estado local do AppLayout */}
      <AppHeader usuario={usuario} onLogout={handleLogout} />
      <BackButton />
      <main className="app-content">
        {/* Fornece o 'usuario' como contexto para as rotas filhas (Dashboard, etc.) */}
        <Outlet context={{ usuario }} />
      </main>
    </div>
  );
}

export default AppLayout;
