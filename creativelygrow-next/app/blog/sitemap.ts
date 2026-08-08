import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const SITE = "https://creativelygrow.com";

/* Served at /blog/sitemap.xml. The marketing pages stay in the hand-written
   /sitemap.xml on the static site; robots.txt lists both. */
export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts();

    return [
        {
            url: `${SITE}/blog`,
            lastModified: posts[0]?.date ? new Date(posts[0].date) : new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        ...posts.map((post) => ({
            url: `${SITE}/blog/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        })),
    ];
}
