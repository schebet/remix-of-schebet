import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

type ArticlePreview = {
  slug: string;
  title: string;
  excerpt: string | null;
  og_image: string | null;
  cover_image: string | null;
};

type Options = {
  siteUrl: string;
  defaultOgImage: string;
  outDir?: string;
};

const escapeHtmlAttr = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const stripHeadTags = (html: string, patterns: RegExp[]) => {
  let out = html;
  for (const re of patterns) out = out.replace(re, "");
  return out;
};

const buildHeadBlock = (args: {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: "website" | "article";
  ogImage: string;
  ogUrl: string;
}) => {
  const title = escapeHtmlAttr(args.title);
  const description = escapeHtmlAttr(args.description);
  const canonicalUrl = escapeHtmlAttr(args.canonicalUrl);
  const ogImage = escapeHtmlAttr(args.ogImage);
  const ogUrl = escapeHtmlAttr(args.ogUrl);

  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonicalUrl}" />

    <meta property="og:type" content="${args.ogType}" />
    <meta property="og:site_name" content="Selo Šebet" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:secure_url" content="${ogImage}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${title}" />
    <meta property="og:url" content="${ogUrl}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />
  `;
};

const pickOgImage = (args: {
  siteUrl: string;
  defaultOgImage: string;
  og_image: string | null;
  cover_image: string | null;
}) => {
  const raw = (args.og_image || args.cover_image || "").trim();
  if (!raw) return args.defaultOgImage;

  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `${args.siteUrl}${raw.startsWith("/") ? "" : "/"}${raw}`;
};

async function fetchPublishedArticles(): Promise<ArticlePreview[]> {
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.VITE_PUBLIC_SUPABASE_URL;

  const apiKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !apiKey) {
    console.warn(
      "[prerender-og-pages] Missing SUPABASE_URL/VITE_SUPABASE_URL or API key env; skipping OG prerender."
    );
    return [];
  }

  const url = new URL(`${supabaseUrl}/rest/v1/articles`);
  url.searchParams.set(
    "select",
    "slug,title,excerpt,og_image,cover_image"
  );
  url.searchParams.set("status", "eq.published");
  url.searchParams.set("limit", "1000");

  const res = await fetch(url.toString(), {
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.warn(
      `[prerender-og-pages] Failed to fetch articles: ${res.status} ${res.statusText}`
    );
    return [];
  }

  const json = (await res.json()) as ArticlePreview[];
  return Array.isArray(json) ? json.filter((a) => !!a?.slug) : [];
}

export const prerenderOgPages = (options: Options): Plugin => {
  return {
    name: "prerender-og-pages",
    apply: "build",
    async closeBundle() {
      const outDir = options.outDir || "dist";
      const templatePath = path.join(process.cwd(), outDir, "index.html");

      let templateHtml = "";
      try {
        templateHtml = await fs.readFile(templatePath, "utf8");
      } catch {
        console.warn(
          `[prerender-og-pages] Could not read ${templatePath}; skipping OG prerender.`
        );
        return;
      }

      const articles = await fetchPublishedArticles();
      if (articles.length === 0) return;

      // Remove any existing OG/Twitter/title/description/canonical tags from template;
      // we will inject a clean set for each article page.
      const cleanedTemplate = stripHeadTags(templateHtml, [
        /<title>.*?<\/title>\s*/gis,
        /<meta\b[^>]*name=["']description["'][^>]*>\s*/gis,
        /<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gis,
        /<meta\b[^>]*property=["']og:[^"']+["'][^>]*>\s*/gis,
        /<meta\b[^>]*name=["']twitter:[^"']+["'][^>]*>\s*/gis,
      ]);

      const blogRoot = path.join(process.cwd(), outDir, "blog");
      await fs.mkdir(blogRoot, { recursive: true });

      await Promise.all(
        articles.map(async (a) => {
          const ogImage = pickOgImage({
            siteUrl: options.siteUrl,
            defaultOgImage: options.defaultOgImage,
            og_image: a.og_image,
            cover_image: a.cover_image,
          });

          const canonicalUrl = `${options.siteUrl}/blog/${a.slug}/`;
          const pageTitle = `${a.title} - Selo Šebet`;
          const description =
            (a.excerpt || "").trim() ||
            "Priče, fotografije i istorija sela Šebet.";

          const headBlock = buildHeadBlock({
            title: pageTitle,
            description,
            canonicalUrl,
            ogType: "article",
            ogImage,
            ogUrl: canonicalUrl,
          });

          const html = cleanedTemplate.replace(
            /<\/head>/i,
            `${headBlock}\n  </head>`
          );

          const outPath = path.join(blogRoot, a.slug, "index.html");
          await fs.mkdir(path.dirname(outPath), { recursive: true });
          await fs.writeFile(outPath, html, "utf8");
        })
      );

      console.log(
        `[prerender-og-pages] Generated ${articles.length} OG-ready blog pages.`
      );
    },
  };
};
