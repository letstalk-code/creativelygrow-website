"use client";

import { useState } from "react";

/* Matches the static site's real header exactly: logo linked home, a
   trigger+dropdown nav (desktop opens on hover/focus via CSS, no JS needed
   there), a phone number, and a hamburger that reveals the same nav flattened
   on mobile. /blog is the only route this Next app actually owns — every
   other link crosses back to the static deployment via the root vercel.json
   rewrite, so those are plain <a> tags, not next/link, to force a real
   navigation instead of Next's client router trying to own them. */
export default function BlogHeader() {
    const [open, setOpen] = useState(false);

    return (
        <header className={`cg-head${open ? " is-open" : ""}`}>
            <div className="cg-frame cg-head-inner">
                <a href="/" aria-label="Creatively Grow home" className="cg-brand">
                    <img src="/cg-logo.webp" alt="Creatively Grow" className="cg-logo-img" />
                    <span className="cg-brand-label">
                        Video Content
                        <br />+ Growth Systems
                    </span>
                </a>

                <button
                    type="button"
                    className="cg-burger"
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-expanded={open}
                    aria-controls="cg-blog-menu"
                    onClick={() => setOpen((v) => !v)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <nav className="cg-nav" id="cg-blog-menu" aria-label="Pages">
                    <div className="cg-nav-item">
                        <a className="cg-nav-trigger" href="/">
                            Home<span className="cg-caret" aria-hidden="true" />
                        </a>
                        <div className="cg-nav-drop">
                            <a href="/how-it-works" onClick={() => setOpen(false)}>
                                How It Works
                            </a>
                            <a href="/brand-films" onClick={() => setOpen(false)}>
                                Brand Films
                            </a>
                            <a href="/services" onClick={() => setOpen(false)}>
                                Services
                            </a>
                        </div>
                    </div>
                </nav>

                <a href="tel:+17272708422" className="cg-head-phone">
                    <span className="cg-head-dash" aria-hidden="true" />
                    Call now
                    <br />
                    (727) 270-8422
                </a>
            </div>
        </header>
    );
}
