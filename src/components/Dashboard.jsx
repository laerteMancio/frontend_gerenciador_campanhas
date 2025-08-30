import React from "react";
import { useNavigate } from "react-router-dom";
import PresellList from "./PresellList";
import Register from"./Register"
import "./Dashboard.css";

function Dashboard({ setTela, admin }) {

  const navigate = useNavigate();


  const handleCriarPagina = () => {
    navigate("/presell");
  };

   const handlePresellTemplate = () => {
    navigate("/templates");
  };

  return (
    <div className="dashboard-container">
      

      <div className="pages-section">
        <button onClick={handleCriarPagina}>Criar Página</button>
        <button onClick={handlePresellTemplate}>Template</button>
      </div>
      <div className="pages-section">
        <PresellList />
      </div>
      
    </div>
  );
}

export default Dashboard;
