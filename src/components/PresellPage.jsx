// PresellPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PresellTemplate from "./PresellTemplate";

const PresellPage = () => {
  const { nomePagina } = useParams();
  const [presell, setPresell] = useState(null);

  useEffect(() => {
    const fetchPresell = async () => {
      try {
        const resp = await fetch(`http://localhost:3000/presell/${nomePagina}`);
        const data = await resp.json();
        if (resp.ok) setPresell(data.presell);
        else console.error(data.message);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPresell();
  }, [nomePagina]);

  if (!presell) return <p>Carregando presell...</p>;

  return (
    <PresellTemplate
      titulo={presell.titulo}
      subtitulo={presell.subtitulo}
      descricao={presell.descricao}
      imagemUrl={presell.imagem_url}
      linkAfiliado={presell.link_afiliado}
      destaque={presell.destaque}
    />
  );
};

export default PresellPage;
