// Presell.jsx
import React from "react";
import "./Presell.css";

const Presell = ({ formData }) => {
  if (!formData) return null;

  const {
    bannerUrl = "",
    productUrl = "",
    title = "Product Title",
    subtitle = "Product Subtitle",
    heroCtaText = "Learn More",
    buyLink = "#",
    problemTitle = "",
    problems = [],
    solutionTitle = "",
    solutionParagraphs = [],
    benefitsTitle = "Benefits",
    benefits = [],
    socialTitle = "Testimonials",
    testimonials = [],
    finalCtaTitle = "",
    finalCtaSubtitle = "",
    finalCtaText = "Visit Official Site",
    promotion = "",
  } = formData;

  const toggleFaq = (index) => {
    const el = document.getElementById(`faq-p-${index}`);
    if (el) el.style.display = el.style.display === "block" ? "none" : "block";
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
            {bannerUrl && (
              <div className="hero-image">
                <img src={bannerUrl} alt="Product Banner" loading="lazy" />
              </div>
            )}
            {heroCtaText && buyLink && (
              <a
                href={buyLink}
                className="cta-button primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {heroCtaText}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="problem-solution">
        <div className="container">
          <div className="content-grid">
            {/* Text content */}
            <div className="text-content">
              {problemTitle && <h2>{problemTitle}</h2>}
              {problems.filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {solutionTitle && <h3>{solutionTitle}</h3>}
              {solutionParagraphs.filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Image content */}
            {productUrl && (
              <div className="image-content">
                {buyLink ? (
                  <a href={buyLink} target="_blank" rel="noopener noreferrer">
                    <img src={productUrl} alt="Product" loading="lazy" />
                  </a>
                ) : (
                  <img src={productUrl} alt="Product" loading="lazy" />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      {(benefitsTitle || benefits.length > 0) && (
        <section className="benefits">
          <div className="container">
            {benefitsTitle && <h2 className="section-title">{benefitsTitle}</h2>}
            <div className="benefits-grid">
              {benefits.filter(Boolean).map((b, i) => (
                <div key={i} className="benefit-card">
                  <h3>{b}</h3>
                  <p>{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Proof Section */}
      {testimonials.length > 0 && (
        <section className="social-proof">
          <div className="container">
            {socialTitle && <h2 className="section-title">{socialTitle}</h2>}
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <blockquote>
                  <p>"{t.text}"</p>
                </blockquote>
                {t.name && <cite>{t.name}</cite>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      {buyLink && (
        <section className="final-cta" id="cta">
          <div className="container">
            {finalCtaTitle && <h2>{finalCtaTitle}</h2>}
            {finalCtaSubtitle && <p>{finalCtaSubtitle}</p>}
            <a
              href={buyLink}
              className="cta-button primary large"
              target="_blank"
              rel="noopener noreferrer"
            >
              {finalCtaText}
            </a>
            <p className="disclaimer">
              * You will be redirected to the product's official website
            </p>
            <p className="health-disclaimer">
              ** This product is not intended to diagnose, treat, cure, or prevent any disease.
              Always consult a healthcare professional before starting any supplementation.
            </p>
          </div>
        </section>
      )}

      {/* Floating button always visible */}
      {buyLink && (
        <a
          href={buyLink}
          className="fixed-cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          {finalCtaText}
        </a>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Product Info Page. All rights reserved.</p>
          <p className="footer-disclaimer">
            This is an informational page. For official purchases and information, visit the product's official website.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Presell;
