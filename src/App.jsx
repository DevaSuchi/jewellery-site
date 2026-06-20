import React, { useState, useEffect, useRef } from "react";
import { loadProducts, loadHero, loadBrand } from "./content.js";

const CONTACT = {
  whatsappNumber: "",
};

function buildEmailLink(brand, product) {
  const subject = encodeURIComponent(`Enquiry: ${product.name}`);
  const body = encodeURIComponent(
    `Hi, I'd like to buy the ${product.name} (${product.price}).\n\nPlease let me know how to proceed with payment.`
  );
  return `mailto:${brand.email}?subject=${subject}&body=${body}`;
}

function buildWhatsappLink(number, product) {
  const text = encodeURIComponent(
    `Hi, I'd like to buy the ${product.name} (${product.price}). Please let me know how to proceed with payment.`
  );
  return `https://wa.me/${number}?text=${text}`;
}

function GoldDivider({ style }) {
  return (
    <div
      style={{
        width: "48px",
        height: "1px",
        background: "#A8843E",
        margin: "0 auto",
        ...style,
      }}
    />
  );
}

function Header({ brand, onNav }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: scrolled ? "16px 48px" : "28px 48px",
        background: scrolled ? "rgba(247,244,239,0.96)" : "transparent",
        borderBottom: scrolled ? "1px solid #E3DCCB" : "1px solid transparent",
        transition: "all 0.35s ease",
        backdropFilter: scrolled ? "blur(6px)" : "none",
      }}
    >
      <button
        onClick={() => onNav("top")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'Playfair Display', serif",
          fontSize: "22px",
          letterSpacing: "0.04em",
          color: !scrolled ? "#F7F4EF" : "#15130F",
          transition: "color 0.35s ease",
        }}
      >
        {brand.name}
      </button>
      <nav style={{ display: "flex", gap: "36px", alignItems: "center" }}>
        {["Shop", "About"].map((label) => (
          <button
            key={label}
            onClick={() => onNav(label === "Shop" ? "shop" : "about")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: !scrolled ? "#F7F4EF" : "#15130F",
              transition: "color 0.35s ease",
              opacity: 0.85,
            }}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function Hero({ slides }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timerRef.current);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <div
      id="top"
      style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#15130F" }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === index ? 1 : 0,
            transition: "opacity 1.4s ease",
          }}
        >
          <img
            src={slide.image}
            alt={slide.headline}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: i === index ? "scale(1.06)" : "scale(1)",
              transition: "transform 7s ease-out",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(15,13,10,0.25) 0%, rgba(15,13,10,0.15) 40%, rgba(15,13,10,0.55) 100%)",
            }}
          />
        </div>
      ))}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "14%",
          textAlign: "center",
          color: "#F7F4EF",
          padding: "0 24px",
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.85,
            marginBottom: "18px",
          }}
        >
          {slides[index].eyebrow}
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 500,
            margin: "0 0 16px",
            letterSpacing: "0.01em",
          }}
        >
          {slides[index].headline}
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            opacity: 0.9,
            maxWidth: "440px",
            margin: "0 auto",
          }}
        >
          {slides[index].sub}
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "32px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === index ? "28px" : "8px",
              height: "3px",
              background: i === index ? "#A8843E" : "rgba(247,244,239,0.5)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.4s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, onOpen, size }) {
  return (
    <div onClick={() => onOpen(product)} style={{ cursor: "pointer", gridRow: size === "large" ? "span 2" : "span 1" }}>
      <div style={{ width: "100%", aspectRatio: size === "large" ? "4/5" : "1/1", overflow: "hidden", background: "#EDE8DC" }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>
      <div style={{ paddingTop: "14px", textAlign: "left" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: 500, margin: "0 0 4px", color: "#15130F" }}>
          {product.name}
        </h3>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#8A8472", margin: 0 }}>{product.price}</p>
      </div>
    </div>
  );
}

function Shop({ products, onOpen }) {
  return (
    <section id="shop" style={{ background: "#F7F4EF", padding: "120px 48px" }}>
      <div style={{ textAlign: "center", marginBottom: "72px" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#A8843E", marginBottom: "16px" }}>
          The collection
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 500, color: "#15130F", margin: "0 0 20px" }}>
          Shop all pieces
        </h2>
        <GoldDivider />
      </div>

      {products.length === 0 ? (
        <p style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", color: "#8A8472", fontSize: "14px" }}>
          No pieces yet. Add your first product from the Studio panel.
        </p>
      ) : (
        <div style={{ maxWidth: "1240px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "40px 32px" }}>
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} onOpen={onOpen} size={i === 0 ? "large" : "normal"} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductModal({ product, brand, onClose }) {
  if (!product) return null;
  const emailLink = buildEmailLink(brand, product);
  const whatsappLink = CONTACT.whatsappNumber
    ? buildWhatsappLink(CONTACT.whatsappNumber, product)
    : null;

  const buttonBase = {
    display: "block",
    textAlign: "center",
    padding: "14px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "12px",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    textDecoration: "none",
    cursor: "pointer",
    border: "1px solid #15130F",
  };

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(21,19,15,0.78)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#F7F4EF", maxWidth: "920px", width: "100%", maxHeight: "88vh", overflow: "auto", display: "grid", gridTemplateColumns: "1.1fr 1fr" }}
      >
        <div style={{ background: "#EDE8DC" }}>
          <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column" }}>
          <button
            onClick={onClose}
            style={{ alignSelf: "flex-end", background: "none", border: "none", cursor: "pointer", fontSize: "13px", letterSpacing: "0.1em", color: "#8A8472", fontFamily: "'Inter', sans-serif", marginBottom: "24px" }}
          >
            CLOSE ✕
          </button>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "30px", fontWeight: 500, margin: "0 0 12px", color: "#15130F" }}>{product.name}</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "#A8843E", margin: "0 0 28px" }}>{product.price}</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", lineHeight: 1.8, color: "#4A4738", margin: "0 0 32px" }}>{product.description}</p>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            <a
              href={emailLink}
              style={{ ...buttonBase, background: "#15130F", color: "#F7F4EF" }}
            >
              Enquire by email
            </a>
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...buttonBase, background: "transparent", color: "#15130F" }}
              >
                Enquire on WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function About({ brand }) {
  return (
    <section id="about" style={{ background: "#15130F", color: "#F7F4EF", padding: "140px 48px", textAlign: "center" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#A8843E", marginBottom: "20px" }}>
          About the house
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 500, margin: "0 0 28px" }}>{brand.tagline}</h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", lineHeight: 1.9, color: "#C9BFAF" }}>{brand.about}</p>
      </div>
    </section>
  );
}

function Footer({ brand }) {
  return (
    <footer style={{ background: "#F7F4EF", borderTop: "1px solid #E3DCCB", padding: "48px", textAlign: "center" }}>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#15130F", margin: "0 0 10px" }}>{brand.name}</p>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#8A8472", letterSpacing: "0.04em" }}>
        {brand.email} · {brand.instagram}
      </p>
    </footer>
  );
}

export default function App() {
  const [products] = useState(loadProducts());
  const [hero] = useState(loadHero());
  const [brand] = useState(loadBrand());
  const [openProduct, setOpenProduct] = useState(null);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header brand={brand} onNav={scrollTo} />
      <Hero slides={hero} />
      <Shop products={products} onOpen={setOpenProduct} />
      <About brand={brand} />
      <Footer brand={brand} />
      <ProductModal product={openProduct} brand={brand} onClose={() => setOpenProduct(null)} />
    </div>
  );
}
