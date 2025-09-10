import React, { useEffect, useState } from "react";
import { FiCopy, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

import "./PresellList.css";

function PresellList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const userId = localStorage.getItem("userId");
  const FRONTEND_BASE_URL = "https://frontend-gerenciador-campanhas.vercel.app";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!userId) throw new Error("userId não fornecido");

        const resp = await fetch(`https://gerador-presell.vercel.app/projects/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!resp.ok) throw new Error("Erro ao buscar projetos");

        const data = await resp.json();
        setProjects(data);
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
    navigator.clipboard.writeText(url)
      .then(() => alert("Link copiado!"))
      .catch(() => alert("Falha ao copiar o link"));
  };

  const excluirProjeto = async (id) => {
    if (!window.confirm("Deseja realmente excluir este projeto?")) return;

    try {
      const resp = await fetch(`https://gerador-presell.vercel.app/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!resp.ok) throw new Error("Erro ao excluir projeto");

      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir o projeto");
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p className="erro">{erro}</p>;

  return (
    <div className="presell-list">
      <h2>Meus Projetos</h2>
      {projects.length === 0 ? (
        <p>Nenhum projeto criado ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Data de criação</th>
              <th>Nome do produto</th>
              <th>Domínio</th>
              <th>Subdomínio</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((proj, index) => {
              const subdomainUrl = proj.subdominio || proj.url;
              return (
                <tr key={`${proj.id}-${index}`}>
                  <td data-label="Criado em">{new Date(proj.created_at).toLocaleString("pt-BR")}</td>
                  <td data-label="Nome do Produto">{proj.nome_produto}</td>
                  <td data-label="Domínio">{proj.dominio}</td>
                  <td data-label="Subdomínio">{proj.subdominio || "pendente"}</td>
                  <td data-label="Status">{proj.status || "pendente"}</td>
                  <td data-label="Ações">
                    <div className="acoes-icons">
                      <FiCopy title="Copiar" onClick={() => copiarLink(subdomainUrl)} />
                      <FiEye title="Visualizar" onClick={() => window.open(subdomainUrl, "_blank")} />
                      <FiEdit title="Editar" onClick={() => alert("Implementar edição")} />
                      <FiTrash2 title="Excluir" onClick={() => excluirProjeto(proj.id)} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PresellList;
