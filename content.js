function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw.trim() };
  const [, fm, body] = match;
  const data = {};
  fm.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    let key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    val = val.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    data[key] = val;
  });
  return { data, body: body.trim() };
}

function parseYaml(raw) {
  const data = {};
  raw.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    let key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    val = val.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
    data[key] = val;
  });
  return data;
}

const productFiles = import.meta.glob("../content/products/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const heroFiles = import.meta.glob("../content/hero/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const settingsFile = import.meta.glob("../content/settings.yml", {
  query: "?raw",
  import: "default",
  eager: true,
});

export function loadProducts() {
  const products = Object.entries(productFiles).map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw);
    const id = path.split("/").pop().replace(".md", "");
    return {
      id,
      name: data.name || "Untitled piece",
      price: data.price || "",
      image: data.image || "",
      order: Number(data.order || 0),
      description: body || "",
    };
  });
  return products.sort((a, b) => a.order - b.order);
}

export function loadHero() {
  const slides = Object.entries(heroFiles).map(([path, raw]) => {
    const { data } = parseFrontmatter(raw);
    const id = path.split("/").pop().replace(".md", "");
    return {
      id,
      eyebrow: data.eyebrow || "",
      headline: data.headline || "",
      sub: data.sub || "",
      image: data.image || "",
      order: Number(data.order || 0),
    };
  });
  return slides.sort((a, b) => a.order - b.order);
}

export function loadBrand() {
  const raw = Object.values(settingsFile)[0] || "";
  const data = parseYaml(raw);
  return {
    name: data.name || "Maison Lumière",
    tagline: data.tagline || "",
    about: data.about || "",
    email: data.email || "",
    instagram: data.instagram || "",
  };
}
