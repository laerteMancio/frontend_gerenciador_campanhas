import React, { useEffect, useState, useCallback } from "react";
import { FiCopy, FiEye, FiTrash2, FiLoader, FiCheckCircle, FiAlertTriangle, FiXCircle } from "react-icons/fi";
import "./PresellList.css";

const StatusBadge = ({ status, message }) => {
  let icon = <FiLoader className="spinner" />;
  let className = "status-badge pending";
  let text = message || "Pendente";

  if (status === "ativo") {
    icon = <FiCheckCircle />;
    className = "status-badge active";
    text = "Ativo";
  } else if (message?.toLowerCase().includes("erro") || message?.toLowerCase().includes("falha") || message?.toLowerCase().includes("⚠️")) {
    icon = <FiXCircle />;
    className = "status-badge error";
    text = "Falha";
  } else if (message === "Verificando... ⏳") {
    text = "Verificando...";
  }

  return (
    <div className={className} title={message}>
      {icon}
      <span>{text}</span>
    </div>
  );
};

function PresellList() {
  const userId = localStorage.getItem("userId");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const BASE_URL = "https://gerador-presell.vercel.app";

  const verificarTodosOsSubdominios = useCallback(async (projetosParaVerificar ) => {
    for (const proj of projetosParaVerificar) {
      if (!proj.dominio || !proj.subdominio || !proj.projeto_vercel) {
        setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, checked: true, vercelMessage: "Dados insuficientes" } : p));
        continue;
      }
      setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, vercelMessage: "Verificando... ⏳" } : p));
      try {
        const resp = await fetch(`${BASE_URL}/check-subdomain`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: proj.projeto_vercel, subdominio: proj.subdominio }),
        });
        const data = await resp.json();
        setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, status: data.status === "ativo" && !data.invalidConfiguration ? "ativo" : "pendente", vercelMessage: data.vercelMessage, checked: true } : p));
      } catch (err) {
        setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, status: "pendente", checked: true, vercelMessage: "Erro ao verificar ⚠️" } : p));
      }
    }
  }, [BASE_URL]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setErro("ID do usuário não encontrado. Faça login novamente.");
      return;
    }
    const fetchProjectsEVerificar = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`${BASE_URL}/projects/${userId}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        });
        if (!resp.ok) throw new Error("Erro ao buscar projetos");
        const data = await resp.json();
        const projetosIniciais = data.map((p) => ({ ...p, checked: false, vercelMessage: "" }));
        setProjects(projetosIniciais);
        if (projetosIniciais.length > 0) {
          verificarTodosOsSubdominios(projetosIniciais);
        }
      } catch (err) {
        setErro("Não foi possível carregar os projetos");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectsEVerificar();
  }, [userId, BASE_URL, verificarTodosOsSubdominios]);

  const copiarLink = (url) => {
    navigator.clipboard.writeText(url).then(() => alert("Link copiado!")).catch(() => alert("Falha ao copiar o link"));
  };

  const excluirProjeto = async (idDoBanco) => {
    if (!window.confirm("Deseja realmente excluir este projeto?")) return;
    try {
      const resp = await fetch(`${BASE_URL}/vercel/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ projetoId: idDoBanco, userId }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Erro ao excluir projeto");
      setProjects((prev) => prev.filter((p) => p.id !== idDoBanco));
      alert("Projeto excluído com sucesso!");
    } catch (err) {
      alert("Erro ao excluir o projeto: " + err.message);
    }
  };

  if (loading) return <div className="list-feedback"><FiLoader className="spinner" /> Carregando projetos...</div>;
  if (erro) return <div className="list-feedback error"><FiAlertTriangle /> {erro}</div>;

  return (
    <div className="presell-list-wrapper">
      {projects.length === 0 ? (
        <div className="list-feedback">Nenhum projeto criado ainda.</div>
      ) : (
        <div className="projects-grid">
          {projects.map((proj) => {
            const subdomainUrl = proj.subdominio || proj.url;
            const fullUrl = `https://${subdomainUrl}`;
            return (
              <div className="project-card" key={proj.id}>
                <div className="card-header">
                  <h3 className="card-title">{proj.nome_produto}</h3>
                  <StatusBadge status={proj.status} message={proj.vercelMessage} />
                </div>
                <div className="card-body">
                  <div className="info-group">
                    <label>Link da Presell</label>
                    <a href={fullUrl} target="_blank" rel="noopener noreferrer">{subdomainUrl}</a>
                  </div>
                  <div className="info-group">
                    <label>Domínio Principal</label>
                    <span>{proj.dominio || "N/A"}</span>
                  </div>
                  <div className="info-group">
                    <label>Data de Criação</label>
                    <span>{new Date(proj.created_at ).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="action-btn" onClick={() => copiarLink(fullUrl)}><FiCopy /> Copiar</button>
                  <button className="action-btn" onClick={() => window.open(fullUrl, "_blank")}><FiEye /> Ver</button>
                  <button className="action-btn danger" onClick={() => excluirProjeto(proj.id)}><FiTrash2 /> Excluir</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PresellList;
