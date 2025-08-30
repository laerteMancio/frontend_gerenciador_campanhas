import React, { useState } from "react";
import "./Presell.css";

function Presell() {
  const [dominio, setDominio] = useState("betterchoicenow.store");
  const [nomePagina, setNomePagina] = useState("");
  const [linkAfiliado, setLinkAfiliado] = useState("");
  const [salesPage, setSalesPage] = useState("");

  const [resultado, setResultado] = useState("");
  const [erro, setErro] = useState("");

  const gerarLink = async (e) => {
    e.preventDefault();
    setErro("");
    setResultado("");

    if (!nomePagina || !linkAfiliado || !salesPage || !dominio) {
      setErro("Por favor, preencha todos os campos obrigatórios (*)");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErro("Você precisa estar logado");
        return;
      }

      const resp = await fetch("http://localhost:3000/generate-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dominio,
          nomePagina,
          linkAfiliado,
          salesPage,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setErro(data.message || "Erro ao gerar link");
        return;
      }

      // Exibe a URL final limpa (sem https://)
      const urlExibicao = data.finalUrl.replace(/^https?:\/\//, "");
      setResultado(urlExibicao);
    } catch (error) {
      console.error("Erro ao gerar link:", error);
      setErro("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="container">
      <h2>Gerador de Presell</h2>
      <form onSubmit={gerarLink}>
        <label>Domínio *</label>
        <input value={dominio} onChange={(e) => setDominio(e.target.value)} placeholder="ex: betterchoicenow.store" />

        <label>Nome da página *</label>
        <input value={nomePagina} onChange={(e) => setNomePagina(e.target.value)} />

        <label>Link de Afiliado *</label>
        <input value={linkAfiliado} onChange={(e) => setLinkAfiliado(e.target.value)} />

        <label>Página de vendas do produtor *</label>
        <input value={salesPage} onChange={(e) => setSalesPage(e.target.value)} />

        <button type="submit">Gerar</button>
      </form>

      {erro && <div className="error">{erro}</div>}

      {resultado && (
        <div className="result">
          Sua URL final:{" "}
          <a href={`https://${resultado}`} target="_blank" rel="noreferrer">
            {resultado}
          </a>
        </div>
      )}
    </div>
  );
}

export default Presell;
