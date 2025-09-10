// MontarPresell.jsx
import React, { useState, useEffect } from "react";
import Presell from "./Presell";
import "./MontarPresell.css";
import cssContent from "./MontarPresell.css?raw";
import presellCss from "./Presell.css?raw";
// Se houver outros arquivos CSS do frontend, importe aqui:
// import extraCss from "./Extra.css?raw";

const MontarPresell = ({ userId: propUserId }) => {
  const userId = propUserId || localStorage.getItem("userId");

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

  // --- Edição de inputs ---
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

  // Gerar HTML
  const gerarHTML = () => {
    const htmlContentFinal = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${formData.title || "Sleep Lean"}</title>
<meta name="description" content="${formData.subtitle}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
${cssContent}
${presellCss}
/* Adicione aqui CSS extra se houver */
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
        ${formData.problems.map(p => `<p>${p}</p>`).join("")}
        <h3>${formData.solutionTitle}</h3>
        ${formData.solutionParagraphs.map(p => `<p>${p}</p>`).join("")}
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
      ${formData.benefits.map(b => `
        <div class="benefit-card">
          <h3>${b}</h3>
          <p>${b}</p>
        </div>`).join("")}
    </div>
  </div>
</section>

<section class="final-cta" id="cta">
  <div class="container">
    <h2>${formData.finalCtaTitle}</h2>
    <p>${formData.finalCtaSubtitle}</p>
    <a href="${formData.buyLink}" class="cta-button primary large" target="_blank" rel="noopener noreferrer">${formData.finalCtaText}</a>
    <p class="disclaimer">* You will be redirected to the product's official website</p>
    <p class="health-disclaimer">** This product is not intended to diagnose, treat, cure, or prevent any disease. Always consult a healthcare professional before starting any supplementation.</p>
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

<script>
// Toggle FAQs
document.querySelectorAll('.faq h3').forEach((h3, index) => {
  h3.addEventListener('click', () => {
    const p = document.getElementById('faq-p-' + index);
    if(p) p.style.display = p.style.display === 'block' ? 'none' : 'block';
  });
});
</script>
</body>
</html>
  `;
    const blob = new Blob([htmlContentFinal], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "index.html";
    a.click();
  };

  // --- Publicar no backend ---
  const publicarPresell = async () => {
  if (!formData.title || !formData.domain) {
    alert("Preencha o nome do produto e o domínio antes de publicar.");
    return;
  }

  try {
    // HTML completo com CSS inline
    const htmlContentFinal = `<!DOCTYPE html>
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
/* Se houver CSS extra, adicione aqui */
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
        ${formData.problems.map(p => `<p>${p}</p>`).join("")}
        <h3>${formData.solutionTitle}</h3>
        ${formData.solutionParagraphs.map(p => `<p>${p}</p>`).join("")}
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
      ${formData.benefits.map(b => `<div class="benefit-card"><h3>${b}</h3><p>${b}</p></div>`).join("")}
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

<script>
// Toggle FAQs
document.querySelectorAll('.faq h3').forEach((h3, index) => {
  h3.addEventListener('click', () => {
    const p = document.getElementById('faq-p-' + index);
    if(p) p.style.display = p.style.display === 'block' ? 'none' : 'block';
  });
});
</script>
</body>
</html>`;

    // Payload enviado ao backend
    const payload = {
      userId,
      nomeProduto: formData.title,
      dominio: formData.domain,
      indexHtml: htmlContentFinal,
      cssFiles: [] // Caso queira enviar CSS extra como arquivo, adicione aqui
    };

    const apiUrl = "/api/vercel/deploy";
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Publicado com sucesso!\nURL: https://${data.deployUrl}\nSubdomínio: ${data.subdomain}`);
    } else {
      alert(`Falha ao publicar: ${data.error || "Erro desconhecido"}`);
      console.error(data);
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
        {[...[
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
          { field: "finalCtaText", label: "Texto do Botão Final" },
        ]].map(({ field, label }) => (
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
        <button type="button" onClick={addBenefit}>
          Adicionar Benefício
        </button>

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
            <button type="button" onClick={() => removeFaq(i)}>
              Remover
            </button>
          </div>
        ))}
        <button type="button" onClick={addFaq}>
          Adicionar FAQ
        </button>

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
