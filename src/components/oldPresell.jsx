import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Presell.css";

function Presell() {
  const navigate = useNavigate();

  // Estados do formulário
  const [dominio, setDominio] = useState("betterchoicenow.store");
  const [nomePagina, setNomePagina] = useState("");
  const [linkAfiliado, setLinkAfiliado] = useState("");
  const [salesPage, setSalesPage] = useState("");
  const [idioma, setIdioma] = useState("pt");

  const [resultado, setResultado] = useState("");
  const [erro, setErro] = useState("");

  // Estados manuais para a presell
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [preco, setPreco] = useState("");
  const [promocoes, setPromocoes] = useState([]);
  const [benefits, setBenefits] = useState("");

  const handleVoltar = () => navigate("/dashboard");

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

      const resp = await fetch("https://gerador-presell.vercel.app/generate-auth", {
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
          idioma,
          titulo,
          subtitulo,
          descricao,
          imagemUrl,
          preco,
          benefits,
          promocoes,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setErro(data.message || "Erro ao gerar link");
        return;
      }

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

        {/* Campos manuais adicionais */}
        <label>Título</label>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />

        <label>Subtítulo</label>
        <input value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} />

        <label>Descrição</label>
        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />

        <label>Imagem URL</label>
        <input
          type="text"
          value={imagemUrl}
          onChange={(e) => setImagemUrl(e.target.value)}
          placeholder="Cole a URL da imagem"
        />

        <label>Preço / Oferta</label>
        <input value={preco} onChange={(e) => setPreco(e.target.value)} />

        <label>Benefícios</label>
        <textarea value={benefits} onChange={(e) => setBenefits(e.target.value)} />

        <label>Promoções (separadas por vírgula)</label>
        <input
          value={promocoes.join(", ")}
          onChange={(e) => setPromocoes(e.target.value.split(",").map((p) => p.trim()))}
        />

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
          {preco && <p><strong>Oferta:</strong> {preco}</p>}
          {promocoes.length > 0 && (
            <ul>
              {promocoes.map((promo, idx) => (
                <li key={idx}>{promo}</li>
              ))}
            </ul>
          )}
          {benefits && (
            <div className="benefits">
              <h4>Benefícios</h4>
              <p>{benefits}</p>
            </div>
          )}
        </div>
      )}

      <button onClick={handleVoltar} style={{ marginTop: "20px" }}>Voltar</button>
    </div>
  );
}

export default Presell;
