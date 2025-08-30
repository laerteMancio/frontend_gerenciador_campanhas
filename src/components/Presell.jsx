import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Presell.css";

function Presell() {
  const navigate = useNavigate();

  const [dominio, setDominio] = useState("betterchoicenow.store");
  const [nomePagina, setNomePagina] = useState("");
  const [linkAfiliado, setLinkAfiliado] = useState("");
  const [salesPage, setSalesPage] = useState("");

  const [resultado, setResultado] = useState("");
  const [erro, setErro] = useState("");

  // Novos estados para exibir dados extraídos da página oficial
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");

  const [idioma, setIdioma] = useState("pt");

  const handleVoltar = () => {
    navigate("/dashboard");
  };

  const gerarLink = async (e) => {
    e.preventDefault();
    setErro("");
    setResultado("");
    setTitulo("");
    setSubtitulo("");
    setDescricao("");
    setImagemUrl("");

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
          idioma
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

      // Atualiza dados extraídos da página oficial, se retornados pelo backend
      if (data.presell) {
        setTitulo(data.presell.titulo || "");
        setSubtitulo(data.presell.subtitulo || "");
        setDescricao(data.presell.descricao || "");
        setImagemUrl(data.presell.imagem_url || "");
      }
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
        <input
          value={dominio}
          onChange={(e) => setDominio(e.target.value)}
          placeholder="ex: betterchoicenow.store"
        />

        <label>Nome da página *</label>
        <input value={nomePagina} onChange={(e) => setNomePagina(e.target.value)} />

        <label>Link de Afiliado *</label>
        <input value={linkAfiliado} onChange={(e) => setLinkAfiliado(e.target.value)} />

        <label>Página de vendas do produtor *</label>
        <input value={salesPage} onChange={(e) => setSalesPage(e.target.value)} />

        <label>Idioma *</label>
        <select value={idioma} onChange={(e) => setIdioma(e.target.value)}>
          <option value="pt">Português</option>
          <option value="en">Inglês</option>
        </select>

        <button type="submit">Gerar</button>
      </form>

      {erro && <div className="error">{erro}</div>}

      {resultado && (
        <div className="result">
          <p>
            Sua URL final:{" "}
            <a href={`https://${resultado}`} target="_blank" rel="noreferrer">
              {resultado}
            </a>
          </p>

          {titulo && <h3>{titulo}</h3>}
          {subtitulo && <h4>{subtitulo}</h4>}
          {descricao && <p>{descricao}</p>}
          {imagemUrl && <img src={imagemUrl} alt={titulo} style={{ maxWidth: "100%" }} />}
        </div>
      )}
    </div>
  );
}

export default Presell;
