import "./blog.css";
import BlogHeader from "./BlogHeader";

/* The real header/footer, ported to match the static marketing site exactly
   (see BlogHeader.tsx and the header/footer rules in blog.css) — this used to
   be a from-scratch simplified recreation with a text wordmark and no link
   back to the homepage at all. Links to anything outside /blog are plain <a>
   tags: they cross back to the static deployment via the root vercel.json
   rewrite, so Next's client router must never try to own them. */
export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="cg-blog">
            <BlogHeader />

            <main>{children}</main>

            <footer className="cg-foot">
                <div className="cg-frame cg-foot-inner">
                    <div className="cg-foot-brand">
                        <img src="/blog/cg-logo.webp" alt="Creatively Grow" className="cg-foot-logo" />
                        <span className="cg-foot-tagline">
                            Video + growth systems · Tampa Bay, FL
                        </span>
                    </div>
                    <div className="cg-foot-links">
                        <a href="/">Home</a>
                        <a href="/how-it-works">How It Works</a>
                        <a href="/brand-films">Brand Films</a>
                        <a href="/services">Services</a>
                        <a href="tel:+17272708422" className="cg-foot-phone">
                            (727) 270-8422
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
