import React, { useState, useEffect } from "react";
import Presell from "./Presell";
import "./MontarPresell.css";
import cssContent from "./MontarPresell.css?raw";
import presellCss from "./Presell.css?raw";

const MontarPresell = ({ userId: propUserId }) => {
  const userId = propUserId || localStorage.getItem("userId");

  const BASE_URL = "https://gerador-presell.vercel.app";

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
          problems: ["Manter níveis saudáveis de açúcar no sangue é fundamental para o bem-estar geral."],
          solutionTitle: "Uma Abordagem Natural",
          solutionParagraphs: ["O Gluco6 é um suplemento natural desenvolvido para apoiar seu bem-estar."],
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

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData((prev) => ({ ...prev, benefits: newBenefits }));
  };

  const addBenefit = () => setFormData((prev) => ({ ...prev, benefits: [...prev.benefits, ""] }));
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

  const addFaq = () => setFormData((prev) => ({ ...prev, faqs: [...prev.faqs, { question: "", answer: "" }] }));
  const removeFaq = (index) => {
    const newFaqs = [...formData.faqs];
    newFaqs.splice(index, 1);
    setFormData((prev) => ({ ...prev, faqs: newFaqs }));
  };

  // --- Gerar HTML ---
  const buildFinalHtml = () => {
    return `<!DOCTYPE html>
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
  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <h1 class="hero-title">${formData.title}</h1>
        <p class="hero-subtitle">${formData.subtitle}</p>
        <div class="hero-image">
          <img src="${formData.bannerUrl}" alt="Product Banner" loading="lazy">
        </div>
        <a href="${formData.buyLink}" class="cta-button primary" target="_blank" rel="noopener noreferrer">${formData.heroCtaText}</a>
      </div>
    </div>
  </section>
  <section class="problem-solution">
    <div class="container">
      <div class="content-grid">
        <div class="text-content">
          <h2>${formData.problemTitle}</h2>
          ${formData.problems.map((p) => `<p>${p}</p>`).join("")}
          <h3>${formData.solutionTitle}</h3>
          ${formData.solutionParagraphs.map((p) => `<p>${p}</p>`).join("")}
        </div>
        <div class="image-content">
          <a href="${formData.buyLink}" target="_blank" rel="noopener noreferrer">
            <img src="${formData.productUrl}" alt="Product" loading="lazy">
          </a>
        </div>
      </div>
    </div>
  </section>
  <section class="benefits">
    <div class="container">
      <h2 class="section-title">${formData.benefitsTitle}</h2>
      <div class="benefits-grid">
        ${formData.benefits.map((b) => `<div class="benefit-card"><h3>${b}</h3><p>${b}</p></div>`).join("")}
      </div>
    </div>
  </section>
  <section class="final-cta" id="cta">
    <div class="container">
      <h2>${formData.finalCtaTitle}</h2>
      <p>${formData.finalCtaSubtitle}</p>
      <a href="${formData.buyLink}" class="cta-button primary large" target="_blank" rel="noopener noreferrer">${formData.finalCtaText}</a>
    </div>
  </section>
  <a href="${formData.buyLink}" class="fixed-cta" target="_blank" rel="noopener noreferrer">${formData.finalCtaText}</a>
  <footer class="footer">
    <div class="container">
      <p>© 2025 Product Info Page. All rights reserved.</p>
      <p class="footer-disclaimer">This is an informational page. For official purchases and information, visit the product's official website.</p>
    </div>
  </footer>
</div>
</body>
</html>`;
  };

  // --- Publicar no backend ---
  const publicarPresell = async () => {
    if (!formData.title || !formData.domain) {
      alert("Preencha o nome do produto e o domínio antes de publicar.");
      return;
    }

    try {
      const htmlContentFinal = buildFinalHtml();

      const payload = {
        userId,
        nomeProduto: formData.title,
        dominio: formData.domain,
        indexHtml: htmlContentFinal,
        cssFiles: [],
      };

      const res = await fetch(`${BASE_URL}/vercel/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Publicado com sucesso!\nURL: https://${data.deployUrl}\nSubdomínio: ${data.subdomain}`);
      } else {
        console.error(data);
        alert(`Falha ao publicar: ${data.error || "Erro desconhecido"}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Erro ao publicar: ${err.message}`);
    }
  };

  return (
    <div className="montar-presell">
      <div className="formulario">
        <h2>Editar Presell</h2>
        {["bannerUrl","productUrl","title","subtitle","heroCtaText","buyLink","domain","problemTitle","solutionTitle","finalCtaTitle","finalCtaSubtitle","finalCtaText"].map(field => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
          />
        ))}

        <h3>Benefícios</h3>
        {formData.benefits.map((b,i) => (
          <div key={i}>
            <input value={b} onChange={(e)=>handleBenefitChange(i,e.target.value)} />
            <button type="button" onClick={()=>removeBenefit(i)}>Remover</button>
          </div>
        ))}
        <button type="button" onClick={addBenefit}>Adicionar Benefício</button>
        {/*
        <h3>FAQs</h3>
        {formData.faqs.map((faq,i)=>(
          <div key={i}>
            <input value={faq.question} placeholder="Pergunta" onChange={(e)=>handleFaqChange(i,"question",e.target.value)} />
            <input value={faq.answer} placeholder="Resposta" onChange={(e)=>handleFaqChange(i,"answer",e.target.value)} />
            <button type="button" onClick={()=>removeFaq(i)}>Remover</button>
          </div>
        ))}
        <button type="button" onClick={addFaq}>Adicionar FAQ</button>
        */}

        
        <div style={{marginTop:20}}>
          <button onClick={()=>{const blob=new Blob([buildFinalHtml()],{type:"text/html"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="index.html";a.click();}}>Gerar HTML</button>
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
