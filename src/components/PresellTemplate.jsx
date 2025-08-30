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
}) => {
  return (
    <div className="presell-container">
      {imagemUrl && (
        <div className="presell-imagem">
          <img src={imagemUrl} alt={titulo} />
        </div>
      )}

      <div className="presell-conteudo">
        <h1 className="presell-titulo">{titulo}</h1>
        {subtitulo && <h2 className="presell-subtitulo">{subtitulo}</h2>}
        <p className="presell-descricao">{descricao}</p>
        
        {destaque && <div className="presell-destaque">{destaque}</div>}
        
        {linkAfiliado && (
          <a
            href={linkAfiliado}
            target="_blank"
            rel="noopener noreferrer"
            className="presell-botao"
          >
            Saiba Mais
          </a>
        )}
      </div>
    </div>
  );
};

export default PresellTemplate;
