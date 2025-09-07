import React from "react";
import "./PresellTemplate.css";

const PresellTemplate = ({
  titulo,
  subtitulo,
  descricao,
  imagemUrl,
  linkAfiliado,
  destaque, // obrigatório / manual
  idioma = "pt",
  promocoes = [],
  reviews = [],
  benefits = "",
}) => {
  const text = {
    botao: idioma === "pt" ? "Saiba Mais" : "Learn More",
  };

  const hasImage = imagemUrl && imagemUrl.trim() !== "";
  const hasPromocoes = promocoes.length > 0;
  const hasReviews = reviews.length > 0;

  return (
    <section className="presell-container-hero">
      <div className="presell-conteudo-hero">
        {/* Destaque agora obrigatório */}
        <div className="presell-destaque-hero">{destaque}</div>

        <h1 className="presell-titulo-hero">{titulo}</h1>
        {subtitulo && <h2 className="presell-subtitulo-hero">{subtitulo}</h2>}

        {benefits && (
          <div className="presell-benefits-hero">
            <h3>{idioma === "pt" ? "Benefícios" : "Benefits"}</h3>
            <p>{benefits}</p>
          </div>
        )}

        {hasPromocoes && (
          <ul className="presell-promocoes">
            {promocoes.map((promo, idx) => (
              <li key={idx}>{promo}</li>
            ))}
          </ul>
        )}

        {linkAfiliado && (
          <a
            href={linkAfiliado}
            target="_blank"
            rel="noopener noreferrer"
            className="presell-botao-hero"
          >
            {text.botao}
          </a>
        )}

        {hasReviews && (
          <div className="presell-reviews">
            <h3>{idioma === "pt" ? "Avaliações" : "Reviews"}</h3>
            <ul>
              {reviews.map((rev, idx) => (
                <li key={idx} className="presell-review-item">{rev}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {hasImage && (
        <div className="presell-imagem-hero">
          <img src={imagemUrl} alt={titulo} loading="lazy" />
        </div>
      )}
    </section>
  );
};

export default PresellTemplate;
