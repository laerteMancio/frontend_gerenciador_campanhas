// PresellTemplate.jsx
import React from "react";
import "./PresellTemplate.css";

const PresellTemplate = ({
  titulo,
  subtitulo,
  descricao,
  imagemUrl,
  linkAfiliado,
  destaque = null, // conteúdo extra opcional
  idioma = "pt",   // idioma padrão
}) => {
  // Textos traduzíveis conforme idioma
  const text = {
    botao: idioma === "pt" ? "Saiba Mais" : "Learn More",
    destaque: destaque || (idioma === "pt" ? "Oferta especial!" : "Special Offer!"),
  };

  // Verifica se a imagem é válida
  const hasImage = imagemUrl && imagemUrl.trim() !== "";

  return (
    <div className="presell-container">
      {/* Renderiza a imagem apenas se existir */}
      {hasImage && (
        <div className="presell-imagem">
          <img src={imagemUrl} alt={titulo} />
        </div>
      )}

      <div className="presell-conteudo">
        <h1 className="presell-titulo">{titulo}</h1>
        {subtitulo && <h2 className="presell-subtitulo">{subtitulo}</h2>}
        <p className="presell-descricao">{descricao}</p>

        {text.destaque && <div className="presell-destaque">{text.destaque}</div>}

        {linkAfiliado && (
          <a
            href={linkAfiliado}
            target="_blank"
            rel="noopener noreferrer"
            className="presell-botao"
          >
            {text.botao}
          </a>
        )}
      </div>
    </div>
  );
};

export default PresellTemplate;
