import { getAllPosts } from "@/lib/posts";

/* Served at /blog/index.json — the Studio Blog tab reads this.
   Same origin as the marketing site via the zone rewrite, so no CORS.
   Published posts only; drafts are already filtered out by getAllPosts. */
export function GET() {
    const posts = getAllPosts().map((p) => ({
        slug: p.slug,
        title: p.title,
        targetKeyword: p.targetKeyword,
        date: p.date,
        dateDisplay: p.dateDisplay,
        url: `https://creativelygrow.com/blog/${p.slug}`,
    }));

    return Response.json(
        { count: posts.length, posts },
        { headers: { "Cache-Control": "public, max-age=0, s-maxage=60" } },
    );
}
