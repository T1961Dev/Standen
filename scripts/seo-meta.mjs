/** Trim meta descriptions to a search-friendly length (roughly 120-155 chars). */
export function metaDescription(text, max = 155) {
    const t = String(text).replace(/\s+/g, " ").trim();
    if (t.length <= max) return t;
    const cut = t.slice(0, max - 1);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export function articleSchema({ title, description, url, datePublished = "2026-01-15", dateModified = "2026-05-29" }) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        author: { "@type": "Organization", name: "Standen", url: "https://www.standen.io" },
        publisher: {
            "@type": "Organization",
            name: "Standen",
            logo: { "@type": "ImageObject", url: "https://www.standen.io/logo.png" },
        },
        datePublished,
        dateModified,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
    };
}
