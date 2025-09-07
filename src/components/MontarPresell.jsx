// MontarPresell.jsx
import React, { useState, useEffect } from "react";
import Presell from "./Presell";
import "./MontarPresell.css";
import cssContent from "./MontarPresell.css?raw";
import presellCss from "./Presell.css?raw";

const MontarPresell = ({ userId }) => {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("montarPresellData");
    return saved
      ? JSON.parse(saved)
      : {
          bannerUrl: "",
          productUrl: "",
          title: "Gluco6 - Suplemento Natural",
          subtitle: "Suporte natural para níveis saudáveis de açúcar no sangue.",
          heroCtaText: "Saiba Mais",
          buyLink: "",
          problemTitle: "Você busca equilíbrio em sua saúde?",
          problems: [
            "Manter níveis saudáveis de açúcar no sangue é fundamental para o bem-estar geral."
          ],
          solutionTitle: "Uma Abordagem Natural",
          solutionParagraphs: [
            "O Gluco6 é um suplemento natural desenvolvido para apoiar seu bem-estar."
          ],
          benefitsTitle: "Benefícios do Gluco6",
          benefits: ["Ingredientes Naturais", "Suporte Diário", "Qualidade Confiável"],
          socialTitle: "O que nossos clientes dizem",
          testimonials: [{ text: "Excelente produto!", name: "Maria S." }],
          finalCtaTitle: "Pronto para experimentar o Gluco6?",
          finalCtaSubtitle: "Clique no botão abaixo para visitar o site oficial.",
          finalCtaText: "Visitar Site Oficial",
          promotion: "",
          faqs: [],
          domain: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("montarPresellData", JSON.stringify(formData));
  }, [formData]);

  // --- Funções de edição (inputs dinâmicos) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData((prev) => ({ ...prev, benefits: newBenefits }));
  };
  const addBenefit = () =>
    setFormData((prev) => ({ ...prev, benefits: [...prev.benefits, ""] }));
  const removeBenefit = (index) => {
    const newBenefits = [...formData.benefits];
    newBenefits.splice(index, 1);
    setFormData((prev) => ({ ...prev, benefits: newBenefits }));
  };

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...formData.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFormData((prev) => ({ ...prev, faqs: newFaqs }));
  };
  const addFaq = () =>
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }]
    }));
  const removeFaq = (index) => {
    const newFaqs = [...formData.faqs];
    newFaqs.splice(index, 1);
    setFormData((prev) => ({ ...prev, faqs: newFaqs }));
  };

  // --- Gerar HTML ---
  const gerarHTML = () => {
    const htmlContentFinal = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${formData.title}</title>
<meta name="description" content="${formData.subtitle}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
${cssContent}
${presellCss}
</style>
</head>
<body>
<div id="root">
${document.getElementById("preview-root")?.innerHTML || ""}
</div>
<script>
document.querySelectorAll('.faq h3').forEach((h3, index) => {
  h3.addEventListener('click', () => {
    const p = document.getElementById('faq-p-' + index);
    if(p) p.style.display = p.style.display === 'block' ? 'none' : 'block';
  });
});
</script>
</body>
</html>`;
    const blob = new Blob([htmlContentFinal], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "index.html";
    a.click();
  };

  // --- Publicar ---
  const publicarPresell = async () => {
    if (!formData.title || !formData.domain) {
      alert("Preencha o nome do produto e o domínio antes de publicar.");
      return;
    }

    try {
      const payload = {
        userId,
        productName: formData.title,
        domain: formData.domain,
        formData: {
          ...formData,
          html: document.getElementById("preview-root")?.innerHTML || "",
          css: `${cssContent}\n${presellCss}`,
        },
      };

      const apiUrl = `${import.meta.env.VITE_API_URL}/publicar-presell`;
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) alert(`Publicado com sucesso! URL: ${data.url}`);
      else alert(`Falha ao publicar: ${data.message || "Erro desconhecido"}`);
    } catch (err) {
      console.error(err);
      alert(`Erro ao publicar: ${err.message}`);
    }
  };

  return (
    <div className="montar-presell">
      <div className="formulario">
        <h2>Editar Presell</h2>
        {[
          { field: "bannerUrl", label: "URL do Banner" },
          { field: "productUrl", label: "URL do Produto (imagem)" },
          { field: "title", label: "Título do Produto" },
          { field: "subtitle", label: "Subtítulo do Produto" },
          { field: "heroCtaText", label: "Texto do Botão Hero" },
          { field: "buyLink", label: "Link de Compra" },
          { field: "domain", label: "Domínio" },
          { field: "problemTitle", label: "Título do Problema" },
          { field: "solutionTitle", label: "Título da Solução" },
          { field: "finalCtaTitle", label: "Título da CTA Final" },
          { field: "finalCtaSubtitle", label: "Subtítulo da CTA Final" },
          { field: "finalCtaText", label: "Texto do Botão Final" }
        ].map(({ field, label }) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={label}
            value={formData[field]}
            onChange={handleChange}
          />
        ))}

        <h3>Benefícios</h3>
        {formData.benefits.map((b, i) => (
          <div key={i} className="dynamic-input">
            <input
              value={b}
              placeholder={`Benefício ${i + 1}`}
              onChange={(e) => handleBenefitChange(i, e.target.value)}
            />
            <button type="button" onClick={() => removeBenefit(i)}>Remover</button>
          </div>
        ))}
        <button type="button" onClick={addBenefit}>Adicionar Benefício</button>

        <h3>FAQs</h3>
        {formData.faqs.map((faq, i) => (
          <div key={i} className="dynamic-faq">
            <input
              value={faq.question}
              placeholder={`Pergunta ${i + 1}`}
              onChange={(e) => handleFaqChange(i, "question", e.target.value)}
            />
            <input
              value={faq.answer}
              placeholder={`Resposta ${i + 1}`}
              onChange={(e) => handleFaqChange(i, "answer", e.target.value)}
            />
            <button type="button" onClick={() => removeFaq(i)}>Remover</button>
          </div>
        ))}
        <button type="button" onClick={addFaq}>Adicionar FAQ</button>

        <div style={{ marginTop: 20 }}>
          <button onClick={gerarHTML}>Gerar HTML</button>
          <button onClick={publicarPresell}>Publicar</button>
        </div>
      </div>

      <div className="preview" id="preview-root">
        <Presell formData={formData} />
      </div>
    </div>
  );
};

export default MontarPresell;
