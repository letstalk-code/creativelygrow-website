import Link from "next/link";
import "./blog.css";

/* Hard 3-part bar on cream with a hairline bottom rule — no glass, per
   DESIGN-REFERENCE.md. Links point at the static marketing site, which serves
   everything outside /blog on the same domain (zone rewrite in root vercel.json). */
export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="cg-blog">
            <header className="cg-head">
                <div className="cg-frame cg-head-inner">
                    <Link href="/blog" className="cg-brand">
                        Creatively Grow
                    </Link>
                    <nav className="cg-nav">
                        <a href="/how-it-works">How It Works</a>
                        <a href="/brand-films">Brand Films</a>
                        <a href="mailto:letstalk@creativelygrow.com">Email Us</a>
                    </nav>
                </div>
            </header>

            <main>{children}</main>

            <footer className="cg-foot">
                <div className="cg-frame">
                    Creatively Grow — Video Content + Growth Systems · Tampa Bay, FL · Call or
                    text{" "}
                    <a href="tel:+17272708422">(727) 270-8422</a> ·{" "}
                    <a href="mailto:letstalk@creativelygrow.com">letstalk@creativelygrow.com</a>
                </div>
            </footer>
        </div>
    );
}
