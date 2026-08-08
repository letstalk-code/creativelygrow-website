import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
    title: "Growth Notes — Creatively Grow",
    description:
        "How local service businesses actually get found and booked: local search, reviews, follow-up, and the content that carries it. Written from the systems we run.",
    alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
    const posts = getAllPosts();

    return (
        <>
            <section className="cg-frame cg-lede">
                <span className="cg-eyebrow">The Journal</span>
                <h1>Growth notes.</h1>
                <p>
                    How local service businesses actually get found and booked — local search,
                    reviews, fast follow-up, and the content that carries it. Written from the
                    systems we run, not from a template.
                </p>
            </section>

            <div className="cg-frame">
                {posts.length === 0 ? (
                    <p className="cg-empty">First posts are on the way.</p>
                ) : (
                    <ul className="cg-list">
                        {posts.map((post, i) => (
                            <li className="cg-row" key={post.slug}>
                                <Link href={`/blog/${post.slug}`}>
                                    {/* Numbers are the icon system. */}
                                    <span className="cg-num">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div>
                                        <h2>{post.title}</h2>
                                        <p>{post.metaDescription}</p>
                                        <span className="cg-eyebrow">{post.dateDisplay}</span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
