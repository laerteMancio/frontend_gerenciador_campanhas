import React, { useEffect, useState } from "react";
import { FiCopy, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import "./PresellList.css";

function PresellList() {
  const userId = localStorage.getItem("userId");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [verificando, setVerificando] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchProjects = async () => {
      try {
        const resp = await fetch(`/api/projects/${userId}`, {
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
            vercelMessage: "", // Inicialmente vazio
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

  const excluirProjeto = async (id) => {
    if (!window.confirm("Deseja realmente excluir este projeto?")) return;

    try {
      const resp = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!resp.ok) throw new Error("Erro ao excluir projeto");

      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir o projeto");
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
          const resp = await fetch("/api/check-subdomain", {
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
                  <td data-label="Criado em">
                    {new Date(proj.created_at).toLocaleString("pt-BR")}
                  </td>
                  <td data-label="Nome do Produto">{proj.nome_produto}</td>
                  <td data-label="Domínio">{proj.dominio}</td>
                  <td data-label="Subdomínio">{proj.subdominio || "pendente"}</td>
                  <td data-label="Status">{proj.vercelMessage || "Pendente"}</td>
                  <td data-label="Ações">
                    <div className="acoes-icons">
                      <FiCopy
                        title="Copiar"
                        onClick={() => copiarLink(subdomainUrl)}
                      />
                      <FiEye
                        title="Visualizar"
                        onClick={() => window.open(subdomainUrl, "_blank")}
                      />
                      <FiEdit title="Editar" onClick={() => alert("Implementar edição")} />
                      <FiTrash2
                        title="Excluir"
                        onClick={() => excluirProjeto(proj.id)}
                      />
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
