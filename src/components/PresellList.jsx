import React, { useEffect, useState } from "react";
import { FiCopy, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

import "./PresellList.css";

function PresellList() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const FRONTEND_BASE_URL = "gerador-presell.vercel.app/api/presell"; // base local do frontend

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const resp = await fetch("https://gerador-presell.vercel.app/links", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!resp.ok) {
          throw new Error("Erro ao buscar links");
        }

        const data = await resp.json();
                
        setLinks(data.links);
      } catch (err) {
        console.error(err);
        setErro("Não foi possível carregar os links");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const copiarLink = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => alert("Link copiado!"))
      .catch(() => alert("Falha ao copiar o link"));
  };

  const excluirLink = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta página?")) return;

    try {
      const resp = await fetch(`https://gerador-presell.vercel.app/links/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!resp.ok) throw new Error("Erro ao excluir link");

      setLinks(links.filter(link => link.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir o link");
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p className="erro">{erro}</p>;

  return (
    <div className="presell-list">
      <h2>Minhas Páginas</h2>
      {links.length === 0 ? (
        <p>Nenhuma página criada ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Data de criação</th>
              <th>Nome da página</th>
              <th>Domínio</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link, index) => {
              const localPresellUrl = `${FRONTEND_BASE_URL}/${link.nome_pagina.toLowerCase()}`;

              return (
                <tr key={`${link.id}-${index}`}>
                  <td data-label="Criado em">{new Date(link.criado_em).toLocaleString("pt-BR")}</td>
                  <td data-label="Nome da Página">{link.nome_pagina}</td>
                  <td data-label="Dominio">{link.dominio.replace(/^https?:\/\//, "")}</td>
                  <td data-label="Ações">
                    <div className="acoes-icons">
                      <FiCopy title="Copiar" onClick={() => copiarLink(localPresellUrl)} />
                      <FiEye title="Visualizar" onClick={() => window.open(localPresellUrl, "_blank")} />
                      <FiEdit title="Editar" onClick={() => alert("Implementar edição")} />
                      <FiTrash2 title="Excluir" onClick={() => excluirLink(link.id)} />
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
