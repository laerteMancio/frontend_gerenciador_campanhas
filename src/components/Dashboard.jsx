import React from "react";
import PresellList from "./PresellList";
import Register from"./Register"
import "./Dashboard.css";

function Dashboard({ setTela, admin }) {
  const handleCriarPagina = () => {
    setTela("presell"); // muda para a tela Presell
  };

  return (
    <div className="dashboard-container">
      <button onClick={handleCriarPagina}>Criar Página</button>

      <div className="pages-section">
        <PresellList />
      </div>
      
    </div>
  );
}

export default Dashboard;
