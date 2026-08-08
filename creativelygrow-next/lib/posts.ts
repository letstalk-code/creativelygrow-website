import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export type Faq = { question: string; answer: string };

export type PostMeta = {
    slug: string;
    title: string;
    targetKeyword: string;
    metaDescription: string;
    date: string;
    dateDisplay: string;
    author: string;
    heroImage?: string;
    heroAlt?: string;
    tags: string[];
    faq: Faq[];
};

export type Post = PostMeta & { html: string; readingMinutes: number };

/** Frontmatter is snake_case (what Hermes writes); the app reads camelCase. */
function toMeta(slug: string, data: Record<string, unknown>): PostMeta {
    const date = String(data.date ?? "");
    return {
        slug,
        title: String(data.title ?? slug),
        targetKeyword: String(data.target_keyword ?? ""),
        metaDescription: String(data.meta_description ?? ""),
        date,
        dateDisplay: date
            ? new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
              })
            : "",
        author: String(data.author ?? "Creatively Grow"),
        heroImage: data.hero_image ? String(data.hero_image) : undefined,
        heroAlt: data.hero_alt ? String(data.hero_alt) : undefined,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        faq: Array.isArray(data.faq)
            ? (data.faq as Record<string, unknown>[]).map((f) => ({
                  question: String(f.question ?? ""),
                  answer: String(f.answer ?? ""),
              }))
            : [],
    };
}

/* In-body images are all 1600x894 renders. Declaring intrinsic size stops them
   shifting the text as they load; lazy-loading keeps them out of the initial fetch. */
function withImageAttrs(html: string) {
    return html.replace(
        /<img /g,
        '<img width="1600" height="894" loading="lazy" decoding="async" ',
    );
}

function readPost(slug: string) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
    const { data, content } = matter(raw);
    return { data, content };
}

/** Drafts (status !== "published") never ship. */
function isPublished(data: Record<string, unknown>) {
    return String(data.status ?? "draft") === "published";
}

export function getPostSlugs(): string[] {
    if (!fs.existsSync(POSTS_DIR)) return [];
    return fs
        .readdirSync(POSTS_DIR)
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.replace(/\.md$/, ""))
        .filter((slug) => isPublished(readPost(slug).data));
}

export function getAllPosts(): PostMeta[] {
    return getPostSlugs()
        .map((slug) => toMeta(slug, readPost(slug).data))
        .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
    if (!getPostSlugs().includes(slug)) return null;
    const { data, content } = readPost(slug);
    return {
        ...toMeta(slug, data),
        html: withImageAttrs(marked.parse(content, { async: false }) as string),
        readingMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 225)),
    };
}
