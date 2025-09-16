import React, { useEffect, useState } from "react";
import { FiCopy, FiEye, FiTrash2 } from "react-icons/fi";
import "./PresellList.css";

function PresellList() {
  const userId = localStorage.getItem("userId");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [verificando, setVerificando] = useState(false);

  const BASE_URL = "https://gerador-presell.vercel.app";

  useEffect(() => {
    if (!userId) return;

    const fetchProjects = async () => {
      try {
        const resp = await fetch(`${BASE_URL}/projects/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!resp.ok) throw new Error("Erro ao buscar projetos");
        const data = await resp.json();

        setProjects(
          data.map((p) => ({
            ...p,
            checked: false,
            vercelMessage: "",
          }))
        );
      } catch (err) {
        console.error(err);
        setErro("Não foi possível carregar os projetos");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  const copiarLink = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => alert("Link copiado!"))
      .catch(() => alert("Falha ao copiar o link"));
  };

  const excluirProjeto = async (idDoBanco) => {
    if (!window.confirm("Deseja realmente excluir este projeto?")) return;

    try {
      const resp = await fetch(`${BASE_URL}/vercel/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ projetoId: idDoBanco, userId }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Erro ao excluir projeto");

      setProjects((prev) => prev.filter((p) => p.id !== idDoBanco));
      alert("Projeto excluído com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir o projeto: " + err.message);
    }
  };

  // Verificação de subdomínios
  useEffect(() => {
    if (projects.length === 0 || verificando) return;

    const verificarSubdominios = async () => {
      setVerificando(true);

      const pendentes = projects.filter(
        (p) => !p.checked && p.dominio && p.subdominio && p.projeto_vercel
      );

      for (const proj of pendentes) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === proj.id ? { ...p, vercelMessage: "Verificando... ⏳" } : p
          )
        );

        try {
          const resp = await fetch(`${BASE_URL}/check-subdomain`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              projectId: proj.projeto_vercel,
              subdominio: proj.subdominio,
            }),
          });

          const data = await resp.json();

          setProjects((prev) =>
            prev.map((p) =>
              p.id === proj.id
                ? {
                    ...p,
                    status:
                      data.status === "ativo" && !data.invalidConfiguration
                        ? "ativo"
                        : "pendente",
                    vercelMessage: data.vercelMessage,
                    checked: true,
                  }
                : p
            )
          );
        } catch (err) {
          console.error("Erro na verificação:", err);
          setProjects((prev) =>
            prev.map((p) =>
              p.id === proj.id
                ? {
                    ...p,
                    status: "pendente",
                    checked: true,
                    vercelMessage: "Erro ao verificar subdomínio ⚠️",
                  }
                : p
            )
          );
        }
      }

      setVerificando(false);
    };

    verificarSubdominios();
  }, [projects, verificando]);

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p className="erro">{erro}</p>;

  const columns = [
    "Data de criação",
    "Nome do produto",
    "Domínio",
    "Subdomínio",
    "Status",
    "Ações",
  ];

  return (
    <div className="presell-list">
      <h2>Meus Projetos</h2>
      {projects.length === 0 ? (
        <p>Nenhum projeto criado ainda.</p>
      ) : (
        <>
          {/* Cabeçalho desktop */}
          <div className="projects-header">
            {columns.map((col, index) => (
              <div className="header-item" key={index}>
                {col}
              </div>
            ))}
          </div>

          <div className="projects-list">
            {projects.map((proj, index) => {
              const subdomainUrl = proj.subdominio || proj.url;
              return (
                <div className="project-row" key={`${proj.id}-${index}`}>
                  <div className="project-item" data-label="Data de criação">
                    {new Date(proj.created_at).toLocaleString("pt-BR")}
                  </div>
                  <div className="project-item" data-label="Nome do produto">
                    {proj.nome_produto}
                  </div>
                  <div className="project-item" data-label="Domínio" title={proj.dominio}>
                    {proj.dominio}
                  </div>
                  <div className="project-item" data-label="Subdomínio" title={proj.subdominio}>
                    {proj.subdominio || "pendente"}
                  </div>
                  <div className="project-item" data-label="Status" title={proj.vercelMessage || "Pendente"}>
                    {proj.vercelMessage || "Pendente"}
                  </div>
                  <div className="project-actions" data-label="Ações">
                    <FiCopy title="Copiar" onClick={() => copiarLink(subdomainUrl)} />
                    <FiEye title="Visualizar" onClick={() => window.open(`https://${subdomainUrl}`, "_blank")} />
                    <FiTrash2 title="Excluir" onClick={() => excluirProjeto(proj.id)} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default PresellList;
