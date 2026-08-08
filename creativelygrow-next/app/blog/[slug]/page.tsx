import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPostSlugs } from "@/lib/posts";

const SITE = "https://creativelygrow.com";

type Props = { params: { slug: string } };

export function generateStaticParams() {
    return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
    const post = getPost(params.slug);
    if (!post) return { title: "Not found" };

    const url = `${SITE}/blog/${post.slug}`;
    return {
        title: `${post.title} | Creatively Grow`,
        description: post.metaDescription,
        alternates: { canonical: url },
        openGraph: {
            type: "article",
            url,
            title: post.title,
            description: post.metaDescription,
            publishedTime: post.date,
            authors: [post.author],
            images: post.heroImage ? [post.heroImage] : undefined,
        },
        twitter: {
            card: post.heroImage ? "summary_large_image" : "summary",
            title: post.title,
            description: post.metaDescription,
        },
    };
}

export default function BlogPost({ params }: Props) {
    const post = getPost(params.slug);
    if (!post) notFound();

    const url = `${SITE}/blog/${post.slug}`;

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.metaDescription,
        datePublished: post.date,
        dateModified: post.date,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@type": "Organization", name: post.author, url: SITE },
        publisher: {
            "@type": "Organization",
            name: "Creatively Grow",
            url: SITE,
            logo: { "@type": "ImageObject", url: `${SITE}/assets/logo.png` },
        },
        ...(post.heroImage ? { image: post.heroImage } : {}),
    };

    /* FAQPage is emitted only when real Q&As exist — schema without matching
       visible content is a manual-action risk. */
    const faqSchema =
        post.faq.length > 0
            ? {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: post.faq.map((f) => ({
                      "@type": "Question",
                      name: f.question,
                      acceptedAnswer: { "@type": "Answer", text: f.answer },
                  })),
              }
            : null;

    return (
        <article>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

            <header className="cg-frame cg-post-head">
                <span className="cg-eyebrow">
                    {post.dateDisplay} · {post.readingMinutes} min read
                </span>
                <h1>{post.title}</h1>
            </header>

            {post.heroImage && (
                <figure className="cg-frame cg-figure">
                    {/* Intrinsic size is fixed at generation time; declaring it keeps
                        the hero from shifting the article as it loads. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className="cg-hero"
                        src={post.heroImage}
                        alt={post.heroAlt ?? ""}
                        width={1600}
                        height={894}
                        fetchPriority="high"
                    />
                </figure>
            )}

            <div className="cg-frame">
                <div
                    className="cg-body cg-col"
                    dangerouslySetInnerHTML={{ __html: post.html }}
                />
            </div>

            {post.faq.length > 0 && (
                <div className="cg-frame">
                    <section className="cg-faq cg-col">
                        <h2>Common questions</h2>
                        <dl>
                            {post.faq.map((f) => (
                                <div key={f.question}>
                                    <dt>{f.question}</dt>
                                    <dd>{f.answer}</dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                </div>
            )}

            <aside className="cg-cta" id="contact">
                <div className="cg-frame">
                    <span className="cg-eyebrow">Next step</span>
                    <h2>Got a question about any of this?</h2>
                    <p>
                        Shoot us a text or an email — whichever&rsquo;s easier. No call to
                        schedule and no pitch. Tell us what you&rsquo;re working on and
                        we&rsquo;ll tell you straight whether we can help.
                    </p>
                    <div className="cg-cta-actions">
                        <a className="cg-btn" href="sms:+17272708422">
                            Text (727) 270-8422
                        </a>
                        <a
                            className="cg-btn cg-btn-ghost"
                            href="mailto:letstalk@creativelygrow.com"
                        >
                            Email us
                        </a>
                    </div>
                </div>
            </aside>
        </article>
    );
}
